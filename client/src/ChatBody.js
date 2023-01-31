import { useEffect, useRef } from 'react';
import Message from './Message'


function ChatBody({messageList, username}) {

    const lastMessageRef = useRef(null);

    useEffect(() => {
        lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
    }, [messageList]);

    return ( 
        <div className="chat-messages">
            {messageList.map((message, index) => (
                <Message index={index} message={message} username={username}/>
            ))}
            <div ref={lastMessageRef} />
        </div>
    );
}

export default ChatBody;