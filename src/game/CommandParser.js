const VALID_COMMANDS = {
  look: ['look', 'l', 'examine', 'x'],
  take: ['take', 'get', 'grab', 't', 'g'],
  drop: ['drop', 'd'],
  inventory: ['inventory', 'i', 'inv'],
  go: ['go', 'walk', 'move'],
  save: ['save', 'savegame'],
  load: ['load', 'loadgame'],
  help: ['help', 'h', '?']
};

const DIRECTIONS = {
  north: ['north', 'n'],
  south: ['south', 's'],
  east: ['east', 'e'],
  west: ['west', 'w']
};

const parseCommand = (input) => {
  const words = input.toLowerCase().trim().split(' ');
  const command = words[0];
  const target = words.slice(1).join(' ');

  // Handle movement commands specially
  if (VALID_COMMANDS.go.includes(command)) {
    for (const [direction, aliases] of Object.entries(DIRECTIONS)) {
      if (aliases.includes(target)) {
        return { command: 'go', target: direction };
      }
    }
  }

  // Check if the first word alone is a direction
  for (const [direction, aliases] of Object.entries(DIRECTIONS)) {
    if (aliases.includes(command)) {
      return { command: 'go', target: direction };
    }
  }

  // Handle look/examine commands
  if (VALID_COMMANDS.look.includes(command)) {
    return { command: 'look', target };
  }

  return { command, target };
};

const getCommandType = (input) => {
  // Special case for movement commands
  if (input === 'go') return 'go';

  for (const [type, aliases] of Object.entries(VALID_COMMANDS)) {
    if (aliases.includes(input)) {
      return type;
    }
  }
  return null;
};

function findItem(itemName, items) {
  return items.find(item => 
    item.name.toLowerCase() === itemName.toLowerCase() ||
    (item.aliases && item.aliases.some(alias => 
      alias.toLowerCase() === itemName.toLowerCase()
    ))
  );
}

export { parseCommand, getCommandType, findItem }; 