import React from 'react';
import './GameOutput.css';

function GameOutput({ messages }) {
  const renderMessage = (message) => {
    return message.split('\n').map((line, lineIndex) => {
      // Match complete item tags with content
      const parts = line.split(/(<item>[^<]+<\/item>)/g);
      
      return (
        <div key={lineIndex} className="message-line">
          {parts.map((part, partIndex) => {
            if (part.startsWith('<item>') && part.endsWith('</item>')) {
              const text = part.slice(6, -7); // Remove <item> and </item>
              return <span key={partIndex} className="interactable-item">{text}</span>;
            }
            return <span key={partIndex}>{part}</span>;
          })}
        </div>
      );
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