import React from 'react';
import './EnemyDisplay.css';

function EnemyDisplay({ enemy }) {
  if (!enemy) return null;

  // Use boss ASCII art if it exists
  if (enemy.isBoss && enemy.appearance?.ascii) {
    return (
      <div className="enemy-display boss">
        <pre className="enemy-ascii">
          {enemy.appearance.ascii.join('\n')}
        </pre>
        <div className="enemy-name">{enemy.name}</div>
      </div>
    );
  }

  // Default enemy ASCII art
  return (
    <div className="enemy-display">
      <pre className="enemy-ascii">
        {`  /\\__/\\
 ( o.o )
  ( ^ )`}
      </pre>
      <div className="enemy-name">{enemy.name}</div>
    </div>
  );
}

export default EnemyDisplay; 