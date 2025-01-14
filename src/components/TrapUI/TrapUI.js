import React, { useState } from 'react';
import './TrapUI.css';

function TrapUI({ trap, onAttemptDisarm, onClose }) {
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [input, setInput] = useState('');

  const handleDisarmAttempt = () => {
    onAttemptDisarm(selectedMethod, input);
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      const commandInput = document.querySelector('.command-input');
      commandInput?.focus();
    }, 0);
  };

  const renderDisarmInterface = () => {
    switch (trap.trapType.disarmMethod) {
      case 'TIMING':
        return (
          <div className="timing-interface">
            <div className="timing-bar-container">
              <div className="timing-bar" />
              <button 
                className="timing-button"
                onClick={() => handleDisarmAttempt()}
              >
                Stop!
              </button>
            </div>
            <p className="hint-text">Click the button when the bar aligns with the target zone</p>
          </div>
        );

      case 'PATTERN':
        return (
          <div className="pattern-interface">
            <div className="pattern-display">
              {Array(4).fill(0).map((_, i) => (
                <button 
                  key={i}
                  className={`pattern-button ${input.includes(i) ? 'active' : ''}`}
                  onClick={() => setInput(prev => prev + i)}
                />
              ))}
            </div>
            <button 
              className="submit-button"
              onClick={() => handleDisarmAttempt()}
            >
              Submit Pattern
            </button>
          </div>
        );

      case 'SEQUENCE':
        return (
          <div className="sequence-interface">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter the sequence..."
              className="sequence-input"
            />
            <button 
              className="submit-button"
              onClick={() => handleDisarmAttempt()}
            >
              Submit Sequence
            </button>
          </div>
        );

      default:
        return <p>Unknown trap type</p>;
    }
  };

  return (
    <div className="trap-overlay">
      <div className="trap-modal">
        <div className="trap-header">
          <h2>{trap.trapType.name}</h2>
          <button className="close-button" onClick={handleClose}>×</button>
        </div>
        
        <div className="trap-description">
          <p>{trap.trapType.description}</p>
          <div className="difficulty-indicator">
            Difficulty: {'⚡'.repeat(trap.trapType.difficulty)}
          </div>
        </div>

        <div className="disarm-interface">
          {renderDisarmInterface()}
        </div>

        <div className="trap-footer">
          <div className="reward-preview">
            Potential Reward: {trap.trapType.fragments} fragments
          </div>
        </div>
      </div>
    </div>
  );
}

export default TrapUI; 