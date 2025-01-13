import React, { useRef, useEffect } from 'react';
import './ImageDisplay.css';
import RoomRenderer from '../../utils/RoomRenderer.js';

const ImageDisplay = ({ currentRoom }) => {
  const canvasRef = useRef(null);
  const rendererRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    
    if (!rendererRef.current) {
      rendererRef.current = new RoomRenderer(canvasRef.current);
    }
    
    const currentRenderer = rendererRef.current;
    
    if (currentRoom) {
      rendererRef.current.renderRoom(currentRoom);
    }
    
    return () => {
      currentRenderer.cleanup();
    };
  }, [currentRoom]);

  return (
    <div className="image-display">
      <canvas 
        ref={canvasRef}
        width={400}
        height={300}
        className="room-canvas"
      />
    </div>
  );
};

export default ImageDisplay; 