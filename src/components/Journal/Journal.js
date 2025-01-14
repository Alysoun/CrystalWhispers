import React, { useEffect, useRef } from 'react';
import './Journal.css';

function Journal({ entries }) {
  const journalRef = useRef(null);

  useEffect(() => {
    if (journalRef.current) {
      // Scroll the journal container itself, not the viewport
      const scrollOptions = {
        top: journalRef.current.scrollHeight,
        behavior: 'smooth',
      };
      
      // Only scroll the journal div itself
      journalRef.current.scrollTo(scrollOptions);
    }
  }, [entries]);

  return (
    <div className="journal-container">
      <h3>Journal</h3>
      <div className="journal-entries" ref={journalRef}>
        {entries.map((entry, index) => (
          <div key={index} className="journal-entry">
            {typeof entry === 'object' ? (
              <>
                <span className="entry-timestamp">{entry.timestamp}</span>
                <span className="entry-text">{entry.text}</span>
              </>
            ) : (
              entry
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Journal; 