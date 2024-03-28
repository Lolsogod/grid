
export type Task = {
	id: number;
	host: string;
	status: string; //потом переписать на enum
	result: any[]; 
	code?: Function;
	args: any[];
};

type ProcessedTask = {
	id: number;
	host: string;
	code: string;
	args: any[];
};

export type Result = {
    id: number,
    status: string
    data: any
}