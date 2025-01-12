export const PuzzleTypes = {
  MEMORY_MATCH: {
    name: 'Memory Match',
    description: 'Match the symbols in the correct order...',
    generatePuzzle: (difficulty) => {
      const symbols = ['◆', '◇', '○', '●', '□', '■', '△', '▲', '☆', '★'];
      const length = Math.min(3 + difficulty, 7);
      const sequence = [];
      
      for (let i = 0; i < length; i++) {
        sequence.push(symbols[Math.floor(Math.random() * symbols.length)]);
      }
      
      return {
        type: 'MEMORY_MATCH',
        sequence,
        solution: sequence.join(''),
        attempts: 0,
        maxAttempts: 3,
        reward: 10 + (difficulty * 5),
        checkSolution: (input) => {
          return {
            success: input === sequence.join(''),
            destroyed: false
          };
        }
      };
    }
  },

  ECHO_SEQUENCE: {
    name: 'Echo Sequence',
    description: 'Repeat the pattern of lights as they appear...',
    generatePuzzle: (difficulty) => {
      const colors = ['red', 'blue', 'green', 'yellow'];
      const length = Math.min(3 + difficulty, 8);
      const sequence = [];
      
      for (let i = 0; i < length; i++) {
        sequence.push(colors[Math.floor(Math.random() * colors.length)]);
      }
      
      return {
        sequence,
        solution: sequence.join(','),
        attempts: 0,
        maxAttempts: 3,
        reward: 15 + (difficulty * 5)
      };
    }
  },

  REFLECTION_RIDDLE: {
    name: 'Reflection Riddle',
    description: 'Arrange the mirrors to complete the pattern...',
    generatePuzzle: (difficulty) => {
      const patterns = [
        '↑↓→←',
        '↖↗↙↘',
        '⬡⬢⬣'
      ];
      
      return {
        pattern: patterns[Math.floor(Math.random() * patterns.length)],
        solution: patterns[Math.floor(Math.random() * patterns.length)],
        attempts: 0,
        maxAttempts: 4,
        reward: 20 + (difficulty * 5)
      };
    }
  }
}; 