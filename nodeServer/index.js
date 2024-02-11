const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const {Server} = require("socket.io");

app.use(cors());

const  server = http.createServer(app);

const io = new Server(server ,{
    cors : {
        // origin :'https://realtime-chatting-server.vercel.app',
        methods : ["GET" ,'POST'],
    }
})

const users = {};

console.log("user  " );

io.on('connection',(socket) => {
    console.log("connected ");

    socket.on('new-user-joined' , (name) => {
        console.log("user connected " + name);
          users[socket.id] = name ;
          socket.broadcast.emit('user-joined' , name);
    });

    socket.on('send', (message) =>{
        console.log("user connected send" + message);
        socket.broadcast.emit('receive' ,{message:message ,name :users[socket.id]});
   
    })

    socket.on('disconnect', () => {
        console.log("user disconnected");
    })
})

app.get('/', (req, res) =>
    res.send(`Node and Express server running on port 3001`)
);

app.post('/', (req, res) =>
    res.send(`Node server running on port 3001`)
);

server.listen(3001, ()=>{
    console.log("hello");
})