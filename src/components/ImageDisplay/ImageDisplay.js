import React, { useEffect, useRef } from 'react';
import RoomRenderer from '../../utils/RoomRenderer';
import './ImageDisplay.css';

function ImageDisplay({ currentRoom }) {
  const canvasRef = useRef(null);
  const rendererRef = useRef(null);

  const itemsKey = currentRoom?.items?.length || 0;

  useEffect(() => {
    if (!canvasRef.current) return;
    
    if (!rendererRef.current) {
      rendererRef.current = new RoomRenderer(canvasRef.current);
    }
    
    if (currentRoom) {
      rendererRef.current.renderRoom(currentRoom);
    }
  }, [currentRoom, itemsKey]);

  useEffect(() => {
    return () => {
      if (rendererRef.current) {
        rendererRef.current.cleanup();
      }
    };
  }, []);

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
}

export default ImageDisplay; 