import React, { useState } from 'react';
import { Memories } from '../../game/Memories';
import './MemoriesUI.css';

function MemoriesUI({ 
  isOpen, 
  onClose, 
  currentMemories, 
  permanentUpgrades, 
  memoryFragments,
  onPurchaseUpgrade,
  allowPurchases = false
}) {
  const [purchaseInProgress, setPurchaseInProgress] = useState(false);

  const handlePurchase = async (categoryKey, upgradeKey) => {
    if (purchaseInProgress) return;
    
    setPurchaseInProgress(true);
    await onPurchaseUpgrade(categoryKey, upgradeKey);
    
    // Add a small delay before allowing next purchase
    setTimeout(() => {
      setPurchaseInProgress(false);
    }, 500);
  };

  const renderUpgradeButton = (categoryKey, upgradeKey, currentLevel) => {
    const upgrade = Memories.categories[categoryKey].upgrades[upgradeKey];
    const cost = upgrade.cost(currentLevel);
    const canAfford = memoryFragments >= cost;
    
    if (!allowPurchases) {
      return (
        <div className="upgrade-cost">
          <span className={canAfford ? 'can-afford' : 'cannot-afford'}>
            Cost: {cost} fragments {canAfford ? '(Available!)' : ''}
          </span>
        </div>
      );
    }

    return (
      <button
        className={`upgrade-button ${canAfford ? 'can-afford' : 'cannot-afford'}`}
        onClick={() => handlePurchase(categoryKey, upgradeKey)}
        disabled={!canAfford || purchaseInProgress}
      >
        {purchaseInProgress ? 'Processing...' : `Purchase (${cost} fragments)`}
      </button>
    );
  };

  if (!isOpen) return null;

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
                                {stat === 'retentionBonus' ? (
                                  `Memory Retention: +${Math.round(value * 100)}%`
                                ) : (
                                  `${stat}: ${value}`
                                )}
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
        </div>
      </div>
    </div>
  );
}

export default MemoriesUI; 