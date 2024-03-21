import type { Actions, PageServerLoad } from './$types';
import { grid, dictionary } from "$lib/server/data";
import { getTaskStrings, generateRealTasks } from '$lib/server/stringGenerator';
import { deleteTopic, getGroupInfo, getStatus, initKafka, send } from '$lib/server/kafka';

//размер надо бы автоматом подсчитывать
const tasks = generateRealTasks(dictionary, grid, 4000);
const taskStrings = getTaskStrings(tasks);

export const load = (async () => {
    return {
        topic: await getStatus(),
        nodeCount: await getGroupInfo(),
    };
}) satisfies PageServerLoad;

export const actions: Actions = {
    init: async () => {
        return initKafka(taskStrings)
    },
    delete: async () => {
        return deleteTopic()
    },
    send: async () => {
        return send(taskStrings)
    }
};