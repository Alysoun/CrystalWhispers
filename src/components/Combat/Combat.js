import React, { useState, useEffect, useRef } from 'react';
import EnemyDisplay from './EnemyDisplay';
import './Combat.css';

function Combat({ isOpen, onClose, player, enemy, onCombatEnd }) {
  const [combatLog, setCombatLog] = useState([]);
  const [currentTurn, setCurrentTurn] = useState('player');
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
      setCombatLog([`A ${enemy.name} appears before you!`]);
      setCurrentTurn('player');
    }
  }, [isOpen, enemy]);

  const addToCombatLog = (message) => {
    setCombatLog(prev => [...prev, message]);
  };

  const handleAttack = () => {
    const damage = Math.floor(Math.random() * player.attack) + 1;
    enemy.health -= damage;
    addToCombatLog(`You attack the ${enemy.name} for ${damage} damage!`);
    
    if (enemy.health <= 0) {
      addToCombatLog(`The ${enemy.name} has been defeated!`);
      onCombatEnd('victory');
      return;
    }

    // Enemy turn
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
      onCombatEnd('flee');
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
    const damage = Math.floor(Math.random() * enemy.attack) + 1;
    
    if (player.defending) {
      const reducedDamage = Math.floor(damage / 2);
      player.health -= reducedDamage;
      addToCombatLog(`The ${enemy.name} attacks! Your defense reduces the damage to ${reducedDamage}!`);
      player.defending = false;
    } else {
      player.health -= damage;
      addToCombatLog(`The ${enemy.name} attacks for ${damage} damage!`);
    }

    if (player.health <= 0) {
      addToCombatLog("You have been defeated!");
      onCombatEnd('defeat');
      return;
    }

    setCurrentTurn('player');
  };

  const handleBossAction = () => {
    const currentPhase = getCurrentPhase(boss.health);
    const availableAbilities = currentPhase.activeAbilities;

    // Check for crystal-modified abilities
    const crystalAbilities = boss.activeCrystals?.flatMap(crystal => 
      Object.keys(boss.crystalBehaviors[crystal]?.modifiedAbilities || {})
    ) || [];

    const allAbilities = [...availableAbilities, ...crystalAbilities];
    
    // Choose and execute an ability
    const selectedAbility = chooseAbility(allAbilities);
    executeAbility(selectedAbility);
  };

  const executeAbility = (ability) => {
    switch(ability) {
      case 'mirrorImage':
        // Normal mirror image behavior
        break;
      case 'aggressiveReflection':
        // DEFIANCE crystal behavior - images attack
        break;
      case 'splittingImage':
        // RESILIENCE crystal behavior - images multiply
        break;
      case 'perfectMimicry':
        // REFLECTION crystal behavior - copies player
        break;
      case 'realityBend':
        // CHALLENGE crystal behavior - changes arena
        break;
    }
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
              {enemy.name} HP: {enemy.health}/{enemy.maxHealth}
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