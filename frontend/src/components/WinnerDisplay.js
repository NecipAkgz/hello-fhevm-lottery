const WinnerDisplay = ({ lotteryState, account, loading, onClaimPrize, onStartNewRound }) => {
  if (!lotteryState.isDrawn) return null;

  return (
    <div className="card" style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}>
      <h2 style={{ color: 'var(--warning-color)', marginBottom: '12px', fontSize: '1.25rem' }}>🏆 Winner Announcement</h2>
      <p style={{ marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Winner Address:</p>
      <p style={{
        fontSize: '1.125rem',
        fontWeight: 'bold',
        color: 'var(--success-color)',
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
            onClick={onClaimPrize}
            disabled={loading}
            className="btn btn-success"
          >
            {loading ? '💰 Claiming...' : `💰 Claim Prize (${lotteryState.balance} ETH)`}
          </button>
        </div>
      ) : (
        <div>
          <p style={{ color: 'var(--text-secondary)' }}>Better luck next time! 🎯</p>
          <button
            onClick={onStartNewRound}
            disabled={loading}
            className="btn btn-secondary"
            style={{ marginTop: '8px', fontSize: '0.75rem' }}
          >
            🔄 Start New Round
          </button>
        </div>
      )}
    </div>
  );
};

export default WinnerDisplay;
