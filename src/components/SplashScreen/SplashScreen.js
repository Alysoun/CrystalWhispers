import React from 'react';
import { Story } from '../../game/Story';
import './SplashScreen.css';

function SplashScreen({ onNewGame, onLoadGame, onShowAchievements, hasSavedGame }) {
  return (
    <div className="splash-screen">
      <h1>Crystal Whispers</h1>
      <div className="story-intro">
        {Story.introduction.map((line, index) => (
          <p key={index}>{line}</p>
        ))}
      </div>
      <div className="menu-options">
        <button onClick={onNewGame}>Start New Game</button>
        {hasSavedGame && (
          <button onClick={onLoadGame}>Continue Game</button>
        )}
        <button onClick={onShowAchievements}>Achievements</button>
      </div>
    </div>
  );
}

export default SplashScreen; 