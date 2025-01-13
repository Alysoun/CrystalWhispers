import React, { useState, useEffect, useRef } from 'react';
import EnemyDisplay from './EnemyDisplay';
import './Combat.css';

function Combat({ isOpen, onClose, player, enemy, onCombatEnd, currentRoom }) {
  const [combatLog, setCombatLog] = useState([]);
  const [currentTurn, setCurrentTurn] = useState('player');
  const [ambushState, setAmbushState] = useState(null);
  const combatLogRef = useRef(null);

  // Auto-scroll combat log to bottom when new messages are added
  useEffect(() => {
    if (combatLogRef.current) {
      combatLogRef.current.scrollTop = combatLogRef.current.scrollHeight;
    }
  }, [combatLog]);

  // Reset combat log when a new combat starts
  useEffect(() => {
    if (isOpen && enemy) {
      // Initialize enemy if needed
      if (!enemy.maxHealth) enemy.maxHealth = 30;
      if (!enemy.health) enemy.health = enemy.maxHealth;
      if (!enemy.attack) enemy.attack = 2;
      
      setCombatLog(['A Shadow Remnant appears before you!']);
      setCurrentTurn('player');
    }
  }, [isOpen, enemy]);

  useEffect(() => {
    if (isOpen) {
      const roomAmbushState = currentRoom.getAmbushState();
      setAmbushState(roomAmbushState);
      
      // Handle initial advantage
      if (roomAmbushState === 'enemy') {
        handleEnemyTurn();
      } else if (roomAmbushState === 'player') {
        // Player gets an extra attack
        setCurrentTurn('player');
      }
    }
  }, [isOpen, currentRoom]);

  const addToCombatLog = (message) => {
    setCombatLog(prev => [...prev, message]);
  };

  const handleAttack = () => {
    const attackPower = player.attack || 5;
    const damage = Math.floor(Math.random() * attackPower) + 1;
    enemy.health -= damage;
    addToCombatLog(`You attack the Shadow Remnant for ${damage} damage!`);
    
    if (enemy.health <= 0) {
        addToCombatLog(`The Shadow Remnant has been defeated!`);
        onCombatEnd({ victory: true });
        return;
    }

    handleEnemyTurn();
  };

  const handleDefend = () => {
    player.defending = true;
    addToCombatLog("You take a defensive stance.");
    handleEnemyTurn();
  };

  const handleRun = () => {
    const escapeChance = Math.random();
    if (escapeChance > 0.3) {
        addToCombatLog("You successfully flee from combat!");
        onCombatEnd({ fled: true });
    } else {
        addToCombatLog("You failed to escape!");
        handleEnemyTurn();
    }
  };

  const handleUseItem = () => {
    // We'll implement this later
    addToCombatLog("Item use not implemented yet.");
  };

  const handleEnemyTurn = () => {
    setCurrentTurn('enemy');
    const enemyAttack = enemy.attack || 2;
    const damage = Math.floor(Math.random() * enemyAttack) + 1;
    
    if (player.defending) {
      const reducedDamage = Math.floor(damage / 2);
      player.health -= reducedDamage;
      addToCombatLog(`The Shadow Remnant attacks! Your defense reduces the damage to ${reducedDamage}!`);
      player.defending = false;
    } else {
      player.health -= damage;
      addToCombatLog(`The Shadow Remnant attacks for ${damage} damage!`);
    }

    if (player.health <= 0) {
        addToCombatLog("You have been defeated!");
        onCombatEnd({ defeat: true });
        return;
    }

    setCurrentTurn('player');
  };

  if (!isOpen) return null;

  return (
    <div className="combat-modal">
      <div className="combat-content">
        <div className="combat-header">
          <h2>Combat!</h2>
          <EnemyDisplay enemy={enemy} />
          <div className="combat-stats">
            <div className="player-stats">
              Player HP: {player.health}/{player.maxHealth}
            </div>
            <div className="enemy-stats">
              Shadow Remnant HP: {enemy.health}/{enemy.maxHealth}
            </div>
          </div>
        </div>

        <div className="combat-log" ref={combatLogRef}>
          {combatLog.map((message, index) => (
            <div key={index} className="combat-message">{message}</div>
          ))}
        </div>

        <div className="combat-controls">
          <button onClick={handleAttack} disabled={currentTurn !== 'player'}>Attack</button>
          <button onClick={handleDefend} disabled={currentTurn !== 'player'}>Defend</button>
          <button onClick={handleRun} disabled={currentTurn !== 'player'}>Run</button>
          <button onClick={handleUseItem} disabled={currentTurn !== 'player'}>Use Item</button>
        </div>
      </div>
    </div>
  );
}

export default Combat; 