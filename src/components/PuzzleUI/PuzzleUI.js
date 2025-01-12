import React, { useState } from 'react';
import './PuzzleUI.css';

function PuzzleUI({ isOpen, puzzle, onSolve, onClose, inventory }) {
  const [answer, setAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (puzzle.checkSolution(answer)) {
      onSolve(puzzle.getReward());
    } else {
      setShowHint(true);
    }
  };

  const handleUsePuzzleItem = (item) => {
    if (item.id === 'puzzle_master') {
      const solution = item.effect.effect(puzzle);
      if (solution) {
        setAnswer(solution);
        addToOutput("The lens reveals the puzzle's solution!");
      }
    } else if (item.id === 'stabilizing_crystal') {
      const success = item.effect.effect(puzzle);
      if (success) {
        addToOutput("The crystal pulses, stabilizing the puzzle's energy!");
      }
    }
  };

  const puzzleItems = inventory.filter(item => 
    (item.id === 'puzzle_master' || item.id === 'stabilizing_crystal') && 
    item.effect.uses > 0
  );

  if (!isOpen || !puzzle) return null;

  return (
    <div className="puzzle-modal">
      <div className="puzzle-content">
        <h2>{puzzle.name}</h2>
        <p>{puzzle.description}</p>
        
        {puzzle.imageUrl && (
          <img 
            src={puzzle.imageUrl} 
            alt={puzzle.name} 
            className="puzzle-image"
          />
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Enter your answer..."
          />
          <button type="submit">Solve</button>
          <button type="button" onClick={() => setShowHint(true)}>
            Get Hint
          </button>
        </form>

        {showHint && (
          <div className="hint">
            Hint: {puzzle.getHint()}
          </div>
        )}
      </div>

      {puzzleItems.length > 0 && (
        <div className="puzzle-items">
          <h3>Available Items:</h3>
          {puzzleItems.map(item => (
            <button 
              key={item.id}
              onClick={() => handleUsePuzzleItem(item)}
              className="puzzle-item-button"
            >
              Use {item.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default PuzzleUI; 