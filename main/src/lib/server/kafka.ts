import { Kafka, Partitioners } from 'kafkajs';

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
    await admin.deleteTopics({ topics: ["task"] });
    await admin.disconnect();
};

const expandTopic = async (taskStrings: string[]) => {
    const topic = await admin.fetchTopicMetadata({ topics: ["task"] });
    console.log(
      "start expansion current: ",
      topic.topics[0]!.partitions.length,
      " required: ",
      taskStrings.length
    );
    if (topic.topics[0]!.partitions.length < taskStrings.length) {
      console.log("expanding topic to " + taskStrings.length);
      await admin.createPartitions({
        topicPartitions: [{ topic: "task", count: taskStrings.length }],
      });
    }
  };

  export const initKafka = async (taskStrings: string[]) => {
    await admin.connect();
  
    const topics = await admin.listTopics();
    if (topics.includes("task")) {
      expandTopic(taskStrings);
    } else {
      await admin.createTopics({
        waitForLeaders: false,
        topics: [{ topic: "task", numPartitions: taskStrings.length }],
      });
    }
  };


//info for ui
  export const getStatus = async () => {
    let result
    try{
        return (await admin.fetchTopicMetadata({ topics: ["task"] })).topics[0]
    }
    catch(err){
        return {
            name: "not created yet",
            partitions: []
        }
    }
  }

  export const getGroupInfo = async () => {
    //console.log((await admin.describeGroups(['test-group'])).groups[0].members)
      return (await admin.describeGroups(['test-group'])).groups[0].members.length
  }