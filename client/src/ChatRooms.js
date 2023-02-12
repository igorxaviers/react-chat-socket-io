import { useEffect, useState } from "react";
import Util from "./Util";
import { FiMessageCircle } from "react-icons/fi";

function ChatUsers({socket, setRoom, room, joinedRoom, setJoinedRoom, username}) {
    const [rooms, setRooms] = useState([]); 

    useEffect(() => {
        socket.on('room_list', (data) => {
            setRooms(data.rooms);
        });
    }, [socket]);

    const joinRoom = async (roomName) => {
        if(joinedRoom && room !== roomName){
            await socket.emit('leave_room', { username, room: room, time: Util.dateNow() });
            await socket.emit('join_room', { username, room: roomName, time: Util.dateNow() });
            setRoom(roomName)
        }
        else if(!joinedRoom){
            await socket.emit('join_room', { username, room: roomName, time: Util.dateNow() });
            setRoom(roomName);
            setJoinedRoom(true);
        }
    }


    return ( 
        <div className="chat-rooms-container">
            <div className="chat-rooms">
                {rooms.length > 0 ?
                    rooms.map((roomAv, index) => {
                        return (
                            <div className={`chat-room ${roomAv.name === room && joinedRoom ? 'active' : ''}`} key={index} onClick={() => joinRoom(roomAv.name)}>
                                <FiMessageCircle/>
                                <h4>{roomAv.name}</h4>
                                <p>{roomAv.users}</p>
                            </div>
                        )
                    })
                : <p className="info">No rooms available</p>}
            </div>
        </div>
     );
}

export default ChatUsers;