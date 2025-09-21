const Header = () => {
  return (
    <header className="header">
      <div className="header-content">
        <h1 className="title">
          🔒 Confidential Lottery
          <div style={{ display: 'inline-flex', gap: '6px', marginLeft: '12px' }}>
            <span className="badge" style={{ background: 'var(--success-color)', fontSize: '0.6rem', padding: '2px 6px' }}>FHEVM</span>
            <span className="badge" style={{ background: 'var(--warning-color)', fontSize: '0.6rem', padding: '2px 6px' }}>Private</span>
          </div>
        </h1>
        <p className="subtitle">
          🤫 Your ticket number is encrypted with mathematical security
        </p>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '4px 0 0 0', fontStyle: 'italic' }}>
          "Zero-Knowledge Lottery: Only winners can prove they won!"
        </p>
      </div>
    </header>
  );
};

export default Header;
