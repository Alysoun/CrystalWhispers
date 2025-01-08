import React from 'react';
import './GameOutput.css';

function GameOutput({ messages }) {
  const renderMessage = (message) => {
    // Split the message by item tags
    const parts = message.split(/(<item>.*?<\/item>)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('<item>') && part.endsWith('</item>')) {
        // Extract the text between the tags and render in green
        const text = part.replace(/<\/?item>/g, '');
        return <span key={index} className="interactable-item">{text}</span>;
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="game-output">
      {messages.map((message, index) => (
        <div key={index} className="message">
          {renderMessage(message)}
        </div>
      ))}
    </div>
  );
}

export default GameOutput; 