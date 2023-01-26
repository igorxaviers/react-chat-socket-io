import { useEffect, useState } from 'react';



export default function Chat ({socket, username, room}) {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        socket.on('recieve_message', (data) => {
          setMessages((messages) => [...messages, data]);
        });

    }, [socket]);

    const sendMessage = async() => {
        const data = {
          username,
          message,
          time: new Date().toLocaleTimeString(),
          room
        };
        await socket.emit('send_message', data);
      }

    return ( 
        <>
            <div className="chat">
            {
                messages.map((message, index) => (
                <div key={index}>
                    <h6>{message.userName}</h6>
                    <p>{message.message}</p>
                    <p>{message.time}</p>
                </div>
                ))
            }
            </div>
            <div className="d-flex align-items-center col-6 mx-auto">
                <input 
                className="form-control" 
                type="text" 
                value={message} onChange={(e) => setMessage(e.target.value)} 
                placeholder="Your message"/>
    
                <button className="btn btn-dark " onClick={() => sendMessage()}>Send</button>
            </div>
        </> 
    );
}