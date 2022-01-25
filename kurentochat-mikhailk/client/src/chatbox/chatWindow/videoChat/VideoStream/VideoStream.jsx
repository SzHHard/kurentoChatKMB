import React, { useEffect, useRef } from 'react';
import { findTrackIndexByKind } from '../../../../utils/findTrackByKind';
import styles from './VideoStream.module.css';
import { connect } from 'react-redux';
import { toggleMediaTrackAC } from '../../../../redux/reducers/streamsReducer';
import enableMic from '../../../../imgs/enableMic.png';
import disableMic from '../../../../imgs/disableMic.png';
import disableVideo from '../../../../imgs/disableVideo.png';
import enableVideo from '../../../../imgs/enableVideo.png';

const VideoStream = (props) => {
    const videoRef = useRef(null);

    useEffect(() => {
        if (!videoRef.current) return;

        videoRef.current.srcObject = props.stream;
    }, [props.stream]);

    const toggleVideo = () => { //works
        const tracks = props.stream.getTracks()
        const index = findTrackIndexByKind(tracks, 'video');
        props.toggleMediaTrackAC(tracks[index], 'video');
    }
    const toggleAudio = () => { //works
        const tracks = props.stream.getTracks()
        const index = findTrackIndexByKind(tracks, 'audio');
        props.toggleMediaTrackAC(tracks[index], 'audio');
        
    }
    return (
        props.me?.callId === props.callId ?
            <div className={`${styles.videoElement} ${styles.myVideo}`}>
                <video muted autoPlay playsInline ref={videoRef} />
                <img onClick={toggleVideo}  src={props.isEnabledObj.isVideoEnabled ? disableVideo : enableVideo} />
                <img onClick={toggleAudio} src={props.isEnabledObj.isAudioEnabled ? disableMic : enableMic} />
                
            </div>
            : <div className={styles.videoElement}>
                <video autoPlay playsInline ref={videoRef} />
                {props.callId}
            </div>

    )
}

const mapStateToProps = (state) => { 
    return {
        isEnabledObj: state.streamsReducer.ifEnabledObj,
    }
}

export default connect(mapStateToProps, {toggleMediaTrackAC})(VideoStream);