import React, { useState } from 'react';
import { ethers, BrowserProvider, Contract, parseEther, formatEther } from 'ethers';

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
    "function getMyTicket() view returns (uint8)",
    "function getBalance() view returns (uint256)",
    "function getParticipantCount() view returns (uint256)",
    "function ticketPrice() view returns (uint256)",
    "function isDrawn() view returns (bool)",
    "function winner() view returns (address)"
  ];

  // Contract address
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  // Connect to MetaMask
  const connectWallet = async () => {
    if (!window.ethereum) {
      showToast('Please install MetaMask browser extension', 'error');
      return;
    }

    try {
      setTxStatus('Connecting...');
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
        value: parseEther("0.001"),
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
              <p style={{ opacity: 0.8, marginBottom: '24px' }}>
                Connect your MetaMask wallet to participate in the confidential lottery
              </p>
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
                      {loading ? '🎫 Purchasing...' : '🎫 Buy Ticket (0.001 ETH)'}
                    </button>
                  </div>
                </div>
              )}

              {/* Admin Section */}
              <div className="glass-card" style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}>
                <h2 style={{ marginBottom: '16px' }}>⚙️ Admin Functions</h2>
                <p style={{ opacity: 0.7, marginBottom: '24px' }}>
                  Only administrators can draw the winner
                </p>
                <button
                  onClick={drawWinner}
                  disabled={loading || lotteryState.isDrawn}
                  className="btn btn-warning"
                >
                  {loading ? '🎲 Drawing...' : '🎲 Draw Winner'}
                </button>
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
                    Local Hardhat
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
