import React from 'react';

import { SCREEN_NAME } from '../../constants';
import logoIcon from '../../assets/img/icon-34.png';
import userProfileIcon from '../../assets/img/userProfile.png';

import './Header.css'

function Header({ userdata, profilePhotoUri, setScreenState }) {
    const onAccountClick = (e) => {
        setScreenState(SCREEN_NAME.ACCOUNT);
    };

    return (
        <header className={userdata ? "App-header Account-header" : "App-header"}>
            <img src={logoIcon} alt='logo' className='app-logo' />
            <p>
                {userdata?.username || 'Gridlock'}
            </p>
            <img src={profilePhotoUri ? { uri: profilePhotoUri } : userProfileIcon} alt='User Profile' onClick={onAccountClick} />
        </header>
    );
}

export default Header;
