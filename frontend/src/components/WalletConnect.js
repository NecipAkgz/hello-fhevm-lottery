import React from 'react';

const WalletConnect = ({
  isConnected,
  account,
  onConnect,
  txStatus,
  pastRounds,
  onClaimPastPrize,
  loading
}) => {
  const [showPastRounds, setShowPastRounds] = React.useState(false);

  const formatAddress = (value) => `${value.slice(0, 6)}...${value.slice(-4)}`;

  if (isConnected) {
    return (
      <div className="panel panel-primary wallet-panel">
        <div className="wallet-header">
          <div className="wallet-header-copy">
            <h2 className="panel-title">Connected account</h2>
            <p className="panel-description">
              Your wallet is linked and ready to buy tickets or claim rewards.
            </p>
          </div>
          <div className="wallet-address-block" title={account}>
            <span className="wallet-address-label">Address</span>
            <span className="wallet-address-value mono">{formatAddress(account)}</span>
            <span className="wallet-status-tag">Connected</span>
          </div>
        </div>

        {txStatus && <div className="wallet-note">{txStatus}</div>}

        {pastRounds && pastRounds.length > 0 && (
          <div className="wallet-past">
            <button
              type="button"
              className="wallet-past-toggle"
              onClick={() => setShowPastRounds((prev) => !prev)}
            >
              <span>Past rounds ({pastRounds.length})</span>
              <span>{showPastRounds ? '−' : '+'}</span>
            </button>

            {showPastRounds && (
              <div className="wallet-past-list">
                {pastRounds.map((round) => {
                  const isWinner = round.winner.toLowerCase() === account.toLowerCase();
                  const claimed = Boolean(round.claimed);
                  const drawDate = new Date(round.drawTime * 1000).toLocaleDateString();

                  return (
                    <div
                      key={round.index}
                      className={`wallet-round-card${isWinner ? ' is-winner' : ''}`}
                    >
                      <div className="wallet-round-meta">
                        <span>Round #{round.index + 1}</span>
                        <span className="wallet-round-date">{drawDate}</span>
                      </div>
                      <div className="wallet-round-prize">
                        <span>Prize</span>
                        <span className="wallet-round-amount mono">{round.prize} ETH</span>
                      </div>
                      <div className="wallet-round-footer">
                        <span className="mono">{formatAddress(round.winner)}</span>
                        {isWinner ? (
                          claimed ? (
                            <span className="wallet-round-status">Claimed</span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => onClaimPastPrize(round.index)}
                              disabled={loading}
                              className={`btn ${loading ? 'btn-loading' : 'btn-success'} btn-compact`}
                            >
                              Claim prize
                            </button>
                          )
                        ) : (
                          <span className="wallet-round-tip">Better luck next time</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  const isConnecting = txStatus === 'Connecting...';

  return (
    <div className="panel panel-primary">
      <h2 className="panel-title">Connect your wallet</h2>
      <p className="panel-description">
        Link MetaMask to join the private draw, purchase an encrypted ticket, and follow each round securely.
      </p>

      <div className="panel-divider" />

      <div className="callout">
        <ul>
          <li>Ticket numbers stay encrypted on-chain.</li>
          <li>Winners are selected with fully homomorphic encryption.</li>
          <li>Only the winner can unlock the prize.</li>
        </ul>
      </div>

      <button
        type="button"
        onClick={onConnect}
        disabled={isConnecting}
        className={`btn ${isConnecting ? 'btn-loading' : 'btn-primary'}`}
      >
        {isConnecting ? 'Connecting...' : 'Connect MetaMask'}
      </button>
    </div>
  );
};

export default WalletConnect;
