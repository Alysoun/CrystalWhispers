import React, { useState, useEffect } from 'react';
import { PuzzleTypes } from '../../game/puzzles/PuzzleTypes';
import './PuzzleUI.css';

function PuzzleUI({ puzzle, onClose, onComplete }) {
  const [input, setInput] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [showSequence, setShowSequence] = useState(true);
  const [currentPuzzle] = useState(() => {
    if (puzzle.type === 'MEMORY_MATCH') {
      return PuzzleTypes.MEMORY_MATCH.generatePuzzle(1);
    }
    return puzzle;
  });

  const handleSubmit = () => {
    const result = currentPuzzle.checkSolution(input);
    if (result.success) {
      onComplete(currentPuzzle.reward);
    } else {
      setInput('');
      setShowHint(true);
      currentPuzzle.attempts++;
      if (currentPuzzle.attempts >= currentPuzzle.maxAttempts) {
        onClose();
      }
    }
  };

  useEffect(() => {
    if (showSequence) {
      const timer = setTimeout(() => {
        setShowSequence(false);
      }, 5000); // Hide after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [showSequence]);

  return (
    <div className="puzzle-overlay">
      <div className="puzzle-modal">
        <div className="puzzle-header">
          <h2>{currentPuzzle.name || 'Memory Match'}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="puzzle-content">
          <p>{currentPuzzle.description || 'Match the symbols in the correct order...'}</p>
          
          {currentPuzzle.type === 'MEMORY_MATCH' && showSequence && (
            <div className="memory-match">
              <div className="symbol-display">
                {currentPuzzle.sequence?.map((symbol, i) => (
                  <span key={i} className="memory-symbol">{symbol}</span>
                ))}
              </div>
            </div>
          )}
          
          {currentPuzzle.type === 'ECHO_SEQUENCE' && (
            <div className="echo-sequence">
              <div className="color-buttons">
                {['red', 'blue', 'green', 'yellow'].map(color => (
                  <button 
                    key={color}
                    className={`color-button ${color}`}
                    onClick={() => setInput(prev => prev + (prev ? ',' : '') + color)}
                  />
                ))}
              </div>
            </div>
          )}

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter your answer..."
            className="puzzle-input"
            autoFocus
          />

          <div className="puzzle-controls">
            <button onClick={handleSubmit} className="solve-button">
              Solve
            </button>
            <button 
              onClick={() => setShowHint(true)} 
              className="hint-button"
            >
              Get Hint
            </button>
          </div>

          {showHint && (
            <div className="hint-text">
              {`Try to remember the order... (${currentPuzzle.maxAttempts - currentPuzzle.attempts} attempts remaining)`}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PuzzleUI; 