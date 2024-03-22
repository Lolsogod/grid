import type { RequestHandler } from './$types';
import { tasks } from '$lib/server/data/task';

export const POST: RequestHandler = async ({request}) => {
    const result = (await request.json()).result;
    console.log(result)
    const index = tasks.findIndex(task => task.id === result.id);
    if (index !== -1) {
        tasks[index].status = 'finished';
        tasks[index].result = result.data;
        console.log(`Task ${result.id} finished`);
    } else {
        console.log(`Task ${result.id} not found.`);
    }

    return new Response('OK', { status: 200 });
};