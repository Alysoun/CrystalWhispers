import React, { useRef, useEffect } from 'react';
import './GameOutput.css';

const parseMessage = (message) => {
  if (typeof message !== 'string') return message;

  // Split by tags while keeping the tags in the array
  const parts = message.split(/(<\/?[^>]+>)/);
  
  return parts.map((part, index) => {
    // Check if this is a tag
    if (part.startsWith('<') && part.endsWith('>')) {
      // Skip closing tags
      if (part.startsWith('</')) return null;
      
      // For opening tags, get the tag name and handle the next content part
      const tagName = part.slice(1, -1);
      const content = parts[index + 1];
      
      if (tagName === 'item' || tagName === 'command') {
        // Create a tooltip that shows available commands
        const getTooltipContent = (type, content) => {
          if (type === 'item') {
            return (
              <div className="tooltip-content">
                <div className="tooltip-commands">
                  <span className="tooltip-command">examine {content}</span>
                  <span className="tooltip-command">take {content}</span>
                </div>
              </div>
            );
          }
          return null;
        };

        return (
          <span 
            key={index} 
            className={`${tagName}-text`}
          >
            {content}
            <div className="tooltip">
              {getTooltipContent(tagName, content)}
            </div>
          </span>
        );
      }
      return null;
    }
    
    // Skip content that was handled with its opening tag
    if (parts[index - 1]?.startsWith('<') && !parts[index - 1]?.startsWith('</')) {
      return null;
    }
    
    return part;
  }).filter(Boolean); // Remove null values
};

function GameOutput({ messages }) {
  const outputRef = useRef(null);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="game-output" ref={outputRef}>
      {messages.map((message, index) => (
        <div key={index} className="message">{parseMessage(message)}</div>
      ))}
    </div>
  );
}

export default GameOutput; 