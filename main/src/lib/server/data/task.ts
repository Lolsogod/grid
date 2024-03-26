import { grid, dictionary } from './';
import { getTaskStrings, generateRealTasks } from '../stringGenerator';
import { factorial } from '../helpers';

//размер надо бы автоматом подсчитывать
export let tasks = generateRealTasks(dictionary, grid, 5000000);
export let taskStrings = getTaskStrings(tasks);

export const reset = () => {
	tasks = generateRealTasks(dictionary, grid, 5000000);
	taskStrings = getTaskStrings(tasks);
};
