import { createStore, applyMiddleware } from 'redux';
import { combineReducers } from 'redux';
import { messagesReducer } from './reducers/messagesReducer';
import { usersReducer } from './reducers/usersReducer';
import { streamsReducer } from './reducers/streamsReducer';
import thunkMiddleware from 'redux-thunk';

let reducers = combineReducers({ messagesReducer, usersReducer, streamsReducer })

const store = createStore(reducers, applyMiddleware(thunkMiddleware))


export default store;