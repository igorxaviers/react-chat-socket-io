import { FiMessageSquare, FiLogOut, FiUser } from "react-icons/fi";
import Chat from './Chat';
import Modal from './Modal';
import ThemeButton from "./ThemeButton";
import { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
const socket = io.connect('https://react-chat-socket-io-1paz.vercel.app');

function App() {
  const [username, setUsername] = useState('');
  const [connected, setConnected] = useState(false);
  const [joinedChat, setJoinedChat] = useState(false);
  
  useEffect(() => {
    socket.on('connect', () => {
      setConnected(true);
      console.log('connected');
    });

    socket.on('disconnect', () => {
      setConnected(false);
      console.log('disconnected');
    });
  }, [socket]);

  useEffect(() => {
    const username = localStorage.getItem('username');
    if(username) {
      setUsername(username);
      setJoinedChat(true);
    }
  }, []);

  const joinUser = async () => {
    console.log(username);
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
          <h1>JustChat</h1>
        </div>
        {joinedChat ?
          <div className="user-info">
            <FiUser/>
            <p className="user-name">{username}</p>
            <button className="button button-dark" onClick={logout} title="Log out from chat">Logout <FiLogOut/></button>
          </div>
          :''
        }
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
        © {new Date().getFullYear()} design & desenvolvimento por <a href="https://github.com/igorxaviers/" target="_blank" rel="noreferrer">Igor Xavier</a> ❤️
      </p>

      <div className="gradient"></div>
    </div>
  );
}

export default App;
