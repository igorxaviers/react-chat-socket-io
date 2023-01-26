import './App.css';
import Chat from './Chat';
import { useEffect, useState } from 'react';
import io from 'socket.io-client';
const socket = io.connect('http://localhost:4000');

function App() {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState(''); 
  
  useEffect(() => {
    socket.on('connect', () => {
      console.log('connected');
    });



  }, [socket]);

  const joinRoom = async() => {
    await socket.emit('join_room', {username, room});
  }

  return (
    <div className="App">
      <h1 className="my-5">⚛️ React  & ⚡ Socket.io</h1>

      <div className="d-flex align-items-center col-6 mx-auto">
          <input 
          className="form-control" 
          type="text" 
          value={username} onChange={(e) => setUsername(e.target.value)} 
          placeholder="Your username"/>

          <input 
          className="form-control" 
          type="text" 
          value={room} onChange={(e) => setRoom(e.target.value)} 
          placeholder="Room"/>

          <button className="btn btn-dark " onClick={() => joinRoom()}>Join</button>

      </div>
      <Chat socket={socket} username={username} room={room}/>

    </div>
  );
}

export default App;
