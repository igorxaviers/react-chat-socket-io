const express = require('express');
const app = express();
const server = require('http').Server(app);
const PORT = process.env.PORT || 4000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000'
const socketIO = require('socket.io')(server, {
  cors: {
    origin: CLIENT_URL,
    allowedHeaders: "*",
    methods: ["GET", "POST"],
    credentials: true
  }
});

console.log(CLIENT_URL);

let rooms = [];


function roomExists(roomName) {
  return rooms.some((room) => room.username === roomName);
}

socketIO.on('connection', (socket) => {
    console.log(`✅: ${socket.id} user just connected!`);
    
    socket.on('join_room', (data) => {
      if(!roomExists(data.room)) {
        rooms.push({room: data.room, users: []});
      }
      else{
        rooms.forEach((room) => {
          if(room.room === data.room) {
            room.users.push(data.username);
          }
        });
      }

      console.log(data);

      let date = new Date();
      socket.join(data.room);
      let dataJoin = {
        username: data.username,
        message: `<strong>${data.username}</strong> has joined the room`,
        time: dateNow(),
        room: data.room,
        notification: true
      };
      socket.to(data.room).emit('user_join', dataJoin);
    });

    socket.on('leave_room', (data) => {
      let date = new Date();
      socket.leave(data.room);
      let dataLeave = {
        username: data.username,
        message: `<strong>${data.username}</strong> has left the room`,
        time: dateNow(),
        room: data.room,
        notification: true
      };
      socket.to(data.room).emit('user_leave', dataLeave);
    })

    socket.on('send_message', (data) => {
      socket.to(data.room).emit('recieve_message', data);
    });

    socket.on('user_typing', (data) => {
      socket.to(data.room).emit('user_typing', {username: data.username});
    });

    socket.on('user_stop_typing', (data) => {
      socket.to(data.room).emit('user_stop_typing', {username: ''});
    });

    socket.on('disconnect', () => {
      console.log(`🔌: ${socket.id} disconnected`);
    });
});

const dateNow = () => {
  let date = new Date();
  let hours = date.getHours() <= 9 ? `0${date.getHours()}` : date.getHours();
  let minutes = date.getMinutes() <= 9 ? `0${date.getMinutes()}` : date.getMinutes();
  return `${hours}:${minutes}`;
}

app.get('/', (req, res) => {
  res.send(`Server listening on port ${PORT}`);
});

server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
