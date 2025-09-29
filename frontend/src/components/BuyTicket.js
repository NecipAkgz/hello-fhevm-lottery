import { useState } from 'react';

const BuyTicket = ({ lotteryState, loading, onBuyTicket }) => {
  const [ticketNumber, setTicketNumber] = useState('');

  const handleBuyTicket = () => {
    onBuyTicket(ticketNumber);
    setTicketNumber('');
  };

  if (lotteryState.isDrawn) {
    return null;
  }

  const isDisabled =
    loading || !ticketNumber || Number(ticketNumber) < 1 || Number(ticketNumber) > 100;

  return (
    <div className="panel panel-primary ticket-panel">
      <div className="ticket-header">
        <div className="ticket-header-copy">
          <h2 className="panel-title">Buy your ticket</h2>
          <p className="panel-description">
            Pick a number and join the pool without revealing your entry.
          </p>
        </div>
        <div className="ticket-price">
          <span className="ticket-price-label">Ticket price</span>
          <span className="ticket-price-value">0.0001 ETH</span>
        </div>
      </div>

      <div className="ticket-badges">
        <div className="badge badge-encrypted">
          🔒 ENCRYPTED
        </div>
        <div className="badge badge-private">
          🛡️ PRIVATE
        </div>
        <div className="badge badge-fhevm">
          🎯 FHEVM
        </div>
      </div>

      <div className="ticket-note">
        Fully homomorphic encryption keeps your choice hidden from everyone, including the contract owner.
      </div>

      <div className="ticket-form">
        <input
          type="number"
          placeholder="Enter a number between 1 and 100"
          value={ticketNumber}
          onChange={(event) => setTicketNumber(event.target.value)}
          min="1"
          max="100"
          className="form-input ticket-input"
        />
        <button
          type="button"
          onClick={handleBuyTicket}
          disabled={isDisabled}
          className={`btn ticket-btn ${loading ? 'btn-loading' : 'btn-primary'}`}
        >
          {loading ? 'Preparing transaction...' : 'Purchase ticket'}
        </button>
      </div>

      <div className="ticket-footer">
        <span>#1–#100</span>
        <p>One encrypted ticket per purchase. Reveal happens only after the round closes.</p>
      </div>
    </div>
  );
};

export default BuyTicket;
