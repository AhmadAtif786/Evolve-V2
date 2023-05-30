import logo from "./logo.svg";
import "./App.css";
import Navbartop from "./component/Navbartop";
import discord from "./images/discord.png";
import Foot from "./component/Foot";
import ani from "./images/bg animation.gif";
import logo1 from "./images/logo.gif";
import text from "./images/text.png";
import detectEthereumProvider from "@metamask/detect-provider";
import Web3 from "web3";
// Import the contract ABI
import contractABI from "./contractABI.json";
import { useState, useEffect } from "react";
function App() {
  const [usdt, setUSDT] = useState(100);
  const [contractInstance, setContractInstance] = useState(null);
  const [totalAmountDeposited, setTotalAmountDeposited] = useState("");
  const [totalClaimed, setTotalClaimed] = useState("");
  const [pendingRewards, setPendingRewards] = useState("");
  const [nextClaimTime, setNextClaimTime] = useState("");
  const [account, setAccount] = useState("");
  const [lastFourDigits, setLastFourDigits] = useState("");
  function Greeting() {
    const digital = new Date();
    const hours = digital.getHours();

    let message;

    if (hours >= 5 && hours <= 11) {
      message = <b>Good morning</b>;
    } else if (hours >= 12 && hours <= 17) {
      message = <b>Good afternoon</b>;
    } else if (hours >= 18 && hours <= 21) {
      message = <b>Good evening</b>;
    } else if (hours >= 22 && hours <= 23) {
      message = <b>Glad to see you this time of the night.</b>;
    } else {
      message = <b>Wow, thanks for choosing us over sleep!</b>;
    }

    return message;
  }
  async function connectToMetaMask() {
    try {
      const provider = await detectEthereumProvider();

      if (provider) {
        const web3 = new Web3(window.ethereum);

        // Requesting account access
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(accounts[0]);

        const contractAddress = "0xa618eb8245e64d4b955e6072dc2c2ac122346716"; // Smart contract address
        const contract = new web3.eth.Contract(contractABI, contractAddress);
        setContractInstance(contract);

        if (accounts.length > 0) {
          setLastFourDigits(accounts[0].slice(-4));
          getContractData();
        }
      } else {
        alert("Please download MetaMask to connect to the Ethereum network.");
      }
    } catch (error) {
      alert(error.message);
    }
  }
  async function handleDepositAmount() {
    try {
      if (!contractInstance) {
        alert("Please connect wallet");
        return;
      }

      const amountInWei = Web3.utils.toWei(usdt.toString(), "ether");
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const fromAddress = accounts[0];
      await contractInstance.methods
        .Deposit(amountInWei)
        .send({ from: fromAddress });
      alert("Deposit successful!");
    } catch (error) {
      alert(error.message);
    }
  }
  async function claim() {
    try {
      if (!contractInstance) {
        alert("Please connect wallet");
        return;
      }

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const fromAddress = accounts[0];

      await contractInstance.methods.Claim().send({ from: fromAddress });

      alert("Claim successful!");
    } catch (error) {
      alert(error.message);
    }
  }

  async function refund() {
    try {
      if (!contractInstance) {
        alert("Please connect wallet");
        return;
      }

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const fromAddress = accounts[0];

      await contractInstance.methods.Refund().send({ from: fromAddress });

      alert("Refund successful!");
    } catch (error) {
      alert(error.message);
    }
  }
  async function getContractData() {
    // Check if a wallet is connected
    if (window.ethereum && window.ethereum.selectedAddress) {
      try {
        const selectedAddress = window.ethereum.selectedAddress;

        // Your code to interact with the contract using the selectedAddress
        const totalClaimedWei = await contractInstance.methods
          .TotalClaimed()
          .call({ from: selectedAddress });
        const pendingRewardsWei = await contractInstance.methods
          .CalculateClaimable()
          .call({ from: selectedAddress });
        const nextClaimTimeEpoch = await contractInstance.methods
          .NextClaimTime()
          .call({ from: selectedAddress });
        const totalAmountDepositedWei = await contractInstance.methods
          .TotalInvested()
          .call({ from: selectedAddress });

        // Convert Wei to normal without decimals for totalAmountDeposited and totalClaimed
        const formattedTotalAmountDeposited = Web3.utils.fromWei(
          totalAmountDepositedWei,
          "ether"
        );
        const formattedTotalClaimed = Web3.utils.fromWei(
          totalClaimedWei,
          "ether"
        );

        // Convert Wei to normal with 4 decimals for pendingRewards
        const formattedPendingRewards = Web3.utils.fromWei(
          pendingRewardsWei,
          "ether"
        );
        const formattedPendingRewardsWithDecimals = parseFloat(
          formattedPendingRewards
        ).toFixed(4);

        // Convert epoch to countdown format for nextClaimTime
        const currentTimestamp = Math.floor(Date.now() / 1000);
        const countdown = nextClaimTimeEpoch - currentTimestamp;
        const days = Math.floor(countdown / (24 * 60 * 60));
        const hours = Math.floor((countdown % (24 * 60 * 60)) / (60 * 60));
        const minutes = Math.floor((countdown % (60 * 60)) / 60);

        setTotalAmountDeposited(formattedTotalAmountDeposited);
        setTotalClaimed(formattedTotalClaimed);
        setPendingRewards(formattedPendingRewardsWithDecimals);
        setNextClaimTime(`${days} D ${hours} H ${minutes} M`);
      } catch (error) {
        console.log("Error:" + error.message);
        // Handle the error appropriately, e.g., display an error message to the user or take corrective actions
      }
    } else {
      console.log("No wallet connected");
    }
  }

  useEffect(() => {
    getContractData();
  }, [lastFourDigits]);

  return (
    <>
      <div id="wb_Image8" className="img">
        <img src={ani} className="Image8" alt="" width="641" height="728" />
      </div>
      //{" "}
      <Navbartop
        lastFourDigits={lastFourDigits}
        connectToMetaMask={connectToMetaMask}
        account={account}
      />
      <div className="d-flex justify-content-between align-items-center px-5 mt-2">
        <div>
          {" "}
          <img className="img23" src={logo1} />
          <img src={text} className="img223" />
        </div>
        <span className="connectbutton">
          <strong onClick={connectToMetaMask}>
            {lastFourDigits
              ? `Connected: ****${lastFourDigits}`
              : "CONNECT WALLET"}
          </strong>
        </span>
      </div>
      <div className="bg py-4 w50 px-5  d-flex  mt-3">
        <span className="welcome text-center justify-content-center d-flex m-auto">
          {Greeting()}
        </span>
      </div>
      <div className="boxadjust mt-5 px-5">
        <div className="bg p-2 widthbox">
          {" "}
          <span className="firstblockshead">
            <strong className="text-center textsm justify-content-center d-flex m-auto">
              DEPOSIT
            </strong>
          </span>
          <div className="d-flex justify-content-center  align-items-center mt-3">
            {" "}
            <input
              type="number"
              id="Editbox1"
              name="Deposit Box"
              value={usdt}
              onChange={(e) => {
                setUSDT(e.target.value);
              }}
              autocomplete="off"
              spellcheck="false"
            ></input>
            <span className="usdt">
              <strong>USDT</strong>
            </span>
          </div>
          <button
            className="btn btnupdates d-flex justify-content-center m-auto mt-3"
            onClick={handleDepositAmount}
          >
            DEPOSIT
          </button>
          <div className="d-flex justify-content-between align-items-center p-1">
            <span className="usdt">
              <strong>YOUR TOTAL DEPOSIT :</strong>
            </span>
            <div>
              {" "}
              <span className="usdt" style={{ color: "#d73cbe" }}>
                <strong>
                  {totalAmountDeposited ? totalAmountDeposited : 0}
                </strong>
              </span>{" "}
              <span className="usdt">
                <strong>USDT</strong>
              </span>
            </div>
          </div>
        </div>
        {/* </Col>
          <Col md={6} className="bg "> */}
        <div className="bg p-2 widthbox adjust ">
          <span className="firstblockshead">
            <strong className="text-center textsm justify-content-center d-flex m-auto">
              REWARDS
            </strong>
          </span>
          <div className="d-flex justify-content-between align-items-center p-1">
            <span className="usdt">
              <strong>PENDING :</strong>
            </span>
            <div>
              {" "}
              <span className="usdt" style={{ color: "#d73cbe" }}>
                <strong>{pendingRewards ? pendingRewards : "0.0000"}</strong>
              </span>{" "}
              <span className="usdt">
                <strong>USDT</strong>
              </span>
            </div>
          </div>
          <button
            className="btn btnupdates d-flex justify-content-center m-auto mt-3"
            onClick={claim}
          >
            CLAIM
          </button>
          <div className="d-flex justify-content-between align-items-center p-1 pb-0 mt-2">
            <span className="usdt">
              <strong>YOU CAN CLAIM IN :</strong>
            </span>
            <div>
              {" "}
              <span className="usdt">
                <strong>{nextClaimTime ? nextClaimTime : "0D 0H 0M"}</strong>
              </span>{" "}
            </div>
          </div>
          <div className="d-flex justify-content-between align-items-center px-1">
            <span className="usdt">
              <strong>YOUR TOTAL CLAIMS :</strong>
            </span>
            <div>
              {" "}
              <span className="usdt" style={{ color: "#d73cbe" }}>
                <strong>{totalClaimed ? totalClaimed : 0}</strong>
              </span>{" "}
              <span className="usdt">
                <strong>USDT</strong>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="boxadjust last mt-5  px-5">
        <div className="bg p-2 widthbox">
          <span className="firstblockshead">
            <strong className="text-center textsm justify-content-center d-flex m-auto">
              CLAIM TOTAL DEPOSIT
            </strong>
          </span>
          <div className="d-flex justify-content-center align-items-center p-1">
            <div>
              {" "}
              <span className="usdt" style={{ color: "#d73cbe" }}>
                <strong style={{ fontSize: "19px" }}>
                  {totalAmountDeposited ? totalAmountDeposited : 0}
                </strong>
              </span>{" "}
              <span className="usdt">
                <strong>USDT</strong>
              </span>
            </div>
          </div>
          <button
            className="btn btnupdates d-flex justify-content-center m-auto mt-0"
            onClick={refund}
          >
            <strong> LEAVE PF</strong>
          </button>
          <div className="d-flex justify-content-center align-items-center p-1 pb-2 mt-2">
            <span className="usdtClaim">
              <strong>
                PLEASE MAKE SURE TO CLAIM YOUR PENDING REWARDS FIRST
              </strong>
            </span>
          </div>
        </div>
        {/* </Col>
          <Col md={6} className="bg"> */}
        <div className="bg p-2 widthbox adjust">
          <span className="firstblockshead">
            <strong className="text-center textsm justify-content-center d-flex m-auto">
              NOT SURE WHAT TO DO ?
            </strong>
          </span>
          <div className="d-flex justify-content-center align-items-center p-1">
            <img src={discord} id="Image9" alt="" width="203" height="52" />
          </div>
          <div className="d-flex justify-content-center align-items-center p-1 pb-0">
            <span className="usdtClaim">
              <strong>* MAY CONTAIN MEMES.</strong>
            </span>
          </div>
        </div>
      </div>
      <Foot />
    </>
  );
}

export default App;
