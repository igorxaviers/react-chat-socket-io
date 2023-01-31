import { useEffect, useState, useRef } from 'react';
import Message from './Message'
// import EmojiPicker from 'emoji-picker-react';
import toast, { Toaster } from 'react-hot-toast';
import ChatHeader from './ChatHeader';
import ChatBody from './ChatBody';
import { FiSend, FiSmile } from "react-icons/fi";

export default function Chat ({socket, username}) {
    const [message, setMessage] = useState('');
    const [messageList, setMessageList] = useState([]);
    const [room, setRoom] = useState(''); 
    const [joinedRoom, setJoinedRoom] = useState(false);
    const [userTyping, setUserTyping] = useState('');
    const lastMessageRef = useRef(null);

    const sendMessage = async () => {
        if(!joinedRoom) return;
        if(message.trim() === '') return;
        
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
        setMessage(e.target.value);
        if(e.key === 'Enter'){
            sendMessage();
        }
        // socket.emit('user_typing', {username, room});
        // WILL DO THIS LATER 👌
    }

    const handleClickChat = () => {
        if(!joinedRoom)
            toast.error("Join a room before chatting! 😉");

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
        // WILL DO THIS LATER 👌

    }, [socket]);


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


                <ChatBody 
                    messageList={messageList} 
                    username={username}/>

                    {/* { userTyping ? <p>{userTyping} is typing...</p> : ''} */}
                    {/* WILL DO THIS LATER 👌 */}


                <div className="chat-footer" onClick={() => handleClickChat()}>

                    {/* <EmojiPicker/> */}

                    <textarea 
                    className={`${!joinedRoom ? 'disabled' : ''} chat-input`} 
                    type="text" 
                    value={message} 
                    onChange={(e) => setMessage(e.target.value)} 
                    onKeyDown={handleTyping}
                    // onKeyUp={() => setUserTyping('')}
                    disabled={!joinedRoom}
                    placeholder="Your message"/>
        
                    <button className={`${!joinedRoom ? 'disabled' : ''} button`} onClick={sendMessage}><FiSend/></button>
                </div>
            </div>
            <div><Toaster position="bottom-right"/></div>
        </> 
    );
}