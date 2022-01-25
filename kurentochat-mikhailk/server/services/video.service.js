const { createEndpoint } = require('./kurento-service');
const VideoStream = require('../models/videoStream-model');

const streams = {};
const candidatesQueue = {};

exports.createVideoStream = async ({ callId, offer, onIceCandidate }) => {
    const endpoint = await createEndpoint();

    const videoStream = new VideoStream({
        endpoint,
        callId,
        onIceCandidate
    });
    await videoStream.configureEndpoint(); //turn server

    const answer = await videoStream.processOffer(offer);

    await videoStream.flushCandidates(candidatesQueue, callId)

    await videoStream.gatherCandidates(); //соберутся кандидаты и сработает предварительно установленный в video-model handler
    streams[callId] = videoStream;

    return { answer, videoStream };
}

exports.getVideoStream = (callId) => {
    return streams[callId];
}

exports.addToCandidatesQueue = (callId, candidate) => {
    candidatesQueue[callId] = candidatesQueue[callId] || [];
    candidatesQueue[callId].push(candidate);
}