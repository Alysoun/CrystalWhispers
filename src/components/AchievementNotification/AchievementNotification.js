import React, { useState, useEffect } from 'react';
import './AchievementNotification.css';

function AchievementNotification({ achievement, onDismiss }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (achievement) {
      setIsVisible(true);
      // Auto dismiss after 5 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onDismiss, 500); // Allow exit animation to complete
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [achievement, onDismiss]);

  if (!achievement) return null;

  return (
    <div className={`achievement-notification ${isVisible ? 'visible' : ''}`}>
      <div className="achievement-notification-icon">✨</div>
      <div className="achievement-notification-content">
        <h3>Achievement Unlocked!</h3>
        <h4>{achievement.name}</h4>
        <p>{achievement.description}</p>
        <div className="achievement-notification-reward">
          +{achievement.reward.fragments} fragments
        </div>
      </div>
    </div>
  );
}

export default AchievementNotification; 