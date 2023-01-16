import React, { useState } from "react";
import QRCode from 'qrcode'

import gridlockIcon from '../../assets/img/icon-34.png';
import './Onboarding.css';

const Onboarding = ({ deviceId, firebaseRegId }) => {
    const [qrSrc, setQrSrc] = useState(null);

    const onPair = (e) => {
        const codeData = JSON.stringify({
            guardianType: 'extension',
            deviceId: deviceId,
            firebaseToken: firebaseRegId,
        })
        QRCode.toDataURL(codeData, {
            width: 300,
            margin: 2,
            color: {
                // dark: '#335383FF',
                // light: '#EEEEEEFF'
            }
        }, (err, url) => {
            if (err) return console.error(err)
            setQrSrc(url);
        });
    };

    return (
        <div className="App">
            <header className="App-header">
                <img src={gridlockIcon} alt='logo' />
                <p>Gridlock</p>
            </header>
            {qrSrc ? (
                <div className="body">
                    <p>Please scan the QR code to pair your chrome extension with Gridlock app.</p>
                    <img className='qrcode' src={qrSrc} alt='QR code' />
                </div>
            ) : (
                <div className="body">
                    <div className="title">Welcome to Gridlock</div>
                    <div className="desc">Please pair your Chrome extension with your Gridlock App.</div>
                    <div className="desc">If you have not downloaded Gridlock, please use this <a href="https://gridlock.network/download" className="app-download-link">link</a> to start downloading</div>
                    <button className="btn-pair" onClick={onPair}>Pair Now</button>
                </div>
            )}
        </div>
    )
}

export default Onboarding;