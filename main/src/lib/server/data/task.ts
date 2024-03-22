import { grid, dictionary } from "./";
import { getTaskStrings, generateRealTasks } from '../stringGenerator';

//размер надо бы автоматом подсчитывать
export const tasks = generateRealTasks(dictionary, grid, 4000);
export const taskStrings = getTaskStrings(tasks);