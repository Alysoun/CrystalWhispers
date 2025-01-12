import React from 'react';
import './GameOutput.css';

function GameOutput({ messages }) {
  const renderMessage = (message) => {
    return message.split('\n').map((line, lineIndex) => {
      // Match both item and command tags with content
      const parts = line.split(/(<(?:item|command)>[^<]*<\/(?:item|command)>)/g);
      console.log('Parts:', parts);
      
      return (
        <div key={lineIndex} className="message-line">
          {parts.map((part, partIndex) => {
            if (part.match(/<(?:item|command)>[^<]*<\/(?:item|command)>/)) {
              const type = part.startsWith('<item>') ? 'item' : 'command';
              const content = part.match(/<(?:item|command)>([^<]*)<\/(?:item|command)>/)[1];
              return <span key={partIndex} className={`interactable-${type}`}>{content}</span>;
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