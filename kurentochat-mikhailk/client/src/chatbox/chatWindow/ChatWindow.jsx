import React from 'react';
import styles from './ChatWindow.module.css';
import Messages from './messages/Messages';
import VideoChat from './videoChat/VideoChat';

export function ChatWindow(props) {

    return (
        <div className={styles.chatWindow}>
            <VideoChat />
            <Messages />
        </div>
    )
}