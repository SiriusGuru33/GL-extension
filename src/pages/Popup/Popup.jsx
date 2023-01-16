import React, { useEffect, useState, useCallback } from 'react';
import cryptoRandomString from 'crypto-random-string';
import axios from 'axios';
import 'semantic-ui-css/semantic.min.css'

import { DEVICE_ID_KEY, FIREBASE_REG_ID, USER_DATA_KEY, SERVER_URL, SCREEN_NAME } from '../../constants';
import './Popup.css';
import logoIcon from '../../assets/img/icon-34.png';

import Onboarding from '../Onboarding/Onboarding';
import Home from '../Home/Home';
import Account from '../Account/Account';
import Transfer from '../Transfer/Transfer';

const Popup = () => {
  const [deviceId, setDeviceID] = useState('');
  const [userData, setUserData] = useState(null);
  const [qr, setQR] = useState(null);
  const [firebaseRegId, setFirebaseRegID] = useState('');
  const [notificationMsg, setNotificationMsg] = useState(null);
  const [screenState, setScreenState] = useState(SCREEN_NAME.ONBOARDING);
  const [wallets, setWallets] = useState([]);

  useEffect(() => {
    chrome.storage.sync.get([DEVICE_ID_KEY, FIREBASE_REG_ID, USER_DATA_KEY], function (items) {
      if (items[DEVICE_ID_KEY]) {
        setDeviceID(items[DEVICE_ID_KEY]);
        console.log(items[DEVICE_ID_KEY]);
      } else {
        const token = cryptoRandomString({ length: 30, type: 'base64' });
        console.log(`Generate deviceID: ${token}`)
        chrome.storage.sync.set({ [DEVICE_ID_KEY]: token }, function () {
          setDeviceID(token);
        });
      }
      if (items[USER_DATA_KEY]) {
        setUserData(JSON.parse(items[USER_DATA_KEY]));
        setScreenState(SCREEN_NAME.HOME);
      }
      setFirebaseRegID(items[FIREBASE_REG_ID]);
      console.log(items[FIREBASE_REG_ID]);
    });

    function tokenRegistered(registration_id) {
      chrome.storage.sync.set({ [FIREBASE_REG_ID]: registration_id }, function () {
        console.log('Store firebase reg ID');
      });
      if (chrome.runtime.lastError) {
        console.log("failed")
        return
      }
    }
    chrome.gcm.register(["209550883114"], tokenRegistered)

    chrome.gcm.onMessage.addListener((message) => {
      console.log(message);
      if (message.data.type === "REGISTER_SUCCESS") {
        const userObj = JSON.parse(message.data.params);
        setUserData(userObj);
        chrome.storage.sync.set({ [USER_DATA_KEY]: JSON.stringify(userObj) }, function () {
          console.log('Store user data.');
        });
        setScreenState(SCREEN_NAME.HOME);
      }
      setNotificationMsg(message);
    })
  }, []);

  useEffect(() => {
    console.log(userData, deviceId);
    if (userData && deviceId && wallets.length === 0) {
      console.log('Wallets Fetching');
      console.log(userData);
      axios.get(`${SERVER_URL}/wallet`, {
        params: {
          extensionDeviceID: deviceId,
          nodeId: userData.nodeId,
        }
      }).then((resp) => {
        if (resp.data?.wallets) {
          console.log(resp.data?.wallets);
          setWallets(resp.data.wallets);
        } else {
          console.log('Failed to get wallets data');
        }
      }).catch((err) => {
        console.error(err);
      })
    }
  }, [userData, deviceId, wallets])

  const onLogout = () => {
    chrome.storage.sync.remove(USER_DATA_KEY, () => {
      setScreenState(SCREEN_NAME.ONBOARDING);
      setUserData(null);
    })
  }

  return (
    <div className="App">
      {!userData && <Onboarding firebaseRegId={firebaseRegId} deviceId={deviceId} />}
      {screenState === SCREEN_NAME.HOME && <Home userData={userData} setScreenState={(action) => setScreenState(action)} />}
      {screenState === SCREEN_NAME.ACCOUNT && <Account userData={userData} setScreenState={(action) => setScreenState(action)} onLogout={onLogout} />}
      {[SCREEN_NAME.SEND, SCREEN_NAME.RECEIVE].includes(screenState) && <Transfer userData={userData} action={screenState} setScreenState={setScreenState} wallets={wallets} deviceId={deviceId} />}

    </div>
  );
};

export default Popup;
