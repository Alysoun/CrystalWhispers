describe('Puzzle System', () => {
  test('Puzzle Generation', () => {
    Object.entries(PuzzleTypes).forEach(([type, puzzleType]) => {
      const puzzle = puzzleType.generatePuzzle(1);
      expect(puzzle.solution).toBeDefined();
      expect(puzzle.maxAttempts).toBeGreaterThan(0);
      expect(puzzle.reward).toBeGreaterThan(0);
    });
  });

  test('Puzzle Solving', () => {
    const puzzle = PuzzleTypes.MEMORY_MATCH.generatePuzzle(1);
    const correctSolution = puzzle.solution;
    
    const result = puzzle.checkSolution(correctSolution);
    expect(result.success).toBe(true);
    
    const wrongResult = puzzle.checkSolution('wrong');
    expect(wrongResult.success).toBe(false);
  });
}); 