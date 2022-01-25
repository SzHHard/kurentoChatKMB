import { io } from "socket.io-client";
import {API_URL} from '../config/vars';

export const socket = io(API_URL, {
    transports: ["websocket", "polling"]
});

