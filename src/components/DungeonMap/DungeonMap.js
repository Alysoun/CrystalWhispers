import React, { useEffect, useRef } from 'react';

const DungeonMap = () => {
  const canvasRef = useRef(null);
  const scale = 1; // Assuming a default scale

  const handleRoomClick = (x, y) => {
    // Implementation of handleRoomClick
  };

  // Add touch event handlers
  useEffect(() => {
    const canvas = canvasRef.current;
    let touchStartX = 0;
    let touchStartY = 0;

    const handleTouchStart = (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e) => {
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      
      const deltaX = touchEndX - touchStartX;
      const deltaY = touchEndY - touchStartY;
      
      // Convert touch to grid coordinates and handle room selection
      const rect = canvas.getBoundingClientRect();
      const x = (touchEndX - rect.left) / scale;
      const y = (touchEndY - rect.top) / scale;
      
      // If it's a tap (minimal movement), handle as click
      if (Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10) {
        handleRoomClick(x, y);
      }
    };

    canvas.addEventListener('touchstart', handleTouchStart);
    canvas.addEventListener('touchend', handleTouchEnd);

    return () => {
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchend', handleTouchEnd);
    };
  }, [scale]);

  return (
    <div>
      <canvas ref={canvasRef} />
    </div>
  );
};

export default DungeonMap; 