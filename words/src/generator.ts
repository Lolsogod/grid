//снести это всё
const rows = 5;
const cols = 5;

const wordGrid: string[][] = Array.from({ length: rows }, () =>
  Array.from({ length: cols }, () =>
    String.fromCharCode(Math.floor(Math.random() * 26) + 65)
  )
);

const hideWordHorizontally = (grid: string[][], word: string): void => {
  const startRow = Math.floor(Math.random() * rows);
  const startCol = Math.floor(Math.random() * (cols - word.length + 1));

  for (let i = 0; i < word.length; i++) {
    grid[startRow]![startCol + i] = word[i]!;
  }
};

const dictionary = ["WORD", "FIND", "GAME"];

dictionary.forEach(word => {
    hideWordHorizontally(wordGrid, word);
  })
  