import React from 'react';
import { Memories } from '../../game/Memories';
import './MemoriesUI.css';

function MemoriesUI({ fragments, upgradeLevels, onPurchase }) {
  return (
    <div className="memories-modal">
      <div className="memories-content">
        <h2>Memories ({fragments} fragments)</h2>
        
        {Object.entries(Memories.categories).map(([catKey, category]) => (
          <div key={catKey} className="memory-category">
            <h3>{category.name}</h3>
            <p>{category.description}</p>
            
            <div className="upgrades-grid">
              {Object.entries(category.upgrades).map(([upKey, upgrade]) => {
                const currentLevel = upgradeLevels[catKey]?.[upKey] || 0;
                const canBuy = Memories.canPurchaseUpgrade(
                  catKey, upKey, currentLevel, fragments
                );
                
                return (
                  <div key={upKey} className="upgrade-item">
                    <h4>{upgrade.name} (Level {currentLevel}/{upgrade.maxLevel})</h4>
                    <p>{upgrade.description}</p>
                    <button 
                      onClick={() => onPurchase(catKey, upKey)}
                      disabled={!canBuy}
                    >
                      Upgrade ({upgrade.cost(currentLevel)} fragments)
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MemoriesUI; 