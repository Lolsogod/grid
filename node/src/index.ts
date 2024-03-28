import { io } from "socket.io-client";
import { Result } from "./types";

console.log("test node started...");
const socket = io("http://localhost:3000");
let program: Function;
let free = true
socket.on("connect", () => {
  console.log("Connected to server");

  setInterval(() => {
    if (free){
      socket.emit("requestTask");
    }
  }, 5000);

  socket.on("give", async (task: string) => {
    free = false
    //console.log('Received task:', task);
    const result = await computeTask(task);
    socket.emit("taskResult", result);
    socket.emit("requestTask");
    free = true
  });
});

const computeTask = async (task: string): Promise<Result> => {
  const parsed: any = JSON.parse(task);
  console.log(`-----------task-${parsed.id}--------------`);
  program = new Function(
    `return (${parsed.code})(${JSON.stringify(parsed.args)});`
  );

  var startTime = performance.now();

  const result = await program();

  var endTime = performance.now();

  console.log(`-----------finished--------------`);
  console.log(`Task took ${msToTime(endTime - startTime)}`);

  return {
    id: parsed.id,
    status: "finished",
    data: result,
  };
};

const msToTime = (duration: number) => {
  let milliseconds = Math.floor((duration % 1000) / 100),
    seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor((duration / (1000 * 60)) % 60),
    hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

  hours = hours < 10 ? 0 + hours : hours;
  minutes = minutes < 10 ? 0 + minutes : minutes;
  seconds = seconds < 10 ? 0 + seconds : seconds;

  return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
};
