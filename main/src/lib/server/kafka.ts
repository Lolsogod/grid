import { Kafka, Partitioners } from 'kafkajs';
import { tasks } from './data/task';

const kafka = new Kafka({
	clientId: 'app',
	brokers: ['localhost:19092']
});

const admin = kafka.admin();
const producer = kafka.producer({
	createPartitioner: Partitioners.LegacyPartitioner
});

export const deleteTopic = async () => {
	await admin.connect();
	const topics = await admin.listTopics();
	//console.log(topics);
	await admin.deleteTopics({ topics: ['task'] });
	await admin.disconnect();
};

const expandTopic = async (taskStrings: string[]) => {
	const topic = await admin.fetchTopicMetadata({ topics: ['task'] });
	console.log(
		'start expansion current: ',
		topic.topics[0]!.partitions.length,
		' required: ',
		taskStrings.length
	);
	if (topic.topics[0]!.partitions.length < taskStrings.length) {
		console.log('expanding topic to ' + taskStrings.length);
		await admin.createPartitions({
			topicPartitions: [{ topic: 'task', count: taskStrings.length }]
		});
	}
};

export const initKafka = async (taskStrings: string[]) => {
	await admin.connect();

	const topics = await admin.listTopics();
	if (topics.includes('task')) {
		expandTopic(taskStrings);
	} else {
		await admin.createTopics({
			waitForLeaders: true,
			topics: [{ topic: 'task', numPartitions: taskStrings.length }]
		});
	}
};

export const send = async (taskStrings: string[]) => {
	console.log('sending!');
	await producer.connect();
	producer.send({
		topic: 'task',
		messages: taskStrings.map((task) => ({ value: task }))
	});
};

//result agrigation
const consumer = kafka.consumer({ groupId: 'result-group', sessionTimeout: 180000 });

export const startResultConsumer = async () => {
  await consumer.stop()
	console.log('agregating');
	await consumer.connect();
	await consumer.subscribe({ topic: 'result', fromBeginning: true });
	await consumer.run({
		eachMessage: async ({ topic, partition, message }) => {
			const result = JSON.parse(message.value) as Result;
			console.log(result);
      console.log(tasks)
			const index = tasks.findIndex((task) => task.parentId == result.parrentId && task.id == result.id);
			if (index !== -1) {
				tasks[index].status = 'finished';
				tasks[index].result = result.data;
				console.log(`Task ${result.id} finished`);
			} else {
				console.log(`Task ${result.id} not found.`);
			}
		}
	});
};


//info for ui
export const getStatus = async () => {
	try {
		return (await admin.fetchTopicMetadata({ topics: ['task'] })).topics[0];
	} catch (err) {
		return {
			name: 'not created yet',
			partitions: []
		};
	}
};

export const getGroupInfo = async () => {
	//console.log((await admin.describeGroups(['test-group'])).groups[0].members)
	return (await admin.describeGroups(['test-group'])).groups[0].members.length;
};
