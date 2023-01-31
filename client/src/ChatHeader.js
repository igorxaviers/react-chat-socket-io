import { FiMessageCircle, FiLogIn, FiLogOut } from "react-icons/fi";

function ChatHeader(props) {

  const joinRoom = async () => {
    if(props.room === '') return;

    await props.socket.emit('join_room', { username: props.username, room: props.room });
    props.setJoinedRoom(true);
  }

  const leaveRoom = async () => {
    await props.socket.emit('leave_room', { username: props.username, room: props.room });
    props.setJoinedRoom(false);
    props.setMessageList([]);
  }

    return ( 
      <div className="chat-header">
          {props.joinedRoom ? 
          <>
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
            
            <input 
              type="text" 
              value={props.room} 
              onChange={(e) => props.setRoom(e.target.value)} 
              placeholder="Room name"
              id="room"/> 
            <button className="button button-dark" 
            onClick={() => joinRoom()} 
            title="Join a room">
              <span className="button-text">Join</span> <FiLogIn/> 
            </button>
          </>
          }
      </div>
    );
}

export default ChatHeader;