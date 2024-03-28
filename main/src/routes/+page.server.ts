import type { Actions, PageServerLoad } from './$types';
import { reset, taskStrings } from '$lib/server/data/task';
import { tasks } from '$lib/server/store';
import { send } from '$lib/server/soket';
import { Status } from '$lib/enums';

export const load = (async () => {
	return {};
}) satisfies PageServerLoad;

export const actions: Actions = {
	send: async () => {
		tasks.update((value: Task[]) => {
            return value.map((task) => ({
                ...task,
                status: Status.sent,
                result: []
            }));
        });

		return send(taskStrings);
	},
	reset: async () => {
		//добавить таск айди
		return reset();
	}
};
