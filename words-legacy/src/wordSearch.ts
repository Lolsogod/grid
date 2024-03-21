import type { Grid } from "./consts/grid";

export const wordSearch = (args: [string[], Grid, number, number]) => {

  const [dictionary, grid, start, end] = args;
  const factorial = (n: number): number => {
    if (n === 0 || n === 1) {
      return 1;
    }
    return n * factorial(n - 1);
  };

  const getPermutationByRange = <T>(
    elements: T[],
    start: number,
    end: number
  ): T[][] | null => {
    const permutations = [];
    for (let i = start; i <= end; i++) {
      const permutation = getPermutationByIndex(elements, i);
      if (permutation) {
        permutations.push(permutation);
      }
    }
    return permutations;
  };

  const getPermutationByIndex = <T>(
    elements: T[],
    index: number
  ): T[] | null => {
    const n = elements.length;
    const numPermutations = factorial(n);
    if (index < 0 || index >= numPermutations) {
      return null;
    }

    const result: T[] = [];
    let available = [...elements];

    let remainingIndex = index;
    for (let i = 1; i <= n; i++) {
      const currentFactorial = factorial(n - i);
      const selectedElementIndex = Math.floor(
        remainingIndex / currentFactorial
      );
      result.push(available[selectedElementIndex]!);
      available = available.filter(
        (_, index) => index !== selectedElementIndex
      );
      remainingIndex %= currentFactorial;
    }

    return result;
  };

  const findAndMaskWord = (grid: Grid, word: string): Grid | null => {
    const findHorizontal = (word: string): [number, number] | null => {
      for (let row = 0; row < grid.length; row++) {
        const rowString = grid[row]!.join("");
        const index = rowString.indexOf(word);
        if (index !== -1) {
          return [row, index];
        }
      }
      return null;
    };

    const findVertical = (word: string): [number, number] | null => {
      for (let col = 0; col < grid[0]!.length; col++) {
        for (let row = 0; row < grid.length - word.length + 1; row++) {
          let match = true;
          for (let i = 0; i < word.length; i++) {
            if (grid[row + i]![col] !== word[i]) {
              match = false;
              break;
            }
          }
          if (match) {
            return [row, col];
          }
        }
      }
      return null;
    };

    const horizontalMatch = findHorizontal(word);
    const verticalMatch = findVertical(word);

    if (horizontalMatch) {
      const [row, index] = horizontalMatch;
      const modifiedGrid = [...grid];
      modifiedGrid[row] = [...grid[row]!];
      for (let i = 0; i < word.length; i++) {
        modifiedGrid[row]![index + i] = ".";
      }
      return modifiedGrid;
    }

    if (verticalMatch) {
      const [row, col] = verticalMatch;
      const modifiedGrid = [...grid];
      for (let i = 0; i < word.length; i++) {
        modifiedGrid[row + i] = [...grid[row + i]!];
        modifiedGrid[row + i]![col] = ".";
      }
      return modifiedGrid;
    }

    return null;
  };

  const findWordsWithoutCrossing = (
    grid: Grid,
    dictionary: string[]
  ): [Grid, string[]] => {
    let nGrid: Grid = [...grid];
    const wordsFound: string[] = [];

    dictionary.forEach((word) => {
      const masked = findAndMaskWord(nGrid, word);
      if (masked) {
        nGrid = masked;
        wordsFound.push(word);
      }
    });
    return [nGrid, wordsFound];
  };
  const coverage = (strings: string[], grid: Grid): number =>
    (strings.reduce((sum, str) => sum + str.length, 0) /
      (grid.length * grid[0]!.length)) *
    100;

  const rangedSearch = (
    dictionary: string[],
    grid: Grid,
    start: number,
    end: number
  ): [number, string[], Grid] => {
    const exampleTask = getPermutationByRange(dictionary, start, end);
    let maxCoverage = 0;
    let bestWords: string[] = [];
    let bestGrid: Grid = [];

    exampleTask?.forEach((permutation) => {
      let [foundGrid, foundWords] = findWordsWithoutCrossing(grid, permutation);
      const curCoverage = coverage(foundWords, grid);
      if (curCoverage > maxCoverage) {
        maxCoverage = curCoverage;
        bestWords = foundWords;
        bestGrid = foundGrid;
      }
    });
    return [maxCoverage, bestWords, bestGrid];
  };

  const result = rangedSearch(dictionary, grid, start, end);

  return result;
};
