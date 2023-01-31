const express = require('express');
const app = express();
const PORT = process.env.PORT || 4000;
const server = require('http').Server(app);
const cors = require('cors');

// app.use(cors());
// app.use((req, res, next) =>{
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });

const socketIO = require('socket.io')(server, {
  cors: {
    // origin: "http://localhost:3000",
    origin: "*",
    allowedHeaders: "*",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// socketIO.set('origins', '*:*');
// socketIO.origin('*:*');


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
