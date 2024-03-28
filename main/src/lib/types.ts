

type ProcessedTask = {
	id: number;
	host: string;
	code: string;
	args: any[];
};

type Task = {
	id: number;
	host: string;
	status: string; //потом переписать на enum
	result: any[]; 
	code?: Function;
	args: any[];
};

type Result = {
    id: number,
    status: string
    data: any
}

type Grid = string[][];