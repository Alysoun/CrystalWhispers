import React, { useState, useEffect } from 'react';
import './PlayerStats.css';

function PlayerStats({ player, statsRevealed, memoryFragments = 0, onPurchase, unlockedStats }) {
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

  const expNeeded = player.level * 100;
  const expPercentage = (player.experience / expNeeded) * 100;
  
  // Cost for each stat reveal
  const statCosts = {
    healthNumbers: 5, // Very cheap - early game purchase
    experience: 15,   // First meaningful purchase
    attack: 25,      // Combat stats are more expensive
    defense: 25
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

  // Render health bar with conditional numbers
  const renderHealthBar = () => (
    <div className="stat-row">
      <span className="stat-label">Health:</span>
      <div className="stat-bar-container">
        <div 
          className="stat-bar health-bar" 
          style={{ width: `${(player.health / player.maxHealth) * 100}%` }}
        ></div>
        {unlockedStats.healthNumbers && (
          <span className="stat-text" style={{ zIndex: 1 }}>
            {`${player.health}/${player.maxHealth}`}
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

      {/* Level - visible after Mirror Keeper */}
      {unlockedStats.level && (
        <div className="stat-row">
          <span className="stat-label">Level:</span>
          <span className="stat-value">{player.level}</span>
        </div>
      )}

      {/* Experience - purchasable */}
      {unlockedStats.experience ? (
        <div className="stat-row">
          <span className="stat-label">Experience:</span>
          <div className="stat-bar-container">
            <div className="stat-bar exp-bar" style={{ width: `${expPercentage}%` }}></div>
            <span className="stat-text">{`${player.experience}/${expNeeded}`}</span>
          </div>
        </div>
      ) : (
        <div className="stat-row locked" onClick={() => onPurchase('experience', statCosts.experience)}>
          <span className="stat-label">Experience:</span>
          <span className="unlock-cost">{statCosts.experience} fragments to unlock</span>
        </div>
      )}

      {/* Attack - purchasable */}
      {unlockedStats.attack ? (
        <div className="stat-row">
          <span className="stat-label">Attack:</span>
          <span className="stat-value">{player.attackPower}</span>
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
          Defeat the Mirror Keeper to begin understanding yourself...
        </div>
      )}
    </div>
  );
}

export default PlayerStats; 