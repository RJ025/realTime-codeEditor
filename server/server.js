const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const {Server} = require('socket.io');
const ACTIONS = require('../client/src/actions');

const io = new Server(server);
const PORT = process.env.PORT || 8080;

const userSocketMap = {}  //this will let us which socket id is related to which user

const getAllConnectedClients = (roomId)=>{
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((socketId)=>{
        return {
            socketId,
            userName : userSocketMap[socketId]
        }
    });  //this will give up array of all sockets ids
}



io.on('connection' , (socket)=>{
    console.log('socket connected' , socket.id)
    socket.on(ACTIONS.JOIN , ({roomId , userName})=>{
        userSocketMap[socket.id] = userName;
        socket.join(roomId); //this will join this socket in this room if it alredy exits this will simply join it but if it does not exist then it will create new room
        const clients = getAllConnectedClients(roomId);
        console.log(clients);
        clients.forEach(({socketId})=>{
            io.to(socketId).emit(ACTIONS.JOINED , {
                clients ,
                userName,
                socketId: socket.id
            })
        })
    })

    socket.on(ACTIONS.CODE_CHNAGE , ({roomId , code})=>{
        socket.in(roomId).emit(ACTIONS.CODE_CHNAGE , {code});
    })

   
    socket.on(ACTIONS.SYNC_CODE , ({code , socketId})=>{
        io.to(socketId).emit(ACTIONS.CODE_CHNAGE , {code});
    })

    socket.on('disconnecting' , ()=>{
        const rooms = [...socket.rooms];
        rooms.forEach((roomId)=>{
            socket.in(roomId).emit(ACTIONS.DISCONNECTED ,{
                socketId : socket.id,
                userName : userSocketMap[socket.id]
            })
        })

        delete userSocketMap[socket.id];
        socket.leave();
    })
})

app.get('/' , (req , res)=>{
    res.send('hello')
})



server.listen(PORT , ()=>{
    console.log('http://localhost:'+PORT);
})