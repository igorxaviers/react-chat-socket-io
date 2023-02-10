import { useEffect, useState } from "react";

function ChatUsers({socket}) {
    const [rooms, setRooms] = useState([]); 

    useEffect(() => {
        socket.on('room_list', (data) => {
            console.log(data);
            setRooms(data);
        });
    }, [socket])


    return ( 
        <div className="chat-rooms">
            {
                rooms.map((room, index) => {
                    return (
                        <div className="chat-room" key={index}>
                            <h4>{room}</h4>
                        </div>
                    )
                })
            }
        </div>
     );
}

export default ChatUsers;