import Util from './Util';
import { useState, useEffect } from 'react';
import { FiMessageCircle, FiLogIn, FiLogOut, FiUsers, FiMaximize2, FiMinimize2 } from "react-icons/fi";

function ChatHeader(props) {
  const [users, setUsers] = useState(0);

  useEffect(() => {
    props.socket.on('users_in_room', (data) => {
      setUsers(data.users);
    });
    props.socket.on('disconnect', () => {
      leaveRoom();
    })
  }, [props.socket, props.setJoinedRoom, props.setRoom]);

  const joinRoom = async () => {
    if(props.room === '') return;

    await props.socket.emit('join_room', { username: props.username, room: props.room, time: Util.dateNow() });
    props.setJoinedRoom(true);
  }

  const leaveRoom = async () => {
    await props.socket.emit('leave_room', { username: props.username, room: props.room, time: Util.dateNow() });
    props.setJoinedRoom(false);
    props.setRoom('');
    props.setMessageList([]);
  }

    return ( 
      <>
        <div className="chat-header">
            {props.joinedRoom ? 
            <>
              <div className="chat-room-users">
                <FiUsers/>
                <p>{users}</p>
              </div>
              <h3>{props.room}</h3> 
              <button className="button button-dark" 
              onClick={() => leaveRoom()} 
              title="Leave current room">
                <span className="button-text">Leave</span> <FiLogOut/>
              </button>
            </>
            : 
            <>
              <div className="chat-header-title">
                <label htmlFor="room">Room</label>
                <FiMessageCircle/>
              </div>
              
              <div className="flex">
                <input 
                  type="text" 
                  value={props.room} 
                  onChange={(e) => props.setRoom(e.target.value)} 
                  placeholder="Room name"
                  id="room"/> 
                <button 
                  className="button button-dark" 
                  onClick={() => joinRoom()} 
                  title="Join a room">
                  <span className="button-text">Join</span> <FiLogIn/> 
                </button>
              </div>
            </>
            }
            <div className="chat-maximize">
              {props.fullscreen ?
              <FiMinimize2 onClick={() => props.setFullscreen(false)}/> :
              <FiMaximize2 onClick={() => props.setFullscreen(true)}/>}
            </div>

        </div>

        <div className="user-typing">
          { props.userTyping !== '' && props.username !== props.userTyping ?
            <p>{props.userTyping} is typing...</p>
          : null}
        </div>
      </>
    );
}

export default ChatHeader;