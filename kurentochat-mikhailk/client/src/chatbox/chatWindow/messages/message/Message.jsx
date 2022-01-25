import React from 'react';
import styles from './Message.module.css';

export function Message(props) {
    return (
        <div className={styles.messageContainer}>
            <div className={styles.sender}>{props.sender}:</div>
            <div className={styles.message}>{props.message}</div>
        </div>
    )
}