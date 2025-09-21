const PastRounds = ({ pastRounds, account, onClaimPastPrize, loading }) => {
  if (!pastRounds || pastRounds.length === 0) return null;

  return (
    <div className="card" style={{ maxWidth: '600px', margin: '20px auto 0' }}>
      <h3 style={{ marginBottom: '16px', fontSize: '1.1rem', color: 'var(--text-primary)' }}>📜 Past Rounds</h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {pastRounds.map((round) => {
          const isWinner = round.winner.toLowerCase() === account.toLowerCase();
          const canClaim = isWinner && !round.claimed;

          return (
            <div
              key={round.index}
              style={{
                padding: '12px',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                backgroundColor: 'var(--bg-secondary)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>
                  Round #{round.index + 1}
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  {new Date(round.drawTime * 1000).toLocaleDateString()}
                </span>
              </div>

              <div style={{ marginBottom: '8px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Winner: </span>
                <span style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>
                  {round.winner.slice(0, 6)}...{round.winner.slice(-4)}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-secondary)' }}>
                  Prize: {round.prize} ETH
                </span>

                {isWinner ? (
                  round.claimed ? (
                    <span style={{ color: 'var(--success-color)', fontSize: '0.9rem' }}>✅ Claimed</span>
                  ) : (
                    <button
                      onClick={() => onClaimPastPrize(round.index)}
                      disabled={loading}
                      className="btn btn-success"
                      style={{ fontSize: '0.8rem', padding: '4px 8px' }}
                    >
                      {loading ? '💰 Claiming...' : '💰 Claim Prize'}
                    </button>
                  )
                ) : (
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    Better luck next time! 🎯
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PastRounds;
