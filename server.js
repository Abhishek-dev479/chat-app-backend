const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');

const httpServer = http.createServer(app);

app.use(express.json());

const io = new Server(httpServer, {cors: {origin: '*'}});

let onlineUsers = [];

// Connected with client
io.on('connection', (socket) => {
    console.log(socket.id);
    // Receiving message from client
    socket.on('send', (name, msg) => {
        console.log('=====================');
        console.log(name +' : '+msg);
        // Broadcasting the message
        socket.broadcast.emit('receive', name, msg);
    })

    socket.on('onlineUsers', (user) => {
        onlineUsers.push(user);
        console.log('received users');
        io.emit('onlineUsers', onlineUsers);
    })         

    socket.on('disconnect', () => {
        console.log('disconnected');
        onlineUsers = onlineUsers.filter((e) => e.id != socket.id);
        io.emit('onlineUsers', onlineUsers);
    })
})






httpServer.listen(3001, (err) => console.log('server running...'));


