const kurentoClent = require('kurento-client');
const IceCandidate = kurentoClent.getComplexType('IceCandidate');

const iceServers = {
    stun: {
        ip: '18.191.223.12',
        port: '3478'
    },
    turn: {
        url: 'kurentoturn:kurentoturnpassword@78.46.107.230:3486',
       
    },
}

class VideoStream {
    constructor({ endpoint, callId, onIceCandidate }) {
        this.endpoint = endpoint;
        this.callId = callId;
        this.endpoint.on('OnIceCandidate', (event) => {
            onIceCandidate(IceCandidate(event.candidate));
        })
    }

    async processOffer(offer) {
        return this.endpoint.processOffer(offer); // result is a string containing SDP answer (docs). Must be sent to the offerer, so it can be processed
    }
    async addCandidate(candidate) {
        await this.endpoint.addIceCandidate(IceCandidate(candidate));
    }
    async flushCandidates(candidatesQueueObj, callId) {
        if (candidatesQueueObj[callId]) {
            await Promise.all(candidatesQueueObj[callId].map(async (candidate) => {
                this.addCandidate(candidate);
            }))
            delete candidatesQueueObj[callId];
        }
    }
    async configureEndpoint() {
        await this.endpoint.setStunServerAddress(iceServers.stun.ip);
        await this.endpoint.setStunServerPort(iceServers.stun.port);
        await this.endpoint.setTurnUrl(iceServers.turn.url);

    }

    async gatherCandidates() {
        await this.endpoint.gatherCandidates();
    }
}

module.exports = VideoStream;