import React, { useRef, useEffect, useState } from 'react';
import './CommandPrompt.css';

const CommandPrompt = React.forwardRef(({ onCommand }, ref) => {
  const [input, setInput] = useState('');
  const inputRef = useRef(null);

  // Connect our internal ref to the forwarded ref
  useEffect(() => {
    if (ref) {
      ref.current = {
        focus: () => inputRef.current?.focus()
      };
    }
  }, [ref]);

  // Focus input when component mounts
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onCommand(input.trim().toLowerCase());
      setInput('');
      inputRef.current?.focus();
    }
  };

  return (
    <form className="command-prompt" onSubmit={handleSubmit}>
      <span className="prompt-symbol">&gt;</span>
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="command-input"
        autoFocus
      />
    </form>
  );
});

// Add display name for debugging
CommandPrompt.displayName = 'CommandPrompt';

export default CommandPrompt; 