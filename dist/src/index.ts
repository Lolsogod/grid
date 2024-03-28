import { Server } from "socket.io";
import { Result, inProgress, ProcessedTask } from "./types";

const io = new Server(3000, {
    pingTimeout: 180000
})

const queue: ProcessedTask[] = []
let inProgress: inProgress[] = []
console.log(queue)

io.on("connection", (socket) => {
    socket.on("task", (task: ProcessedTask) => {
        queue.push(task)
    })
    
    socket.on('requestTask', () => {
        const task = destribute()
        if (task){
            console.log(`Sending task to node...`);
            socket.emit('give', task);
        }else{
            socket.emit('give', null);
        }
    });
    //строки убрать это дич
    socket.on('taskResult',  (result) => {
        //неробит
        inProgress = inProgress.filter((ip) => ip.task.id !== result.id);
        socket.broadcast.emit('resultToMain', result);
        console.log('send to main')
    });


})

setInterval(()=>{
    const currentTime = new Date(); 
    const timeOut = new Date(currentTime.getTime() - 1 * 60 * 1000); 
    inProgress.forEach((ip, index) => {
        if (ip.date < timeOut) {
            inProgress.splice(index, 1);
            queue.push(ip.task);
        }
    });
    console.log({ip: inProgress.length})
}, 10000)

//remove stringification and stuff
const destribute = () => {
    const nextTask = queue.pop()
    if(nextTask){
         inProgress.push({task: nextTask, date: new Date()})
    }
    return nextTask
}