import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { onRecieveNewMessageTC } from '../../../redux/reducers/messagesReducer';
import { Message } from './message/Message';
import styles from './Messages.module.css';
import { socket } from '../../../socket-io/connection';
import { EVENTS } from '../../../const/events';

function Messages(props) {

    useEffect(() => {
        socket.on(EVENTS.RECEIVED_MESSAGE, (messageObj) => {
            props.onRecieveNewMessageTC(messageObj);
        })
    }, [])

    return (
        <div className={styles.messages}>
            {props.allMessages.map((messageObj, index) => {
                return <Message key={index} message={messageObj.message} sender={messageObj.sender} />
            })}
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        allMessages: state.messagesReducer.messagesList,
    }
}

export default connect(mapStateToProps, { onRecieveNewMessageTC })(Messages)