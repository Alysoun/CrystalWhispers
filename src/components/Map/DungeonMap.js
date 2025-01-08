import React, { useState, useRef, useEffect } from 'react';
import './DungeonMap.css';

const CELL_SIZE = 20;
const GRID_COLOR = '#333';
const ROOM_COLOR = '#0f0';
const CURRENT_ROOM_COLOR = '#ff0';
const UNDISCOVERED_COLOR = '#222';
const CONNECTION_COLOR = '#666';
const CONNECTION_WIDTH = '3';
const VIEWPORT_WIDTH = 600;
const VIEWPORT_HEIGHT = 400;
const DOOR_SIZE = 4;
const DOOR_COLOR = '#8b4513'; // Brown color for doors

function DungeonMap({ dungeon, playerPosition }) {
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 0.8 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  const mapRef = useRef();
  const lastCenteredRoom = useRef(null);
  const hasInitializedRef = useRef(false);

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

  // Handle mouse wheel zoom
  const handleWheel = (e) => {
    e.preventDefault();
    const delta = -e.deltaY;
    const scaleFactor = delta > 0 ? 1.1 : 0.9;
    const mouseX = e.nativeEvent.offsetX;
    const mouseY = e.nativeEvent.offsetY;

    setTransform(prev => {
      const newScale = Math.max(0.5, Math.min(2, prev.scale * scaleFactor));
      const scaleRatio = newScale / prev.scale;
      
      return {
        scale: newScale,
        x: mouseX - (mouseX - prev.x) * scaleRatio,
        y: mouseY - (mouseY - prev.y) * scaleRatio
      };
    });
  };

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

  const renderDoor = (room, connectedRoom) => {
    const start = room.getCenter();
    const end = connectedRoom.getCenter();
    const doorX = (start.x + end.x) / 2 * CELL_SIZE;
    const doorY = (start.y + end.y) / 2 * CELL_SIZE;

    return (
      <rect
        key={`door-${room.id}-${connectedRoom.id}`}
        x={doorX - DOOR_SIZE/2}
        y={doorY - DOOR_SIZE/2}
        width={DOOR_SIZE}
        height={DOOR_SIZE}
        fill={DOOR_COLOR}
        transform={`rotate(${
          Math.atan2(end.y - start.y, end.x - start.x) * 180 / Math.PI
        }, ${doorX}, ${doorY})`}
      />
    );
  };

  const renderRooms = () => {
    const elements = [];

    // Draw connections first
    dungeon.rooms.forEach(room => {
      if (!room.discovered) return;

      room.connections.forEach(({ room: connectedRoom, direction, state }) => {
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

    // Draw rooms
    dungeon.rooms.forEach(room => {
      if (!room.discovered) return;

      const isCurrentRoom = room.id === dungeon.currentRoomId;
      const roomColor = isCurrentRoom ? CURRENT_ROOM_COLOR : ROOM_COLOR;

      elements.push(
        <rect
          key={`room-${room.id}`}
          x={room.x * CELL_SIZE}
          y={room.y * CELL_SIZE}
          width={room.width * CELL_SIZE}
          height={room.height * CELL_SIZE}
          fill={roomColor}
          opacity={0.3}
          stroke={roomColor}
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
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
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
      </div>
    </div>
  );
}

export default DungeonMap; 