import React from 'react';
import styles from './Chat.module.css';
import { ChatWindow } from './chatWindow/ChatWindow';
import NewMessageBar from './newMessageBar/NewMessageBar';
import TopBar from './topBar/topBar';
import { connect } from 'react-redux';
import { Navigate } from 'react-router-dom';

function Chat(props) {

    return  props.usersList[0] ? (
        <div className={styles.chat}>
            <TopBar />
            <ChatWindow />
            <NewMessageBar />
        </div>
    ) : (
        <Navigate to='/' replace={true} /> 
    )
}


const mapStateToProps = (state) => {
    return {
        usersList: state.usersReducer.usersList
    }
}

export default connect(mapStateToProps, null)(Chat)

