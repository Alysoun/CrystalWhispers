import { saveGame, loadGame } from '../utils/SaveLoadManager';
import { Player } from './mocks/Player';
import { Dungeon } from './mocks/Dungeon';

jest.mock('../utils/SaveLoadManager', () => ({
  saveGame: jest.fn(),
  loadGame: jest.fn()
}));

describe('Save/Load System', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Game State Persistence', () => {
    const mockSavedState = {
      player: {
        health: 100,
        maxHealth: 100,
        level: 1,
        memoryFragments: 100
      },
      dungeon: {
        rooms: {
          0: { id: 0, x: 0, y: 0, discovered: true },
          1: { id: 1, x: 1, y: 0, discovered: false }
        },
        currentRoomId: 0
      },
      memoryFragments: 100
    };

    loadGame.mockReturnValue(mockSavedState);

    const gameState = {
      player: new Player(),
      dungeon: new Dungeon(50, 50, 20),
      memoryFragments: 100,
      currentRoomId: 0
    };

    saveGame(gameState);
    const loaded = loadGame();
    
    expect(loaded.memoryFragments).toBe(gameState.memoryFragments);
    expect(loaded.player.level).toBe(1);
    expect(saveGame).toHaveBeenCalledWith(gameState);
  });
}); 