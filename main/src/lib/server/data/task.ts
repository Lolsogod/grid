import { grid, dictionary } from './';
import {  generateRealTasks, getProcessed } from '../stringGenerator';
import { factorial } from '../helpers';
import {tasks} from '../store'

//размер надо бы автоматом подсчитывать
//export let tasks = generateRealTasks(dictionary, grid, 500000);
export let processed: ProcessedTask[] = []

tasks.set(generateRealTasks(dictionary, grid, 500000))

tasks.subscribe((value) => {
	processed=getProcessed(value)
})
export let tasksResult: Result[] = []


export const reset = () => {
	tasks.set(generateRealTasks(dictionary, grid, 500000))
	//taskStrings = getTaskStrings(tasks);
};
