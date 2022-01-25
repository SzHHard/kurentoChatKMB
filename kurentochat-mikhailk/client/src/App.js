import './App.css';
import Chat from './chatbox/Chat';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import React, { useEffect } from 'react';
import { addNewUserTC } from './redux/reducers/usersReducer';
import { connect } from 'react-redux';
import { socket } from './socket-io/connection';
import WaitRoom from './waitroom/WaitRoom';

socket.on('connect', () => {
  console.log('socket.id: ', socket.id);
})


function App(props) {

  useEffect(() => {
    const usernameFromLS = sessionStorage.getItem('username');
    if (!usernameFromLS) {
      const username = window.prompt("What's your name?", "user-пришелец")
      sessionStorage.setItem('username', username || "user-пришелец");
    }
    props.addNewUserTC(sessionStorage.getItem('username') || "user-пришелец", true);
  }, [])

  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path='/'>
            <Route index element={<WaitRoom />} />
            <Route path='chat' element={<Chat />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default connect(null, { addNewUserTC })(App);
