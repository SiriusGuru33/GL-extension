import React, { useState } from "react";
import { Button } from 'semantic-ui-react'

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
            <Header userdata={userData} profilePhotoUri={userData.profilePhotoUri} setScreenState={setScreenState} />
            <div className='body'>
                {/* <button className="btn" onClick={onAddWallet}>Add Wallet</button> */}
                <div className="btn">
                    <Button color='violet' onClick={onSend} size='big' fluid >Send</Button>
                </div>
                <div className="btn">
                    <Button color='violet' onClick={onReceive} size='big' fluid >Receive</Button>
                </div>
                {/* <button className="btn" onClick={onSend}>Send</button>
                <button className="btn" onClick={onReceive}>Receive</button> */}
            </div>
        </div>
    )
}

export default Home;