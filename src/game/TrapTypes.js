export const TrapTypes = {
    SPIKE: {
        name: 'Spike Trap',
        description: 'Sharp spikes protrude from the floor and walls.',
        difficulty: 3,
        damage: 25,
        methods: [
            {
                name: 'Mechanical',
                description: 'Try to jam the mechanism.',
                requiresInput: false
            },
            {
                name: 'Agility',
                description: 'Attempt to carefully disable the trigger.',
                requiresInput: false
            }
        ]
    },
    PUZZLE: {
        name: 'Puzzle Lock',
        description: 'A complex locking mechanism shows four arrow symbols that must be arranged in a clockwise pattern, starting from the top.',
        difficulty: 4,
        damage: 15,
        methods: [
            {
                name: 'Solve',
                description: 'The mechanism has four slots. Arrange the arrows (↑↓→←) in clockwise order, starting from the top.',
                requiresInput: true,
                inputHint: 'Drag the arrows into the correct positions',
                solution: '↑→↓←',
                hint: 'Think clockwise: Start at the top (↑), then right (→), then bottom (↓), then left (←)'
            }
        ]
    },
    PRESSURE: {
        name: 'Pressure Plate',
        description: 'A suspicious plate in the floor.',
        difficulty: 2,
        damage: 20,
        methods: [
            {
                name: 'Timing',
                description: 'Time your movements carefully.',
                requiresInput: false,
                type: 'timing',
                minigame: {
                    type: 'timing',
                    description: 'Click when the marker is in the green zone!'
                }
            },
            {
                name: 'Strength',
                description: 'Try to jam the plate with brute force.',
                requiresInput: false,
                type: 'strength',
                minigame: {
                    type: 'mash',
                    description: 'Rapidly click to build up enough force!'
                }
            }
        ]
    }
}; 