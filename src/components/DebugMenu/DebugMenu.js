import React, { useState, useRef, useEffect } from 'react';
import Player from '../../game/Player';
import { Dungeon } from '../../game/DungeonGenerator';
import { getBossForLevel } from '../../game/bosses/GriefBosses';
import './DebugMenu.css';

function DebugMenu({ 
  isOpen, 
  onClose, 
  player, 
  setPlayer,
  dungeon,
  setDungeon,
  memoryFragments,
  setMemoryFragments,
  discoveredTreasures,
  setDiscoveredTreasures,
  initializeGame,
  handlePlayerDeath
}) {
  const [selectedTab, setSelectedTab] = useState('player');
  const [position, setPosition] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const menuRef = useRef(null);

  useEffect(() => {
    if (!position && menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      setPosition({
        x: rect.left,
        y: rect.top
      });
    }
  }, [position]);

  const handleMouseDown = (e) => {
    if (e.target.closest('.debug-actions') || e.target.tagName === 'BUTTON') return;
    setIsDragging(true);
    const rect = menuRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const x = e.clientX - dragOffset.x;
    const y = e.clientY - dragOffset.y;
    
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const menuRect = menuRef.current.getBoundingClientRect();
    
    const boundedX = Math.min(Math.max(x, 0), windowWidth - menuRect.width);
    const boundedY = Math.min(Math.max(y, 0), windowHeight - menuRect.height);
    
    setPosition({ x: boundedX, y: boundedY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const clonePlayer = (originalPlayer) => {
    const newPlayer = new Player();
    Object.assign(newPlayer, {
      maxHealth: originalPlayer.maxHealth,
      health: originalPlayer.health,
      attack: originalPlayer.attack,
      defense: originalPlayer.defense,
      level: originalPlayer.level,
      experience: originalPlayer.experience,
      healAfterCombat: originalPlayer.healAfterCombat
    });
    return newPlayer;
  };

  const debugActions = {
    player: [
      {
        name: 'Max Health',
        action: () => {
          const newPlayer = clonePlayer(player);
          newPlayer.health = newPlayer.maxHealth;
          setPlayer(newPlayer);
        }
      },
      {
        name: 'Level Up',
        action: () => {
          const newPlayer = clonePlayer(player);
          const expNeeded = (newPlayer.level * 100) - newPlayer.experience;
          const expResult = newPlayer.gainExperience(expNeeded + 1);
          setPlayer(newPlayer);
        }
      },
      {
        name: 'Add Experience',
        action: () => {
          const newPlayer = clonePlayer(player);
          const expResult = newPlayer.gainExperience(100);
          setPlayer(newPlayer);
        }
      },
      {
        name: 'Add Stats',
        action: () => {
          const newPlayer = clonePlayer(player);
          newPlayer.attack += 5;
          newPlayer.defense += 5;
          setPlayer(newPlayer);
        }
      },
      {
        name: 'Heal',
        action: () => {
          const newPlayer = clonePlayer(player);
          newPlayer.health = newPlayer.maxHealth;
          setPlayer(newPlayer);
        }
      },
      {
        name: 'Take Damage',
        action: () => {
          const newPlayer = clonePlayer(player);
          newPlayer.takeDamage(10);
          setPlayer(newPlayer);
        }
      }
    ],
    memories: [
      {
        name: 'Add 100 Fragments',
        action: () => {
          const currentFragments = Number(memoryFragments) || 0;
          setMemoryFragments(currentFragments + 100);
        }
      },
      {
        name: 'Add 1000 Fragments',
        action: () => {
          const currentFragments = Number(memoryFragments) || 0;
          setMemoryFragments(currentFragments + 1000);
        }
      },
      {
        name: 'Unlock All Memory Upgrades',
        action: () => {
          if (!player.upgrades) player.upgrades = {};
          setPlayer({ ...player });
        }
      }
    ],
    treasures: [
      {
        name: 'Discover Random Treasure',
        action: () => {
          const firstRoom = dungeon.rooms.values().next().value;
          if (firstRoom && firstRoom.treasurePool) {
            const newTreasure = firstRoom.treasurePool.getRandomTreasure();
            if (newTreasure) {
              firstRoom.treasurePool.discoverTreasure(newTreasure.id);
              setDiscoveredTreasures(new Set([...discoveredTreasures, newTreasure]));
            }
          }
        }
      },
      {
        name: 'Discover All Treasures',
        action: () => {
          const firstRoom = dungeon.rooms.values().next().value;
          if (firstRoom && firstRoom.treasurePool) {
            firstRoom.treasurePool.allTreasures.forEach(treasure => {
              firstRoom.treasurePool.discoverTreasure(treasure.id);
            });
            setDiscoveredTreasures(
              new Set(Array.from(firstRoom.treasurePool.allTreasures.values()))
            );
          }
        }
      }
    ],
    teleport: [
      {
        name: 'Reveal & Teleport Map',
        action: () => {
          dungeon.rooms.forEach(room => {
            room.discovered = true;
            if (!room.items || room.items.length === 0) {
              room.createItemsFromFeatures();
            }
          });

          const roomsList = Array.from(dungeon.rooms.values());
          const teleportUI = document.createElement('div');
          teleportUI.className = 'teleport-grid';
          
          roomsList.forEach(room => {
            const button = document.createElement('button');
            button.className = `room-button ${room.id === dungeon.currentRoomId ? 'current' : ''}`;
            button.textContent = `Room ${room.id} (${room.roomType})`;
            button.onclick = () => {
              dungeon.currentRoomId = room.id;
              room.discovered = true;
              room.createItemsFromFeatures();
              setDungeon({ ...dungeon });
              teleportUI.remove();
            };
            teleportUI.appendChild(button);
          });

          const debugMenu = document.querySelector('.debug-menu');
          const existingTeleportUI = debugMenu.querySelector('.teleport-grid');
          if (existingTeleportUI) {
            existingTeleportUI.remove();
          }
          debugMenu.appendChild(teleportUI);
        }
      },
      {
        name: 'Quick Room Teleport',
        action: () => {
          const roomId = prompt('Enter room ID to teleport to:');
          if (roomId && dungeon.rooms.has(Number(roomId))) {
            const targetRoom = dungeon.rooms.get(Number(roomId));
            targetRoom.discovered = true;
            targetRoom.createItemsFromFeatures();
            dungeon.currentRoomId = Number(roomId);
            setDungeon({ ...dungeon });
          } else {
            alert('Invalid room ID');
          }
        }
      },
      {
        name: 'Find & Teleport to Boss',
        action: () => {
          const bossRoom = Array.from(dungeon.rooms.values()).find(room => room.roomType === 'boss');
          if (bossRoom) {
            bossRoom.discovered = true;
            bossRoom.createItemsFromFeatures();
            dungeon.currentRoomId = bossRoom.id;
            setDungeon({ ...dungeon });
          } else {
            alert('No boss room found in current dungeon');
          }
        }
      },
      {
        name: 'Teleport to Start',
        action: () => {
          const startRoom = dungeon.rooms.get(0);
          if (startRoom) {
            startRoom.discovered = true;
            dungeon.currentRoomId = 0;
            setDungeon({ ...dungeon });
          }
        }
      },
      {
        name: 'Find & Teleport to Treasure',
        action: () => {
          const treasureRoom = Array.from(dungeon.rooms.values()).find(room => room.roomType === 'treasure');
          if (treasureRoom) {
            treasureRoom.discovered = true;
            treasureRoom.createItemsFromFeatures();
            dungeon.currentRoomId = treasureRoom.id;
            setDungeon({ ...dungeon });
          } else {
            alert('No treasure room found in current dungeon');
          }
        }
      }
    ],
    dungeon: [
      {
        name: 'New Game with Seed',
        action: () => {
          const seed = prompt('Enter seed:');
          if (seed) {
            initializeGame({}, seed);
          }
        }
      },
      {
        name: 'Reveal Map',
        action: () => {
          dungeon.rooms.forEach(room => room.discovered = true);
          setDungeon({ ...dungeon });
        }
      },
      {
        name: 'Reveal All Rooms',
        action: () => {
          dungeon.rooms.forEach(room => {
            room.discovered = true;
            if (!room.items || room.items.length === 0) {
              room.createItemsFromFeatures();
            }
          });
          setDungeon({ ...dungeon });
        }
      },
      {
        name: 'Generate New Floor',
        action: () => {
          const minRooms = 15;
          const maxRooms = 30;
          const numRooms = Math.floor(Math.random() * (maxRooms - minRooms + 1)) + minRooms;
          const newDungeon = new Dungeon(50, 50, numRooms);
          
          const startingRoom = newDungeon.rooms.get(0);
          startingRoom.discovered = true;
          startingRoom.createItemsFromFeatures();
          
          setDungeon(newDungeon);
        }
      },
      {
        name: 'Add Items to Room',
        action: () => {
          const currentRoom = dungeon.rooms.get(dungeon.currentRoomId);
          if (currentRoom) {
            currentRoom.createItemsFromFeatures();
            setDungeon({ ...dungeon });
          }
        }
      }
    ],
    combat: [
      {
        name: 'Kill Player',
        action: () => {
          const newPlayer = clonePlayer(player);
          newPlayer.health = 0;
          setPlayer(newPlayer);
          handlePlayerDeath();
        }
      },
      {
        name: 'Spawn Boss',
        action: () => {
          const boss = getBossForLevel(dungeon.level || 1);
          const currentRoom = dungeon.rooms.get(dungeon.currentRoomId);
          if (currentRoom) {
            currentRoom.enemyType = boss;
            currentRoom.roomType = 'boss';
            setDungeon({ ...dungeon });
          }
        }
      },
      {
        name: 'Heal Player',
        action: () => {
          player.health = player.maxHealth;
          setPlayer({ ...player });
        }
      },
      {
        name: 'Add Combat Buffs',
        action: () => {
          player.addEffect('strength', 2, 10);
          player.addEffect('defense', 2, 10);
          setPlayer({ ...player });
        }
      }
    ],
    traps: [
      {
        name: 'Simulate Trap Death',
        action: () => {
          const newPlayer = clonePlayer(player);
          newPlayer.health = 0;
          setPlayer(newPlayer);
          handlePlayerDeath({
            cause: 'trap',
            message: 'You were killed by a deadly trap!'
          });
        }
      },
      {
        name: 'Add Trap to Room',
        action: () => {
          const currentRoom = dungeon.rooms.get(dungeon.currentRoomId);
          if (currentRoom) {
            currentRoom.trap = {
              type: 'spike',
              difficulty: 3,
              damage: 50,
              isDisarmed: false,
              description: 'A deadly spike trap'
            };
            setDungeon({ ...dungeon });
          }
        }
      },
      {
        name: 'Disarm Room Trap',
        action: () => {
          const currentRoom = dungeon.rooms.get(dungeon.currentRoomId);
          if (currentRoom && currentRoom.trap) {
            currentRoom.trap.isDisarmed = true;
            setDungeon({ ...dungeon });
          }
        }
      }
    ]
  };

  if (!isOpen) return null;

  return (
    <div 
      className="debug-menu"
      ref={menuRef}
      style={{
        left: position ? `${position.x}px` : '20%',
        top: position ? `${position.y}px` : '20%',
        transform: 'none',
        transition: isDragging ? 'none' : 'all 0.2s'
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="debug-header">
        <h2>Debug Menu</h2>
        <button onClick={onClose}>×</button>
      </div>

      <div className="debug-tabs">
        {Object.keys(debugActions).map(tab => (
          <button
            key={tab}
            className={selectedTab === tab ? 'active' : ''}
            onClick={() => setSelectedTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="debug-actions">
        {debugActions[selectedTab].map((action, index) => (
          <button key={index} onClick={action.action}>
            {action.name}
          </button>
        ))}
      </div>

      <div className="debug-info">
        <h3>Current State:</h3>
        <div className="debug-fragments">
          <div>Current Memory Fragments: {Number(memoryFragments) || 0}</div>
          <div>Raw value: {String(memoryFragments)}</div>
          <div>Type: {typeof memoryFragments}</div>
          <div>Is NaN: {isNaN(memoryFragments) ? 'true' : 'false'}</div>
          <div>Dungeon Seed: {dungeon.seed}</div>
        </div>
        <pre>
          {JSON.stringify({
            playerLevel: player.level,
            health: `${player.health}/${player.maxHealth}`,
            fragments: Number(memoryFragments) || 0,
            discoveredTreasures: discoveredTreasures.size,
            currentRoom: dungeon.currentRoomId,
            seed: dungeon.seed
          }, null, 2)}
        </pre>
      </div>
    </div>
  );
}

export default DebugMenu; 