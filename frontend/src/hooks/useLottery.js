import { useState, useEffect, useCallback } from 'react';
import { BrowserProvider, Contract, formatEther, hexlify } from 'ethers';

const contractABI = [
  'event WinnerDecryptionRequested(uint256 indexed requestID, bytes32 randomIndexHandle)',
  'event WinnerDrawn(address indexed winner, bytes encryptedWinningNumber)',
  'function buyTicket(bytes32,bytes) payable',
  'function drawWinner()',
  'function fulfillRandomIndex(uint256,bytes,bytes)',
  'function claimPrize()',
  'function startNewRound()',
  'function claimPastPrize(uint256)',
  'function getMyTicket() view returns (bytes)',
  'function getBalance() view returns (uint256)',
  'function getParticipantCount() view returns (uint256)',
  'function ticketPrice() view returns (uint256)',
  'function isDrawn() view returns (bool)',
  'function drawPending() view returns (bool)',
  'function winner() view returns (address)',
  'function admin() view returns (address)',
  'function lastDrawTime() view returns (uint256)',
  'function getPastRoundsLength() view returns (uint256)',
  'function getPastRound(uint256) view returns (address, uint256, uint256, bool)'
];

// Orchestrates lottery contract interactions plus FHE ticket handling hooks.
export const useLottery = (account, showToast, setTxStatus, contractAddress) => {
  const [contract, setContract] = useState(null);
  const [lotteryState, setLotteryState] = useState({
    isDrawn: false,
    drawPending: false,
    winner: '',
    participantCount: 0,
    balance: '0',
    ticketPrice: '0.001',
    lastDrawTime: 0,
    admin: '',
    pastRounds: []
  });
  const [loading, setLoading] = useState(false);

  // Pulls current lottery state and recent round history from the blockchain.
  const loadLotteryState = useCallback(async (contractInstance) => {
    try {
      const [
        isDrawn,
        drawPending,
        winner,
        participantCount,
        balance,
        ticketPrice,
        lastDrawTime,
        admin,
        pastRoundsLength
      ] = await Promise.all([
        contractInstance.isDrawn(),
        contractInstance.drawPending(),
        contractInstance.winner(),
        contractInstance.getParticipantCount(),
        contractInstance.getBalance(),
        contractInstance.ticketPrice(),
        contractInstance.lastDrawTime(),
        contractInstance.admin(),
        contractInstance.getPastRoundsLength()
      ]);

      const pastRoundsLengthNum = Number(pastRoundsLength);
      const pastRounds = [];
      const startIndex = pastRoundsLengthNum > 5 ? pastRoundsLengthNum - 5 : 0;

      for (let i = startIndex; i < pastRoundsLengthNum; i++) {
        try {
          const round = await contractInstance.getPastRound(i);
          pastRounds.push({
            winner: round[0],
            prize: formatEther(round[1]),
            drawTime: Number(round[2]),
            claimed: round[3],
            index: i
          });
        } catch (error) {
          console.error('Error loading past round:', i, error);
        }
      }

      setLotteryState({
        isDrawn,
        winner,
        drawPending,
        participantCount: Number(participantCount),
        balance: formatEther(balance),
        ticketPrice: formatEther(ticketPrice),
        lastDrawTime: Number(lastDrawTime),
        admin,
        pastRounds
      });
    } catch (error) {
      console.error('Error loading lottery state:', error);
    }
  }, []);

  useEffect(() => {
    if (!account || !window.ethereum) {
      setContract(null);
      return;
    }

    // Builds a signer-backed contract instance whenever the user context changes.
    const initContract = async () => {
      try {
        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const lotteryContract = new Contract(contractAddress, contractABI, signer);
        setContract(lotteryContract);
        await loadLotteryState(lotteryContract);
      } catch (error) {
        console.error('Error initializing contract:', error);
      }
    };

    initContract();
  }, [account, contractAddress, loadLotteryState]);

  useEffect(() => {
    if (!contract) return;

    const handleDecryptionRequested = async () => {
      setTxStatus('Awaiting FHE oracle to reveal the winner...');
      await loadLotteryState(contract);
    };

    const handleWinnerDrawn = async (winnerAddress) => {
      showToast(`Winner decrypted: ${winnerAddress}`, 'success');
      setTxStatus('');
      await loadLotteryState(contract);
    };

    contract.on('WinnerDecryptionRequested', handleDecryptionRequested);
    contract.on('WinnerDrawn', handleWinnerDrawn);

    return () => {
      contract.off('WinnerDecryptionRequested', handleDecryptionRequested);
      contract.off('WinnerDrawn', handleWinnerDrawn);
    };
  }, [contract, loadLotteryState, showToast, setTxStatus]);

  // Encrypts a ticket number into an FHE handle + proof pair that the contract accepts.
  const encryptTicket = useCallback(
    async (ticketNumber) => {
      await window.relayerSDK.initSDK();

      const config = { ...window.relayerSDK.SepoliaConfig, network: window.ethereum };
      const fhevm = await window.relayerSDK.createInstance(config);

      const encryptedInput = await fhevm.createEncryptedInput(contractAddress, account);
      encryptedInput.add8(Number(ticketNumber));

      const { handles, inputProof } = await encryptedInput.encrypt();

      if (!handles || handles.length === 0) {
        throw new Error('Encryption did not return any handles');
      }

      return {
        handle: hexlify(handles[0]),
        proof: hexlify(inputProof)
      };
    },
    [account, contractAddress]
  );

  // Sends an encrypted ticket purchase using the handle + proof produced above.
  const buyTicket = async (ticketNumber) => {
    if (!contract || !ticketNumber || ticketNumber < 1 || ticketNumber > 100) {
      showToast('Please enter a ticket number between 1-100', 'warning');
      return;
    }

    setLoading(true);
    setTxStatus('Encrypting ticket number...');

    try {
      const { handle, proof } = await encryptTicket(ticketNumber);
      const ticketPriceWei = await contract.ticketPrice();

      setTxStatus('Purchasing ticket...');

      const tx = await contract.buyTicket(handle, proof, {
        value: ticketPriceWei
      });

      await tx.wait();

      showToast('Ticket purchased successfully! 🎫', 'success');
      await loadLotteryState(contract);
    } catch (error) {
      console.error('Error buying ticket:', error);
      showToast('Purchase failed: ' + error.message, 'error');
    } finally {
      setLoading(false);
      setTxStatus('');
    }
  };

  // Triggers the on-chain draw routine once conditions are met.
  const drawWinner = async () => {
    if (!contract) return;

    setLoading(true);
    setTxStatus('Requesting FHE-powered draw...');

    try {
      const tx = await contract.drawWinner();
      await tx.wait();

      showToast('FHE oracle request sent. Awaiting decryption… 🔐', 'info');
      await loadLotteryState(contract);

      const pending = await contract.drawPending();
      if (pending) {
        setTxStatus('Awaiting FHE oracle to reveal the winner...');
      } else {
        setTxStatus('');
        showToast('Winner drawn successfully! 🎉', 'success');
      }
    } catch (error) {
      console.error('Error drawing winner:', error);
      showToast('Drawing failed: ' + error.message, 'error');
      setTxStatus('');
    } finally {
      setLoading(false);
    }
  };

  // Lets the current winner collect their encrypted-round payout.
  const claimPrize = async () => {
    if (!contract) return;

    setLoading(true);
    setTxStatus('Claiming prize...');

    try {
      const tx = await contract.claimPrize();
      await tx.wait();

      showToast('Prize claimed successfully! 💰', 'success');
      await loadLotteryState(contract);
    } catch (error) {
      console.error('Error claiming prize:', error);
      showToast('Claim failed: ' + error.message, 'error');
    } finally {
      setLoading(false);
      setTxStatus('');
    }
  };

  // Resets contract state and pre-buys a ticket to seed the next encrypted round.
  const startNewRound = async () => {
    if (!contract) return;

    setLoading(true);
    setTxStatus('Starting new round...');

    try {
      const tx = await contract.startNewRound();
      await tx.wait();

      showToast('New round started! Ready for new lottery! 🎯', 'success');
      await loadLotteryState(contract);

      setTxStatus('Auto purchasing your first ticket...');

      const { handle, proof } = await encryptTicket(1);
      const ticketPriceWei = await contract.ticketPrice();

      const ticketTx = await contract.buyTicket(handle, proof, {
        value: ticketPriceWei
      });

      await ticketTx.wait();

      showToast('First ticket purchased automatically! 🎫 You are the first participant!', 'success');
      await loadLotteryState(contract);
    } catch (error) {
      console.error('Error starting new round:', error);
      showToast('Failed to start new round: ' + error.message, 'error');
    } finally {
      setLoading(false);
      setTxStatus('');
    }
  };

  // Allows winners from prior encrypted rounds to withdraw missed prizes.
  const claimPastPrize = async (roundIndex) => {
    if (!contract) return;

    setLoading(true);
    setTxStatus('Claiming past prize...');

    try {
      const tx = await contract.claimPastPrize(roundIndex);
      await tx.wait();

      showToast('Past prize claimed successfully! 💰', 'success');
      await loadLotteryState(contract);
    } catch (error) {
      console.error('Error claiming past prize:', error);
      showToast('Past prize claim failed: ' + error.message, 'error');
    } finally {
      setLoading(false);
      setTxStatus('');
    }
  };

  return {
    contract,
    lotteryState,
    loading,
    buyTicket,
    drawWinner,
    claimPrize,
    startNewRound,
    claimPastPrize
  };
};
