import React, { useEffect, useRef } from 'react';
import './Journal.css';

function Journal({ entries }) {
  const journalEndRef = useRef(null);

  useEffect(() => {
    // Scroll to bottom when entries change
    journalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [entries]);

  return (
    <div className="journal-container">
      <div className="journal-title">Adventure Log</div>
      <div className="journal-entries">
        {entries.map((entry, index) => (
          <div key={index} className="journal-entry">
            <span className="entry-timestamp">{entry.timestamp}</span>
            <span className="entry-text"> - {entry.text}</span>
          </div>
        ))}
        <div ref={journalEndRef} /> {/* Scroll anchor */}
      </div>
    </div>
  );
}

export default Journal; 