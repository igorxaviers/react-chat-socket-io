const express = require('express');
const app = express();
const server = require('http').Server(app);
const PORT = process.env.PORT || 4000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000'
const socketIO = require('socket.io')(server, {
  cors: {
    origin: "*",
    allowedHeaders: "*",
    methods: ["GET", "POST"],
    credentials: true
  }
});

const roomClients = {};

const rooms = ()  =>{
  let rooms = [];
  for (const room in roomClients) {
    if(room){
      rooms.push({
        name: room,
        users: roomClients[room]
      });
    }
  }
  return rooms;
}


socketIO.on('connection', (socket) => {
    console.log(`✅: ${socket.id} user just connected!`);
    socketIO.emit('room_list', {rooms: rooms()});
    
    
    socket.on('join_room', (data) => {
      const {room} = data;
      if (!roomClients[room]) {
        roomClients[room] = 0;
      }
      roomClients[room]++;
      socket.join(room);
      
      socketIO.to(room).emit('users_in_room', {
        users: roomClients[room]
      });

      let dataJoin = {
        username: data.username,
        message: `<strong>${data.username}</strong> has joined the room`,
        time: data.time,
        room: room,
        notification: true
      };


      socket.to(room).emit('user_join', dataJoin);
      socketIO.emit('room_list', {rooms: rooms()});

    });

    socket.on('leave_room', (data) => {
      const {room} = data;
      roomClients[room]--;
      socketIO.to(room).emit('users_in_room', {
        users: roomClients[room]
      });
      socket.leave(room);
      if(roomClients[room] === 0){
        delete roomClients[room];
      }
      let dataLeave = {
        username: data.username,
        message: `<strong>${data.username}</strong> has left the room`,
        time:  data.time,
        room: room,
        notification: true
      };
      socket.to(room).emit('user_leave', dataLeave);
      socketIO.emit('room_list', {rooms: rooms()});
    });

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

app.get('/', (req, res) => {
  res.send(`Server listening on port ${PORT}`);
});

server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
