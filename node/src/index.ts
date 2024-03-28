console.log("test node started...");
import { Kafka, logLevel, Partitioners } from "kafkajs";
import type { Result } from "./types";

const kafka = new Kafka({
  clientId: "kafka",
  brokers: ["localhost:19092"],
  //logLevel: logLevel.NOTHING,
});

const consumer = kafka.consumer({
  groupId: "test-group",
  sessionTimeout: 540000,
  heartbeatInterval: 180000,
});
const producer = kafka.producer({
  createPartitioner: Partitioners.LegacyPartitioner,
});

const sendResult = async (result: Result) => {
  await producer.connect();
  producer.send({
    topic: "result",
    messages: [{ value: JSON.stringify(result) }],
  });
};

let program: Function;

const consumeOneMessage = async () => {
  await consumer.connect();
  console.log("conected");
  await consumer.subscribe({ topic: "task", fromBeginning: true });
  console.log("subscribed");
  try {
    await consumer.run({
      autoCommit: false,
      eachMessage: async ({ topic, partition, message, heartbeat}) => {
        consumer.commitOffsets([{ topic, partition, offset: message.offset }]);
        var startTime = performance.now();
        console.log({ partition });
        if (message.value) {
          const parsed: any = JSON.parse(message.value.toString());
          console.log(
            `----------${parsed.parentId}-${parsed.id}--------------`
          );
          program = new Function(
            `return (${parsed.code})(${JSON.stringify(parsed.args)});`
          );
          heartbeat();
          const result = await program();
          heartbeat();
          //console.log("result is: ", result);
          await sendResult({
            parrentId: parsed.parentId,
            id: parsed.id,
            status: "finished",
            data: result,
          });
        }
        console.log(`-----------finished--------------`);
        let endTime = performance.now();
        console.log(`Task took ${endTime - startTime} milliseconds`);
      },
    });
  } catch (error) {
    console.error("Error occurred:", error);
  }
};

consumeOneMessage();
