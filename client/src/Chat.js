import { useEffect, useState, useRef } from 'react';
import Message from './Message'
import ChatHeader from './ChatHeader';
import { FiSend } from "react-icons/fi";

export default function Chat ({socket, username}) {
    const [message, setMessage] = useState('');
    const [messageList, setMessageList] = useState([]);
    const [room, setRoom] = useState(''); 
    const [joinedRoom, setJoinedRoom] = useState(false);
    const [userTyping, setUserTyping] = useState('');
    const lastMessageRef = useRef(null);

    const sendMessage = async () => {
        if(!message || !joinedRoom) return;
        const messageData = {
            author: username,
            message: message,
            time: dateNow(),
            room: room,
            notification: false
        };
        await socket.emit('send_message', messageData);
        setMessageList((list) => [...list, messageData]);
        setMessage('');
        setUserTyping('');
    }

    const dateNow = () => {
        let date = new Date();
        let hours = date.getHours() <= 9 ? `0${date.getHours()}` : date.getHours();
        let minutes = date.getMinutes() <= 9 ? `0${date.getMinutes()}` : date.getMinutes();
        return `${hours}:${minutes}`;
    }

    const handleTyping = (e) => {
        console.log(e.key);
        if(e.key === 'Enter'){
            sendMessage();
        }
        socket.emit('user_typing', {username, room});
    }

    useEffect(() => {
        socket.on('recieve_message', (data) => {
            setMessageList((list) => [...list, data]);
        });

        socket.on('user_join', (data) => {
            setMessageList((list) => [...list, data]);
        });

        socket.on('user_leave', (data) => {
            setMessageList((list) => [...list, data]);
        });

        // socket.on('user_typing', (data) => {
        //     setUserTyping(data.username);
        // });
    }, [socket]);

    useEffect(() => {
        lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
    }, [messageList]);

    useEffect(() => {
        console.log(room);
    },[]);


    return ( 
        <>
            <div className="chat">
                <ChatHeader 
                    room={room} 
                    username={username}
                    socket={socket} 
                    setRoom={setRoom} 
                    joinedRoom={joinedRoom} 
                    setJoinedRoom={setJoinedRoom} 
                    setMessageList={setMessageList}/>


                <div className="chat-messages">
                    {messageList.map((message, index) => (
                        <Message index={index} message={message} username={username}/>
                    ))}
                    <div ref={lastMessageRef} />
                </div>


                    { userTyping ? <p>{userTyping} is typing...</p> : ''}
                <div className="chat-footer">
                    
                    <textarea 
                    className="chat-input" 
                    type="text" 
                    value={message} 
                    onChange={(e) => setMessage(e.target.value)} 
                    onKeyDown={handleTyping}
                    onKeyUp={() => setUserTyping('')}
                    placeholder="Your message"/>
        
                    <button className="button" onClick={sendMessage}><FiSend/></button>
                </div>
            </div>
        </> 
    );
}