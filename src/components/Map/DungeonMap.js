import React, { useState, useRef, useEffect } from 'react';
import './DungeonMap.css';

const CELL_SIZE = 20;
const GRID_COLOR = '#333';
const ROOM_COLOR = '#0f0';
const CURRENT_ROOM_COLOR = '#ff0';
const UNDISCOVERED_COLOR = '#222';
const CONNECTION_COLOR = '#666';
const CONNECTION_WIDTH = 2;
const VIEWPORT_WIDTH = 600;
const VIEWPORT_HEIGHT = 400;
const DOOR_SIZE = 12;
const DOOR_COLOR = '#8b4513';
const DOOR_OFFSET = 2;

function DungeonMap({ dungeon, playerPosition }) {
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 0.8 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  const mapRef = useRef();
  const lastCenteredRoom = useRef(null);
  const hasInitializedRef = useRef(false);
  const lastTouchDistance = useRef(null);

  // Get container dimensions and try to center map
  useEffect(() => {
    const updateViewportAndCenter = () => {
      if (!mapRef.current || dungeon?.currentRoomId === undefined) return;

      const { width, height } = mapRef.current.getBoundingClientRect();
      setViewport({ width, height });

      // Only try to center if we haven't done initial centering
      if (!hasInitializedRef.current) {
        const currentRoom = dungeon.rooms.get(dungeon.currentRoomId);
        if (currentRoom && width && height) {
          const center = currentRoom.getCenter();
          setTransform({
            scale: 0.8,
            x: width/2 - center.x * CELL_SIZE * 0.8,
            y: height/2 - center.y * CELL_SIZE * 0.8
          });
          hasInitializedRef.current = true;
          lastCenteredRoom.current = currentRoom.id;
        }
      }
    };

    updateViewportAndCenter();
    window.addEventListener('resize', updateViewportAndCenter);
    return () => window.removeEventListener('resize', updateViewportAndCenter);
  }, [dungeon]);

  // Handle room changes after initial centering
  useEffect(() => {
    if (!dungeon?.currentRoomId || !viewport.width || !viewport.height || !hasInitializedRef.current) return;

    const currentRoom = dungeon.rooms.get(dungeon.currentRoomId);
    if (!currentRoom || currentRoom.id === lastCenteredRoom.current) return;

    const center = currentRoom.getCenter();
    setTransform(prev => ({
      scale: prev.scale,
      x: viewport.width/2 - center.x * CELL_SIZE * prev.scale,
      y: viewport.height/2 - center.y * CELL_SIZE * prev.scale
    }));
    lastCenteredRoom.current = currentRoom.id;
  }, [dungeon?.currentRoomId, viewport.width, viewport.height]);

    // Handle mouse wheel zoom
    const handleWheel = (e) => {
        e.preventDefault();
        
        // Ignore if no dungeon
        if (!dungeon) return;
    
        const delta = -e.deltaY;
        const scaleFactor = delta > 0 ? 1.1 : 0.9;
        
        // Get mouse position relative to the map container
        const rect = mapRef.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
    
        setTransform(prev => {
          // Limit scale between 0.5 and 2.0
          const newScale = Math.max(0.5, Math.min(2.0, prev.scale * scaleFactor));
          
          // If scale hasn't changed, don't update
          if (newScale === prev.scale) return prev;
          
          const scaleRatio = newScale / prev.scale;
          
          return {
            scale: newScale,
            x: mouseX - (mouseX - prev.x) * scaleRatio,
            y: mouseY - (mouseY - prev.y) * scaleRatio
          };
        });
      };
      
  useEffect(() => {
    const mapElement = mapRef.current;
    if (!mapElement) return;
  
    // Add non-passive wheel event listener
    mapElement.addEventListener('wheel', handleWheel, { passive: false });
  
    // Cleanup event listener on unmount
    return () => {
      mapElement.removeEventListener('wheel', handleWheel);
    };
  }, [handleWheel]);

  // Add visual indicator for map interaction
  const renderMapHint = () => {
    return (
      <div className="map-hint">
        <div className="hint-text">
          🔍 Scroll to zoom, drag to move
        </div>
      </div>
    );
  };

  // Add touch event handlers
  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      // Single touch - handle as drag
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - transform.x,
        y: e.touches[0].clientY - transform.y
      });
    } else if (e.touches.length === 2) {
      // Two touches - prepare for pinch zoom
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      lastTouchDistance.current = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
    }
  };

  // Add useEffect for touch events
  useEffect(() => {
    const mapElement = mapRef.current;
    if (!mapElement) return;

    const touchMoveHandler = (e) => {
      e.preventDefault();
      
      if (e.touches.length === 1 && isDragging) {
        setTransform(prev => ({
          ...prev,
          x: e.touches[0].clientX - dragStart.x,
          y: e.touches[0].clientY - dragStart.y
        }));
      } else if (e.touches.length === 2) {
        // Handle pinch zoom
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const currentDistance = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY
        );

        if (lastTouchDistance.current) {
          const delta = currentDistance - lastTouchDistance.current;
          const scaleFactor = delta > 0 ? 1.02 : 0.98;
          
          const pinchCenterX = (touch1.clientX + touch2.clientX) / 2;
          const pinchCenterY = (touch1.clientY + touch2.clientY) / 2;
          
          setTransform(prev => {
            const newScale = Math.max(0.5, Math.min(2.0, prev.scale * scaleFactor));
            if (newScale === prev.scale) return prev;
            
            const scaleRatio = newScale / prev.scale;
            return {
              scale: newScale,
              x: pinchCenterX - (pinchCenterX - prev.x) * scaleRatio,
              y: pinchCenterY - (pinchCenterY - prev.y) * scaleRatio
            };
          });
        }
        lastTouchDistance.current = currentDistance;
      }
    };

    // Add event listeners with { passive: false }
    mapElement.addEventListener('touchmove', touchMoveHandler, { passive: false });

    return () => {
      mapElement.removeEventListener('touchmove', touchMoveHandler);
    };
  }, [isDragging, dragStart]);

  const handleTouchEnd = () => {
    setIsDragging(false);
    lastTouchDistance.current = null;
  };

  if (!dungeon) {
    return (
      <div className="map-container">
        <div className="map-placeholder">No map available</div>
      </div>
    );
  }

  // Calculate map dimensions
  const width = dungeon.width * CELL_SIZE;
  const height = dungeon.height * CELL_SIZE;



  // Handle drag start
  const handleMouseDown = (e) => {
    if (e.button === 0) { // Left click only
      setIsDragging(true);
      setDragStart({
        x: e.clientX - transform.x,
        y: e.clientY - transform.y
      });
    }
  };

  // Handle drag
  const handleMouseMove = (e) => {
    if (isDragging) {
      setTransform(prev => ({
        ...prev,
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      }));
    }
  };

  // Handle drag end
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const getDoorPosition = (room, direction) => {
    const roomCenterX = (room.x + room.width/2) * CELL_SIZE;
    const roomCenterY = (room.y + room.height/2) * CELL_SIZE;
    
    switch(direction) {
      case 'north':
        return { x: roomCenterX, y: room.y * CELL_SIZE - DOOR_OFFSET };
      case 'south':
        return { x: roomCenterX, y: (room.y + room.height) * CELL_SIZE + DOOR_OFFSET };
      case 'east':
        return { x: (room.x + room.width) * CELL_SIZE + DOOR_OFFSET, y: roomCenterY };
      case 'west':
        return { x: room.x * CELL_SIZE - DOOR_OFFSET, y: roomCenterY };
      default:
        return { x: 0, y: 0 };
    }
  };

  const renderRooms = () => {
    const elements = [];

    // Draw connections first
    dungeon.rooms.forEach(room => {
      if (!room.discovered) return;

      room.connections.forEach(({ room: connectedRoom, direction, state }) => {
        // Only draw connections between discovered rooms
        if (!connectedRoom.discovered) return;

        const start = room.getCenter();
        const end = connectedRoom.getCenter();

        // Draw connection line
        elements.push(
          <line
            key={`connection-${room.id}-${connectedRoom.id}`}
            x1={start.x * CELL_SIZE}
            y1={start.y * CELL_SIZE}
            x2={end.x * CELL_SIZE}
            y2={end.y * CELL_SIZE}
            stroke={CONNECTION_COLOR}
            strokeWidth={CONNECTION_WIDTH}
          />
        );
      });
    });

    // Draw doors
    dungeon.rooms.forEach(room => {
      if (!room.discovered) return;

      room.connections.forEach(({ room: connectedRoom, direction }) => {
        const doorPos = getDoorPosition(room, direction);
        elements.push(
          <rect
            key={`door-${room.id}-${connectedRoom.id}`}
            x={doorPos.x - DOOR_SIZE/2}
            y={doorPos.y - DOOR_SIZE/2}
            width={DOOR_SIZE}
            height={DOOR_SIZE}
            fill={DOOR_COLOR}
            stroke="#000"
            strokeWidth="1"
            transform={`rotate(${
              direction === 'east' || direction === 'west' ? 90 : 0
            }, ${doorPos.x}, ${doorPos.y})`}
          />
        );
      });
    });

    // Draw rooms on top
    dungeon.rooms.forEach(room => {
      if (!room.discovered) return;
      
      const isCurrentRoom = room.id === dungeon.currentRoomId;
      elements.push(
        <rect
          key={`room-${room.id}`}
          x={room.x * CELL_SIZE}
          y={room.y * CELL_SIZE}
          width={room.width * CELL_SIZE}
          height={room.height * CELL_SIZE}
          fill={isCurrentRoom ? CURRENT_ROOM_COLOR : ROOM_COLOR}
          opacity={0.7}
          stroke={isCurrentRoom ? CURRENT_ROOM_COLOR : ROOM_COLOR}
          strokeWidth="2"
        />
      );
    });

    return elements;
  };

  return (
    <div className="map-container">
      <div className="map-title">Dungeon Map</div>
      {renderMapHint()}
      <div 
        className="map-scroll"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        ref={mapRef}
      >
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          className="dungeon-map"
          style={{
            cursor: isDragging ? 'grabbing' : 'grab',
            transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`
          }}
        >
          <rect
            x="0"
            y="0"
            width={width}
            height={height}
            fill="#1a1a1a"
            stroke={GRID_COLOR}
          />
          {renderRooms()}
        </svg>
      </div>
      <div className="map-legend">
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: CURRENT_ROOM_COLOR }}></span>
          Current Room
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: ROOM_COLOR }}></span>
          Discovered Rooms
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: DOOR_COLOR }}></span>
          Doors
        </div>
      </div>
    </div>
  );
}

export default DungeonMap; 