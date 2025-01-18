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
  memories: ['memories', 'mem', 'm'],
  achievements: ['achievements', 'a']
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

  // Find the canonical command type from aliases
  const commandType = Object.entries(VALID_COMMANDS).find(([_, aliases]) => 
    aliases.includes(command)
  )?.[0] || command;

  // Handle look/examine commands
  if (VALID_COMMANDS.look.includes(command)) {
    if (!target) {
      return {
        type: 'look',
        target: null
      };
    }
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
  return { type: commandType, target };
};

const getCommandType = (input) => {
  const words = input.toLowerCase().trim().split(' ');
  const command = words[0];

  // Find the canonical command type from aliases
  const commandType = Object.entries(VALID_COMMANDS).find(([_, aliases]) => 
    aliases.includes(command)
  )?.[0];

  return commandType || command;
};

const findItem = (itemName, items) => {
  if (!itemName || !items) return null;
  
  return items.find(item => 
    item.name.toLowerCase() === itemName.toLowerCase() ||
    (item.aliases && item.aliases.some(alias => 
      alias.toLowerCase() === itemName.toLowerCase()
    ))
  );
};

const handleExamine = (args, gameState) => {
  if (!args || !gameState) return "There's nothing to examine.";
  
  const target = Array.isArray(args) ? args.join(" ").toLowerCase() : args.toLowerCase();
  
  if (target === "puzzle") {
    const currentRoom = gameState.dungeon.rooms.get(gameState.dungeon.currentRoomId);
    if (currentRoom?.puzzle) {
      return {
        type: 'puzzle',
        puzzle: currentRoom.puzzle,
        message: 'You begin examining the puzzle more closely...'
      };
    }
    return "There is no puzzle here.";
  }
  return `You don't see that here.`;
};

export { parseCommand, getCommandType, findItem, handleExamine }; 