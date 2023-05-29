import React, { useState } from "react";
import logo from "../images/logo.gif";
import text from "../images/text.png";
import detectEthereumProvider from '@metamask/detect-provider';
import Web3 from 'web3';
// Import the contract ABI
import contractABI from '../contractABI.json';
const Navbartop = (props) => {
  const [account, setAccount] = useState('');
  const [lastFourDigits, setLastFourDigits] = useState('');
  async function connectToMetaMask() {
    try {
      const provider = await detectEthereumProvider();

      if (provider) {
        await provider.request({ method: 'eth_requestAccounts' });
        const web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);

        const contractAddress = '0xa618eb8245e64d4b955e6072dc2c2ac122346716'; // Smart contract address
        const contract = new web3.eth.Contract(contractABI, contractAddress);
        props.setContractInstance(contract);

        if (account) {
          setLastFourDigits(account.slice(-4));

        }
      } else {
        alert('Please download MetaMask to connect to the Ethereum network.');
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center px-5 mt-2">
        <div>
          {" "}
          <img src={logo} />
          <img src={text} />
        </div>
        <span className="connectbutton">
          <strong onClick={connectToMetaMask} >{lastFourDigits ? `Connected Account: ****${lastFourDigits}` : 'CONNECT WALLET'}</strong>
        </span>
      </div>
    </div>
  );
};

export default Navbartop;
