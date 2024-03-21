type ProcessedTask = {
	code: string;
	args: any[];
};

type Task = {
	code: Function;
	args: any[];
};

type Grid = string[][];