const ContractInfo = ({ contractAddress }) => {
  return (
    <div className="card-secondary">
      <h3 style={{ marginBottom: '12px', fontSize: '1.125rem', color: 'var(--text-secondary)' }}>📋 Contract Information</h3>
      <hr style={{ borderColor: 'var(--border-light)', marginBottom: '16px' }} />

      {/* Educational Content */}
      <div style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)', padding: '12px', borderRadius: '8px', marginBottom: '16px', border: '1px solid var(--info-color)' }}>
        <h4 style={{ margin: '0 0 8px 0', fontSize: '0.9rem', color: 'var(--info-color)' }}>🔐 What is FHEVM?</h4>
        <p style={{ margin: '0', fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
          <strong>Fully Homomorphic Encryption Virtual Machine</strong> enables computations on encrypted data without decryption.
          Your lottery ticket is mathematically encrypted - only you know your number!
        </p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <span style={{ color: 'var(--text-secondary)' }}>Contract Address:</span>
        <a
          href={`https://sepolia.etherscan.io/address/${contractAddress}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily: 'monospace',
            color: 'var(--primary-color)',
            fontSize: '0.875rem',
            textDecoration: 'none',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
          onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
        >
          {contractAddress.slice(0, 10)}...{contractAddress.slice(-8)}
        </a>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <span style={{ color: 'var(--text-secondary)' }}>Network:</span>
        <span className="badge" style={{ background: 'var(--secondary-color)', padding: '2px 8px', fontSize: '0.75rem' }}>
          Sepolia Testnet
        </span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <span style={{ color: 'var(--text-secondary)' }}>Technology:</span>
        <span className="badge" style={{ background: 'var(--warning-color)', padding: '2px 8px', fontSize: '0.75rem' }}>
          🔒 FHEVM
        </span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ color: 'var(--text-secondary)' }}>Privacy:</span>
        <span className="badge" style={{ background: 'var(--success-color)', padding: '2px 8px', fontSize: '0.75rem' }}>
          🛡️ Mathematical
        </span>
      </div>
    </div>
  );
};

export default ContractInfo;
