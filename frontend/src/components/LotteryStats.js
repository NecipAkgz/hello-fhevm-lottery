import React from 'react';

const LotteryStats = ({ lotteryState }) => {
  const [, forceUpdate] = React.useReducer(x => x + 1, 0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      forceUpdate();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
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

      {!lotteryState.isDrawn && (
        <div className="stat-card">
          <div className="stat-label">Next Draw</div>
          <div className="stat-value">
            {(() => {
              const now = Math.floor(Date.now() / 1000);
              const nextDrawTime = lotteryState.lastDrawTime + 600;
              const remaining = nextDrawTime - now;

              if (remaining <= 0) {
                return "⏰ Available";
              } else {
                const minutes = Math.floor(remaining / 60);
                const seconds = remaining % 60;
                return `${minutes}:${seconds.toString().padStart(2, '0')}`;
              }
            })()}
          </div>
          <div className="stat-desc">
            {lotteryState.participantCount > 0 ? "Draw available in" : "Waiting for players"}
          </div>
          {(() => {
            const now = Math.floor(Date.now() / 1000);
            const nextDrawTime = lotteryState.lastDrawTime + 600;
            const remaining = nextDrawTime - now;
            return remaining <= 0 && lotteryState.participantCount > 0;
          })() && (
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('drawWinner'))}
              className="btn btn-warning"
              style={{ marginTop: '8px', fontSize: '0.75rem', padding: '4px 8px' }}
            >
              🎲 Draw Winner Now
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default LotteryStats;
