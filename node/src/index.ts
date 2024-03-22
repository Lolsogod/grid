console.log("test node started...");
import { Kafka, logLevel  } from "kafkajs";
import { sendResult } from "./sendReult";

const kafka = new Kafka({
  clientId: "kafka",
  brokers: ["localhost:19092"],
  logLevel: logLevel.NOTHING,
});

const consumer = kafka.consumer({ groupId: "test-group" });

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
          const result = await program();
          console.log("result is: ", result);
          sendResult(parsed.host, {
            id: parsed.id,
            status: "finished",
            data: result,
          });
        }
        console.log(`-----------finished--------------`);
        consumer.stop().then(() => free = true);
      },
    });
  } catch (error) {
    console.error("Error occurred:", error);
  }
};

consumeOneMessage()
// TODO: get rid of long task simulation
setInterval(
  () => {
    console.log("free: ", free);
    if(free){
      consumeOneMessage()
    }
  }, 5000);
