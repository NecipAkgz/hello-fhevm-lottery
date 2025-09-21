const ToastContainer = ({ messages }) => {
  return (
    <div className="toast-container">
      {messages.map(msg => (
        <div key={msg.id} className={`toast toast-${msg.type}`}>
          {msg.message}
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
