import React, { useEffect } from 'react';
import styles from './topBar.module.css';
import callImg from '../../imgs/call.png';
import { connect } from 'react-redux';
import { socket } from '../../socket-io/connection';
import { fetchAllOtherUsersFromServerTC, addNewUserAC, removeUserAC } from '../../redux/reducers/usersReducer';
import { EVENTS } from '../../const/events';

function TopBar(props) {

    useEffect(() => {
        if (socket.id) {
            props.fetchAllOtherUsersFromServerTC(socket.id);
        }
    }, [socket.id])
    useEffect(() => {
        socket.on(EVENTS.NOTIFY_EVERYBODY_SOMEONE_JOINED, (username, id) => {
            props.addNewUserAC(username, id)
        })

        return function cleanup() {
            socket.off(EVENTS.NOTIFY_EVERYBODY_SOMEONE_JOINED);
        }

    }, [props])

    return (
        <div className={styles.topBar}>
       
            {props.users.map((user, index) => {
                return (
                    <div key={index} className={(user?.me ? styles.currentUser : '')}>  {/* добавил '?' в user.me */}
                        {user.username}
                    </div>
                )
            })}

            <img className={styles.callImg} src={callImg} alt='call'></img>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        users: state.usersReducer.usersList,
    }
}

export default connect(mapStateToProps, { fetchAllOtherUsersFromServerTC, addNewUserAC, removeUserAC })(TopBar)