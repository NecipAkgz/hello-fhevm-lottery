import React from 'react';

const WalletConnect = ({ isConnected, account, onConnect, txStatus, pastRounds, onClaimPastPrize, loading }) => {
  const [showPastRounds, setShowPastRounds] = React.useState(false);

  if (isConnected) {
    return (
      <div>
        {/* Connected Account */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Connected Account</div>
              <div style={{ fontWeight: 'bold' }}>
                {account.slice(0, 6)}...{account.slice(-4)}
              </div>
            </div>
            <span className="badge" style={{ background: 'var(--success-color)' }}>
              ✅ Connected
            </span>
          </div>
        </div>

        {/* Past Rounds Section */}
        {pastRounds && pastRounds.length > 0 && (
          <div className="card" style={{ marginTop: '16px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
                padding: '12px'
              }}
              onClick={() => setShowPastRounds(!showPastRounds)}
            >
              <div style={{ fontSize: '0.875rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                📜 Past Rounds ({pastRounds.length})
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {showPastRounds ? '▼' : '▶'}
              </span>
            </div>

            {showPastRounds && (
              <div style={{ padding: '0 12px 12px 12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto' }}>
                  {pastRounds.map((round) => {
                    const isWinner = round.winner.toLowerCase() === account.toLowerCase();
                    const canClaim = isWinner && !round.claimed;

                    return (
                      <div
                        key={round.index}
                        style={{
                          padding: '8px',
                          border: '1px solid var(--border-color)',
                          borderRadius: '6px',
                          backgroundColor: 'var(--bg-secondary)',
                          fontSize: '0.8rem'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                          <span style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>
                            Round #{round.index + 1}
                          </span>
                          <span style={{ color: 'var(--text-secondary)' }}>
                            {new Date(round.drawTime * 1000).toLocaleDateString()}
                          </span>
                        </div>

                        <div style={{ marginBottom: '4px' }}>
                          <span style={{ color: 'var(--text-secondary)' }}>Winner: </span>
                          <span style={{ fontFamily: 'monospace' }}>
                            {round.winner.slice(0, 4)}...{round.winner.slice(-4)}
                          </span>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ color: 'var(--text-secondary)' }}>
                            Prize: {round.prize} ETH
                          </span>

                          {isWinner ? (
                            round.claimed ? (
                              <span style={{ color: 'var(--success-color)', fontSize: '0.75rem' }}>✅ Claimed</span>
                            ) : (
                              <button
                                onClick={() => onClaimPastPrize(round.index)}
                                disabled={loading}
                                className="btn btn-success"
                                style={{ fontSize: '0.7rem', padding: '2px 6px' }}
                              >
                                {loading ? '💰 ...' : '💰 Claim'}
                              </button>
                            )
                          ) : (
                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
                              Better luck!
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="card" style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}>
      <h2 style={{ fontSize: '1.25rem', marginBottom: '12px' }}>Connect Your Wallet</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '16px', fontSize: '0.875rem' }}>
        Connect your MetaMask wallet to participate in the confidential lottery
      </p>

      {/* App Description */}
      <div style={{
        background: 'var(--card-background)',
        border: '1px solid var(--border-color)',
        borderRadius: '8px',
        padding: '12px',
        marginBottom: '20px',
        textAlign: 'left'
      }}>
        <h3 style={{ fontSize: '0.9rem', marginBottom: '6px', color: 'var(--text-primary)' }}>
          🎯 What is Confidential Lottery?
        </h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
          A privacy-focused lottery built with Zama FHEVM technology where:
        </p>
        <ul style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', paddingLeft: '16px', marginBottom: '0' }}>
          <li>🎫 Buy tickets with encrypted numbers (0.0001 ETH)</li>
          <li>🎲 Admin draws winner randomly on blockchain</li>
          <li>💰 Only winner can claim the prize pool</li>
        </ul>
      </div>

      <button
        onClick={onConnect}
        disabled={txStatus === 'Connecting...'}
        className="btn btn-primary"
      >
        {txStatus === 'Connecting...' ? '🔄 Connecting...' : '🔗 Connect MetaMask'}
      </button>
    </div>
  );
};

export default WalletConnect;
