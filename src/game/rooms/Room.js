import { TreasurePool } from '../treasures/TreasurePool';
import { PuzzlePool } from '../puzzles/PuzzlePool';
import { getBossForLevel } from '../bosses/GriefBosses';
import { TrapRoom } from './TrapRoom';
import { TrapTypes } from '../TrapTypes';
import { DenialBoss } from '../bosses/DenialBoss';

export class Room {
    constructor(id, x, y, width, height, theme, dungeon) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.theme = theme;
        this.dungeon = dungeon;
        
        // Basic properties
        this.discovered = false;
        this.contentGenerated = false;
        this.knownExit = false;
        this.cleared = false;
        
        // Collections
        this.connections = new Map();
        this.items = [];
        this.features = [];
        this.featureItems = new Map();
        this.loot = [];
        
        // Combat related
        this.enemy = null;
        this.enemyState = null;
        this.enemyAware = false;
        this.playerAware = false;
        this.enteredFrom = null;
        
        // Trap related
        this.trap = null;
        this.firstExamine = true;
        
        // Description elements
        this.baseDescription = this.generateBaseDescription();
        this.description = this.baseDescription;
        this.roomSize = theme.getRandomSize();
        this.roomAtmosphere = theme.getRandomAtmosphere();
        this.roomAmbience = theme.getRandomAmbience();
        this.roomFeatures = theme.getRandomFeatures(3);
        
        // Initialize pools
        this.treasurePool = new TreasurePool();
        this.puzzlePool = new PuzzlePool();
    }

    generateBaseDescription() {
        const size = this.theme.getRandomSize();
        const atmosphere = this.theme.getRandomAtmosphere();
        const ambience = this.theme.getRandomAmbience();
        
        return `You're in a ${size} ${atmosphere} chamber. ${ambience || ''}`.trim();
    }

    generateContent() {
        if (!this.contentGenerated) {
            const roll = Math.random();
            
            if (this.roomType === 'boss') {
                this.generateCombatContent();
            } else if (roll < 0.15) { // 15% chance for trap room
                this.roomType = 'trap';
                this.generateTrap();
                this.setupTrap();
            } else if (roll < 0.25) {
                this.roomType = 'treasure';
                this.treasure = this.generateTreasure();
                this.description += '\n\nSomething valuable catches your eye...';
            } else if (roll < 0.35) {
                this.roomType = 'puzzle';
                this.generatePuzzle();
            } else {
                this.roomType = 'combat';
                this.generateCombatContent(); // Generate combat content for normal combat rooms
            }
            
            this.contentGenerated = true;
        }
    }

    setupTrap() {
        if (!this.trap) {
            this.generateTrap();
        }
        if (this.trap) { // Only update if trap exists
            this.description = this.trap.type.description || 'A dangerous trap lies in wait.';
            if (this.trap.type.name) {
                this.features.push(this.trap.type.name);
            }
            console.log('Trap setup complete:', this.trap); // Debug log
        }
    }

    generateEnemy() {
        // Basic enemy types for now
        const enemies = [
            {
                name: 'Shadow Remnant',
                health: 30,
                maxHealth: 30,
                attack: 5,
                defense: 2,
                experience: 20
            },
            {
                name: 'Memory Fragment',
                health: 20,
                maxHealth: 20,
                attack: 8,
                defense: 1,
                experience: 15
            },
            {
                name: 'Forgotten Echo',
                health: 40,
                maxHealth: 40,
                attack: 4,
                defense: 3,
                experience: 25
            }
        ];

        const index = Math.floor(this.dungeon.random() * enemies.length);
        return { ...enemies[index] };  // Return a copy of the enemy
    }

    generateBossEnemy() {
        if (this.roomType === 'boss') {
            return DenialBoss.spawn();
        }
        return null;
    }

    getFullDescription() {
        const lines = [];
        lines.push(this.description);

        // Add trap-specific description
        if (this.trap && !this.trap.isDisarmed) {
            lines.push('\nThe trap is still active! You can try to disarm it.');
        }

        // Add special message if valuable
        if (this.hasValuableItems()) {
            lines.push("\nSomething valuable catches your eye...");
        }
        
        // Add items section if there are items
        if (this.items && this.items.length > 0) {
            lines.push("\nIn this room:");
            // Only add items that still exist in the room
            const visibleItems = this.items.filter(item => item !== null);
            if (visibleItems.length > 0) {
                visibleItems.forEach(item => {
                    // Create description with tagged item name
                    const itemDesc = item.description.replace(
                        new RegExp(`\\b${item.name}\\b`, 'gi'),
                        `<item>${item.name}</item>`
                    );
                    lines.push(`  - ${itemDesc}`);
                });
            }
        }
        
        // Add puzzle hint if present
        if (this.puzzle && !this.puzzle.solved && !this.puzzle.destroyed) {
            lines.push("\nThere seems to be a puzzle here. Type \"examine puzzle\" to investigate it more closely.");
        }
        
        // Add exits section
        if (this.connections.size > 0) {
            lines.push("\nExits:");
            this.connections.forEach(connection => {
                lines.push(`  - ${connection.direction}: ${connection.state}`);
            });
        }
        
        return lines.join('\n');
    }

    discover() {
        if (!this.discovered) {
            this.discovered = true;
            
            // Generate room content if not already generated
            if (!this.contentGenerated) {
                this.generateContent();
                this.contentGenerated = true;
            }

            // Mark connected rooms as having known exits
            this.connections.forEach(({ room: connectedRoom }) => {
                connectedRoom.knownExit = true;
            });
        }
    }

    partiallyDiscover() {
        // Just mark that we know this is an exit
        this.knownExit = true;
    }

    createItemsFromFeatures() {
        if (!this.roomFeatures) return;

        // Clear existing items and featureItems
        this.items = [];
        this.featureItems = new Map();

        this.roomFeatures.forEach(feature => {
            // Extract the basic item type from the feature text
            const itemTypes = {
                'mirror that only shows': 'mirror',
                'table perpetually set': 'table',
                'clock whose hands': 'clock',
                'window that always shows': 'window',
                'portraits where everyone': 'portraits',
                'flowers that never': 'flowers',
                'music box playing': 'music box',
                'rocking chair gently': 'rocking chair',
                'child\'s toy that winds': 'toy',
                'bookshelf where': 'bookshelf',
                'fireplace with eternal': 'fireplace',
                'chess game frozen': 'chess game',
                'chess set mid-game': 'chess set',
                'tea set that stays': 'tea set',
                'crystal chandelier casting': 'chandelier',
                'piano that plays': 'piano',
                'tapestry showing scenes': 'tapestry',
                'fountain whose water': 'fountain',
                'kaleidoscope showing': 'kaleidoscope',
                'snow globe containing': 'snow globe',
                'hourglass where sand': 'hourglass',
                'sundial casting shadows': 'sundial'
            };
            
            // Find matching item type
            const itemType = Object.entries(itemTypes)
                .find(([key, _]) => feature.toLowerCase().includes(key.toLowerCase()));
            
            if (itemType) {
                const [_, type] = itemType;
                const definition = this.theme.currentTheme.featureItems[type] || {
                    name: type,
                    description: feature,
                    canTake: false
                };
                
                const item = {
                    ...definition,
                    id: type,
                    feature: feature
                };

                // Add to both collections
                this.items.push(item);
                this.featureItems.set(type, item);  // Use type as key
                
                console.log(`Added item to featureItems:`, type, item);
            }
        });
    }

    getExits() {
        const exits = {};
        this.connections.forEach((connection, roomId) => {
            exits[connection.direction] = connection.state || 'open';
        });
        return exits;
    }

    connectTo(room, direction) {
        // Only allow connections if rooms are adjacent
        const ROOM_SPACING = this.width + 2; // Same spacing as used in generation
        const dx = room.x - this.x;
        const dy = room.y - this.y;
        
        const isAdjacent = (
            (direction === 'east' && dx === ROOM_SPACING && Math.abs(dy) < 1) ||
            (direction === 'west' && dx === -ROOM_SPACING && Math.abs(dy) < 1) ||
            (direction === 'south' && dy === ROOM_SPACING && Math.abs(dx) < 1) ||
            (direction === 'north' && dy === -ROOM_SPACING && Math.abs(dx) < 1)
        );

        if (isAdjacent) {
            this.connections.set(room.id, {
                room: room,
                direction: direction,
                state: 'open'
            });
        }
    }

    getCenter() {
        return {
            x: this.x + Math.floor(this.width / 2),
            y: this.y + Math.floor(this.height / 2)
        };
    }

    generateTreasure() {
        // Rarity chances
        const roll = Math.random();
        let rarity;
        if (roll < 0.60) rarity = 'common';
        else if (roll < 0.85) rarity = 'uncommon';
        else if (roll < 0.95) rarity = 'rare';
        else rarity = 'legendary';

        return this.treasurePool.getRandomTreasure(rarity);
    }

    generatePuzzle() {
        const difficulty = Math.min(5, Math.ceil(this.theme.level / 2));
        this.puzzle = this.puzzlePool.getRandomPuzzle(difficulty);
        
        if (this.puzzle) {
            // Add a subtle hint about the puzzle to the room's description
            this.description += '\n\nSomething about this room feels particularly enigmatic...';
            
            // Add puzzle-specific features that hint at interaction
            const puzzleFeature = this.puzzle.getFeature();
            if (puzzleFeature) {
                this.roomFeatures = this.roomFeatures.filter(f => !f.includes('puzzle'));
                this.roomFeatures.push(puzzleFeature);
            }
        }
    }

    generateNormalContent() {
        // Add random event to normal rooms occasionally
        if (Math.random() < 0.3) {
            const event = this.theme.getRandomEvent();
            if (event) {
                this.description += `\n\n${event}`;
            }
        }
    }

    examinePuzzle() {
        if (this.puzzle && !this.puzzle.solved) {
            return {
                type: 'puzzle',
                content: this.puzzle.getDescription(),
                puzzle: this.puzzle
            };
        } else if (this.puzzle && this.puzzle.solved) {
            return {
                type: 'message',
                content: 'You\'ve already solved this puzzle.'
            };
        }
        return {
            type: 'message',
            content: 'There\'s no puzzle to examine here.'
        };
    }

    removeItem(itemToRemove) {
        console.log('removeItem called with:', itemToRemove);
        console.log('Current items before removal:', this.items);

        if (!this.items) {
            this.items = [];
            return false;
        }

        const index = this.items.findIndex(item => 
            item.name === itemToRemove.name || 
            (item.aliases && item.aliases.includes(itemToRemove.name))
        );

        console.log('Found item at index:', index);

        if (index !== -1) {
            const item = this.items[index];
            
            // Check if item can be taken
            if (!item.canTake) {
                return {
                    success: false,
                    message: `The ${item.name} cannot be taken.`,
                    fragments: 0
                };
            }

            // Create new items array
            const newItems = [...this.items];
            newItems.splice(index, 1);
            this.items = newItems;
            
            // Remove from features list if it exists there
            if (item.feature) {
                this.features = this.features.filter(feature => 
                    !feature.toLowerCase().includes(item.name.toLowerCase())
                );
            }
            
            // Update the room description
            this.updateDescription();
            
            console.log('Items after removal:', this.items);
            
            const result = {
                success: true,
                message: '',
                fragments: 0
            };
            
            if (item.onTake) {
                result.fragments = item.onTake.fragments;
                result.message = [
                    item.onTake.message,
                    `The ${item.name} dissolves into ${item.onTake.fragments} memory fragments as you grasp it...`
                ].join('\n');
            }

            return result;
        }
        
        return { success: false, message: "You can't take that.", fragments: 0 };
    }

    handleCombatEnd(result) {
        if (result.victory) {
            this.cleared = true;
            this.enemyState = null;
        } else if (result.fled) {
            this.enemyState = {
                ...this.enemy,
                health: this.enemy.health
            };
        }
        this.enemy = null;
    }

    examineItem(itemName) {
        console.log('Examining item:', itemName);
        console.log('First examine flag:', this.firstExamine);
        console.log('Current featureItems:', this.featureItems);
        
        // Try to match item name or alias
        const itemKey = Array.from(this.featureItems.keys()).find(key => {
            const item = this.featureItems.get(key);
            return item.name.toLowerCase() === itemName.toLowerCase() ||
                   (item.aliases && item.aliases.includes(itemName.toLowerCase()));
        });
        
        console.log('Found item key:', itemKey);
        
        if (itemKey) {
            const item = this.featureItems.get(itemKey);
            console.log('Found item:', item);
            
            const result = {
                message: item.examine || `You examine the ${item.name}.`
            };

            if (item.onExamine) {
                console.log('Item has onExamine:', item.onExamine);
                const roll = this.firstExamine ? 0 : this.dungeon.random();
                console.log('Roll value:', roll, 'Chance needed:', item.onExamine.chance);
                this.firstExamine = false;
                
                if (roll < item.onExamine.chance) {
                    const fragments = item.onExamine.fragments;
                    result.fragments = fragments.min + Math.floor(this.dungeon.random() * (fragments.max - fragments.min + 1));
                    result.message = item.onExamine.message;
                    console.log('Fragments gained:', result.fragments);
                }
            }

            console.log('Examine result:', result);
            return result;
        }

        // Then check regular items
        const item = this.items.find(i => 
            i.name.toLowerCase() === itemName.toLowerCase() ||
            (i.aliases && i.aliases.includes(itemName.toLowerCase()))
        );

        if (item) {
            return {
                message: item.examine || `You examine the ${item.name}.`
            };
        }

        return {
            message: `There is no ${itemName} to examine.`
        };
    }

    hasValuableItems() {
        return this.items && this.items.some(item => 
            item && (
                item.canTake || 
                (item.onTake && item.onTake.fragments) || 
                (item.onExamine && item.onExamine.fragments)
            )
        );
    }

    recordEntry(direction) {
        if (!this.enemyAware && this.enemy) {
            if (!this.enteredFrom) {
                this.enteredFrom = direction;
                // 70% chance player notices enemy first
                this.playerAware = this.dungeon.random() < 0.7;
            }
        }
    }

    canSneakPast(exitDirection) {
        if (!this.enemy || this.cleared) return true;
        if (this.enemyAware) return false;
        
        // Can sneak out the way we came in
        const opposites = {
            'north': 'south',
            'south': 'north',
            'east': 'west',
            'west': 'east'
        };
        return opposites[exitDirection] === this.enteredFrom;
    }

    getAmbushState() {
        if (!this.enemy) return null;
        
        if (this.playerAware && !this.enemyAware) {
            return 'player'; // Player gets advantage
        } else if (!this.playerAware && this.enemyAware) {
            return 'enemy';  // Enemy gets advantage
        }
        return 'none';     // No advantage
    }

    attemptDisarmTrap(method, result, player) {
        if (!this.trap) {
            return { success: false, message: 'There is no trap to disarm here.' };
        }

        // Handle timing and strength minigames
        if (result === 'success') {
            this.trap.isDisarmed = true;
            return {
                success: true,
                message: "You successfully disarm the trap!",
                fragments: Math.floor(Math.random() * 20) + 20 // 20-40 fragments for perfect timing/strength
            };
        } else if (result === 'failure') {
            return {
                success: false,
                message: "You failed to disarm the trap!",
                damage: Math.floor(this.trap.type.damage / 2)
            };
        }

        // Handle puzzle solution
        if (typeof result === 'string' && this.trap.type.methods[0].solution === result) {
            this.trap.isDisarmed = true;
            return {
                success: true,
                message: "The mechanism clicks into place! You've solved the puzzle!",
                fragments: Math.floor(Math.random() * 20) + 20
            };
        }

        // Base success chance for other methods
        let successChance = 0.5;
        const safePassageLevel = player?.upgrades?.explorer?.safePassage || 0;
        successChance += safePassageLevel * 0.15;

        const roll = Math.random();
        if (roll < successChance) {
            this.trap.isDisarmed = true;
            return {
                success: true,
                message: "You successfully disarm the trap!",
                fragments: Math.floor(Math.random() * 20) + 10
            };
        }

        return {
            success: false,
            message: "You fail to disarm the trap!",
            damage: Math.floor(this.trap.type.damage / 2)
        };
    }

    generateCombatContent() {
        if (this.roomType === 'combat') {
            // Generate enemy
            this.enemy = this.generateEnemy();
            
            // Add combat-related description
            const enemyDescriptions = [
                `A ${this.enemy.name.toLowerCase()} lurks in the shadows.`,
                `You sense the presence of a ${this.enemy.name.toLowerCase()}.`,
                `A ${this.enemy.name.toLowerCase()} blocks your path.`
            ];
            
            const randomDescription = enemyDescriptions[Math.floor(Math.random() * enemyDescriptions.length)];
            this.description += `\n\n${randomDescription}`;
            
            // Add enemy name to features for examination
            this.features.push(this.enemy.name);
            
            console.log('Generated enemy:', this.enemy); // Debug log
        } else if (this.roomType === 'boss') {
            this.enemy = this.generateBossEnemy();
            if (this.enemy) {
                this.description = this.enemy.roomDescription?.base || 'A powerful presence fills this room.';
                this.features = this.enemy.roomDescription?.features || [];
            }
        }
    }

    removeFeatureItem(itemName) {
        // Remove the item from featureItems
        this.featureItems.delete(itemName);
        
        // Update the room's features list to remove the corresponding feature
        this.features = this.features.filter(feature => {
            // Check if this feature corresponds to the taken item
            const featureText = feature.toLowerCase();
            return !featureText.includes(itemName.toLowerCase());
        });

        // Update the room description
        this.updateDescription();
    }

    updateDescription() {
        // Start with the original base description
        let description = this.baseDescription;
        
        // Add remaining items to description
        if (this.items && this.items.length > 0) {
            description += '\n\nIn this room:';
            this.items.forEach(item => {
                if (item.description) {
                    description += `\n- ${item.description}`;
                }
            });
        }

        // Add remaining features
        if (this.features && this.features.length > 0) {
            if (!description.includes('In this room:')) {
                description += '\n\nIn this room:';
            }
            this.features.forEach(feature => {
                description += `\n- ${feature}`;
            });
        }

        // Add any additional state descriptions
        if (this.enemy) {
            description += '\n\nThere is a hostile presence here...';
        }
        if (this.trap && !this.trap.isDisarmed) {
            description += '\n\nA trap lies in wait...';
        }

        this.description = description;
    }

    takeItem(itemName) {
        if (!itemName) {
            return {
                success: false,
                message: "What do you want to take?"
            };
        }

        // First check feature items
        if (this.featureItems && this.featureItems.size > 0) {
            const itemKey = Array.from(this.featureItems.keys()).find(key => {
                const item = this.featureItems.get(key);
                return item.name.toLowerCase() === itemName.toLowerCase() ||
                       (item.aliases && item.aliases.includes(itemName.toLowerCase()));
            });

            if (itemKey) {
                const item = this.featureItems.get(itemKey);
                if (!item.canTake) {
                    return { success: false, message: `You cannot take the ${item.name}.` };
                }
                
                // Remove from both collections
                this.featureItems.delete(itemKey);
                this.items = this.items.filter(i => i.name !== item.name);
                
                // Update room features and description
                this.roomFeatures = this.roomFeatures.filter(f => !f.toLowerCase().includes(item.name.toLowerCase()));
                this.updateDescription();
                
                const result = {
                    success: true,
                    item: item,
                    message: item.onTake?.message || `You take the ${item.name}.`,
                    fragments: item.onTake?.fragments || 0,
                    description: this.getFullDescription()
                };
                
                return result;
            }
        }

        // Then check regular items
        if (this.items && this.items.length > 0) {
            const itemIndex = this.items.findIndex(i => 
                (i && i.name && i.name.toLowerCase() === itemName.toLowerCase()) ||
                (i && i.aliases && i.aliases.includes(itemName.toLowerCase()))
            );

            if (itemIndex >= 0) {
                const item = this.items[itemIndex];
                if (!item.canTake) {
                    return { success: false, message: `You cannot take the ${item.name}.` };
                }
                this.items.splice(itemIndex, 1);
                this.updateDescription();
                
                return {
                    success: true,
                    item: item,
                    message: item.onTake?.message || `You take the ${item.name}.`,
                    fragments: item.onTake?.fragments || 0,
                    description: this.getFullDescription()
                };
            }
        }

        return { success: false, message: "You can't take that.", fragments: 0 };
    }

    handleTrapTrigger() {
        if (!this.trap) {
            return {
                triggered: false,
                message: null
            };
        }

        // Ensure trap has proper type reference
        if (typeof this.trap.type === 'string') {
            this.trap.type = TrapTypes[this.trap.type.toUpperCase()];
        }

        if (!this.trap.type) {
            console.error('Invalid trap type:', this.trap);
            return {
                triggered: false,
                message: 'Error: Invalid trap type'
            };
        }

        return {
            triggered: true,
            message: `You notice ${this.trap.type.description}`,
            requiresDisarm: true
        };
    }

    generateLoot() {
        if (!this.loot || this.loot.length === 0) return;

        const treasureMagnetLevel = this.dungeon?.player?.upgrades?.explorer?.treasureMagnet || 0;
        const fragmentBonus = 1 + (treasureMagnetLevel * 0.2); // 20% more per level

        this.loot = this.loot.map(item => {
            if (item.fragments) {
                return {
                    ...item,
                    fragments: Math.floor(item.fragments * fragmentBonus)
                };
            }
            return item;
        });
    }

    generateTrap() {
        if (this.roomType === 'trap') {
            const trapTypes = Object.values(TrapTypes);
            const selectedTrap = trapTypes[Math.floor(Math.random() * trapTypes.length)];
            console.log('Selected trap type:', selectedTrap); // Debug log
            this.trap = {
                type: selectedTrap,
                isDisarmed: false,
                attempts: 0
            };
        }
    }

    setupBossRoom() {
        if (this.cleared) return; // Don't reset a cleared boss room

        this.roomType = 'boss';
        this.contentGenerated = true;
        this.isBossRoom = true;
        
        // Get the boss with appropriate phase based on game completions
        const boss = DenialBoss.spawn();
        
        // Set up the boss enemy with all properties
        this.enemy = {
            ...boss,
            health: boss.maxHealth,
            maxHealth: boss.maxHealth,
            attack: boss.attack,
            name: boss.name,
            isBoss: true,
            abilities: boss.abilities,
            dialogue: boss.dialogue,
            phase: boss.phase,
            appearance: boss.appearance
        };

        // Set boss room description and features from boss config
        this.description = boss.roomDescription.base;
        this.features = boss.roomDescription.features;
        
        // Ensure the room is ready for combat
        this.enemyAware = true;  // Boss is always aware
        this.playerAware = true; // Player is always aware of boss
        this.trap = null;        // Ensure no traps in boss room
    }

    // Update enter method to handle boss rooms properly
    enter(fromDirection) {
        if (this.roomType === 'boss' && !this.cleared && !this.enemy) {
            this.setupBossRoom();
        }
        
        // Rest of enter logic...
        this.lastEntryDirection = fromDirection;
        if (!this.discovered) {
            this.discover();
        }
    }

    // Add method to spring trap (called after failed/skipped disarm)
    springTrap() {
        if (!this.trap?.type) return null;

        const damage = this.trap.type.damage;
        // Remove the trap after it springs
        const message = this.trap.type.description;
        this.trap = null;  // Remove trap after springing

        return {
            triggered: true,
            message: `${message} The trap springs!`,
            damage
        };
    }
}
  