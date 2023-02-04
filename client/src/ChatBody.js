import { useEffect, useRef, createRef } from 'react';
import Message from './Message'

function ChatBody({messageList, username}) {
    const lastMessageRef = useRef(null);

    useEffect(() => {
        if(lastMessageRef.current)
            lastMessageRef.current.scrollIntoView();
        // lastMessageRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // for some reason, the above line doesn't work in chrome 🥲
    }, [messageList]);

    return ( 
        <div className="chat-messages">
            {messageList.map((message, index) => (
                <Message key={index} index={index} message={message} username={username}/>
            ))}
            <div className='last-message' ref={lastMessageRef} />
        </div>
    );
}

export default ChatBody;