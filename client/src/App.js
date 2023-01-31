import { FiMessageSquare, FiLogOut, FiUser } from "react-icons/fi";
import Chat from './Chat';
import Modal from './Modal';
import ThemeButton from "./ThemeButton";
import { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
const socket = io.connect('http://localhost:4000');

function App() {
  const [username, setUsername] = useState('');
  const [joinedChat, setJoinedChat] = useState(false);
  const ref = useRef(null);
  
  useEffect(() => {
    socket.on('connect', () => {
      console.log('connected');
    });

    socket.on('disconnect', () => {
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
          <h1>Chat.io</h1>
          <FiMessageSquare/>
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

      <div className="gradient"></div>

      <ThemeButton/>

      <p class="footer-credits">
        © {new Date().getFullYear()} design & desenvolvimento por <a href="https://github.com/igorxaviers/" target="_blank" rel="noreferrer">Igor Xavier</a> ❤️
      </p>
    </div>
  );
}

export default App;
