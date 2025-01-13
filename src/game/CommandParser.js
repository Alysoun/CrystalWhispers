const VALID_COMMANDS = {
  look: ['look', 'l', 'examine', 'x'],
  take: ['take', 'get', 'grab', 't', 'g'],
  drop: ['drop', 'd'],
  inventory: ['inventory', 'i', 'inv'],
  go: ['go', 'walk', 'move'],
  save: ['save', 'savegame'],
  load: ['load', 'loadgame'],
  help: ['help', 'h', '?'],
  use: ['use', 'apply'],
  memories: ['memories', 'mem', 'm']
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
  let target = words.slice(1).join(' ');

  // Handle look/examine commands
  if (VALID_COMMANDS.look.includes(command)) {
    if (!target) {
      // If no target, treat as a look at room command
      return {
        type: 'look',
        target: null
      };
    }
    // Otherwise treat as examine command
    return {
      type: 'examine',
      target: target
    };
  }

  // Handle movement commands
  if (VALID_COMMANDS.go.includes(command)) {
    for (const [direction, aliases] of Object.entries(DIRECTIONS)) {
      if (aliases.includes(target)) {
        return { type: 'go', target: direction };
      }
    }
  }

  // Check if the first word alone is a direction
  for (const [direction, aliases] of Object.entries(DIRECTIONS)) {
    if (aliases.includes(command)) {
      return { type: 'go', target: direction };
    }
  }

  // Handle other commands
  return { type: command, target };
};

const getCommandType = (input) => {
  const command = input.toLowerCase().trim();
  
  if (command.startsWith('examine ') || command === 'examine') {
    return 'examine';
  }
  // ... other command checks
  return command;
};

const findItem = (itemName, items) => {
  return items.find(item => 
    item.name.toLowerCase() === itemName.toLowerCase() ||
    (item.aliases && item.aliases.some(alias => 
      alias.toLowerCase() === itemName.toLowerCase()
    ))
  );
};

const handleExamine = (args, gameState) => {
  const target = Array.isArray(args) ? args.join(" ").toLowerCase() : args.toLowerCase();
  
  if (target === "puzzle") {
    const currentRoom = gameState.dungeon.rooms.get(gameState.dungeon.currentRoomId);
    if (currentRoom.puzzle) {
      return `You begin examining the puzzle more closely...`;
    }
  }
  return `You don't see that here.`;
};

export { parseCommand, getCommandType, findItem, handleExamine }; 