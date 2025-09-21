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
      <h2 style={{ textAlign: 'center', marginBottom: '12px', fontSize: '1.25rem', color: 'var(--primary-color)' }}>🎫 Buy Your Ticket</h2>
      <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '20px', fontSize: '0.875rem' }}>
        Choose a number between 1-100 and purchase your confidential lottery ticket
      </p>

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
          {loading ? '🎫 Purchasing...' : '🎫 Buy Ticket (0.0001 ETH)'}
        </button>
      </div>
    </div>
  );
};

export default BuyTicket;
