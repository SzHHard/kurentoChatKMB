import { getConstraints, getUserMedia } from "../utils/mediaDevices";
import { CONNECTION_TYPES } from "../const/CONNECTION_TYPES";

export class WebRtcConnection {
    constructor(data) {
        this.callId = data.callId;
        this.publishCallId = data.publishCallId
        this.type = data.type;

        this.iceServers = null; // will be a turn server

        this.onGotOffer = data.onGotOffer;
        this.onGotCandidate = data.onGotCandidate;
        this.onGotRemoteStream = data.onGotRemoteStream; // for view only 
        this.onGotLocalStream = data.onGotLocalStream; //for publish only

        this.sdpAnswerSet = false;
    }
    generateLocalStream = async () => {
        const constraints = getConstraints();
        this.localStream = await getUserMedia(constraints);
        this.onGotLocalStream(this.localStream); // вызовет addStreamAC -> добавит стрим в state
    }


    createPeerConnection = async () => {
        const configuration = {
            iceServers: [
            {
                urls: 'turn:78.46.107.230:3486',
                username: 'kurentoturn',            //78.46.107.230:3486
                credential: 'kurentoturnpassword', //78.46.107.230:3486  //Hetzner Online GmbH (AS24940)
            },
         {
            urls: 'stun:stun.12connect.com:3478' //3478
         }]
        }
        this.peerConnection = new RTCPeerConnection(configuration);

        this.peerConnection.oniceconnectionstatechange = (event) => {
            if (this.peerConnection.iceConnectionState === "failed") {
                console.log('Unexpected behavior - iceConnectionState failed');
            } else {
                console.log('iceConnectionState changed: ' + this.peerConnection.iceConnectionState);
            }
        }

        this.peerConnection.onicecandidate = (e) => {
            return e.candidate && this.onGotCandidate(e.candidate) //emits.ICE_CANDIDATE({callId, candidate})  
        }
        if (this.type === CONNECTION_TYPES.VIEW) {
            this.peerConnection.ontrack = e => { // triggered при установлении соединения с обеих сторон. (state === connected)
                this.remoteStream = this.remoteStream || new MediaStream();
                this.remoteStream.addTrack(e.track);
                this.onGotRemoteStream(this.remoteStream); //to state
            }
        }
    }

    createOffer = async () => {

        const isView = this.type === CONNECTION_TYPES.VIEW;
        if (this.localStream) {
            this.peerConnection.addStream(new MediaStream(this.localStream.getTracks()));
        }

        const offer = await this.peerConnection.createOffer({
            offerToReceiveAudio: isView,
            offerToReceiveVideo: isView
        });

        await this.peerConnection.setLocalDescription(offer);

        this.onGotOffer(this.callId, offer.sdp, this.publishCallId)
        console.log(this.peerConnection)
    }

    addAnswer = async (sdp) => {
        await this.peerConnection.setRemoteDescription({ type: 'answer', sdp });
        this.sdpAnswerSet = true;
    };

    addIceCandidate = async (candidate) => {
        await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    }

}
