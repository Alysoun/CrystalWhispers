import { parseCommand } from '../game/CommandParser';

describe('Command System', () => {
  test('Basic Commands', () => {
    expect(parseCommand('look')).toEqual({ command: 'look', target: '' });
    expect(parseCommand('go north')).toEqual({ command: 'go', target: 'north' });
    expect(parseCommand('take book')).toEqual({ command: 'take', target: 'book' });
    expect(parseCommand('look mirror')).toEqual({ command: 'look', target: 'mirror' });
  });
}); 