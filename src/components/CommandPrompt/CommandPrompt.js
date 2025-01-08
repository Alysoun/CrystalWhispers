import React, { useState } from 'react';
import './CommandPrompt.css';

const CommandPrompt = ({ onCommand }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onCommand(input.trim().toLowerCase());
      setInput('');
    }
  };

  return (
    <form className="command-prompt" onSubmit={handleSubmit}>
      <span className="prompt-symbol">&gt;</span>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="command-input"
        autoFocus
      />
    </form>
  );
};

export default CommandPrompt; 