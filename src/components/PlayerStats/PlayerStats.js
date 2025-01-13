import React, { useState, useEffect } from 'react';
import './PlayerStats.css';

function PlayerStats({ player, statsRevealed, memoryFragments = 0, onPurchase, unlockedStats = {} }) {
  // Add default value for player
  if (!player) return null;  // Early return if no player

  // Track previous fragments value for change display
  const [prevFragments, setPrevFragments] = useState(memoryFragments);
  const [showChange, setShowChange] = useState(false);

  useEffect(() => {
    if (memoryFragments !== prevFragments) {
      setShowChange(true);
      const timer = setTimeout(() => {
        setShowChange(false);
        setPrevFragments(memoryFragments);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [memoryFragments, prevFragments]);

  const renderFragmentChange = () => {
    if (!showChange) return null;
    const change = memoryFragments - prevFragments;
    return (
      <span className={`fragment-change ${change > 0 ? 'positive' : 'negative'}`}>
        {change > 0 ? '+' : ''}{change}
      </span>
    );
  };

  // Calculate exp needed only if player exists
  const expNeeded = player?.level ? player.level * 100 : 100;
  const expPercentage = player?.experience ? (player.experience / expNeeded) * 100 : 0;
  
  // Cost for each stat reveal - adjusted for permanent progression
  const statCosts = {
    healthNumbers: 25,    // First milestone - basic info
    level: 75,           // Second milestone - see progress
    experience: 150,     // Understanding growth
    attack: 500,        // Combat insight
    defense: 1000       // Deep understanding
  };

  // Format stat name for display
  const formatStatName = (stat) => {
    switch(stat) {
      case 'healthNumbers':
        return 'health numbers';
      default:
        return stat;
    }
  };

  // Render health bar with defensive checks
  const renderHealthBar = () => (
    <div className="stat-row">
      <span className="stat-label">Health:</span>
      <div className="stat-bar-container">
        <div 
          className="stat-bar health-bar" 
          style={{ width: `${((player?.health || 0) / (player?.maxHealth || 100)) * 100}%` }}
        ></div>
        {unlockedStats.healthNumbers && (
          <span className="stat-text" style={{ zIndex: 1 }}>
            {`${player?.health || 0}/${player?.maxHealth || 100}`}
          </span>
        )}
      </div>
      {!unlockedStats.healthNumbers && (
        <div className="unlock-numbers" onClick={() => onPurchase('healthNumbers', statCosts.healthNumbers)}>
          <span className="unlock-cost">{statCosts.healthNumbers} fragments to reveal numbers</span>
        </div>
      )}
    </div>
  );

  return (
    <div className="player-stats">
      <h2>Player Stats</h2>
      
      <div className="stat-row fragments-counter">
        <span className="stat-label">Fragments:</span>
        <span className="stat-value fragment-value">
          {Number(memoryFragments) || 0}
          {renderFragmentChange()}
        </span>
      </div>

      {renderHealthBar()}

      {/* Level - unlockable */}
      {unlockedStats.level ? (
        <div className="stat-row">
          <span className="stat-label">Level:</span>
          <span className="stat-value">
            {player.level}
            {unlockedStats.experience && (
              <span className="exp-info"> ({player.experience}/{player.level * 100} exp)</span>
            )}
          </span>
        </div>
      ) : (
        <div className="stat-row locked" onClick={() => onPurchase('level', 15)}>
          <span className="stat-label">Level:</span>
          <span className="unlock-cost">15 fragments to unlock</span>
        </div>
      )}

      {/* Experience - only show if level is unlocked but experience isn't */}
      {unlockedStats.level && !unlockedStats.experience && (
        <div className="stat-row locked" onClick={() => onPurchase('experience', 15)}>
          <span className="stat-label">Experience:</span>
          <span className="unlock-cost">15 fragments to unlock</span>
        </div>
      )}

      {/* Attack - purchasable */}
      {unlockedStats.attack ? (
        <div className="stat-row">
          <span className="stat-label">Attack:</span>
          <span className="stat-value">{player.attack}</span>
        </div>
      ) : (
        <div className="stat-row locked" onClick={() => onPurchase('attack', statCosts.attack)}>
          <span className="stat-label">Attack:</span>
          <span className="unlock-cost">{statCosts.attack} fragments to unlock</span>
        </div>
      )}

      {/* Defense - purchasable */}
      {unlockedStats.defense ? (
        <div className="stat-row">
          <span className="stat-label">Defense:</span>
          <span className="stat-value">{player.defense}</span>
        </div>
      ) : (
        <div className="stat-row locked" onClick={() => onPurchase('defense', statCosts.defense)}>
          <span className="stat-label">Defense:</span>
          <span className="unlock-cost">{statCosts.defense} fragments to unlock</span>
        </div>
      )}

      {!statsRevealed && (
        <div className="stat-hint">
          Defeat the Mirror Keeper to begin understanding...
        </div>
      )}
    </div>
  );
}

export default PlayerStats; 