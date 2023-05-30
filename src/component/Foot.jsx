import React from "react";
import bnb from "../images/bnb.png";
import cog from "../images/sectigo.png";
const Foot = () => {
  return (
    <>
      <div className="d-flex justify-content-between align-items-center px-5 mt-2 foot">
        <img className="img2" src={bnb} />
        <span className="usdtClaim">© 2023 ELEVATE MY CAPITAL</span>
        <img className="img2" src={cog} />
      </div>
    </>
  );
};

export default Foot;
