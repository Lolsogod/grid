import { grid, dictionary } from "./";
import { getTaskStrings, generateRealTasks } from '../stringGenerator';
import { factorial } from "../helpers";

//размер надо бы автоматом подсчитывать
export const tasks = generateRealTasks(dictionary, grid, 5000000);
export const taskStrings = getTaskStrings(tasks);