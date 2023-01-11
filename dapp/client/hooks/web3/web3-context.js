import Web3Modal from "web3modal";
import { ethers } from "ethers";

export const isConnected = () => {
    return (typeof window.ethereum !== 'undefined')
}


export const getProviderOrSigner = async (needSigner = false) => {

    const instance = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(instance);
    return provider
};


export const connect = async (web3Modal, setProvider) => {
    try {
        const instance = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(instance);
        setProvider(provider)
        const accounts = await provider.listAccounts();
        if (accounts.length > 0) {
            return accounts[0]
        }
        return null
    } catch (err) {
        alert(err.message)
    }
};