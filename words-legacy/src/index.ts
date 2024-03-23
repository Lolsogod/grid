import { dictionary} from "./consts/dictionary";
import { Grid, grid } from "./consts/grid";
import { wordSearch } from "./wordSearch";

export const factorial = (n: number): number => {
    if (n === 0 || n === 1) {return 1;}
    return n * factorial(n - 1);
};

type ProcessedTask = {
	id: number;
	code: string;
	args: any[];
};
enum Status {
    pending = 'pending',
    sent = 'sent',
    finished = 'finished',
    }
type Task = {
	id: number;
	status: string; //потом переписать на enum
	result: any[]; 
	code: Function;
	args: any[];
};
//console.log(wordSearch([dictionary, grid, 0, 3000]))


export const  generateRealTasks = (
    dictionary: string[],
    grid: Grid,
    interval: number
  ) => {
    const tasks: Task[] = [];
    
    let id = 0
    let start = 0;
    let end = interval - 1;
  
    const max = factorial(dictionary.length);
    console.log(max)
    while (end < max) {
        console.log(id)
      const task = {
        id: id++,
        status: Status.pending,
        result: [],
        code: wordSearch,
        args: [dictionary, grid, start, end],
      };
      tasks.push(task);
      start += interval;
      end += interval;
    }
  
    if (start < max) {
      const task = {
        id: id++,
        status: Status.pending,
        result: [],
        code: wordSearch,
        args: [dictionary, grid, start, end],
      };
      tasks.push(task);
    }
  
    return tasks
  };
  
console.log(generateRealTasks(dictionary, grid, (factorial(dictionary.length))/100))