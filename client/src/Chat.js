import { useEffect, useState } from 'react';
// import EmojiPicker from 'emoji-picker-react';
import toast, { Toaster } from 'react-hot-toast';
import Util from './Util';
import ChatHeader from './ChatHeader';
import ChatBody from './ChatBody';
import { FiSend } from "react-icons/fi";

export default function Chat ({socket, username}) {
    const [message, setMessage] = useState('');
    const [messageList, setMessageList] = useState([]);
    const [room, setRoom] = useState(''); 
    const [joinedRoom, setJoinedRoom] = useState(false);
    const [userTyping, setUserTyping] = useState('');
    const TYPING_DELAY = 2000;

    const sendMessage = async () => {
        if(!joinedRoom) return;
        if(message.trim() === '') return;
        
        const messageData = {
            author: username,
            message: message,
            time: Util.dateNow(),
            room: room,
            notification: false
        };
        await socket.emit('send_message', messageData);
        setMessageList((list) => [...list, messageData]);
        setMessage('');
        setUserTyping('');
    }

    const handleTyping = (e) => {
        setMessage(e.target.value);
        if(e.key !== 'Enter' && e.target.value !== ''){
            let timeoutId;
            setUserTyping(username);
            clearTimeout(timeoutId);
            socket.emit('user_typing', {username, room});
    
            timeoutId = setTimeout(() => {
                socket.emit('user_stop_typing', {username, room});
            }, TYPING_DELAY);
    
            return () => {
                clearTimeout(timeoutId);
            }
        }
    }

    const handleSend = (e) => {
        if(e.key === 'Enter'){
            setMessage('');
            sendMessage();
        }
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

        socket.on('user_typing', (data) => {
            setUserTyping(data.username);
        });

        socket.on('user_stop_typing', (data) => {
            setUserTyping('');
        });

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
                    setMessageList={setMessageList}
                    userTyping={userTyping}/>

                <ChatBody 
                    messageList={messageList} 
                    username={username}/>

                <div className="chat-footer" onClick={() => handleClickChat()}>

                    {/* <EmojiPicker/> */}

                    <input 
                    className={`${!joinedRoom ? 'disabled' : ''} chat-input`} 
                    type="text" 
                    value={message} 
                    onChange={handleTyping} 
                    onKeyDown={handleSend}
                    disabled={!joinedRoom}
                    placeholder="Your message"/>
        
                    <button className={`${!joinedRoom ? 'disabled' : ''} button`} onClick={sendMessage}><FiSend/></button>
                </div>
            </div>

            <div><Toaster position="bottom-right"/></div>
        </> 
    );
}