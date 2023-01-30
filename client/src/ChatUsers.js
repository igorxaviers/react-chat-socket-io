import { useEffect, useState } from "react";



function ChatUsers({socket}) {

    const [users, setUsers] = useState([]);

    useEffect(() => {
        socket.on('join', (data) => {
            setUsers(data.users);
        });
    }, [users, socket])


    return ( 
        <div className="chat-users">
            
        </div>
     );
}

export default ChatUsers;