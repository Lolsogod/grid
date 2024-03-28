export const wordSearch = (args: [string[], Grid, number, number]) => {
	const [dictionary, grid, start, end] = args;
	//permutations stuff
	const factorial = (n: number): number => {
		if (n === 0 || n === 1) {
			return 1;
		}
		return n * factorial(n - 1);
	};

	const getPermutationByIndex = <T>(elements: T[], index: number): T[] | null => {
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
			const selectedElementIndex = Math.floor(remainingIndex / currentFactorial);
			result.push(available[selectedElementIndex]!);
			available = available.filter((_, index) => index !== selectedElementIndex);
			remainingIndex %= currentFactorial;
		}

		return result;
	};

	//word search
	const directions = [
		[-1, 0],
		[1, 0],
		[0, -1],
		[0, 1],
		[-1, -1], // maybe remove diagonals
		[-1, 1],
		[1, -1],
		[1, 1]
	];

	const isValidPosition = (grid: Grid, row: number, col: number): boolean => {
		const rows = grid.length;
		const cols = grid[0].length;
		return row >= 0 && row < rows && col >= 0 && col < cols;
	};

	const findWordWithTurns = (grid: Grid, word: string): boolean => {
		const rows = grid.length;
		const cols = grid[0].length;

		const dfs = (row: number, col: number, index: number): boolean => {
			if (index === word.length) {
				return true;
			}

			if (!isValidPosition(grid, row, col) || grid[row][col] !== word[index]) {
				return false;
			}

			const temp = grid[row][col];
			grid[row][col] = '.';

			for (const [dx, dy] of directions) {
				if (dfs(row + dx, col + dy, index + 1)) {
					return true;
				}
			}
			grid[row][col] = temp;

			return false;
		};

		for (let i = 0; i < rows; i++) {
			for (let j = 0; j < cols; j++) {
				if (dfs(i, j, 0)) {
					return true;
				}
			}
		}

		return false;
	};
	//merge with upper
	const search = (dictionary: string[], grid: Grid): { foundGrid: Grid; foundWords: string[] } => {
		const foundGrid: Grid = grid.map((row) => [...row]);
		const foundWords: string[] = [];

		for (const word of dictionary) {
			if (findWordWithTurns(foundGrid, word)) {
				foundWords.push(word);
			}
		}

		return { foundGrid, foundWords };
	};

	//ranged search stuff

	const coverage = (strings: string[], grid: Grid): number =>
		(strings.reduce((sum, str) => sum + str.length, 0) / (grid.length * grid[0]!.length)) * 100;

	const rangedSearch = (
		dictionary: string[],
		grid: Grid,
		start: number,
		end: number
	): [number, string[], Grid] => {
		let maxCoverage = 0;
		let bestWords: string[] = [];
		let bestGrid: Grid = [];

		for (let i = start; i <= end; i++) {
			const permutation = getPermutationByIndex(dictionary, i);
			if (permutation) {
				let { foundGrid, foundWords } = search(permutation, grid);
				const curCoverage = coverage(foundWords, grid);
				if (curCoverage > maxCoverage) {
					maxCoverage = curCoverage;
					bestWords = foundWords;
					bestGrid = foundGrid;
				}
			}
		}

		return [maxCoverage, bestWords, bestGrid];
	};

	const result = rangedSearch(dictionary, grid, start, end);

	return result;
};
