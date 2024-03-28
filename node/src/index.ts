import { io } from "socket.io-client";
import { ProcessedTask, Result } from "./types";

console.log("test node started...");
const socket = io("http://localhost:3000");
let program: Function;

socket.on("connect", () => {
  console.log("Connected to server");

  socket.emit("requestTask");

  socket.on("give", async (task: ProcessedTask | null) => {
    //console.log('Received task:', task);
    if (task) {
      const result = await computeTask(task);
      socket.emit("taskResult", result);
      socket.emit("requestTask");
    } else {
      setTimeout(() => {
        socket.emit("requestTask");
      }, 5000);
    }
  });
});

const computeTask = async (task: ProcessedTask): Promise<Result> => {
  //ренеймнуть
  const parsed = task;
  console.log(`---------task-${parsed.parentId}-sub-${parsed.id}------------`);
  program = new Function(
    `return (${parsed.code})(${JSON.stringify(parsed.args)});`
  );

  var startTime = performance.now();

  const result = await program();

  var endTime = performance.now();

  console.log(`Task took ${msToTime(endTime - startTime)}`);
  console.log(`-----------finished--------------`);

  return {
    parentId: parsed.parentId,
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
