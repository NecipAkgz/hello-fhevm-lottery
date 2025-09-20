import React, { useState } from 'react';
import { ethers, BrowserProvider, Contract, parseEther, formatEther } from 'ethers';

/**
 * 🎯 Confidential Lottery - FHEVM Tutorial Application
 *
 * This application is a confidential lottery built with Zama FHEVM technology.
 * Users can:
 *
 * 🔐 CONFIDENTIAL TICKET PURCHASE:
 * - Choose a number between 1-100
 * - Purchase tickets for 0.0001 ETH each
 * - Ticket numbers are stored encrypted for privacy
 *
 * 🎲 SECRET DRAWING:
 * - Admin randomly selects a winner
 * - Drawing happens securely on the blockchain
 * - Winner address is announced to all participants
 *
 * 💰 PRIZE CLAIMING:
 * - Only the winner can claim the prize
 * - Total prize pool is transferred to winner's wallet
 *
 * 🌐 TECHNICAL FEATURES:
 * - MetaMask wallet integration
 * - Sepolia testnet deployment
 * - Real-time status updates
 * - Modern responsive design
 */

function App() {
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [ticketNumber, setTicketNumber] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [lotteryState, setLotteryState] = useState({
    isDrawn: false,
    winner: '',
    participantCount: 0,
    balance: '0',
    ticketPrice: '0.001'
  });
  const [loading, setLoading] = useState(false);
  const [txStatus, setTxStatus] = useState('');
  const [messages, setMessages] = useState([]);

  // Simple toast function
  const showToast = (message, type = 'info') => {
    const id = Date.now();
    setMessages(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setMessages(prev => prev.filter(msg => msg.id !== id));
    }, 5000);
  };

  // Contract ABI
  const contractABI = [
    "function buyTicket(uint8) payable",
    "function drawWinner()",
    "function claimPrize()",
    "function resetLottery()",
    "function getMyTicket() view returns (uint8)",
    "function getBalance() view returns (uint256)",
    "function getParticipantCount() view returns (uint256)",
    "function ticketPrice() view returns (uint256)",
    "function isDrawn() view returns (bool)",
    "function winner() view returns (address)",
    "function admin() view returns (address)"
  ];

  // Contract address - Sepolia testnet
  const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS || "0x63Cf79cC631699356775d3c6b277A94D64737F18";

  // Switch to Sepolia network
  const switchToSepolia = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xaa36a7' }], // Sepolia chain ID (11155111 in hex)
      });
    } catch (error) {
      // Network mevcut değilse ekle
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0xaa36a7',
              chainName: 'Sepolia Testnet',
              nativeCurrency: { name: 'SepoliaETH', symbol: 'ETH', decimals: 18 },
              rpcUrls: ['https://sepolia.infura.io/v3/54d227d3f34347b5b4ba31bbfdb83093'],
              blockExplorerUrls: ['https://sepolia.etherscan.io/']
            }]
          });
        } catch (addError) {
          console.error("Error adding Sepolia network:", addError);
        }
      } else {
        console.error("Error switching to Sepolia:", error);
      }
    }
  };

  // Connect to MetaMask
  const connectWallet = async () => {
    if (!window.ethereum) {
      showToast('Please install MetaMask browser extension', 'error');
      return;
    }

    try {
      setTxStatus('Connecting...');

      // Sepolia network'üne geç
      await switchToSepolia();

      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
      setIsConnected(true);

      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Initialize contract
      const lotteryContract = new Contract(contractAddress, contractABI, signer);
      setContract(lotteryContract);

      // Load initial state
      await loadLotteryState(lotteryContract);

      showToast('Wallet connected successfully!', 'success');

    } catch (error) {
      console.error("Error connecting wallet:", error);
      showToast('Connection failed: ' + error.message, 'error');
    } finally {
      setTxStatus('');
    }
  };

  // Load lottery state from contract
  const loadLotteryState = async (contractInstance) => {
    try {
      const [isDrawn, winner, participantCount, balance, ticketPrice] = await Promise.all([
        contractInstance.isDrawn(),
        contractInstance.winner(),
        contractInstance.getParticipantCount(),
        contractInstance.getBalance(),
        contractInstance.ticketPrice()
      ]);

      setLotteryState({
        isDrawn,
        winner,
        participantCount: Number(participantCount),
        balance: formatEther(balance),
        ticketPrice: formatEther(ticketPrice)
      });
    } catch (error) {
      console.error("Error loading lottery state:", error);
    }
  };

  // Buy ticket function
  const buyTicket = async () => {
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
      setTicketNumber('');

      showToast('Ticket purchased successfully! 🎫', 'success');

      // Reload state
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

      // Reload state
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

      // Reload state
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

      // Reload state
      await loadLotteryState(contract);

    } catch (error) {
      console.error("Error resetting lottery:", error);
      showToast('Reset failed: ' + error.message, 'error');
    } finally {
      setLoading(false);
      setTxStatus('');
    }
  };

  return (
    <div className="app">
      <div className="container">
        <div className="app-content">

          {/* Header */}
          <header className="header">
            <div className="header-content">
              <h1 className="title">
                <span className="title-icon">🎯</span>
                Confidential Lottery
              </h1>
              <p className="subtitle">
                Your first confidential application with Zama FHEVM
              </p>
    <span className="badge">
      FHEVM Tutorial
    </span>
    <a href="https://github.com/NecipAkgz/hello-fhevm-lottery" target="_blank" rel="noopener noreferrer" style={{ marginTop: '10px', display: 'inline-block', color: '#fff', textDecoration: 'none' }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '5px' }}>
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
      </svg>
      GitHub
    </a>
  </div>
</header>

          {/* Toast Messages */}
          <div className="toast-container">
            {messages.map(msg => (
              <div key={msg.id} className={`toast toast-${msg.type}`}>
                {msg.message}
              </div>
            ))}
          </div>

          {/* Connection Section */}
          {!isConnected ? (
            <div className="glass-card" style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>Connect Your Wallet</h2>
              <p style={{ opacity: 0.8, marginBottom: '16px' }}>
                Connect your MetaMask wallet to participate in the confidential lottery
              </p>

              {/* App Description */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '24px',
                textAlign: 'left'
              }}>
                <h3 style={{ fontSize: '1rem', marginBottom: '8px', color: '#fff' }}>
                  🎯 What is Confidential Lottery?
                </h3>
                <p style={{ fontSize: '0.875rem', opacity: 0.8, marginBottom: '8px' }}>
                  A privacy-focused lottery built with Zama FHEVM technology where:
                </p>
                <ul style={{ fontSize: '0.875rem', opacity: 0.8, paddingLeft: '20px', marginBottom: '0' }}>
                  <li>🎫 Buy tickets with encrypted numbers (0.0001 ETH)</li>
                  <li>🎲 Admin draws winner randomly on blockchain</li>
                  <li>💰 Only winner can claim the prize pool</li>
                </ul>
              </div>

              <button
                onClick={connectWallet}
                disabled={txStatus === 'Connecting...'}
                className="btn btn-primary"
              >
                {txStatus === 'Connecting...' ? '🔄 Connecting...' : '🔗 Connect MetaMask'}
              </button>
            </div>
          ) : (
            <div className="app-content">

              {/* Account Info */}
              <div className="glass-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.875rem', opacity: 0.7 }}>Connected Account</div>
                    <div style={{ fontWeight: 'bold' }}>
                      {account.slice(0, 6)}...{account.slice(-4)}
                    </div>
                  </div>
                  <span className="badge" style={{ background: '#48bb78' }}>
                    ✅ Connected
                  </span>
                </div>
              </div>

              {/* Transaction Status */}
              {txStatus && (
                <div className="status-message status-info">
                  <strong>Transaction in progress:</strong> {txStatus}
                </div>
              )}

              {/* Lottery Stats Grid */}
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-label">Participants</div>
                  <div className="stat-value">{lotteryState.participantCount}</div>
                  <div className="stat-desc">Total players</div>
                </div>

                <div className="stat-card">
                  <div className="stat-label">Prize Pool</div>
                  <div className="stat-value">{lotteryState.balance} ETH</div>
                  <div className="stat-desc">Total rewards</div>
                </div>

                <div className="stat-card">
                  <div className="stat-label">Ticket Price</div>
                  <div className="stat-value">{lotteryState.ticketPrice} ETH</div>
                  <div className="stat-desc">Per ticket</div>
                </div>

                <div className="stat-card">
                  <div className="stat-label">Status</div>
                  <div className="stat-value">
                    {lotteryState.isDrawn ? "🎉 Drawn" : "🎯 Active"}
                  </div>
                  <div className="stat-desc">
                    {lotteryState.isDrawn ? "Winner selected" : "Accepting tickets"}
                  </div>
                </div>
              </div>

              {/* Winner Display */}
              {lotteryState.isDrawn && (
                <div className="glass-card" style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}>
                  <h2 style={{ color: '#ffd700', marginBottom: '16px' }}>🏆 Winner Announcement</h2>
                  <p style={{ marginBottom: '8px' }}>Winner Address:</p>
                  <p style={{
                    fontSize: '1.25rem',
                    fontWeight: 'bold',
                    color: '#48bb78',
                    marginBottom: '16px'
                  }}>
                    {lotteryState.winner.slice(0, 8)}...{lotteryState.winner.slice(-6)}
                  </p>

                  {lotteryState.winner.toLowerCase() === account.toLowerCase() ? (
                    <div>
                      <div className="status-message status-success">
                        🎉 Congratulations! You are the winner! Claim your prize below.
                      </div>
                      <button
                        onClick={claimPrize}
                        disabled={loading}
                        className="btn btn-success"
                      >
                        {loading ? '💰 Claiming...' : `💰 Claim Prize (${lotteryState.balance} ETH)`}
                      </button>
                    </div>
                  ) : (
                    <p style={{ opacity: 0.7 }}>Better luck next time! 🎯</p>
                  )}
                </div>
              )}

              {/* Buy Ticket Section */}
              {!lotteryState.isDrawn && (
                <div className="glass-card" style={{ maxWidth: '500px', margin: '0 auto' }}>
                  <h2 style={{ textAlign: 'center', marginBottom: '16px' }}>🎫 Buy Your Ticket</h2>
                  <p style={{ textAlign: 'center', opacity: 0.8, marginBottom: '24px' }}>
                    Choose a number between 1-100 and purchase your confidential lottery ticket
                  </p>

                  <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                    <input
                      type="number"
                      placeholder="Enter ticket number (1-100)"
                      value={ticketNumber}
                      onChange={(e) => setTicketNumber(e.target.value)}
                      min="1"
                      max="100"
                      className="form-input"
                      style={{ width: '150px', textAlign: 'center' }}
                    />
                    <button
                      onClick={buyTicket}
                      disabled={loading || !ticketNumber || ticketNumber < 1 || ticketNumber > 100}
                      className="btn btn-primary"
                    >
                      {loading ? '🎫 Purchasing...' : '🎫 Buy Ticket (0.0001 ETH)'}
                    </button>
                  </div>
                </div>
              )}

              {/* Admin Section */}
              <div className="glass-card" style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}>
                <h2 style={{ marginBottom: '16px' }}>⚙️ Admin Functions</h2>
                <p style={{ opacity: 0.7, marginBottom: '24px' }}>
                  Only administrators can manage the lottery
                </p>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button
                    onClick={drawWinner}
                    disabled={loading || lotteryState.isDrawn}
                    className="btn btn-warning"
                  >
                    {loading ? '🎲 Drawing...' : '🎲 Draw Winner'}
                  </button>

                  <button
                    onClick={resetLottery}
                    disabled={loading || !lotteryState.isDrawn}
                    className="btn btn-secondary"
                    style={{ background: 'linear-gradient(135deg, #6b7280, #4b5563)' }}
                  >
                    {loading ? '🔄 Resetting...' : '🔄 Reset Lottery'}
                  </button>
                </div>

                <p style={{ fontSize: '0.75rem', opacity: 0.6, marginTop: '16px' }}>
                  💡 Reset lottery after winner claims prize to start a new round
                </p>
              </div>

              {/* Contract Info */}
              <div className="glass-card">
                <h3 style={{ marginBottom: '16px' }}>📋 Contract Information</h3>
                <hr style={{ borderColor: 'rgba(255,255,255,0.3)', marginBottom: '16px' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ opacity: 0.8 }}>Contract Address:</span>
                  <span style={{ fontFamily: 'monospace', color: '#63b3ed' }}>
                    {contractAddress.slice(0, 10)}...{contractAddress.slice(-8)}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ opacity: 0.8 }}>Network:</span>
                  <span className="badge" style={{ background: '#805ad5', padding: '2px 8px', fontSize: '0.75rem' }}>
                    Sepolia Testnet
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ opacity: 0.8 }}>Technology:</span>
                  <span className="badge" style={{ background: '#ed8936', padding: '2px 8px', fontSize: '0.75rem' }}>
                    FHEVM
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        body, html {
          margin: 0;
          padding: 0;
          border: none;
          width: 100%;
          height: 100%;
        }

        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export default App;
