const AdminPanel = ({ loading, onDrawWinner, onResetLottery, lotteryState }) => {
  return (
    <div className="card-priority" style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}>
      <h2 style={{ marginBottom: '12px', fontSize: '1.25rem', color: 'var(--warning-color)' }}>⚙️ Admin Functions</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', fontSize: '0.875rem' }}>
        Reset lottery after winner claims prize
      </p>

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button
          onClick={onResetLottery}
          disabled={loading || !lotteryState.isDrawn}
          className={`btn ${loading ? 'btn-loading' : 'btn-warning'}`}
          style={{ minWidth: '160px' }}
        >
          {loading ? '🔄 Resetting...' : '🔄 Reset Lottery'}
        </button>
      </div>

      <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-light)' }}>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
          📋 Reset clears all tickets and prepares for new round
        </p>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
          <strong>Reset Steps:</strong><br/>
          1. Winner claims prize<br/>
          2. Admin resets lottery<br/>
          3. Winner starts new round
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
