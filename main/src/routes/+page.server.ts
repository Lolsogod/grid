import type { Actions, PageServerLoad } from './$types';
import { tasks, taskStrings } from '$lib/server/data/task';
import { deleteTopic, getGroupInfo, getStatus, initKafka, send } from '$lib/server/kafka';
import { Status } from "$lib/enums";

export const load = (async () => {
    return {
        tasks: tasks.map(({ code, ...task }) => task),
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
        tasks.forEach((task) => {
            task.status = Status.sent
        })
        return send(taskStrings)
    }
};