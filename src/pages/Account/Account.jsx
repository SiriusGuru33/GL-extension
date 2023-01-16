import React, { useState, useEffect } from "react";
import { Button, Image } from 'semantic-ui-react'

import './Account.css';

import profileImg from '../../assets/img/userProfile.png';
import { SERVER_URL, LAMPORTS_PER_SOL, SCREEN_NAME } from "../../constants";

const Account = ({ userData, setScreenState, onLogout }) => {

    const onBack = (e) => {
        setScreenState(SCREEN_NAME.HOME);
    };

    return (
        <div className="App account">
            <Image src={userData.profilePhotoUri ? { uri: userData.profilePhotoUri } : profileImg} size='small' circular alt='Profile' />
            <div>{userData.username}</div>
            <Button color='red' onClick={() => onLogout()} size='big' fluid>Logout</Button>
            <Button color='violet' onClick={onBack} size='big' fluid>Back</Button>
        </div>
    )
}

export default Account;