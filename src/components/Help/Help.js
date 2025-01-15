import React from 'react';
import './Help.css';
import { soundManager } from '../../utils/SoundManager';

function Help({ isOpen, onClose }) {
  if (!isOpen) return null;

  const handleSoundToggle = () => {
    soundManager.initializeAudio();
    soundManager.toggleMute();
  };

  const handleClose = () => {
    onClose();
    // Add a small delay to ensure the modal is closed before refocusing
    setTimeout(() => {
      // Find and focus the command input
      const commandInput = document.querySelector('.command-input');
      commandInput?.focus();
    }, 0);
  };

  const HELP_TEXT = {
    basic: [
      // ... existing help text ...
    ],
    traps: [
      {
        command: 'disarm',
        description: 'Attempt to disarm a trap in the current room',
        details: 'Opens the trap disarming interface'
      }
    ],
    trapTypes: [
      {
        name: 'Timing Trap',
        description: 'Click the button when the moving bar aligns with the target zone',
        difficulty: 'Easy to Medium'
      },
      {
        name: 'Pattern Trap',
        description: 'Click buttons in the correct sequence to disarm',
        difficulty: 'Medium'
      },
      {
        name: 'Sequence Trap',
        description: 'Enter the correct sequence of characters',
        difficulty: 'Hard'
      }
    ],
    trapTips: [
      "Traps can be detected before entering a room",
      "Failed disarm attempts may trigger the trap",
      "Some upgrades can help with trap avoidance and disarming",
      "The Safe Passage upgrade increases your chance to avoid traps"
    ]
  };

  return (
    <div className="help-overlay">
      <div className="help-modal">
        <div className="help-header">
          <h2>Command Reference</h2>
          <button 
            className="close-button" 
            onClick={handleClose}
          >×</button>
        </div>
        
        <div className="help-content">
          <div className="command-section">
            <h3>Look & Examine</h3>
            <div className="command-grid">
              <div className="command">
                <span className="command-name">look (l)</span>
                <span className="command-desc">Look around the room</span>
              </div>
              <div className="command">
                <span className="command-name">examine (x) [item]</span>
                <span className="command-desc">Examine a specific item</span>
              </div>
            </div>
          </div>

          <div className="command-section">
            <h3>Movement</h3>
            <div className="command-grid">
              <div className="command">
                <span className="command-name">north (n)</span>
                <span className="command-desc">Go north</span>
              </div>
              <div className="command">
                <span className="command-name">south (s)</span>
                <span className="command-desc">Go south</span>
              </div>
              <div className="command">
                <span className="command-name">east (e)</span>
                <span className="command-desc">Go east</span>
              </div>
              <div className="command">
                <span className="command-name">west (w)</span>
                <span className="command-desc">Go west</span>
              </div>
            </div>
          </div>

          <div className="command-section">
            <h3>Inventory</h3>
            <div className="command-grid">
              <div className="command">
                <span className="command-name">take (t) [item]</span>
                <span className="command-desc">Pick up an item</span>
              </div>
              <div className="command">
                <span className="command-name">use [item] with [target]</span>
                <span className="command-desc">Use an item with another item</span>
              </div>
              <div className="command">
                <span className="command-name">inventory (i)</span>
                <span className="command-desc">Check your inventory</span>
              </div>
            </div>
          </div>

          <div className="command-section">
            <h3>Game</h3>
            <div className="command-grid">
              <div className="command">
                <span className="command-name">save</span>
                <span className="command-desc">Save your game</span>
              </div>
              <div className="command">
                <span className="command-name">load</span>
                <span className="command-desc">Load a saved game</span>
              </div>
              <div className="command">
                <span className="command-name">help (h)</span>
                <span className="command-desc">Show this help screen</span>
              </div>
            </div>
          </div>

          <div className="command-section">
            <h3>Game Features</h3>
            <div className="command-grid">
              <div className="command">
                <span className="command-name">achievements (a)</span>
                <span className="command-desc">View your achievements</span>
              </div>
            </div>
          </div>

          <div className="command-section">
            <h3>Traps</h3>
            <div className="command-grid">
              {HELP_TEXT.traps.map((cmd, index) => (
                <div key={index} className="command">
                  <span className="command-name">{cmd.command}</span>
                  <span className="command-desc">{cmd.description}</span>
                </div>
              ))}
            </div>

            <h4>Trap Types</h4>
            <div className="trap-types-grid">
              {HELP_TEXT.trapTypes.map((trap, index) => (
                <div key={index} className="trap-type">
                  <span className="trap-name">{trap.name}</span>
                  <span className="trap-desc">{trap.description}</span>
                  <span className="trap-difficulty">Difficulty: {trap.difficulty}</span>
                </div>
              ))}
            </div>

            <h4>Tips</h4>
            <ul className="trap-tips">
              {HELP_TEXT.trapTips.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="sound-controls">
          <button 
            onClick={handleSoundToggle}
            className="sound-toggle"
          >
            {soundManager.muted ? '🔇 Sound Off' : '🔊 Sound On'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Help; 