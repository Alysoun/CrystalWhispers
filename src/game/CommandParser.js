const VALID_COMMANDS = {
  look: ['look', 'l', 'examine', 'x'],
  take: ['take', 'get', 'grab', 't', 'g'],
  drop: ['drop', 'd'],
  inventory: ['inventory', 'i', 'inv'],
  go: ['go', 'walk', 'move'],
  save: ['save', 'savegame'],
  load: ['load', 'loadgame'],
  help: ['help', 'h', '?'],
  use: ['use', 'apply']
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
    // Special case for puzzles
    if (target === 'puzzle') {
      return {
        command: 'examine',
        target: 'puzzle'
      };
    } else {
      return { command: 'look', target };
    }
  }

  if (input.match(/^solve puzzle (.+)$/i)) {
    return {
      command: 'solve',
      target: 'puzzle',
      answer: input.match(/^solve puzzle (.+)$/i)[1]
    };
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

const handleExamine = (args, gameState) => {
  const target = Array.isArray(args) ? args.join(" ").toLowerCase() : args.toLowerCase();
  
  if (target === "puzzle") {
    const currentRoom = gameState.dungeon.rooms.get(gameState.dungeon.currentRoomId);
    if (currentRoom.puzzle) {
      // Trigger puzzle UI
      gameState.setPuzzleActive(currentRoom.puzzle);
      return `You begin examining the puzzle more closely...`;
    } else {
      return `There is no puzzle here to examine.`;
    }
  }
  
  return `You don't see that here.`;
};

export { parseCommand, getCommandType, findItem, handleExamine }; 