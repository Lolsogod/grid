import { grid, dictionary } from './';
import { getTaskStrings, generateRealTasks } from '../stringGenerator';
import { factorial } from '../helpers';
import {tasks} from '../store'

//размер надо бы автоматом подсчитывать
//export let tasks = generateRealTasks(dictionary, grid, 500000);
export let taskStrings: string[] = []

tasks.set(generateRealTasks(dictionary, grid, 500000))

tasks.subscribe((value) => {
	taskStrings=getTaskStrings(value)
})
export let tasksResult: Result[] = []


export const reset = () => {
	tasks.set(generateRealTasks(dictionary, grid, 500000))
	//taskStrings = getTaskStrings(tasks);
};
