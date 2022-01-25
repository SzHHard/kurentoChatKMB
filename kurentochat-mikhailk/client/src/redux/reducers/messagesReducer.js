import { socket } from '../../socket-io/connection'
import { EVENTS } from '../../const/events';

const initialState = {
    messagesList: [],
}

const SEND_NEW_MESSAGE = 'SEND_NEW_MESSAGE';
const SHOW_NEW_MESSAGE = 'SHOW_NEW_MESSAGE';

export const messagesReducer = (state = initialState, action) => {

    switch (action.type) {
        case SEND_NEW_MESSAGE:
            socket.emit(EVENTS.NEW_MESSAGE_SENT, { message: action.newMessage, sender: action.sender });
            return { ...state, messagesList: [...state.messagesList, { message: action.newMessage, sender: action.sender }] };
        case SHOW_NEW_MESSAGE:
            return { ...state, messagesList: [...state.messagesList, { message: action.newMessage, sender: action.sender }] };
        default:
            return state;
    }

}


export const onRecieveNewMessageTC = (messageObj) => {
    return (dispatch) => {
        dispatch(showNewMessageAC({ newMessage: messageObj.message, sender: messageObj.sender }))
    }
}

const showNewMessageAC = (messageObj) => {
    return { type: SHOW_NEW_MESSAGE, newMessage: messageObj.newMessage, sender: messageObj.sender }
}

export const sendNewMessageAC = (messageObj) => {
    return { type: SEND_NEW_MESSAGE, newMessage: messageObj.newMessage, sender: messageObj.sender }
}