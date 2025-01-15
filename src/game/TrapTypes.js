export const TrapTypes = {
    POISON_DART: {
        name: "Poison Dart",
        description: "Small holes line the walls",
        damage: 15,
        difficulty: 2,
        disarmMethod: "TIMING",
        fragments: 25,
        effect: (player) => {
            return {
                damage: 15,
                message: "Poisoned darts shoot from the walls!"
            };
        }
    },
    SPIKE_PIT: {
        name: "Spike Pit",
        description: "The floor looks unstable",
        damage: 20,
        difficulty: 2,
        disarmMethod: "PATTERN",
        fragments: 30,
        effect: (player) => {
            return {
                damage: 20,
                message: "The floor gives way to reveal deadly spikes!"
            };
        }
    },
    RUNE_SEAL: {
        name: "Rune Seal",
        description: "Glowing runes pulse with dangerous energy",
        damage: 25,
        difficulty: 3,
        disarmMethod: "SEQUENCE",
        fragments: 40,
        effect: (player) => {
            return {
                damage: 25,
                message: "The runes flare with destructive energy!"
            };
        }
    }
}; 