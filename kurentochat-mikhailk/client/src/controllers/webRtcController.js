import { CONNECTION_TYPES } from "../const/CONNECTION_TYPES";
import { WebRtcConnection } from "./webRtcConnection";

class WebRtcController {
    constructor() {
        this.connections = {};
        this.candidatesQueue = {};
    }

    createPublishConnection = async (data) => {
        const connection = new WebRtcConnection({ ...data, type: CONNECTION_TYPES.PUBLISH });

        await connection.generateLocalStream();
        await connection.createPeerConnection();
        await connection.createOffer();

        this.connections[connection.callId] = connection;
    }

    createViewConnection = async (data) => {
        const connection = new WebRtcConnection({ ...data, type: CONNECTION_TYPES.VIEW });
        await connection.createPeerConnection();
        await connection.createOffer();

        this.connections[connection.callId] = connection;
    }

    closeViewConnection = async (publishCallId) => {
        const connectionArr = Object.values(this.connections).filter((con) => {
            return con.publishCallId === publishCallId;
        });
        if(connectionArr.length) {
            const connection = connectionArr[0];

            delete this.connections[connection.callId];
            return connection.callId;
        } else {
            return
        }
    }

    addAnswerAndFlush = async (callId, answer) => {
        const connection = this.connections[callId];
        await connection.addAnswer(answer);
        const candidatesQueue = this.candidatesQueue[callId];
        if (candidatesQueue) {
            for (let i = 0; i < candidatesQueue.length; i++) {
                await connection.addIceCandidate(candidatesQueue[i]);
            }
            delete this.candidatesQueue[callId];
        }
    };

    addIceCandidate = async (callId, candidate) => {
        const connection = this.connections[callId];
        if (connection && connection.sdpAnswerSet) {
            return await connection.addIceCandidate(candidate);
        } else {
            this.candidatesQueue[callId] = this.candidatesQueue[callId] || [];

            this.candidatesQueue[callId].push(candidate);
        }
    }
}

export default new WebRtcController();