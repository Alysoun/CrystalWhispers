import React, { useRef, useEffect } from 'react';
import './GameOutput.css';

function GameOutput({ messages }) {
  const outputRef = useRef(null);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [messages]);

  const parseMessage = (message) => {
    if (typeof message !== 'string') return message;

    // Handle danger warnings first
    if (message.includes('!DANGER!')) {
      const parts = message.split('!DANGER!');
      return (
        <span>
          {parts[0]}
          <span className="danger">!DANGER!</span>
          {parts[1]}
        </span>
      );
    }

    // Then handle item tags
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
          return (
            <span 
              key={index} 
              className={`${tagName}-text`}
            >
              {content}
              <div className="tooltip">
                <div className="tooltip-content">
                  <div className="tooltip-commands">
                    {tagName === 'item' && (
                      <>
                        <span className="tooltip-command">examine {content}</span>
                        <span className="tooltip-command">take {content}</span>
                      </>
                    )}
                  </div>
                </div>
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

  return (
    <div className="game-output" ref={outputRef}>
      {messages.map((message, index) => (
        <div key={index} className="message">
          {parseMessage(message)}
        </div>
      ))}
    </div>
  );
}

export default GameOutput; 