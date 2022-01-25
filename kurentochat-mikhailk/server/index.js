const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const usersRouter = require('./users/users-router');
const usersArr = require('./users/usersArr');
const messagesArr = require('./messages/messagesArr')
const cors = require('cors');
const { origin, port } = require('./config/vars');
const EVENTS = require('./const/events');
const videoHandlers = require('./handlers/video-handlers');

const app = express();
const httpServer = createServer(app);

const corsOptions = {
    origin,
    credentials: true
}

app.use(express.json())
app.use(cors(corsOptions))
app.use('/api/users', usersRouter);

const io = new Server(httpServer, {
    cors: {
        origin: [origin],
    },
})

io.on('connection', (socket) => {
    socket.on(EVENTS.ATTEMPT_CONNECT_TO_ROOM, (username) => {

        if (usersArr.length < 4) {
            //
            const user = { username, id: socket.id, };
            usersArr.push(user)
            socket.join('the-only-room');
            socket.emit(EVENTS.JOIN_SUCCESS, username, socket.id)

            socket.on(EVENTS.PUBLISH, (data, cb) => videoHandlers.publish(socket, user, data, cb));
            socket.on(EVENTS.VIEW, async (data, cb) => {
                await videoHandlers.view(socket, user, data, cb);
            });
            
            socket.on(EVENTS.ICE_CANDIDATE, (callId, candidate) => videoHandlers.iceCandidate(callId, candidate));

            socket.on(EVENTS.NOTIFY_SERVER_SOMEONE_IS_STREAMING, (callId) => {
                socket.broadcast.to('the-only-room').emit(EVENTS.NOTIFY_EVERYBODY_SOMEONE_IS_STREAMING, callId);
            });

            messagesArr.forEach((messageObj) => {
                io.to(socket.id).emit(EVENTS.RECEIVED_MESSAGE, messageObj);
            })

            socket.broadcast.to('the-only-room').emit(EVENTS.NOTIFY_EVERYBODY_SOMEONE_JOINED, username, socket.id);

            socket.on(EVENTS.NEW_MESSAGE_SENT, (messageObj) => {
                messagesArr.push(messageObj);
                socket.broadcast.to('the-only-room').emit(EVENTS.RECEIVED_MESSAGE, messageObj);
            })

        } else {
            socket.emit(EVENTS.FULL_ROOM)
        }
        console.log(usersArr);
    })


    socket.on("disconnecting", (reason) => {
        for (const room of socket.rooms) {
            if (room !== socket.id) {
                const indexOfUser = usersArr.findIndex((user) => {
                    return user.id === socket.id;
                })
                if (indexOfUser !== -1) {
                    socket.to(room).emit(EVENTS.NOTIFY_USER_LEFT, socket.id, usersArr[indexOfUser].publishStream?.callId); 
                }
                usersArr.splice(indexOfUser, 1) // на стороне сервера удалим пользователя вместе с информацией о publish соединении 
            }
        }

    });
})
app.get('/api', (req, res) => {
    res.json({ message: "Success. Hello from server!" })
})

httpServer.listen(port, () => {
    console.log('server is listening on port 3001');
})

