console.log("test node started...");
import { Kafka, logLevel  } from "kafkajs";

const kafka = new Kafka({
  clientId: "kafka",
  brokers: ["localhost:19092"],
  logLevel: logLevel.ERROR,
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
        console.log(`-----------recived--------------`);

        if (message.value) {
          const parsed: any = JSON.parse(message.value.toString());
          program = new Function(`return (${parsed.code})(${parsed.args});`);
          const result = await program();
          console.log("result is: ", result);
        }
        console.log(`-----------finished--------------`);
        consumer.stop().then(() => free = true);
      },
      // maxWaitTimeInMs: 10000,
    });
  } catch (error) {
    console.error("Error occurred:", error);
  }
};

// Simulate long task
setInterval(
  () => {
    console.log("free: ", free);
    if(free){
      consumeOneMessage().catch(console.error);
    }
  }, 5000);
