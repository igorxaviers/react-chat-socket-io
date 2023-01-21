import './App.css';
import { useEffect, useState } from 'react';
import io from 'socket.io-client';
const socket = io.connect('http://localhost:4000');

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [lastPong, setLastPong] = useState(null);
  const [name, setName] = useState('');
  const [nameServer, setNameServer] = useState('');

  useEffect(() => {
    socket.on('connect', () => {
      setIsConnected(true);
      console.log('connected');
    });
    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('pong', () => {
      setLastPong(new Date().toISOString());
    });

    socket.on('name', (data) => {
      setNameServer(data);
    });


    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('pong');
    };

  }, []);


  const sendPing = () => {
    socket.emit('ping');
  }

  return (
    <div className="App">
      <h1>⚛️ React  & ⚡ Socket.io</h1>

      <input value={name} onChange={(e) => setName(e.target.value)}></input>
      <button onClick={() => socket.emit('name', name)}>Enviar</button>
      <p>{nameServer}</p>

    </div>
  );
}

export default App;
