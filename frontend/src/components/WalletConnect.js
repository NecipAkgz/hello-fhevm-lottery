const WalletConnect = ({ isConnected, account, onConnect, txStatus }) => {
  if (isConnected) {
    return (
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
