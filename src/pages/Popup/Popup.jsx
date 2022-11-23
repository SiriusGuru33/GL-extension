import React, { useEffect, useState, useCallback } from 'react';
import QRCode from 'qrcode'
import cryptoRandomString from 'crypto-random-string';

import { DEVICE_ID_KEY } from '../../constants';
import './Popup.css';
import logoIcon from '../../assets/img/icon-34.png';

const Popup = () => {
  const [deviceID, setDeviceID] = useState('');
  const [userData, setUserData] = useState(null);
  const [qr, setQR] = useState(null);

  useEffect(() => {
    chrome.storage.sync.get(DEVICE_ID_KEY, function (items) {
      console.log(items);
      if (items[DEVICE_ID_KEY]) {
        setDeviceID(items[DEVICE_ID_KEY]);
        console.log(`Existing deviceID: ${items[DEVICE_ID_KEY]}`)
      } else {
        const token = cryptoRandomString({ length: 30, type: 'base64' });
        console.log(`Generate deviceID: ${token}`)
        chrome.storage.sync.set({ [DEVICE_ID_KEY]: token }, function () {
          setDeviceID(token);
        });
      }
      setUserData(items.user);
      console.log(items.user);
    });
  }, []);

  useEffect(() => {
    if (deviceID && userData === undefined) {
      const codeData = JSON.stringify({
        guardianType: 'extension',
        deviceID: deviceID,
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
        setQR(url);
      });
    }
  }, [deviceID, userData]);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logoIcon} alt='logo' />
        <p>
          Gridlock
        </p>
      </header>
      <div className='body'>
        {!!qr && (
          <div>
            <p>Scan QR code from Gridlock mobile app</p>
            <img className='qrcode' src={qr} alt='QR code' />
          </div>
        )}
      </div>
    </div>
  );
};

export default Popup;
