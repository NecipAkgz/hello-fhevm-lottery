import React from 'react';

const LotteryStats = ({ lotteryState }) => {
  const [, forceUpdate] = React.useReducer((x) => x + 1, 0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      forceUpdate();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const renderDrawCountdown = () => {
    const now = Math.floor(Date.now() / 1000);
    const nextDrawTime = lotteryState.lastDrawTime + 600;
    const remaining = nextDrawTime - now;

    if (remaining <= 0) {
      return 'Ready';
    }

    const minutes = Math.floor(remaining / 60)
      .toString()
      .padStart(2, '0');
    const seconds = Math.floor(remaining % 60)
      .toString()
      .padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const shouldAllowDraw = () => {
    const now = Math.floor(Date.now() / 1000);
    const nextDrawTime = lotteryState.lastDrawTime + 600;
    return nextDrawTime - now <= 0 && lotteryState.participantCount > 0;
  };

  return (
    <div className="panel panel-compact">
      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-label">Prize pool</div>
          <div className="stat-value">{lotteryState.balance} ETH</div>
          <div className="stat-meta">Total rewards available</div>
        </div>

        <div className="stat-card success">
          <div className="stat-label">Participants</div>
          <div className="stat-value">{lotteryState.participantCount}</div>
          <div className="stat-meta">Wallets in this round</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Status</div>
          <div className="stat-value">
            {lotteryState.isDrawn ? 'Winner announced' : 'Accepting tickets'}
          </div>
          <div className="stat-meta">
            {lotteryState.isDrawn ? 'The pool can be claimed' : 'Waiting for new entries'}
          </div>
        </div>

        {!lotteryState.isDrawn && (
          <div className="stat-card warning">
            <div className="stat-label">Next draw</div>
            <div className="stat-value">{renderDrawCountdown()}</div>
            <div className="stat-meta">
              {lotteryState.participantCount > 0
                ? 'A draw can be triggered when the timer reaches zero'
                : 'At least one ticket is required'}
            </div>
            {shouldAllowDraw() && (
              <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent('drawWinner'))}
                className="btn btn-secondary"
              >
                Trigger winner selection
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LotteryStats;
