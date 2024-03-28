

type ProcessedTask = {
	parentId: number,
	id: number;
	code: string;
	args: any[];
};

type Task = {
	parentId: number,
	id: number;
	status: string; //потом переписать на enum
	result: any[]; 
	code?: Function;
	args: any[];
};

type Result = {
	parentId: number,
    id: number,
    status: string
    data: any
}

type Grid = string[][];