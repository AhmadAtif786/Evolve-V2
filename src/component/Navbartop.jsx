import React, { useEffect } from "react";
import logo from "../images/logo.gif";
import text from "../images/text.png";

const Navbartop = (props) => {
useEffect(()=>{},[props.lastFourDigits])
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center px-5 mt-2">
        <div>
          {" "}
          <img src={logo} />
          <img src={text} />
        </div>
        <span className="connectbutton">
          <strong onClick={props.connectToMetaMask} >{props.lastFourDigits ? `Connected: ****${props.lastFourDigits}` : 'CONNECT WALLET'}</strong>
        </span>
      </div>
    </div>
  );
};

export default Navbartop;
