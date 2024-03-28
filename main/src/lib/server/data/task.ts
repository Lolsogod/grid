import { grid, dictionary } from './';
import {  generateRealTasks, getProcessed } from '../stringGenerator';
import {tasks} from '../store'

export let processed: ProcessedTask[] = []

tasks.set(generateRealTasks(dictionary, grid, 500000))

tasks.subscribe((value) => {
	processed=getProcessed(value)
})
export let tasksResult: Result[] = []


export const reset = () => {
	tasks.set(generateRealTasks(dictionary, grid, 500000))
};
