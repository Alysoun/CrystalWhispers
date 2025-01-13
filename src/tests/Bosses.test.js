import { getBossForLevel } from '../game/bosses/GriefBosses';
import { Dungeon } from './mocks/Dungeon';

describe('Boss System', () => {
  test('Boss Generation', () => {
    const boss = getBossForLevel(1);
    expect(boss.name).toBeDefined();
    expect(boss.health).toBeGreaterThan(0);
    expect(boss.attack).toBeGreaterThan(0);
    expect(boss.defense).toBeGreaterThan(0);
  });

  test('Boss Room Creation', () => {
    const dungeon = new Dungeon(50, 50, 20);
    const currentRoom = dungeon.rooms.get(0);
    const boss = getBossForLevel(1);
    
    currentRoom.enemyType = boss;
    currentRoom.roomType = 'boss';
    
    expect(currentRoom.roomType).toBe('boss');
    expect(currentRoom.enemyType).toBe(boss);
  });
}); 