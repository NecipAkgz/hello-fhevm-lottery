import { useState } from 'react';

export const useToast = () => {
  const [messages, setMessages] = useState([]);

  const showToast = (message, type = 'info') => {
    const id = Date.now();
    setMessages(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setMessages(prev => prev.filter(msg => msg.id !== id));
    }, 5000);
  };

  return { messages, showToast };
};
