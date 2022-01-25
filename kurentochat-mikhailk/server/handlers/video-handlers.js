const events = require('../const/events');
const { createVideoStream, addToCandidatesQueue, getVideoStream } = require('../services/video.service');


exports.publish = async (socket, user, data, cb) => {
    const { offer, callId } = data;
    const { answer, videoStream } = await createVideoStream({
        callId,
        offer: offer,
        onIceCandidate: (candidate) => {
            socket.emit(events.ICE_CANDIDATE, callId, candidate)
        }
    });
    user.publishStream = videoStream;

    cb(answer);
};

exports.view = async (socket, user, data, cb) => {
    const { offer, callId, publishCallId } = data;
    const publishStream = getVideoStream(publishCallId);
    if (!publishStream) {
        console.log(`publish stream with call id ${publishCallId} does not exist`);
        return;
    }
    const { answer, videoStream } = await createVideoStream({
        callId,
        offer: offer,
        onIceCandidate: (candidate) => {
            socket.emit(events.ICE_CANDIDATE, callId, candidate)
        }
    });
    publishStream.endpoint.connect(videoStream.endpoint, (err) => {
        if (err) {
            console.log('err: ', err);
        }
    }); //magic

    cb(answer);
};

exports.iceCandidate = async (callId, candidate) => {
    const videoStream = getVideoStream(callId);
    if (!videoStream) { 
        addToCandidatesQueue(callId, candidate);
        return;
    }
    await videoStream.addCandidate(candidate);
}