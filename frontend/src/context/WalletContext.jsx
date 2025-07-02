import React, { useState, useEffect, createContext, useContext } from 'react';
import { ethers } from 'ethers';

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
    const [account, setAccount] = useState(null);

    const checkIfWalletIsConnected = async () => {
        try {
            if (!window.ethereum) return alert("Harap instal MetaMask.");

            const accounts = await window.ethereum.request({ method: 'eth_accounts' });

            if (accounts.length) {
                setAccount(accounts[0]);
            } else {
                console.log("Tidak ada akun yang ditemukan.");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const connectWallet = async () => {
        try {
            if (!window.ethereum) return alert("Harap instal MetaMask.");

            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            
            setAccount(accounts[0]);
        } catch (error) {
            console.error(error);
            throw new Error("Tidak ada objek ethereum.");
        }
    };

    const disconnectWallet = () => {
        setAccount(null);
        console.log("Dompet terputus.");
    };

    useEffect(() => {
        checkIfWalletIsConnected();

        if (window.ethereum) {
            window.ethereum.on('accountsChanged', (accounts) => {
                if (accounts.length > 0) {
                    setAccount(accounts[0]);
                } else {
                    setAccount(null);
                }
            });
        }
    }, []);

    return (
        <WalletContext.Provider value={{ account, connectWallet, disconnectWallet }}>
            {children}
        </WalletContext.Provider>
    );
};

export const useWallet = () => useContext(WalletContext);