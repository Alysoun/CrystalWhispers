import { Room } from './mocks/Room';

describe('Room Features', () => {
  test('Feature Examination', () => {
    const room = new Room(0, 0, 0);
    room.features = ['A mirror that shows only happy memories'];
    
    const result = room.examineFeature('mirror');
    expect(result.description).toBeDefined();
    expect(result.fragments).toBeGreaterThanOrEqual(0);
  });
}); 