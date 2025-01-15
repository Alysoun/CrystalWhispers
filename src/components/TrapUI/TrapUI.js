import React, { useState } from 'react';
import './TrapUI.css';

function TrapUI({ trap, onDisarm, onClose }) {
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [input, setInput] = useState('');

  // Guard against undefined trap
  if (!trap || !trap.type) {
    return null;
  }

  const handleMethodSelect = (method) => {
    setSelectedMethod(method);
  };

  const handleSubmit = () => {
    if (selectedMethod) {
      onDisarm(selectedMethod.name, input);
      setSelectedMethod(null);
      setInput('');
    }
  };

  return (
    <div className="trap-ui">
      <div className="trap-header">
        <h3>Trap Encountered!</h3>
        <button className="close-button" onClick={onClose}>×</button>
      </div>
      
      <div className="trap-description">
        {trap.type.description || "A dangerous trap blocks your path."}
      </div>

      <div className="disarm-methods">
        <h4>Choose your approach:</h4>
        {trap.type.methods?.map((method) => (
          <button
            key={method.name}
            onClick={() => handleMethodSelect(method)}
            className={`method-button ${selectedMethod === method ? 'selected' : ''}`}
          >
            {method.name}
          </button>
        ))}
      </div>

      {selectedMethod && (
        <div className="method-details">
          <p>{selectedMethod.description}</p>
          {selectedMethod.requiresInput && (
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={selectedMethod.inputHint || "Enter your solution..."}
            />
          )}
          <button onClick={handleSubmit} className="submit-button">
            Attempt Disarm
          </button>
        </div>
      )}
    </div>
  );
}

export default TrapUI; 