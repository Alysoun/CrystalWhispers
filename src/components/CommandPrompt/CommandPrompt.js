import React, { useRef, useEffect, useState } from 'react';
import './CommandPrompt.css';

const CommandPrompt = React.forwardRef(({ onCommand }, ref) => {
  const [input, setInput] = useState('');
  const inputRef = useRef(null);

  // Connect our internal ref to the forwarded ref
  useEffect(() => {
    if (ref) {
      ref.current = {
        focus: () => inputRef.current?.focus(),
        querySelector: (selector) => inputRef.current
      };
    }
  }, [ref]);

  // Keep focus on input
  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;

    const handleBlur = () => {
      // Small timeout to allow for other interactions
      setTimeout(() => {
        if (document.activeElement !== input) {
          input.focus();
        }
      }, 10);
    };

    input.addEventListener('blur', handleBlur);
    return () => input.removeEventListener('blur', handleBlur);
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