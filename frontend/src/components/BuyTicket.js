import { useState } from 'react';

const BuyTicket = ({ lotteryState, loading, onBuyTicket }) => {
  const [ticketNumber, setTicketNumber] = useState('');

  const handleBuyTicket = () => {
    onBuyTicket(ticketNumber);
    setTicketNumber('');
  };

  if (lotteryState.isDrawn) return null;

  return (
    <div className="card-priority" style={{ maxWidth: '500px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '12px' }}>
        <span className="badge" style={{ background: 'var(--success-color)', fontSize: '0.7rem' }}>🔒 ENCRYPTED</span>
        <span className="badge" style={{ background: 'var(--warning-color)', fontSize: '0.7rem' }}>🛡️ PRIVATE</span>
        <span className="badge" style={{ background: 'var(--secondary-color)', fontSize: '0.7rem' }}>🎯 FHEVM</span>
      </div>

      <h2 style={{ textAlign: 'center', marginBottom: '8px', fontSize: '1.25rem', color: 'var(--primary-color)' }}>🎫 Buy Your Private Ticket</h2>

      <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '12px', fontSize: '0.8rem' }}>
        🤫 Your ticket number is encrypted with FHEVM technology
      </p>

      <div style={{ background: 'var(--success-light)', padding: '8px', borderRadius: '6px', marginBottom: '16px', border: '1px solid var(--success-color)' }}>
        <p style={{ textAlign: 'center', color: 'var(--success-dark)', fontSize: '0.75rem', margin: '0' }}>
          ✅ <strong>Zero-Knowledge Lottery:</strong> Only the winner can prove they won!
        </p>
      </div>

      <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
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
          onClick={handleBuyTicket}
          disabled={loading || !ticketNumber || ticketNumber < 1 || ticketNumber > 100}
          className={`btn ${loading ? 'btn-loading' : 'btn-primary'}`}
          style={{ minWidth: '200px' }}
        >
          {loading ? '🔄 Encrypting & Purchasing...' : '🔒 Buy Encrypted Ticket (0.0001 ETH)'}
        </button>
      </div>

      <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '12px', fontSize: '0.7rem' }}>
        🔐 Your number is mathematically encrypted and stored privately on the blockchain
      </p>
    </div>
  );
};

export default BuyTicket;
