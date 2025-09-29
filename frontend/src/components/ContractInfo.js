const ContractInfo = ({ contractAddress }) => {
  return (
    <div className="panel panel-muted">
      <h3 className="panel-title">Contract details</h3>
      <div className="panel-divider" />

      <div className="info-block">
        <div className="info-block-title">What is FHEVM?</div>
        <p className="info-block-text">
          The Fully Homomorphic Encryption Virtual Machine allows computations on encrypted data.
          Your ticket number remains private on-chain while the draw stays verifiable.
        </p>
      </div>

      <div className="info-grid">
        <div className="info-row">
          <span>Address</span>
          <a
            href={`https://sepolia.etherscan.io/address/${contractAddress}`}
            target="_blank"
            rel="noopener noreferrer"
            className="external-link mono"
          >
            {`${contractAddress.slice(0, 10)}...${contractAddress.slice(-8)}`}
          </a>
        </div>
        <div className="info-row">
          <span>Network</span>
          <span className="badge badge-neutral">Sepolia testnet</span>
        </div>
        <div className="info-row">
          <span>Technology</span>
          <span className="badge">FHEVM</span>
        </div>
        <div className="info-row">
          <span>Privacy level</span>
          <span className="badge badge-positive">Mathematical assurance</span>
        </div>
      </div>
    </div>
  );
};

export default ContractInfo;
