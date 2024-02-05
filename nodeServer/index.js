const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const {Server} = require("socket.io");

app.use(cors());

const  server = http.createServer(app);

const io = new Server(server ,{
    cors : {
        origin :'realtime-chatting-server.vercel.app',
        methods : ["GET" ,'POST'],
    }
})

const users = {};

io.on('connection',(socket) => {
    socket.on('new-user-joined' , (name) => {
        console.log("user connected " + name);
          users[socket.id] = name ;
          socket.broadcast.emit('user-joined' , name);
    });

    socket.on('send', (message) =>{
        socket.broadcast.emit('receive' ,{message:message ,name :users[socket.id]});
    })

    socket.on('disconnect', () => {
        console.log("user disconnected");
    })
})

server.listen(3001, ()=>{
    console.log("hello");
})