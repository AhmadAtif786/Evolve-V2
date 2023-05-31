import logo from "./logo.svg";
import "./App.css";
import Navbartop from "./component/Navbartop";
import discord from "./images/discord.png";
import Foot from "./component/Foot";
import ani from "./images/bg_logo.png";
import logo1 from "./images/logo.gif";
import text from "./images/logo.png";
import detectEthereumProvider from "@metamask/detect-provider";
import Web3 from "web3";
// Import the contract ABI
import contractABI from "./contractABI.json";
import tokenABI from "./tokenABI.json";
import { useState, useEffect } from "react";
function App() {
  const [usdt, setUSDT] = useState(100);
  const [isApproved, setIsApproved] = useState(false);
  const [contractInstance, setContractInstance] = useState(null);
  const [totalDeposited, setTotalDeposited] = useState(0);
  const [totalClaimed, setTotalClaimed] = useState(0);
  const [pendingRewards, setPendingRewards] = useState(0);
  const [nextClaimTime, setNextClaimTime] = useState("");
  const [account, setAccount] = useState("");
  const [lastFourDigits, setLastFourDigits] = useState("");
  const [local, setlocal] = useState("");
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

  const getContractData = async () => {
    // Check if a wallet is connected
    if (window.ethereum && window.ethereum.selectedAddress) {
      try {
        const selectedAddress = window.ethereum.selectedAddress;
        const web3 = new Web3(window.ethereum);
        const userTotalClaimWei = await contractInstance.methods
          .Players(selectedAddress)
          .call({ from: selectedAddress });
        console.log(userTotalClaimWei.user_total_claimed);
        // Your code to interact with the contract using the selectedAddress
        const totalClaimedWei = userTotalClaimWei.user_total_claimed;
        const pendingRewardsWei = await contractInstance.methods
          .CalculateClaimable(selectedAddress)
          .call();
        const nextClaimTimeEpoch = await contractInstance.methods
          .NextClaimTime(selectedAddress)
          .call();
        const totalAmountDepositedWei = userTotalClaimWei.user_total_invested;

        // Convert Wei to normal without decimals for totalAmountDeposited and totalClaimed
        const formattedTotalAmountDeposited = web3.utils.fromWei(
          totalAmountDepositedWei,
          "ether"
        );
        const formattedTotalClaimed = web3.utils.fromWei(
          totalClaimedWei,
          "ether"
        );

        // Convert Wei to normal with 4 decimals for pendingRewards
        const formattedPendingRewards = web3.utils.fromWei(
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

        setTotalDeposited(formattedTotalAmountDeposited);
        console.log(formattedTotalAmountDeposited, "datas");
        setTotalClaimed(formattedTotalClaimed);
        setPendingRewards(formattedPendingRewardsWithDecimals);
        console.log(formattedPendingRewardsWithDecimals);
        setNextClaimTime(`${days} D ${hours} H ${minutes} M`);
      } catch (error) {
        console.log("Error:" + error.message);
        // Handle the error appropriately, e.g., display an error message to the user or take corrective actions
      }
    } else {
      console.log("No wallet connected");
    }
  };
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
        localStorage.setItem("account", accounts[0]);

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
      console.log(error.message);
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
  async function handleApprove() {
    try {
      if (!contractInstance) {
        alert("Please connect wallet");
        return;
      }
      const web3 = new Web3(window.ethereum);

      const tokenContractAddress = "0x337610d27c682E347C9cD60BD4b3b107C9d34dDd"; // Replace with the actual token contract address
      const tokenContract = new web3.eth.Contract(
        tokenABI,
        tokenContractAddress
      );
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const fromAddress = accounts[0];
      const amountInWei = Web3.utils.toWei(usdt.toString(), "ether");
      await tokenContract.methods
        .approve(contractInstance.options.address, amountInWei)
        .send({ from: fromAddress });
      alert("Approval successful!");
      setIsApproved(true);
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

  async function checkApproval() {
    try {
      console.log("inside");
      // if (!contractInstance) {
      //   alert("Please connect wallet");
      //   return;
      // }

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const fromAddress = accounts[0];
      const amountInWei = Web3.utils.toWei(usdt.toString(), "ether");

      const isApproved = await contractInstance.methods
        .approve()
        .call({ from: fromAddress }, amountInWei);
      console.log(isApproved);
      if (isApproved) {
        setIsApproved(true);
        alert("User is approved!");
      } else {
        setIsApproved(false);

        alert("User is not approved.");
      }
    } catch (error) {
      console.log(error.message);
    }
  }
  function loc() {
    setlocal(localStorage.getItem("account"));
  }
  useEffect(() => {
    console.log(lastFourDigits);
  }, [account, contractInstance, lastFourDigits]);
  // useEffect(() => {
  //   checkApproval();
  // }, [account, lastFourDigits]);
  useEffect(() => {
    loc();
  }, []);

  useEffect(() => {
    // connectToMetaMask();
    getContractData();
  }, [account]);
  useEffect(() => {
    getContractData();
    console.log("is working");
  }, [account]);
  return (
    <>
      <div className="max">
        <div id="wb_Image8" className="img">
          <img src={ani} className="Image8" alt="" width="641" height="728" />
        </div>

        <div className="d-flex justify-content-between align-items-center mt-2 bg p-1 py-2 w50 mt-5 px-3">
          <div>
            {" "}
            {/* <img className="img23" src={logo1} /> */}
            <img className="img223" src={text} />
          </div>
          <span className="connectbutton">
            <strong onClick={connectToMetaMask}>
              {lastFourDigits || local?.slice(-4)
                ? `Connected: ****${lastFourDigits || local?.slice(-4)}`
                : "CONNECT WALLET"}
            </strong>
          </span>
        </div>
        <div className="bg py-4 px-5  d-flex  w50 mt-4">
          <span className="welcome text-center justify-content-center d-flex m-auto">
            {Greeting()}
          </span>
        </div>
        <div className="boxadjust mt-4 px-5">
          <div className="bg py-3 pb-2 p-2 widthbox">
            {" "}
            <span className="firstblockshead">
              <strong className="text-center textsm justify-content-center d-flex m-auto">
                DEPOSIT
              </strong>
            </span>
            <div
              className="d-flex justify-content-center  align-items-center mt-3"
              style={{ flexDirection: "column" }}
            >
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
              <div>
                <span className="usdtClaim">
                  <strong>BEP-20 USDT</strong>
                </span>
              </div>
            </div>
            <div className="d-flex justify-content-center">
              {" "}
              <button
                className="btn btnupdates d-flex justify-content-center m-auto mt-3"
                onClick={handleApprove}
              >
                Approve
              </button>
              <button
                className="btn btnupdates d-flex justify-content-center m-auto mt-3"
                onClick={handleDepositAmount}
              >
                Deposit
              </button>
            </div>
            <div className="d-flex justify-content-between align-items-center p-1 al">
              <span className="usdt">
                <strong>YOUR TOTAL DEPOSIT :</strong>
              </span>
              <div className="align">
                {" "}
                <span className="usdt " style={{ color: "#BF0564" }}>
                  <strong>{totalDeposited ? totalDeposited : 0}</strong>
                </span>{" "}
                <span className="usdt">
                  <strong>USDT</strong>
                </span>
              </div>
            </div>
          </div>
          {/* </Col>
          <Col md={6} className="bg "> */}
          <div className="bg p-2 py-3 pb-2 widthbox adjust ">
            <span className="firstblockshead">
              <strong className="text-center textsm justify-content-center d-flex m-auto">
                REWARDS
              </strong>
            </span>
            <div className="d-flex justify-content-between align-items-center p-1 mt-3">
              <span className="usdt">
                <strong>PENDING :</strong>
              </span>
              <div>
                {" "}
                <span className="usdt" style={{ color: "#BF0564" }}>
                  <strong>{pendingRewards ? pendingRewards : "0.0000"}</strong>
                </span>{" "}
                <span className="usdt">
                  <strong>USDT</strong>
                </span>
              </div>
            </div>
            <button
              className="btn btnupdates d-flex justify-content-center albloc2 "
              onClick={claim}
            >
              CLAIM
            </button>
            <div className="d-flex justify-content-between align-items-center p-1 pb-0 minus">
              <span className="usdt">
                <strong>YOU CAN CLAIM IN :</strong>
              </span>
              <div className="align2">
                {" "}
                <span className="usdt">
                  <strong>{nextClaimTime ? nextClaimTime : "0D 0H 0M"}</strong>
                </span>{" "}
              </div>
            </div>
            <div className="d-flex justify-content-between align-items-center px-1 minus">
              <span className="usdt">
                <strong>YOUR TOTAL CLAIMS :</strong>
              </span>
              <div className="align2">
                {" "}
                <span className="usdt" style={{ color: "#BF0564" }}>
                  <strong>{totalClaimed ? totalClaimed : 0}</strong>
                </span>{" "}
                <span className="usdt">
                  <strong>USDT</strong>
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="boxadjust last mt-4 px-5">
          <div className="bg p-2 py-3 pb-2 widthbox">
            <span className="firstblockshead">
              <strong className="text-center textsm justify-content-center d-flex m-auto">
                CLAIM TOTAL DEPOSIT
              </strong>
            </span>
            <div className="d-flex justify-content-center align-items-center p-1">
              <div>
                {" "}
                <span className="usdt" style={{ color: "#BF0564" }}>
                  <strong>{totalDeposited ? totalDeposited : 0}</strong>
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
              STOP EVOLVING
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
          <div className="bg p-2  py-3 pb-2 widthbox adjust">
            <span className="firstblockshead">
              <strong className="text-center textsm justify-content-center d-flex m-auto">
                NOT SURE WHAT TO DO ?
              </strong>
            </span>
            <div className="d-flex justify-content-center align-items-center p-1">
              <img src={discord} id="Image9" alt="" width="203" height="52" />
            </div>
            <div className="d-flex justify-content-center align-items-center p-1 pb-0 mt-3">
              <span className="usdtClaim">
                <strong>* MAY CONTAIN MEMES.</strong>
              </span>
            </div>
          </div>
        </div>
        <Foot />
      </div>
    </>
  );
}

export default App;
