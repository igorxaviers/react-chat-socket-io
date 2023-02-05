import { FiLogOut, FiUser } from "react-icons/fi";
import Chat from './Chat';
import Modal from './Modal';
import ThemeButton from "./ThemeButton";
import { useEffect, useState } from 'react';
import io from 'socket.io-client';
const SOCKET_SERVER_URL = process.env.REACT_APP_SERVER_URL || 'http://localhost:4000';
const socket = io.connect(SOCKET_SERVER_URL);

function App() {
  const [username, setUsername] = useState('');
  const [connected, setConnected] = useState(false);
  const [joinedChat, setJoinedChat] = useState(false);
  
  useEffect(() => {
    socket.on('connect', () => {
      setConnected(true);
    });

    socket.on('disconnect', () => {
      setConnected(false);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
    }
  }, [socket]);

  useEffect(() => {
    const username = localStorage.getItem('username');
    if(username) {
      setUsername(username);
      setJoinedChat(true);
    }
  }, []);

  const joinUser = async () => {
    if(username === '')
      return;
    setJoinedChat(true);
    localStorage.setItem('username', username);
  }

  const logout = () => {
    setUsername('');
    setJoinedChat(false);
    localStorage.removeItem('username');
  }


  return (
    <div className="App">
      <nav className="navbar">
        <div className="nav-logo">
          <h1><span className="logo-style">Just</span> Chat</h1>
        </div>
        {joinedChat ?
          <div className="user-info">
            <div className={`${connected ? 'connected' : 'disconnected'} user-status`}></div>
            <FiUser/>
            <p className="user-name">{username}</p>
            <button className="button button-dark" onClick={logout} title="Log out from chat">Logout <FiLogOut/></button>
          </div>
        :''}
      </nav>

      {!joinedChat ? 
        <Modal 
        username={username} 
        setUsername={setUsername} 
        joinUser={joinUser}/>
      : ''}

      <Chat 
        socket={socket} 
        username={username}/>

      <ThemeButton/>

      <p className="footer-credits">
        © {new Date().getFullYear()} design & built by <a href="https://github.com/igorxaviers/" target="_blank" rel="noreferrer">Igor Xavier</a> ❤️
      </p>

    </div>
  );
}

export default App;
