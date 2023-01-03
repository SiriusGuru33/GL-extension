import React, { useState, useEffect } from "react";
import QRCode from 'qrcode'
import axios from 'axios';

import './Transfer.css';

import Header from "../../containers/Header/Header";
import { SERVER_URL, LAMPORTS_PER_SOL } from "../../constants";

const Transfer = ({ userData, setScreenState, action, wallets, deviceID }) => {
    const [currentCoinType, setCurrentCoinType] = useState('solana');
    const [qrSrc, setQrSrc] = useState(null);
    const [transferAmount, setTransferAmount] = useState('');
    const [receiverAddress, setReceiverAddress] = useState('');
    const [errMsg, setErrMsg] = useState('');

    useEffect(() => {
        if (currentCoinType) {
            const walletAddress = wallets.find((walletItem) => walletItem.coinType === currentCoinType).address;
            QRCode.toDataURL(walletAddress, {
                width: 300,
                margin: 2,
            }, (err, url) => {
                if (err) return console.error(err)
                setQrSrc(url);
            });
        }
    }, [currentCoinType, wallets])

    const onWalletSelect = (e) => {
        setCurrentCoinType(e.target.value);
    }

    const onBack = (e) => {
        setScreenState('Home');
    }

    const onAmountChange = (e) => {
        setTransferAmount(e.target.value);
    }

    const onAddressChange = (e) => {
        setReceiverAddress(e.target.value);
    }

    const onSend = async (e) => {
        if (transferAmount === '') {
            setErrMsg('Please input transfer amount');
            return;
        }
        if (receiverAddress === '') {
            setErrMsg('Please input receiver address');
            return;
        }
        setErrMsg('');
        const transaction_api = currentCoinType === 'solana' ? '/transaction/eddsa' : '/transaction';
        const selectedWallet = wallets.find((walletItem) => walletItem.coinType === currentCoinType);
        let response = null;
        if (currentCoinType === 'solana') {
            response = await axios.post(SERVER_URL + transaction_api, {
                coinType: selectedWallet.coinType,
                keyId: selectedWallet.keyId,
                isTestCoin: false,
                transaction: {
                    from: selectedWallet.address,
                    to: receiverAddress,
                    amount: Number(parseFloat(transferAmount)) * LAMPORTS_PER_SOL,
                },
                extensionDeviceID: deviceID,
                token: userData.token,
            });
        } else {
            response = await axios.post(SERVER_URL + transaction_api,
                {
                    toAddress: receiverAddress,
                    fromAddress: selectedWallet.address,
                    value: transferAmount,
                    coinType: selectedWallet.coinType,
                    keyId: selectedWallet.keyId,
                    isTestCoin: false,
                    extensionDeviceID: deviceID,
                    token: userData.token,
                }
            );
        }
        console.log(response);
    }

    const getWalletBalane = () => {
        const selectedWallet = wallets.find((walletItem) => walletItem.coinType === currentCoinType);
        console.log(selectedWallet);
        return selectedWallet.balance;
    }

    return (
        <div className="App">
            <Header username={userData.username} profilePhotoUri={userData.profilePhotoUri} />
            <div className='transfer-body'>
                <div className="wallet-container">
                    <div>Wallets:</div>
                    <select onChange={onWalletSelect} className="wallet-select">
                        {
                            wallets.map((walletItem) => <option value={walletItem.coinType} key={walletItem.coinType}>{walletItem.coinType}</option>)
                        }
                    </select>
                </div>
                <div className="balance-container">
                    <div>
                        Current Balance: {getWalletBalane()}
                    </div>
                </div>
                {action === 'Receive' ? (
                    <>
                        <div>Please select wallet to receive.</div>
                        <div className="qr-container">
                            {qrSrc && <img className='qrcode' src={qrSrc} alt='QR code' />}
                        </div>
                    </>
                ) : (
                    <>
                        <div>Send Amount:</div>
                        <input placeholder="Amount" value={transferAmount} onChange={onAmountChange} />
                        <div>Receiver Address:</div>
                        <input placeholder="Address" value={receiverAddress} onChange={onAddressChange} />
                        <button className="btn" onClick={onSend}>Send</button>
                    </>
                )}
                <div>{errMsg}</div>
                <button className="btn" onClick={onBack}>Back</button>
            </div>
        </div>
    )
}

export default Transfer;