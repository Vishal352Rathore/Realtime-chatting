const express = require("express");
const { Server } = require("socket.io");
const http = require("http");
const cors = require("cors");

const PORT = process.env.PORT || 3001

const app = express();

app.use(cors({
    origin :'https://realtime-chatting-client.vercel.app/',
}));

const  server = http.createServer(app);

const io = new Server(server, {
        cors : {
            origin :'https://realtime-chatting-client.vercel.app/',
            methods : ["GET" ,'POST'],
        }
    });

const users = {};

console.log("user  " );

io.on('connection',(socket) => {
    console.log("We have a new connection ");

    socket.on('new-user-joined' , (name) => {
        console.log("user connected " + name);
          users[socket.id] = name ;
          socket.broadcast.emit('user-joined' , name);
    });

    socket.on('send', (message) =>{
        console.log("user send message " + message);
        socket.broadcast.emit('receive' ,{message:message ,name :users[socket.id]});
    })

    socket.on('disconnect', () => {
        console.log("user disconnected");
    })
})

app.get('/', (req, res) =>
    res.send(`Node and Express server running on port 3001`)
);

// app.post('/', (req, res) =>
//     res.send(`Node server running on port 3001`)
// );

server.listen(PORT, ()=>{
    console.log(`Server has started on port ${PORT}`);
})

module.exports = app;