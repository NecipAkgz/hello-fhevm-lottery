import { useState, useEffect } from 'react';
import { BrowserProvider, Contract, parseEther, formatEther } from 'ethers';

export const useLottery = (account, showToast, setTxStatus, contractAddress) => {
  const [contract, setContract] = useState(null);
  const [lotteryState, setLotteryState] = useState({
    isDrawn: false,
    winner: '',
    participantCount: 0,
    balance: '0',
    ticketPrice: '0.001',
    lastDrawTime: 0,
    admin: '',
    pastRounds: []
  });
  const [loading, setLoading] = useState(false);

  // Contract ABI
  const contractABI = [
    "function buyTicket(uint8) payable",
    "function drawWinner()",
    "function claimPrize()",
    "function resetLottery()",
    "function startNewRound()",
    "function claimPastPrize(uint256)",
    "function getMyTicket() view returns (uint8)",
    "function getBalance() view returns (uint256)",
    "function getParticipantCount() view returns (uint256)",
    "function ticketPrice() view returns (uint256)",
    "function isDrawn() view returns (bool)",
    "function winner() view returns (address)",
    "function admin() view returns (address)",
    "function lastDrawTime() view returns (uint256)",
    "function getPastRoundsLength() view returns (uint256)",
    "function pastRounds(uint256) view returns (address, uint256, uint256, bool)"
  ];

  // Initialize contract when account is available
  useEffect(() => {
    if (account && window.ethereum) {
      const initContract = async () => {
        try {
          const provider = new BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const lotteryContract = new Contract(contractAddress, contractABI, signer);
          setContract(lotteryContract);
          await loadLotteryState(lotteryContract);
        } catch (error) {
          console.error("Error initializing contract:", error);
        }
      };
      initContract();
    }
  }, [account, contractAddress]);

  // Load lottery state from contract
  const loadLotteryState = async (contractInstance) => {
    try {
      const [isDrawn, winner, participantCount, balance, ticketPrice, lastDrawTime, admin, pastRoundsLength] = await Promise.all([
        contractInstance.isDrawn(),
        contractInstance.winner(),
        contractInstance.getParticipantCount(),
        contractInstance.getBalance(),
        contractInstance.ticketPrice(),
        contractInstance.lastDrawTime(),
        contractInstance.admin(),
        contractInstance.getPastRoundsLength()
      ]);

      // Load last 5 past rounds
      const pastRounds = [];
      const startIndex = pastRoundsLength > 5 ? pastRoundsLength - 5 : 0;
      for (let i = startIndex; i < pastRoundsLength; i++) {
        try {
          const round = await contractInstance.pastRounds(i);
          pastRounds.push({
            winner: round[0],
            prize: formatEther(round[1]),
            drawTime: Number(round[2]),
            claimed: round[3],
            index: i
          });
        } catch (error) {
          console.error("Error loading past round:", i, error);
        }
      }

      setLotteryState({
        isDrawn,
        winner,
        participantCount: Number(participantCount),
        balance: formatEther(balance),
        ticketPrice: formatEther(ticketPrice),
        lastDrawTime: Number(lastDrawTime),
        admin,
        pastRounds
      });
    } catch (error) {
      console.error("Error loading lottery state:", error);
    }
  };

  // Buy ticket function
  const buyTicket = async (ticketNumber) => {
    if (!contract || !ticketNumber || ticketNumber < 1 || ticketNumber > 100) {
      showToast('Please enter a ticket number between 1-100', 'warning');
      return;
    }

    setLoading(true);
    setTxStatus('Purchasing ticket...');

    try {
      const tx = await contract.buyTicket(ticketNumber, {
        value: parseEther("0.0001"),
        gasLimit: 500000
      });

      await tx.wait();

      showToast('Ticket purchased successfully! 🎫', 'success');
      await loadLotteryState(contract);

    } catch (error) {
      console.error("Error buying ticket:", error);
      showToast('Purchase failed: ' + error.message, 'error');
    } finally {
      setLoading(false);
      setTxStatus('');
    }
  };

  // Draw winner function
  const drawWinner = async () => {
    if (!contract) return;

    setLoading(true);
    setTxStatus('Drawing winner...');

    try {
      const tx = await contract.drawWinner();
      await tx.wait();

      showToast('Winner drawn successfully! 🎉', 'success');
      await loadLotteryState(contract);

    } catch (error) {
      console.error("Error drawing winner:", error);
      showToast('Drawing failed: ' + error.message, 'error');
    } finally {
      setLoading(false);
      setTxStatus('');
    }
  };

  // Claim prize function
  const claimPrize = async () => {
    if (!contract) return;

    setLoading(true);
    setTxStatus('Claiming prize...');

    try {
      const tx = await contract.claimPrize();
      await tx.wait();

      showToast('Prize claimed successfully! 💰', 'success');
      await loadLotteryState(contract);

      // Auto reset lottery after prize claim
      setTxStatus('Auto resetting lottery...');
      const resetTx = await contract.resetLottery();
      await resetTx.wait();

      showToast('Lottery auto-reset! Ready for new round! 🎯', 'success');
      await loadLotteryState(contract);

    } catch (error) {
      console.error("Error claiming prize:", error);
      showToast('Claim failed: ' + error.message, 'error');
    } finally {
      setLoading(false);
      setTxStatus('');
    }
  };

  // Reset lottery function
  const resetLottery = async () => {
    if (!contract) return;

    setLoading(true);
    setTxStatus('Resetting lottery...');

    try {
      const tx = await contract.resetLottery();
      await tx.wait();

      showToast('Lottery reset successfully! 🎯 Ready for new round!', 'success');
      await loadLotteryState(contract);

    } catch (error) {
      console.error("Error resetting lottery:", error);
      showToast('Reset failed: ' + error.message, 'error');
    } finally {
      setLoading(false);
      setTxStatus('');
    }
  };

  // Start new round function
  const startNewRound = async () => {
    if (!contract) return;

    setLoading(true);
    setTxStatus('Starting new round...');

    try {
      const tx = await contract.startNewRound();
      await tx.wait();

      showToast('New round started! Ready for new lottery! 🎯', 'success');
      await loadLotteryState(contract);

    } catch (error) {
      console.error("Error starting new round:", error);
      showToast('Failed to start new round: ' + error.message, 'error');
    } finally {
      setLoading(false);
      setTxStatus('');
    }
  };

  // Claim past prize function
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
      console.error("Error claiming past prize:", error);
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
    resetLottery,
    startNewRound,
    claimPastPrize
  };
};
