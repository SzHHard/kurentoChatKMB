import React, { useState } from 'react';
import styles from './NewMessageBar.module.css';
import { sendNewMessageAC } from '../../redux/reducers/messagesReducer';
import { connect } from 'react-redux';


const NewMessageBar = (props) => {

    const [newMessage, setNewMessage] = useState('')

    function handleKeyDown(e) { // при нажатии ctrl+enter отправим сообщение
        if (e.code === 'Enter' && e.ctrlKey === true) {
            sendMessage();
        }
    }

    function sendMessage() {
        if (newMessage.trim()) {
            props.dispatch(sendNewMessageAC({ newMessage, sender: sessionStorage.getItem('username') }));
            setNewMessage('');
        }
    }
    function handleChange(e) {
        setNewMessage(e.target.value);
    }

    return (
        <div className={styles.NewMessageBar}>
            <textarea onKeyDown={handleKeyDown} value={newMessage} onChange={handleChange} />
            <button onClick={sendMessage}> Send </button>
        </div>
    )
}



export default connect(null, null)(NewMessageBar)
