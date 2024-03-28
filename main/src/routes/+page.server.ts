import type { Actions, PageServerLoad } from './$types';
import { reset, tasks, taskStrings } from '$lib/server/data/task';
import { deleteTopic, getGroupInfo, getStatus, initKafka, send, startResultConsumer } from '$lib/server/kafka';
import { Status } from "$lib/enums";

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
        tasks.forEach((task) => {
            task.status = Status.sent
            task.result = []
        })
        startResultConsumer()
        return send(taskStrings)
    },
    reset: async () => {
        //добавить таск айди
        return reset()
    }
};