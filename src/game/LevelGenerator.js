const generateSimpleRoom = () => {
  return {
    description: "You're in a dimly lit room. The stone walls are covered in moss.",
    items: [
      { id: 'note', name: 'dusty note', canTake: true, important: true, description: 'The note appears to be very old.' },
      { id: 'key', name: 'rusty key', canTake: true, important: true, description: 'A weathered key that might still work.' }
    ],
    exits: {
      north: 'locked',
      east: 'open',
      south: 'open',
      west: 'blocked'
    }
  };
};

export { generateSimpleRoom }; 