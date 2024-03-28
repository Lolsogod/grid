
export type Task = {
	id: number;
	status: string; //потом переписать на enum
	result: any[]; 
	code?: Function;
	args: any[];
};

export type ProcessedTask = {
	id: number;
	code: string;
	args: any[];
};

export type Result = {
    id: number,
    status: string
    data: any
}

export type inProgress={
	date: Date,
	task: ProcessedTask
}