
import { FiArrowRight, FiUser} from "react-icons/fi";

function Modal(props) {
    return ( 
        <div className="modal-container">
            <div className="modal">
                <h2>Choose your username</h2>

                <label htmlFor="username"><FiUser/> Username</label>
                <input 
                    type="text" 
                    value={props.username} 
                    onChange={(e) => props.setUsername(e.target.value)} 
                    placeholder="Your username"
                    id="username"/>

                {/* <label htmlFor="room">Room</label>
                <input 
                    type="text" 
                    value={props.room} 
                    onChange={(e) => props.setRoom(e.target.value)} 
                    placeholder="Name of the room"
                    id="room"/> */}

                <button className="button" onClick={() => props.joinUser()}>Join <FiArrowRight/></button>

            </div>

        </div>
    );
}

export default Modal;