import React from 'react';
import { Memories } from '../../game/Memories';
import './MemoriesUI.css';

function MemoriesUI({ 
  isOpen, 
  onClose, 
  currentMemories, 
  permanentUpgrades, 
  memoryFragments,
  onPurchaseUpgrade 
}) {
  if (!isOpen) return null;

  const renderUpgradeButton = (category, upgrade, currentLevel) => {
    const upgradeInfo = Memories.categories[category].upgrades[upgrade];
    const canPurchase = Memories.canPurchaseUpgrade(
      category, 
      upgrade, 
      currentLevel || 0, 
      memoryFragments
    );
    const cost = upgradeInfo.cost(currentLevel || 0);

    return (
      <button
        className={`upgrade-button ${canPurchase ? 'available' : 'locked'}`}
        onClick={() => onPurchaseUpgrade(category, upgrade)}
        disabled={!canPurchase}
      >
        Upgrade ({cost} fragments)
      </button>
    );
  };

  return (
    <div className="memories-overlay">
      <div className="memories-modal">
        <div className="memories-header">
          <h2>Memories</h2>
          <div className="fragments-counter">
            Memory Fragments: {memoryFragments}
          </div>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>

        <div className="memories-content">
          <div className="permanent-upgrades">
            <h3>Permanent Upgrades</h3>
            {Object.entries(Memories.categories).map(([categoryKey, category]) => (
              <div key={categoryKey} className="upgrade-category">
                <h4>{category.name}</h4>
                <p className="category-description">{category.description}</p>
                <div className="upgrades-grid">
                  {Object.entries(category.upgrades).map(([upgradeKey, upgrade]) => {
                    const currentLevel = permanentUpgrades[categoryKey]?.[upgradeKey] || 0;
                    const effect = upgrade.effect(currentLevel);
                    
                    return (
                      <div key={upgradeKey} className="upgrade-item">
                        <div className="upgrade-info">
                          <h5>{upgrade.name}</h5>
                          <p>{upgrade.description}</p>
                          <div className="upgrade-level">
                            Level: {currentLevel}/{upgrade.maxLevel}
                          </div>
                          <div className="upgrade-effect">
                            {Object.entries(effect).map(([stat, value]) => (
                              <div key={stat}>
                                {stat}: {value}
                              </div>
                            ))}
                          </div>
                        </div>
                        {currentLevel < upgrade.maxLevel && 
                          renderUpgradeButton(categoryKey, upgradeKey, currentLevel)
                        }
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="current-memories">
            <h3>Current Run Memories</h3>
            <div className="memories-grid">
              {currentMemories.map((memory, index) => (
                <div key={index} className="memory-item">
                  <h4>{memory.name}</h4>
                  <p>{memory.description}</p>
                  <div className="memory-value">
                    Fragment Value: {memory.memoryValue}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MemoriesUI; 