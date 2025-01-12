import React from 'react';
import { Achievements } from '../../game/Achievements';
import './AchievementUI.css';

function AchievementUI({ isOpen, onClose, stats, unlockedAchievements }) {
  if (!isOpen) return null;

  return (
    <div className="achievement-overlay">
      <div className="achievement-modal">
        <div className="achievement-header">
          <h2>Achievements</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>

        <div className="achievement-content">
          {Object.entries(Achievements.categories).map(([categoryKey, category]) => (
            <div key={categoryKey} className="achievement-category">
              <h3>{category.name}</h3>
              <div className="achievements-grid">
                {Object.entries(category.achievements).map(([key, achievement]) => {
                  const isUnlocked = unlockedAchievements.includes(achievement.id);
                  return (
                    <div 
                      key={achievement.id} 
                      className={`achievement-item ${isUnlocked ? 'unlocked' : 'locked'}`}
                    >
                      <div className="achievement-icon">
                        {isUnlocked ? '✓' : '?'}
                      </div>
                      <div className="achievement-info">
                        <h4>{achievement.name}</h4>
                        <p>{achievement.description}</p>
                        {isUnlocked && (
                          <div className="achievement-reward">
                            Reward: {achievement.reward.fragments} fragments
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AchievementUI; 