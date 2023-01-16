import React, { useState, useEffect } from "react";
import QRCode from 'qrcode'
import axios from 'axios';
import { Button } from 'semantic-ui-react'

import './Transfer.css';

import Header from "../../containers/Header/Header";
import { SERVER_URL, LAMPORTS_PER_SOL } from "../../constants";

const Transfer = ({ userData, setScreenState, action, wallets, deviceId }) => {
    const [currentCoinType, setCurrentCoinType] = useState('solana');
    const [qrSrc, setQrSrc] = useState(null);
    const [transferAmount, setTransferAmount] = useState('');
    const [receiverAddress, setReceiverAddress] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [transactionStatus, setTransactionStatus] = useState('inactive');

    useEffect(() => {
        if (currentCoinType) {
            const currentWallet = wallets.find((walletItem) => walletItem.coinType === currentCoinType);
            if (currentWallet) {
                QRCode.toDataURL(currentWallet.address, {
                    width: 250,
                    margin: 2,
                }, (err, url) => {
                    if (err) return console.error(err)
                    setQrSrc(url);
                });
            }

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
        if (!selectedWallet) {
            setErrMsg('Wallet Data is missing');
            return;
        }
        let response = null;
        try {
            setTransactionStatus('processing');
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
                    extensionDeviceID: deviceId,
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
                        extensionDeviceID: deviceId,
                        token: userData.token,
                    }
                );
            }
            if (response?.data?.status === 'Submitted') {
                setTransactionStatus('submitted');
            } else {
                setTransactionStatus('failed');
            }
        } catch (e) {
            setTransactionStatus('failed');
        }
    }

    const getWalletBalane = () => {
        const selectedWallet = wallets.find((walletItem) => walletItem.coinType === currentCoinType);
        console.log(selectedWallet);
        return selectedWallet.balance;
    }

    if (wallets.length === 0) {
        return (
            <div className="App">
                <Header username={userData.username} profilePhotoUri={userData.profilePhotoUri} />
                <div className='transfer-body'>
                    Loading Wallets...
                </div>
            </div>
        )
    }

    // if (transactionStatus === 'submitted') {
    //     return (
    //         <div className="App">
    //             <Header username={userData.username} profilePhotoUri={userData.profilePhotoUri} />
    //             <div className='transfer-body'>
    //                 Transaction is submitted!
    //             </div>
    //         </div>
    //     )
    // }

    return (
        <div className="App">
            <Header userdata={userData} profilePhotoUri={userData.profilePhotoUri} />
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
                        {transactionStatus === 'submitted' ? (
                            <div className="success-label">Transaction is submitted successfully</div>
                        ) : (
                            <div className="btn send-btn">
                                <Button color='violet' onClick={onSend} size='big' fluid active={transactionStatus !== 'processing'} loading={transactionStatus === 'processing'}>Send</Button>
                            </div>
                        )}
                    </>
                )}
                <div>{errMsg}</div>
                <div className="btn back-btn">
                    <Button color='grey' onClick={onBack} size='big' fluid>Back</Button>
                </div>
            </div>
        </div>
    )
}

export default Transfer;