import React, { useState, useRef, useEffect, useCallback } from 'react';
import './DungeonMap.css';

const CELL_SIZE = 20;
const GRID_COLOR = '#333';
const ROOM_COLOR = '#0f0';
const CURRENT_ROOM_COLOR = '#ff0';
const BOSS_ROOM_COLOR = '#f00';
const TREASURE_ROOM_COLOR = '#c4a7e7';
const UNDISCOVERED_COLOR = '#222';
const CONNECTION_COLOR = '#666';
const CONNECTION_WIDTH = 2;
const VIEWPORT_WIDTH = 600;
const VIEWPORT_HEIGHT = 400;
const DOOR_SIZE = 12;
const DOOR_COLOR = '#8b4513';
const DOOR_OFFSET = 2;

function DungeonMap({ dungeon, playerPosition, permanentUpgrades, memoryFragments, onPurchaseMap }) {
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 0.8 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  const mapRef = useRef();
  const lastCenteredRoom = useRef(null);
  const hasInitializedRef = useRef(false);
  const lastTouchDistance = useRef(null);

  const handleWheel = useCallback((e) => {
    e.preventDefault();
    if (!dungeon) return;

    const delta = -e.deltaY;
    const scaleFactor = delta > 0 ? 1.1 : 0.9;
    
    const rect = mapRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    setTransform(prev => {
      const newScale = Math.max(0.5, Math.min(2.0, prev.scale * scaleFactor));
      if (newScale === prev.scale) return prev;
      
      const scaleRatio = newScale / prev.scale;
      
      return {
        scale: newScale,
        x: mouseX - (mouseX - prev.x) * scaleRatio,
        y: mouseY - (mouseY - prev.y) * scaleRatio
      };
    });
  }, [dungeon]);

  useEffect(() => {
    const updateViewportAndCenter = () => {
      if (!mapRef.current || !dungeon?.currentRoomId) return;
      const { width, height } = mapRef.current.getBoundingClientRect();
      setViewport({ width, height });

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

  useEffect(() => {
    const mapElement = mapRef.current;
    if (!mapElement) return;

    mapElement.addEventListener('wheel', handleWheel, { passive: false });
    return () => mapElement.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);

  useEffect(() => {
    if (!dungeon?.currentRoomId || !viewport.width || !viewport.height) return;

    const currentRoom = dungeon.rooms.get(dungeon.currentRoomId);
    if (!currentRoom) return;

    const center = currentRoom.getCenter();
    setTransform(prev => ({
      scale: prev.scale,
      x: viewport.width/2 - center.x * CELL_SIZE * prev.scale,
      y: viewport.height/2 - center.y * CELL_SIZE * prev.scale
    }));
    lastCenteredRoom.current = currentRoom.id;

  }, [dungeon?.currentRoomId, viewport.width, viewport.height]);

  const hasMapUpgrade = permanentUpgrades?.exploration?.dungeonMap > 0;
  const width = dungeon ? dungeon.width * CELL_SIZE : 0;
  const height = dungeon ? dungeon.height * CELL_SIZE : 0;

  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - transform.x,
        y: e.touches[0].clientY - transform.y
      });
    } else if (e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      lastTouchDistance.current = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
    }
  };

  const handleTouchMove = useCallback((e) => {
    e.preventDefault();
    
    if (e.touches.length === 1 && isDragging) {
      setTransform(prev => ({
        ...prev,
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y
      }));
    } else if (e.touches.length === 2) {
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
  }, [isDragging, dragStart]);

  const handleTouchEnd = () => {
    setIsDragging(false);
    lastTouchDistance.current = null;
  };

  const handleMouseDown = (e) => {
    if (e.button === 0) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - transform.x,
        y: e.clientY - transform.y
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setTransform(prev => ({
        ...prev,
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      }));
    }
  };

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

  const getRoomColor = (room) => {
    if (room.id === dungeon.currentRoomId) {
      return CURRENT_ROOM_COLOR;
    }
    if (room.roomType === 'boss') {
      return BOSS_ROOM_COLOR;
    }
    if (room.roomType === 'treasure') {
      return TREASURE_ROOM_COLOR;
    }
    return ROOM_COLOR;
  };

  const renderRooms = () => {
    const elements = [];

    dungeon.rooms.forEach(room => {
      if (!room.discovered) return;

      room.connections.forEach(({ room: connectedRoom, direction, state }) => {
        if (!connectedRoom.discovered) return;

        const start = room.getCenter();
        const end = connectedRoom.getCenter();

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

    dungeon.rooms.forEach(room => {
      if (!room.discovered) return;
      
      elements.push(
        <rect
          key={`room-${room.id}`}
          x={room.x * CELL_SIZE}
          y={room.y * CELL_SIZE}
          width={room.width * CELL_SIZE}
          height={room.height * CELL_SIZE}
          fill={getRoomColor(room)}
          opacity={0.7}
          stroke={getRoomColor(room)}
          strokeWidth="2"
        />
      );
    });

    return elements;
  };

  if (!hasMapUpgrade) {
    return (
      <div className="map-container">
        <div className="map-placeholder">
          <p>Map feature locked</p>
          <div className="map-unlock">
            <p>Unlock Map Feature</p>
            <p className="cost">Cost: 200 fragments</p>
            <button 
              className={`unlock-button ${memoryFragments >= 200 ? 'can-afford' : ''}`}
              onClick={onPurchaseMap}
              disabled={memoryFragments < 200}
            >
              {memoryFragments >= 200 ? 'Purchase Map' : 'Not Enough Fragments'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!dungeon) {
    return (
      <div className="map-container">
        <div className="map-placeholder">No map available</div>
      </div>
    );
  }

  const renderMapHint = () => {
    return (
      <div className="map-hint">
        <div className="hint-text">
          🔍 Scroll to zoom, drag to move
        </div>
      </div>
    );
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
          <span className="legend-color" style={{ backgroundColor: BOSS_ROOM_COLOR }}></span>
          Boss Room
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: TREASURE_ROOM_COLOR }}></span>
          Treasure Room
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