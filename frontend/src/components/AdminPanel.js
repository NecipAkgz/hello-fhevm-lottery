const AdminPanel = ({ loading, onDrawWinner, onResetLottery, lotteryState }) => {
  return (
    <div className="card" style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}>
      <h2 style={{ marginBottom: '12px', fontSize: '1.25rem' }}>⚙️ Admin Functions</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', fontSize: '0.875rem' }}>
        Only administrators can manage the lottery
      </p>

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button
          onClick={onDrawWinner}
          disabled={loading || lotteryState.isDrawn}
          className="btn btn-warning"
        >
          {loading ? '🎲 Drawing...' : '🎲 Draw Winner'}
        </button>

        <button
          onClick={onResetLottery}
          disabled={loading || !lotteryState.isDrawn}
          className="btn btn-secondary"
        >
          {loading ? '🔄 Resetting...' : '🔄 Reset Lottery'}
        </button>
      </div>

      <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '16px' }}>
        💡 Reset lottery after winner claims prize to start a new round
      </p>
    </div>
  );
};

export default AdminPanel;
