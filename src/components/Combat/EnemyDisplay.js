import React from 'react';
import './EnemyDisplay.css';

function EnemyDisplay({ enemy }) {
  const getEnemyState = () => {
    const healthPercentage = (enemy.health / enemy.maxHealth) * 100;
    
    if (healthPercentage <= 0) return 'dead';
    if (healthPercentage <= 25) return 'critical';
    if (healthPercentage <= 50) return 'wounded';
    if (healthPercentage <= 75) return 'injured';
    return 'healthy';
  };

  const getEnemyArt = () => {
    // ASCII art for different states
    const states = {
      healthy: `
   /\\___/\\
  (  o o  )
  (  =^=  )
   (______)`,
      injured: `
   /\\___/\\
  (  o ~ )
  (  =^=  )
   (______)`,
      wounded: `
   /\\___/\\
  (  x o  )
  (  =^=  )
   (______)`,
      critical: `
   /\\___/\\
  (  x x  )
  (  =~=  )
   (______)`,
      dead: `
   /\\___/\\
  (  X X  )
  (  =_=  )
   (______)`,
    };

    return states[getEnemyState()] || states.healthy;
  };

  return (
    <div className={`enemy-display ${getEnemyState()}`}>
      <pre className="enemy-art">{getEnemyArt()}</pre>
      <div className="enemy-name">{enemy.name}</div>
    </div>
  );
}

export default EnemyDisplay; 