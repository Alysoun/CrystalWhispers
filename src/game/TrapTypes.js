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
        description: 'A complex locking mechanism blocks the way.',
        difficulty: 4,
        damage: 15,
        methods: [
            {
                name: 'Solve',
                description: 'Try to solve the puzzle.',
                requiresInput: true,
                inputHint: 'Enter the solution...'
            }
        ]
    }
}; 