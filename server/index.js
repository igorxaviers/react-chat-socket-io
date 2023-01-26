const express = require('express');
const app = express();
const PORT = 4000 || process.env.PORT;
const http = require('http').Server(app);
const cors = require('cors');
app.use(cors());

const socketIO = require('socket.io')(http, {
    cors: {
        origin: "http://localhost:3000"
    }
});

socketIO.on('connection', (socket) => {
    console.log(`✅: ${socket.id} user just connected!`);
    
    socket.on('disconnect', () => {
      console.log(`🔌: ${socket.id} disconnected`);
    });

    socket.on('join_room', (data) => {
      socket.join(data.room);
      socketIO.to(data.room).emit('recieve_message', {
        username: 'admin',
        message: `${data.username} has joined the room`,
        time: new Date().toLocaleTimeString(),
      });
      console.log(data);
    });


    socket.on('send_message', (data) => {
      console.log(data);
      socketIO.to(data.room).emit('recieve_message', data);
    });
});

app.get('/api', (req, res) => {
  res.json({
    message: 'Hello world',
  });
});

http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});