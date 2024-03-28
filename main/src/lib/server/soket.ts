import { io } from 'socket.io-client';
import { tasks,  } from './store';

const socket = io('http://localhost:3000');

export const send = async (processed: ProcessedTask[]) => {
	processed.forEach((task) => {
		socket.emit('task', task);
	});
};

socket.on('connect', () => {
	console.log('Connected to server');
	socket.on('resultToMain', async (result: Result) => {
		tasks.update((currentTasks: Task[]) => {
			return currentTasks.map((task) => {
				if (task.id === result.id && task.status !== 'finished') {
					return {
						...task,
						status: 'finished',
						result: result.data
					};
				} else {
					return task;
				}
			});
		});
	});
});
