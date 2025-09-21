const StatusMessage = ({ children, type = 'info' }) => {
  return (
    <div className={`status-message status-${type}`}>
      {children}
    </div>
  );
};

export default StatusMessage;
