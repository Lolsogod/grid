import { tasks } from '$lib/server/data/task';
import type { LayoutServerLoad } from './$types';

export const load = (async () => {
    return {tasks: tasks.map(({ code, ...task }) => task),};
}) satisfies LayoutServerLoad;