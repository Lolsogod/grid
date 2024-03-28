import { Server } from "socket.io";
import { Result } from "./types";

const io = new Server(3000, {
    pingTimeout: 180000
})

const queue: string[] = []
//protection against failures add
const results: Result[] = []
console.log(queue)

io.on("connection", (socket) => {
    socket.on("task", (task: string) => {
        queue.push(task)
        console.log(queue.length)
        
    })
    //возможны конфликты, давать как то именно запрашивабщему
    socket.on('requestTask', () => {
        const task = destribute()
        if (task){
            console.log(`Sending task to node...`);
            socket.emit('give', task);
        }else{
            console.log('no tasks left')
        }
    });

    socket.on('taskResult', (result) => {
        results.push(result)
        socket.broadcast.emit('resultToMain', result);
        console.log('Received task result from node:', result);
    });


})


//remove stringification and stuff
const destribute = () => {
    return queue.pop()
}