import React, { useState, useEffect, useRef, useCallback } from 'react';
import EnemyDisplay from './EnemyDisplay';
import './Combat.css';

function Combat({ isOpen, onClose, player, enemy, onCombatEnd, currentRoom }) {
  const [combatLog, setCombatLog] = useState([]);
  const [currentTurn, setCurrentTurn] = useState('player');
  const [hasUsedInitiativeReroll, setHasUsedInitiativeReroll] = useState(false);
  const [turnCounter, setTurnCounter] = useState(0);
  const [isDefending, setIsDefending] = useState(false);
  const combatLogRef = useRef(null);
  const [mirrorImages, setMirrorImages] = useState([]);
  const [activeAbility, setActiveAbility] = useState(null);
  const [bossPhase, setBossPhase] = useState(0);
  const [lastBossAction, setLastBossAction] = useState(null);
  const [realBossIndex, setRealBossIndex] = useState(null);
  const [increasedDamage, setIncreasedDamage] = useState(false);
  const [bossDialogueIndex, setBossDialogueIndex] = useState(0);

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
      setIsDefending(false);
    }
  }, [isOpen, enemy]);

  useEffect(() => {
    if (isOpen) {
      const roomAmbushState = currentRoom.getAmbushState();
      setIsDefending(false);
      
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

  const calculateHitChance = (attacker, defender) => {
    // Base hit chance of 85%
    let hitChance = 0.85;

    // Reduce hit chance based on dungeon level (5% per level, max 25% reduction)
    const levelPenalty = Math.min(0.25, (currentRoom.dungeon.level - 1) * 0.05);
    hitChance -= levelPenalty;

    // Add bonus from attacker's upgrades/stats
    if (attacker === player) {
      // Add accuracy bonus from upgrades
      const accuracyLevel = player.upgrades?.combat?.accuracy || 0;
      hitChance += accuracyLevel * 0.1; // +10% per level

      // Add bonus when defending
      if (isDefending) {
        hitChance += 0.15; // +15% when defending
      }
    }

    // Cap hit chance between 30% and 95%
    return Math.min(0.95, Math.max(0.3, hitChance));
  };

  const handleAttack = () => {
    if (currentTurn !== 'player') return;

    const hitChance = calculateHitChance(player, enemy);
    const hits = Math.random() <= hitChance;

    if (!hits) {
      addToCombatLog("Your attack misses!");
      setCurrentTurn('enemy');
      setTimeout(() => {
        handleEnemyTurn();
      }, 500);
      return;
    }

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
        if (enemy.isBoss) {
            addToCombatLog(`${enemy.name} has been defeated! A powerful memory has been unlocked!`);
            onCombatEnd({ 
                victory: true, 
                isBoss: true,
                experience: 100,  // Boss gives more XP
                fragments: 200    // Boss gives more fragments
            });
        } else {
            addToCombatLog(`The ${enemy.name} has been defeated!`);
            onCombatEnd({ 
                victory: true,
                experience: enemy.experience || 20,
                fragments: enemy.fragments || 10
            });
        }
        return;
    }

    setCurrentTurn('enemy');
    setTimeout(() => {
      handleEnemyTurn();
    }, 500);
  };

  const handleDefend = () => {
    setIsDefending(true);
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

  // Handle boss ability selection and execution
  const handleBossAbility = useCallback(() => {
    if (!enemy?.isBoss) return;

    const abilities = Object.values(enemy.abilities);
    const selectedAbility = abilities[Math.floor(Math.random() * abilities.length)];

    // If we have increased damage from Reality Shift, prefer Shattering Strike
    if (increasedDamage && enemy.abilities.shatteringStrike) {
      handleShatteringStrike(true);
      return;
    }

    switch (selectedAbility.name) {
      case "Mirror Image":
        handleMirrorImage();
        break;
      case "Shattering Strike":
        handleShatteringStrike();
        break;
      case "Reality Shift":
        handleRealityShift();
        break;
      default:
        handleBasicAttack();
    }
  }, [enemy, increasedDamage]);

  const handleMirrorImage = () => {
    const imageCount = enemy.abilities.mirrorImage.imageCount;
    const realIndex = Math.floor(Math.random() * imageCount);
    
    const images = Array(imageCount).fill(null).map((_, i) => ({
      isReal: i === realIndex,
      health: enemy.health
    }));

    setMirrorImages(images);
    setRealBossIndex(realIndex);
    addToCombatLog(`${enemy.name} splits into ${imageCount} identical reflections!`);
    setCurrentTurn('player');
  };

  const handleShatteringStrike = (isEmpowered = false) => {
    let damage = enemy.abilities.shatteringStrike.damage;
    if (isEmpowered) {
      damage += enemy.abilities.realityShift.bonusDamage;
      setIncreasedDamage(false);
      addToCombatLog(`${enemy.name}'s reality-warped strike hits for ${damage} damage!`);
    } else {
      addToCombatLog(`${enemy.name}'s shattering strike hits for ${damage} damage!`);
    }

    if (isDefending) {
      damage = Math.floor(damage / 2);
      addToCombatLog("Your defensive stance reduces the damage!");
    }

    player.health -= damage;
    setCurrentTurn('player');
  };

  const handleRealityShift = () => {
    if (mirrorImages.length < 2) {
      handleBasicAttack();
      return;
    }

    // Swap real boss position
    const newImages = [...mirrorImages];
    const newRealIndex = (realBossIndex + 1) % mirrorImages.length;
    newImages[realBossIndex].isReal = false;
    newImages[newRealIndex].isReal = true;
    
    setRealBossIndex(newRealIndex);
    setMirrorImages(newImages);
    setIncreasedDamage(true);
    
    addToCombatLog(`${enemy.name} shifts through reality, empowering its next attack!`);
    setCurrentTurn('player');
  };

  // Update mirror attack handling
  const handleAttackMirror = (index) => {
    if (index === realBossIndex) {
      addToCombatLog("You found the real Mirror Keeper!");
      setMirrorImages([]);
      setRealBossIndex(null);
      handleAttack();
    } else {
      addToCombatLog("The image shatters, revealing it was just a reflection!");
      const newImages = [...mirrorImages];
      newImages.splice(index, 1);
      setMirrorImages(newImages);
      
      // Adjust realBossIndex if needed
      if (index < realBossIndex) {
        setRealBossIndex(realBossIndex - 1);
      }
      
      setTimeout(() => {
        handleBossAbility();
      }, 500);
    }
  };

  // Update boss UI render
  const renderBossUI = () => {
    if (!enemy?.isBoss) return null;

    return (
      <div className="boss-ui">
        {mirrorImages.length > 0 && (
          <div className="mirror-images">
            {mirrorImages.map((image, index) => (
              <button
                key={index}
                onClick={() => handleAttackMirror(index)}
                disabled={currentTurn !== 'player'}
                className="mirror-target"
              >
                Mirror Image {index + 1}
              </button>
            ))}
          </div>
        )}
        {enemy.dialogue && (
          <div className="boss-dialogue">
            {enemy.dialogue[bossDialogueIndex]}
          </div>
        )}
        {increasedDamage && (
          <div className="boss-status empowered">
            Reality-Warped: Next attack empowered!
          </div>
        )}
      </div>
    );
  };

  // Update enemy turn handler
  const handleEnemyTurn = useCallback(() => {
    if (currentTurn !== 'enemy' || !enemy) return;

    if (enemy?.isBoss) {
      handleBossAbility();
      return;
    }

    // Normal enemy combat logic
    const hitChance = calculateHitChance(enemy, player);
    const hits = Math.random() <= hitChance;

    if (!hits) {
      addToCombatLog(`${enemy.name}'s attack misses!`);
      setCurrentTurn('player');
      setIsDefending(false);
      return;
    }

    const enemyAttack = enemy?.attack || 2;
    const damage = Math.floor(Math.random() * enemyAttack) + 1;
    
    let actualDamage = damage;
    if (isDefending) {
      actualDamage = Math.floor(damage / 2);
      addToCombatLog(`The ${enemy.name} attacks! Your defense reduces the damage to ${actualDamage}!`);
    } else {
      addToCombatLog(`The ${enemy.name} attacks for ${actualDamage} damage!`);
    }
    
    player.health -= actualDamage;

    // Check for riposte
    const modifiers = getCombatModifiers();
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

    if (player.health <= 0) {
      addToCombatLog("You have been defeated!");
      onCombatEnd({ defeat: true });
      return;
    }

    setTurnCounter(prev => prev + 1);
    setCurrentTurn('player');
    setIsDefending(false);
  }, [currentTurn, enemy, player, isDefending, onCombatEnd]);

  // Add effect to handle enemy turns
  useEffect(() => {
    if (currentTurn === 'enemy') {
      handleEnemyTurn();
    }
  }, [currentTurn, handleEnemyTurn]);

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

  // Add enemy initialization effect
  useEffect(() => {
    if (isOpen && enemy) {
      // Initialize enemy if needed
      if (!enemy.maxHealth) enemy.maxHealth = enemy.maxHealth || 30;
      if (!enemy.health) enemy.health = enemy.maxHealth;
      if (!enemy.attack) enemy.attack = enemy.attack || 2;
      if (!enemy.name) enemy.name = enemy.name || 'Shadow Remnant';
      
      setCombatLog([`A ${enemy.name} appears before you!`]);
      setCurrentTurn('player');
      setIsDefending(false);
    }
  }, [isOpen, enemy]);

  // Guard clause at the start of render
  if (!isOpen || !enemy) return null;

  return (
    <div className="combat-overlay">
      <div className="combat-modal">
        <div className="combat-header">
          <h2>Combat!</h2>
        </div>

        <div className="combat-content">
          <EnemyDisplay enemy={enemy} />
          {enemy?.isBoss && renderBossUI()}
          
          <div className="combat-stats">
            <div className="player-stats">
              Player HP: {player.health}/{player.maxHealth}
            </div>
            <div className="enemy-stats">
              {enemy.name} HP: {enemy.health}/{enemy.maxHealth}
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
          </div>

          {/* Combat status indicators */}
          {modifiers.bonusActionAvailable && (
            <div className="combat-status">
              Bonus Action Available!
            </div>
          )}

          {player.health <= player.maxHealth * 0.25 && player.upgrades?.combat?.adrenalineRush && (
            <div className="combat-status adrenaline">
              Adrenaline Rush Active! (+{player.upgrades.combat.adrenalineRush * 3} Attack)
            </div>
          )}

          {/* Potion slots */}
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
            {Array(
              (player.getPotionCapacity?.() || 2) - 
              (player.potions?.length || 0)
            ).fill(0).map((_, i) => (
              <div key={`empty-${i}`} className="potion-slot empty">
                Empty Slot
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Combat; 