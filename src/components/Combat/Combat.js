import React, { useState, useEffect, useRef } from 'react';
import EnemyDisplay from './EnemyDisplay';
import './Combat.css';

function Combat({ isOpen, onClose, player, enemy, onCombatEnd, currentRoom }) {
  const [combatLog, setCombatLog] = useState([]);
  const [currentTurn, setCurrentTurn] = useState('player');
  const [hasUsedInitiativeReroll, setHasUsedInitiativeReroll] = useState(false);
  const [turnCounter, setTurnCounter] = useState(0);
  const [ambushState, setAmbushState] = useState(null);
  const combatLogRef = useRef(null);

  // Define getCombatModifiers first
  const getCombatModifiers = () => {
    const modifiers = {
      critChance: 0,
      attackBonus: 0,
      counterChance: 0,
      bonusActionAvailable: false
    };

    // Apply precision strike
    const precisionLevel = player.upgrades?.combat?.precisionStrike || 0;
    modifiers.critChance = precisionLevel * 0.05;

    // Apply adrenaline rush when below 25% health
    const adrenalineLevel = player.upgrades?.combat?.adrenalineRush || 0;
    if (player.health <= player.maxHealth * 0.25) {
      modifiers.attackBonus += adrenalineLevel * 3;
    }

    // Apply riposte
    const riposteLevel = player.upgrades?.combat?.riposte || 0;
    modifiers.counterChance = riposteLevel * 0.1;

    // Check for bonus action from strategist's mind
    const strategistLevel = player.upgrades?.tactical?.strategistMind || 0;
    if (strategistLevel > 0) {
      const interval = 5 - strategistLevel;
      modifiers.bonusActionAvailable = (turnCounter % interval === 0);
    }

    return modifiers;
  };

  // Then calculate modifiers
  const modifiers = getCombatModifiers();

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
      setAmbushState(null);
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
    const modifiers = getCombatModifiers();
    const attackPower = player.attack + modifiers.attackBonus;
    let damage = Math.floor(Math.random() * attackPower) + 1;

    // Check for critical hit
    const critRoll = Math.random();
    const isCrit = critRoll < modifiers.critChance;
    if (isCrit) {
      damage *= 2;
      addToCombatLog("Critical Hit!");
    }

    enemy.health -= damage;
    addToCombatLog(`You attack the ${enemy.name} for ${damage} damage!`);
    
    if (enemy.health <= 0) {
      addToCombatLog(`The ${enemy.name} has been defeated!`);
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
    const modifiers = getCombatModifiers();
    const enemyAttack = enemy.attack || 2;
    const damage = Math.floor(Math.random() * enemyAttack) + 1;
    
    if (player.defending) {
      const reducedDamage = Math.floor(damage / 2);
      player.health -= reducedDamage;
      addToCombatLog(`The ${enemy.name} attacks! Your defense reduces the damage to ${reducedDamage}!`);
      player.defending = false;
    } else {
      player.health -= damage;
      addToCombatLog(`The ${enemy.name} attacks for ${damage} damage!`);

      // Check for riposte
      const riposteRoll = Math.random();
      if (riposteRoll < modifiers.counterChance) {
        const counterDamage = Math.floor(player.attack * 0.5);
        enemy.health -= counterDamage;
        addToCombatLog(`You counter-attack for ${counterDamage} damage!`);

        if (enemy.health <= 0) {
          addToCombatLog(`The ${enemy.name} has been defeated!`);
          onCombatEnd({ victory: true });
          return;
        }
      }
    }

    // Check for Last Stand
    if (player.health === 1 && player.upgrades?.survival?.lastStand) {
      addToCombatLog("Last Stand activates! You're temporarily invulnerable!");
      player.health = 1;  // Ensure health stays at 1
    } else if (player.health <= 0) {
      addToCombatLog("You have been defeated!");
      onCombatEnd({ defeat: true });
      return;
    }

    setTurnCounter(prev => prev + 1);
    setCurrentTurn('player');
  };

  // Add initiative reroll button if available
  const handleInitiativeReroll = () => {
    if (!hasUsedInitiativeReroll && player.upgrades?.tactical?.battlefieldControl) {
      setCurrentTurn(Math.random() < 0.5 ? 'player' : 'enemy');
      setHasUsedInitiativeReroll(true);
      addToCombatLog("You've rerolled combat initiative!");
    }
  };

  const handleUsePotion = (index) => {
    const result = player.usePotion(index);
    if (result.success) {
      addToCombatLog(result.message);
      handleEnemyTurn();
    } else {
      addToCombatLog(result.message);
    }
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      const commandInput = document.querySelector('.command-input');
      commandInput?.focus();
    }, 0);
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
          <button onClick={handleAttack} disabled={currentTurn !== 'player'}>
            Attack {modifiers.critChance > 0 && `(${Math.round(modifiers.critChance * 100)}% Crit)`}
          </button>
          <button onClick={handleDefend} disabled={currentTurn !== 'player'}>
            Defend
          </button>
          <button onClick={handleRun} disabled={currentTurn !== 'player'}>
            Run
          </button>
          
          {/* Show initiative reroll button if available */}
          {player.upgrades?.tactical?.battlefieldControl && !hasUsedInitiativeReroll && (
            <button onClick={handleInitiativeReroll} className="tactical-btn">
              Reroll Initiative
            </button>
          )}
          
          {/* Show bonus action indicator if available */}
          {modifiers.bonusActionAvailable && (
            <div className="bonus-action-indicator">
              Bonus Action Available!
            </div>
          )}

          {/* Show adrenaline rush indicator when active */}
          {player.health <= player.maxHealth * 0.25 && player.upgrades?.combat?.adrenalineRush && (
            <div className="adrenaline-rush-indicator">
              Adrenaline Rush Active! (+{player.upgrades.combat.adrenalineRush * 3} Attack)
            </div>
          )}
        </div>

        <div className="potion-slots">
          {player.potions.map((potion, index) => (
            <button 
              key={index}
              onClick={() => handleUsePotion(index)}
              disabled={currentTurn !== 'player'}
              className="potion-slot"
            >
              {potion.name}
            </button>
          ))}
          {/* Show empty slots - use a fallback for potion capacity */}
          {Array(
            (player.getPotionCapacity?.() || 2) - // Try to use the method, fallback to 2
            (player.potions?.length || 0)
          ).fill(0).map((_, i) => (
            <div key={`empty-${i}`} className="potion-slot empty">
              Empty Slot
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Combat; 