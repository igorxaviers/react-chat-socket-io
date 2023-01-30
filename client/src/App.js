import { FiMessageSquare, FiLogOut, FiMoon, FiSun } from "react-icons/fi";
import Chat from './Chat';
import Modal from './Modal';
import { useEffect, useState } from 'react';
import io from 'socket.io-client';
const socket = io.connect('http://localhost:4000');

function App() {
  const [username, setUsername] = useState('');
  const [joinedChat, setJoinedChat] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  
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

  const changeTheme = () => {
    setDarkMode(!darkMode);
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    document.body.classList.toggle('dark');
  }

  return (
    <div className="App">
      <nav className="navbar">

          <h1 className="my-5">Chat.io</h1>
          <FiMessageSquare className="teste"/>
          
        {joinedChat ?
          <div className="user-info">
            <p className="user-name">{username}</p>
            <button className="button button-dark" onClick={logout}>Leave <FiLogOut/></button>
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

      <div onClick={changeTheme}>
        {darkMode ? <FiMoon/> : <FiSun/> }
      </div>
    </div>
  );
}

export default App;
