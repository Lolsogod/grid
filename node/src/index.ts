console.log("test node started...");
import { Kafka, logLevel  } from "kafkajs";
import { sendResult } from "./sendReult";

const kafka = new Kafka({
  clientId: "kafka",
  brokers: ["localhost:19092"],
  logLevel: logLevel.NOTHING,
});

const consumer = kafka.consumer({ groupId: "test-group", sessionTimeout: 180000 });

let program: Function;
let free = true
const consumeOneMessage = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: "task", fromBeginning: true });
  free = false
  try {
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        if (message.value) {
          const parsed: any = JSON.parse(message.value.toString());
          console.log(`-----------task-${parsed.id}--------------`);
          program = new Function(`return (${parsed.code})(${JSON.stringify(parsed.args)});`);

          var startTime = performance.now()

          const result = await program();

          var endTime = performance.now()
          console.log(`Task took ${endTime - startTime} milliseconds`)

          //console.log("result is: ", result);
          await sendResult(parsed.host, {
            id: parsed.id,
            status: "finished",
            data: result,
          });
        }
        console.log(`-----------finished--------------`);
      },
    });
  } catch (error) {
    console.error("Error occurred:", error);
  }
};

consumeOneMessage()