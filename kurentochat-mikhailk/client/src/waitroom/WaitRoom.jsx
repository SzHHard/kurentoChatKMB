import React from 'react'
import { connect } from 'react-redux';
import { Navigate } from 'react-router-dom';

const WaitRoom = (props) => {
    return props.usersArr[0] ? <Navigate to='/chat' replace={true} /> : (
        <div>
            Подождите, пока сервер проверит, свободна ли комната.
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        usersArr: state.usersReducer.usersList
    }
}

export default connect(mapStateToProps, null)(WaitRoom);