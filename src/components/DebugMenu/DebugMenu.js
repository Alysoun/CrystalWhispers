import React, { useState } from 'react';
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

  const debugActions = {
    player: [
      {
        name: 'Max Health',
        action: () => {
          player.health = player.maxHealth;
          setPlayer({ ...player });
        }
      },
      {
        name: 'Level Up',
        action: () => {
          player.levelUp();
          setPlayer({ ...player });
        }
      },
      {
        name: 'Add Experience',
        action: () => {
          player.gainExperience(50);
          setPlayer({ ...player });
        }
      },
      {
        name: 'Add Stats',
        action: () => {
          player.strength += 5;
          player.agility += 5;
          player.vitality += 5;
          player.updateStats();
          setPlayer({ ...player });
        }
      },
      {
        name: 'Add Combat Buffs',
        action: () => {
          player.addEffect('strength', 0.5, 10);
          player.addEffect('defense', 0.5, 10);
          setPlayer({ ...player });
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
          
          // Set starting room as discovered
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
          player.health = 0;
          setPlayer({ ...player });
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
    ]
  };

  if (!isOpen) return null;

  return (
    <div className="debug-menu">
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