import React, { useEffect, useMemo } from 'react';
import styles from './VideoChat.module.css'
import { connect } from 'react-redux';
import { publishStreamTC, viewStreamTC, stopViewConnectionTC } from '../../../redux/reducers/streamsReducer';
import { removeUserAC } from '../../../redux/reducers/usersReducer';
import webRtcController from '../../../controllers/webRtcController';
import { socket } from '../../../socket-io/connection';
import { EVENTS } from '../../../const/events';
import VideoStream from './VideoStream/VideoStream';


function VideoChat(props) {

    useEffect(() => {
        props.publishStreamTC();

        socket.on(EVENTS.ICE_CANDIDATE, async (callId, candidate) => {
            await webRtcController.addIceCandidate(callId, candidate);
        });
        socket.on(EVENTS.NOTIFY_EVERYBODY_SOMEONE_IS_STREAMING, (callId) => {
            props.viewStreamTC(callId); 
        })
        socket.on(EVENTS.NOTIFY_USER_LEFT, (socketId, callId) => { 
            props.removeUserAC(socketId)
            if (callId) {
                props.stopViewConnectionTC(callId);
            } else {
                console.log('no callId')
            }
        })
    }, [])

    const me = useMemo(() => props.usersArr.find((user) => {
        return user?.me;
    }), [props.usersArr]);

    return (
        <div className={styles.videoArea}>
            {props.streams.map(({ stream, callId }) => 
                    <VideoStream
                        callId={callId}
                        key={callId}
                        stream={stream}
                        me={me}
                    />
            )}
        </div>
    )
}


const mapStateToProps = (state) => {
    return {
        ifEnabledObj: state.streamsReducer.ifEnabledObj,
        streams: state.streamsReducer.streams,
        usersArr: state.usersReducer.usersList,
    };
}

export default connect(mapStateToProps, { publishStreamTC, viewStreamTC, stopViewConnectionTC, removeUserAC })(VideoChat);