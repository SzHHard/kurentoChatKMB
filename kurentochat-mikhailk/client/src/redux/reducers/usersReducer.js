import { socket } from '../../socket-io/connection';
import axios from 'axios';
import { EVENTS } from '../../const/events';
import { API_URL } from '../../config/vars';
import { viewStreamTC } from './streamsReducer';

const instance = axios.create({
    baseURL: API_URL,
    withCredentials: true,
})

socket.on(EVENTS.FULL_ROOM, () => {
    alert('Room is full')
})

let initialState = {
    usersList: [],
}

const ADD_NEW_USER = 'ADD_NEW_USER';
const REMOVE_USER = 'REMOVE_USER';
const FILL_USERS_ARR = 'FILL_USERS_ARR';
const ADD_CALL_ID_OF_MY_STREAM = 'ADD_CALL_ID_OF_MY_STREAM';

export const usersReducer = (state = initialState, action) => {

    switch (action.type) {
        case ADD_NEW_USER:
            const newUser = { username: action.username, id: action.userId, publishCallId: action.publishCallId, me: action.me };
            return { ...state, usersList: [...state.usersList, newUser] };

        case REMOVE_USER:
            const updatedUsersList = state.usersList.filter((user) => {
                return user.id !== action.userId
            })
            return { usersList: [...updatedUsersList] };

        case FILL_USERS_ARR:
            const allUsersExceptMe = [];
           
            action.usersArr.forEach((user) => {
                allUsersExceptMe.push({ username: user.username, id: user.id, publishCallId: user.publishStream?.callId })
            });

            return {
                usersList: [{ id: socket.id, username: sessionStorage.getItem('username'), me: true }, ...allUsersExceptMe]
            };
        case ADD_CALL_ID_OF_MY_STREAM: 
            let me = null; 
            const allExceptMe = state.usersList.filter((user) => {
                if(!user.me) { 
                    return true
                } else {
                    me = user;
                    me.callId = action.callId;
                    return false;
                }
            })
            return {usersList: [me, ...allExceptMe]}
        default:
            return state;
    }

}

export const addNewUserTC = (username, me = false) => {

    return (dispatch) => {
        socket.emit(EVENTS.ATTEMPT_CONNECT_TO_ROOM, username);

        socket.on(EVENTS.JOIN_SUCCESS, (username, userId) => {
            dispatch(addNewUserAC(username, userId, me));
        })
        socket.on(EVENTS.FULL_ROOM, () => {
            console.log('room is full (will be displayed later)');
        })
    }
}

export const fetchAllOtherUsersFromServerTC = (id) => {
    return (dispatch) => {
        instance.get('/api/users/getAll?except=' + id).then((resp) => {
            const usersArr = resp.data.usersArr;
            dispatch(fillUsersArrAC(usersArr));
            usersArr.forEach((user) => {
                if(user.publishStream) {
                    dispatch(viewStreamTC(user.publishStream.callId));
                }
            })
        }).catch((err) => {
            console.log(err);
        })
    }
}

export const removeUserAC = (id) => {
    return { type: REMOVE_USER, userId: id }
}

const fillUsersArrAC = (usersArr) => {
    return { type: FILL_USERS_ARR, usersArr };
}

export const addNewUserAC = (username, userId, me = false, publishCallId) => {
    return { type: ADD_NEW_USER, username, userId, me, publishCallId}
}

export const addCallIdOfMyStream = (callId) => {
    return {type: ADD_CALL_ID_OF_MY_STREAM, callId}
}