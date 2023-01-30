


function Message({ message, index, username}) {
    const typeMessage = () => {
        if(message.notification) 
            return 'notification';
        if(message.author === username) 
            return 'message me';
        return 'message other';
    }

    return ( 
        <>
            <div key={index} className={`${typeMessage()}`}>
                {message.author === username ? '' : <p className='message-author'>{message.author}</p>}
                <p className='message-text' dangerouslySetInnerHTML={{__html: message.message}}></p>
                <p className='message-time'>{message.time}</p>
            </div>
        </>
    );
}

export default Message;