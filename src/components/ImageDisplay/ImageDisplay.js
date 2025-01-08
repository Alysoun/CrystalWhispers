import React from 'react';
import './ImageDisplay.css';

const ASCII_ART = {
  wolf: `
    /\\___/\\
   (  o o  )
   (  =^=  )
    (---)
     | |
    _| |_
  `,
  key: `
    .---.
    |   |
    |   |
    |   |
    '---'
    |   |
    |   |
    |   |
    '---'
  `,
  note: `
   ___________
  |           |
  |  Dear...  |
  |  ~~~~~~~~ |
  |  ~~~~~~~~ |
  |___________|
  `
};

const ImageDisplay = ({ currentImage }) => {
  return (
    <div className="image-display">
      {currentImage ? (
        <pre className="ascii-art">{ASCII_ART[currentImage] || 'No image available'}</pre>
      ) : (
        <div className="no-image">Exploring...</div>
      )}
    </div>
  );
};

export default ImageDisplay; 