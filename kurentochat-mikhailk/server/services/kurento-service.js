const kurentoClient = require('kurento-client');
const { kurentoUrl } = require('../config/vars');

let kurentoConnection = null;
const getKurentoConnection = async () => {           //Creates a connection with the Kurento Media Server
    if(kurentoConnection) {
        return kurentoConnection;
    } else {
        kurentoConnection = kurentoClient(kurentoUrl);
        return kurentoConnection;
    }

}
exports.getKurentoConnection = getKurentoConnection;

let pipeline = null;
const getOrCreatePipeline = async () => {           // ` the pipeline represents a “machine” capable of performing a sequence of operations over a stream. ` docs
    if(pipeline) {
        return pipeline;
    }
    const connection = await getKurentoConnection();
    pipeline = connection.create('MediaPipeline');
    return pipeline;
}
exports.getOrCreatePipeline = getOrCreatePipeline;

exports.createEndpoint = async () => {                  //" This endpoint is one side of a peer-to-peer WebRTC communication,
    const pipeline = await getOrCreatePipeline();       //being the other peer a WebRTC capable browser -using the RTCPeerConnection API-,
    return pipeline.create('WebRtcEndpoint');           // a native WebRTC app or even another Kurento Media Server. " docs
}
