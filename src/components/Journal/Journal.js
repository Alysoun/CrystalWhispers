import React from 'react';
import './Journal.css';

const Journal = ({ entries }) => {
  return (
    <div className="journal">
      <h2>Adventure Log</h2>
      <div className="journal-entries">
        {entries.length === 0 ? (
          <div className="no-entries">Your adventure is just beginning...</div>
        ) : (
          entries.map((entry, index) => (
            <div key={index} className="journal-entry">
              <span className="entry-timestamp">{entry.timestamp}</span>
              <span className="entry-text">{entry.text}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Journal; 