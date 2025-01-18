import React, { useState, useEffect } from 'react';
import './TrapUI.css';

function TrapUI({ trap, onDisarm, onClose }) {
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [input, setInput] = useState('');
  const [puzzleSequence] = useState(['↑', '↓', '→', '←']);
  const [solution, setSolution] = useState(Array(4).fill(null));
  const [draggedSymbol, setDraggedSymbol] = useState(null);
  const [relativePos, setRelativePos] = useState({ x: 0, y: 0 });
  const [timingProgress, setTimingProgress] = useState(0);
  const [strengthProgress, setStrengthProgress] = useState(0);
  const [strengthTimer, setStrengthTimer] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(5); // 5 seconds to complete
  const [isMinigameActive, setIsMinigameActive] = useState(false);
  const [shouldDisarm, setShouldDisarm] = useState(null);

  // Track mouse position globally when dragging
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (draggedSymbol) {
        const trapUI = document.querySelector('.trap-ui');
        const trapRect = trapUI.getBoundingClientRect();
        setRelativePos({
          x: e.clientX - trapRect.left,
          y: e.clientY - trapRect.top
        });
      }
    };

    const handleMouseUp = () => {
      setDraggedSymbol(null);
    };

    if (draggedSymbol) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggedSymbol]);

  // Add cleanup for timers
  useEffect(() => {
    return () => {
      if (strengthTimer) clearInterval(strengthTimer);
    };
  }, [strengthTimer]);

  // Cleanup all timers when component unmounts or method changes
  useEffect(() => {
    return () => {
      if (strengthTimer) {
        clearInterval(strengthTimer);
        setStrengthTimer(null);
      }
    };
  }, [strengthTimer]);

  // Handle disarm effect
  useEffect(() => {
    if (shouldDisarm !== null && selectedMethod) {
      onDisarm(selectedMethod.name, shouldDisarm);
      setShouldDisarm(null);
    }
  }, [shouldDisarm, selectedMethod, onDisarm]);

  // Guard against undefined trap
  if (!trap || !trap.type) {
    return null;
  }

  const handleMethodSelect = (method) => {
    setSelectedMethod(method);
    if (method.type === 'timing' || method.type === 'strength') {
      setIsMinigameActive(true);
      if (method.type === 'timing') {
        startTimingMinigame();
      } else if (method.type === 'strength') {
        startStrengthMinigame();
      }
    }
  };

  const startTimingMinigame = () => {
    setTimingProgress(0);
    const interval = setInterval(() => {
      setTimingProgress(prev => (prev + 1) % 100);
    }, 20);
    return () => clearInterval(interval);
  };

  const startStrengthMinigame = () => {
    if (strengthTimer) {
      clearInterval(strengthTimer);
    }

    setStrengthProgress(0);
    setTimeRemaining(5);
    setIsMinigameActive(true);

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          setShouldDisarm('failure');
          return 0;
        }
        return prev - 0.1;
      });

      setStrengthProgress(prev => Math.max(0, prev - 1.5));
    }, 100);

    setStrengthTimer(timer);
  };

  const handleTimingClick = () => {
    const success = timingProgress >= 45 && timingProgress <= 55;
    setShouldDisarm(success ? 'success' : 'failure');
  };

  const handleStrengthClick = () => {
    if (!selectedMethod) return;

    setStrengthProgress(prev => {
      const newProgress = Math.min(prev + 7, 100);
      if (newProgress >= 90) {
        if (strengthTimer) {
          clearInterval(strengthTimer);
          setStrengthTimer(null);
        }
        setShouldDisarm('success');
      }
      return newProgress;
    });
  };

  const handleMouseDown = (symbol, e) => {
    console.log('Mouse down on symbol:', symbol);
    setDraggedSymbol(symbol);
    setRelativePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = (index) => {
    console.log('Mouse up on slot:', index, 'with symbol:', draggedSymbol);
    if (draggedSymbol !== null) {
      const newSolution = [...solution];
      newSolution[index] = draggedSymbol;
      setSolution(newSolution);
      setDraggedSymbol(null);
    }
  };

  const handleMouseEnter = (e) => {
    if (draggedSymbol) {
      e.currentTarget.style.background = '#3a3a3a';
    }
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.style.background = '#1a1a1a';
  };

  const isSymbolUsed = (symbol) => {
    return solution.includes(symbol);
  };

  // Also add cleanup when method changes
  useEffect(() => {
    if (strengthTimer && !selectedMethod) {
      clearInterval(strengthTimer);
      setStrengthTimer(null);
    }
  }, [selectedMethod, strengthTimer]);

  const handleSubmit = () => {
    if (selectedMethod && selectedMethod.requiresInput) {
      setShouldDisarm(solution.join(''));
    }
  };

  return (
    <div className="trap-ui">
      <div className="trap-header">
        <h3>Trap Encountered!</h3>
        <button className="close-button" onClick={onClose}>×</button>
      </div>
      
      <div className="trap-description">
        {trap.type.description}
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
          {selectedMethod.requiresInput ? (
            <div className="puzzle-interface">
              <div className="puzzle-hint">
                {selectedMethod.hint}
              </div>
              <div className="available-symbols">
                {puzzleSequence.map((symbol, i) => (
                  <div
                    key={i}
                    className={`symbol ${isSymbolUsed(symbol) ? 'used' : ''} ${draggedSymbol === symbol ? 'dragging' : ''}`}
                    onMouseDown={(e) => !isSymbolUsed(symbol) && handleMouseDown(symbol, e)}
                  >
                    {symbol}
                  </div>
                ))}
              </div>
              <div className="solution-slots">
                {[0, 1, 2, 3].map((index) => (
                  <div
                    key={index}
                    className={`solution-slot ${draggedSymbol ? 'can-drop' : ''}`}
                    onMouseUp={() => handleMouseUp(index)}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    {solution[index] || '_'}
                  </div>
                ))}
              </div>
              <div style={{ color: '#666', fontSize: '12px', marginTop: '10px' }}>
                Current solution: [{solution.map(s => s || '_').join(', ')}]
              </div>
              {draggedSymbol && (
                <div style={{ color: '#ff9966', fontSize: '12px' }}>
                  Currently dragging: {draggedSymbol}
                </div>
              )}
              <button 
                onClick={handleSubmit} 
                className="submit-button"
                disabled={solution.includes(null)}
              >
                Attempt Disarm
              </button>
            </div>
          ) : selectedMethod.type === 'timing' ? (
            <div className="timing-minigame">
              <div className="timing-bar">
                <div className="timing-marker" style={{ left: `${timingProgress}%` }} />
                <div className="success-zone" />
              </div>
              <button 
                className="timing-button"
                onClick={handleTimingClick}
              >
                Click!
              </button>
            </div>
          ) : selectedMethod.type === 'strength' ? (
            <div className="strength-minigame">
              <div className="strength-bar">
                <div 
                  className="strength-progress" 
                  style={{ width: `${strengthProgress}%` }} 
                />
              </div>
              <div className="time-remaining">
                Time: {Math.max(0, timeRemaining).toFixed(1)}s
              </div>
              <button 
                className="strength-button"
                onClick={handleStrengthClick}
              >
                Push!
              </button>
              <div className="minigame-hint">
                Rapidly click to build strength before time runs out!<br/>
                Watch out - your strength decays quickly!
              </div>
            </div>
          ) : (
            <button 
              onClick={() => setShouldDisarm(null)} 
              className="submit-button"
            >
              Attempt Disarm
            </button>
          )}
        </div>
      )}

      {draggedSymbol && (
        <div
          className="floating-symbol"
          style={{
            position: 'absolute',
            left: relativePos.x,
            top: relativePos.y,
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            zIndex: 9999
          }}
        >
          {draggedSymbol}
        </div>
      )}
    </div>
  );
}

export default TrapUI; 