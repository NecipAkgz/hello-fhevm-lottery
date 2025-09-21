const ContractInfo = ({ contractAddress }) => {
  return (
    <div className="card-secondary">
      <h3 style={{ marginBottom: '12px', fontSize: '1.125rem', color: 'var(--text-secondary)' }}>📋 Contract Information</h3>
      <hr style={{ borderColor: 'var(--border-light)', marginBottom: '16px' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <span style={{ color: 'var(--text-secondary)' }}>Contract Address:</span>
        <span style={{ fontFamily: 'monospace', color: 'var(--primary-color)', fontSize: '0.875rem' }}>
          {contractAddress.slice(0, 10)}...{contractAddress.slice(-8)}
        </span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <span style={{ color: 'var(--text-secondary)' }}>Network:</span>
        <span className="badge" style={{ background: 'var(--secondary-color)', padding: '2px 8px', fontSize: '0.75rem' }}>
          Sepolia Testnet
        </span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ color: 'var(--text-secondary)' }}>Technology:</span>
        <span className="badge" style={{ background: 'var(--warning-color)', padding: '2px 8px', fontSize: '0.75rem' }}>
          FHEVM
        </span>
      </div>
    </div>
  );
};

export default ContractInfo;
