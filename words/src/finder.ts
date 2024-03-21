
import { type Grid } from "./consts/grid";
export const findWords = (grid: Grid, dictionary: string[]): string[] => {
    const wordsFound: string[] = [];

    const findHorizontal = (word: string): boolean =>
        grid.some(row => row.join('').includes(word));

    const findVertical = (word: string): boolean =>
        grid[0]!.some((_, col) =>
            grid.map(row => row[col]).join('').includes(word)
        );

    dictionary.forEach(word => {
        if (findHorizontal(word) || findVertical(word)) {
            wordsFound.push(word);
        }
    });

    return wordsFound;
};

// мб рекурсию сюда
export const findWordsWithoutCrossing = (grid: Grid, dictionary: string[]): [Grid, string[]] => {
    let nGrid: Grid = [...grid];
    const wordsFound: string[] = [];

    dictionary.forEach(word => {
        const masked = findAndMaskWord(nGrid, word);
        if (masked) {
            nGrid = masked;
            wordsFound.push(word);
        }

    })
    return [nGrid, wordsFound]
}

export const findAndMaskWord = (grid: Grid, word: string): Grid | null => {
    const findHorizontal = (word: string): [number, number] | null => {
        for (let row = 0; row < grid.length; row++) {
            const rowString = grid[row]!.join('');
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
            modifiedGrid[row]![index + i] = '.';
        }
        return modifiedGrid;
    }
    
    if (verticalMatch) {
        const [row, col] = verticalMatch;
        const modifiedGrid = [...grid];
        for (let i = 0; i < word.length; i++) {
            modifiedGrid[row + i] = [...grid[row + i]!];
            modifiedGrid[row + i]![col] = '.';
        }
        return modifiedGrid;
    }

    return null; 
};