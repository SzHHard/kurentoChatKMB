import WebRtcController from "../../controllers/webRtcController";
import { v4 as uuid } from 'uuid';
import { EVENTS } from "../../const/events";
import { socket } from "../../socket-io/connection";
import { addCallIdOfMyStream } from './usersReducer'


const ADD_STREAM = 'ADD_STREAM';
const REMOVE_STREAM = 'REMOVE_STREAM';
const TOGGLE_MEADIA_TRACK = 'TOGGLE_MEADIA_TRACK';


const initialState = {
    streams: [],
    ifEnabledObj: {
        isVideoEnabled: true,
        isAudioEnabled: true,
    }
}

export const streamsReducer = (state = initialState, action) => {

    switch (action.type) {
        case ADD_STREAM:
            const otherStreams = state.streams.filter((stream) => {
                return stream.callId !== action.callId;
            })
            return { streams: [...otherStreams, { stream: action.stream, callId: action.callId }], ifEnabledObj: state.ifEnabledObj  };

        case REMOVE_STREAM:
            const streamsToKeep = state.streams.filter((stream) => {
                return stream.callId !== action.callId;
            })
            return { streams: streamsToKeep, ifEnabledObj: state.ifEnabledObj };
        case TOGGLE_MEADIA_TRACK:
            action.track.enabled = !action.track.enabled;
            if (action.kind === 'video') {
                return {
                    streams: state.streams,
                    ifEnabledObj: {
                        isVideoEnabled: !state.ifEnabledObj.isVideoEnabled,
                        isAudioEnabled: state.ifEnabledObj.isAudioEnabled,
                    }
                }
            } else {
                return {
                    streams: state.streams,
                    ifEnabledObj: {
                        isVideoEnabled: state.ifEnabledObj.isVideoEnabled,
                        isAudioEnabled: !state.ifEnabledObj.isAudioEnabled,
                    }
                }
            }
        default:
            return state;
    }
}

export const publishStreamTC = () => {
    return async (dispatch) => {
        const callId = uuid();
        await WebRtcController.createPublishConnection({
            callId,
            onGotLocalStream: (stream) => {
                dispatch(addStreamAC(stream, callId));
            },
            onGotCandidate: (candidate) => socket.emit(
                EVENTS.ICE_CANDIDATE, callId, candidate
            ),
            onGotOffer: (callId, sdp) => {
                socket.emit(EVENTS.PUBLISH, { callId, offer: sdp }, (answer) => {
                    WebRtcController.addAnswerAndFlush(callId, answer)
                    socket.emit(EVENTS.NOTIFY_SERVER_SOMEONE_IS_STREAMING, callId)
                })
            }
        });
        dispatch(addCallIdOfMyStream(callId));
    }
}

export const viewStreamTC = (publishCallId) => {
    return async (dispatch) => {
        const callId = uuid();
        await WebRtcController.createViewConnection({
            callId,
            publishCallId,

            onGotRemoteStream: (stream) => {
                dispatch(addStreamAC(stream, callId));
            },

            onGotCandidate: (candidate) => socket.emit(
                EVENTS.ICE_CANDIDATE, callId, candidate
            ),
            onGotOffer: (callId, sdp, publishCallId) => {
                socket.emit(EVENTS.VIEW, { callId, offer: sdp, publishCallId }, (answer) => {
                    WebRtcController.addAnswerAndFlush(callId, answer)
                })
            }
        })
    }
}

export const stopViewConnectionTC = (publishCallId) => {
    return async (dispatch) => {
        const callId = await WebRtcController.closeViewConnection(publishCallId);
        console.log('callId: ', callId);
        dispatch(removeStreamAC(callId));
    }
}

export const toggleMediaTrackAC = (track, kind) => { //should I make it 1 function TOGGLE mediaTrackAC
    return { type: TOGGLE_MEADIA_TRACK, track, kind }
}

const addStreamAC = (stream, callId) => {
    return { type: ADD_STREAM, stream, callId }
}

export const removeStreamAC = (callId) => {
    return { type: REMOVE_STREAM, callId }
}