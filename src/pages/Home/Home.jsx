import React, { useState } from "react";
import QRCode from 'qrcode'

import gridlockIcon from '../../assets/img/icon-34.png';
import './Home.css';

import Header from "../../containers/Header/Header";

const Home = ({ userData, setScreenState }) => {

    const onAddWallet = (e) => {
        setScreenState('AddWallet');
    };

    const onSend = (e) => {
        setScreenState('Send');
    };

    const onReceive = (e) => {
        setScreenState('Receive');
    };

    return (
        <div className="App">
            <Header username={userData.username} profilePhotoUri={userData.profilePhotoUri} />
            <div className='body'>
                <button className="btn" onClick={onAddWallet}>Add Wallet</button>
                <button className="btn" onClick={onSend}>Send</button>
                <button className="btn" onClick={onReceive}>Receive</button>
            </div>
        </div>
    )
}

export default Home;