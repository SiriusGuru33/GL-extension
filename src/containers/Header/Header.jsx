import React from 'react';

import logoIcon from '../../assets/img/icon-34.png';
import userProfileIcon from '../../assets/img/userProfile.png';

import './Header.css'

function Header({ username, profilePhotoUri }) {
    return (
        <header className="App-header">
            <img src={logoIcon} alt='logo' className='app-logo' />
            <p>
                {username || 'Gridlock'}
            </p>
            <img src={profilePhotoUri ? { uri: profilePhotoUri } : userProfileIcon} alt='User Profile' />
        </header>
    );
}

export default Header;
