
import { factorial } from "./helpers";
import { wordSearch } from "./data/wordSearch";
import { Status } from "$lib/enums";


export const generateProcessedTask = (task: Task): ProcessedTask => {
    const processed: ProcessedTask = {
      parentId: task.parentId,
      id: task.id,
      code: task.code!.toString(),
      args: task.args, 
    };
    return processed;
  };
  
export const getProcessed = (tasks: Task[]): ProcessedTask[] => {
  const result: ProcessedTask[] = [];
  tasks.forEach((task) => {
    result.push(generateProcessedTask(task));
  })
  return result
}
export const  generateRealTasks = (
    dictionary: string[],
    grid: Grid,
    interval: number
  ) => {
    const tasks: Task[] = [];
    
    const parentId = Math.floor(Math.random() * 1000);
    let id = 0
    let start = 0;
    let end = interval - 1;
  
    const max = factorial(dictionary.length);
  
    while (end < max) {
      const task = {
        parentId,
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
        parentId,
        id: id++,
        status: Status.pending,
        result: [],
        code: wordSearch,
        args: [dictionary, grid, start, end],
      };
      tasks.push(task);
    }
    console.log('total tasks - ', tasks.length.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))
    console.log('task size   - ', (tasks[0].args[3]-tasks[0].args[2]).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))
    return tasks
  };
  