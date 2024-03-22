
import { factorial } from "./helpers";
import { wordSearch } from "./data/wordSearch";
import { Status } from "$lib/enums";

export const generateTaskString = (task: Task): string => {
    const processed: ProcessedTask = {
      id: task.id,
      code: task.code.toString(),
      args: task.args, 
    };
    return JSON.stringify(processed);
  };
  
export const getTaskStrings = (tasks: Task[]): string[] => {
    const result: string[] = [];
    tasks.forEach((task) => {
      result.push(generateTaskString(task));
    });
    return result;
  };

  

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
  
    while (end < max) {
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
  