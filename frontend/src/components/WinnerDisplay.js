const WinnerDisplay = ({ lotteryState, account, loading, onClaimPrize, onStartNewRound }) => {
  if (!lotteryState.isDrawn) return null;

  const isWinner = lotteryState.winner.toLowerCase() === account.toLowerCase();

  return (
    <div className="card-priority" style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}>
      <h2 style={{ color: 'var(--primary-color)', marginBottom: '12px', fontSize: '1.25rem' }}>🏆 Winner Announcement</h2>
      <p style={{ marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Winner Address:</p>
      <p style={{
        fontSize: '1.125rem',
        fontWeight: 'bold',
        color: 'var(--success-color)',
        marginBottom: '16px',
        fontFamily: 'monospace'
      }}>
        {lotteryState.winner.slice(0, 8)}...{lotteryState.winner.slice(-6)}
      </p>

      {isWinner ? (
        <div>
          <div className="status-message status-success fade-in">
            🎉 Congratulations! You are the winner! Claim your prize below.
          </div>
          <button
            onClick={onClaimPrize}
            disabled={loading}
            className={`btn ${loading ? 'btn-loading' : 'btn-success'}`}
            style={{ marginTop: '16px' }}
          >
            {loading ? '💰 Claiming...' : `💰 Claim Prize (${lotteryState.balance} ETH)`}
          </button>
          <div style={{ marginTop: '12px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            💡 After claiming, you can start a new round below
          </div>
        </div>
      ) : (
        <div>
          <div className="status-message status-info fade-in">
            💡 Better luck next time! The winner has been announced.
          </div>
          <button
            onClick={onStartNewRound}
            disabled={loading}
            className={`btn ${loading ? 'btn-loading' : 'btn-primary'}`}
            style={{ marginTop: '8px' }}
          >
            🔄 Start New Round
          </button>
        </div>
      )}

      {/* Show Start New Round button only for winner after claiming */}
      {isWinner && (
        <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-light)' }}>
          <button
            onClick={onStartNewRound}
            disabled={loading}
            className={`btn ${loading ? 'btn-loading' : 'btn-primary'}`}
            style={{ width: '100%' }}
          >
            {loading ? '🔄 Starting...' : '🎯 Start New Round & Buy First Ticket'}
          </button>
          <div style={{ marginTop: '8px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            You will automatically get the first ticket!
          </div>
        </div>
      )}

      {/* Show message for non-winners */}
      {!isWinner && (
        <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-light)' }}>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
            💡 New round will start when winner initiates it
          </div>
        </div>
      )}
    </div>
  );
};

export default WinnerDisplay;
