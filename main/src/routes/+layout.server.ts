import { tasks } from '$lib/server/store';
import type { LayoutServerLoad } from './$types';

let uiTasks: Task[] = []
tasks.subscribe((value) => {
	if(value.length){
		uiTasks = value.map(({ code, ...task }) => task)
	}else {
		uiTasks = []
	}
	
})

export const load = (async () => {
	return { tasks: uiTasks };
}) satisfies LayoutServerLoad;
