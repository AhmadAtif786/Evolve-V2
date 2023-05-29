import logo from "./logo.svg";
import "./App.css";
import Navbartop from "./component/Navbartop";
import { Container, Row, Col } from "react-bootstrap";
import discord from "./images/discord.png";
import Foot from "./component/Foot";
import ani from "./images/bg animation.gif";
function App() {
  return (
    <>
      <div id="wb_Image8" className="img">
        <img src={ani} className="Image8" alt="" width="641" height="728" />
      </div>
      <Navbartop />
      <div className="bg py-4 w-50  d-flex m-auto mt-3">
        <span className="welcome text-center justify-content-center d-flex m-auto">
          Good Morning
        </span>
      </div>

      <div className="boxadjust mt-4 px-5">
        <div className="bg p-2 widthbox">
          {" "}
          <span className="firstblockshead">
            <strong className="text-center justify-content-center d-flex m-auto">
              DEPOSIT
            </strong>
          </span>
          <div className="d-flex justify-content-center  align-items-center mt-3">
            {" "}
            <input
              type="number"
              id="Editbox1"
              name="Deposit Box"
              value="100"
              autocomplete="off"
              spellcheck="false"
            ></input>
            <span className="usdt">
              <strong>USDT</strong>
            </span>
          </div>
          <button className="btn btnupdates d-flex justify-content-center m-auto mt-3">
            DEPOSIT
          </button>
          <div className="d-flex justify-content-between align-items-center p-1">
            <span className="usdt">
              <strong>YOUR TOTAL DEPOSIT :</strong>
            </span>
            <div>
              {" "}
              <span className="usdt" style={{ color: "#d73cbe" }}>
                <strong>10 000</strong>
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
            <strong className="text-center justify-content-center d-flex m-auto">
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
                <strong style={{ fontSize: "19px" }}>10 000</strong>
              </span>{" "}
              <span className="usdt">
                <strong>USDT</strong>
              </span>
            </div>
          </div>
          <button className="btn btnupdates d-flex justify-content-center m-auto mt-3">
            CLAIM
          </button>
          <div className="d-flex justify-content-between align-items-center p-1 pb-0">
            <span className="usdt">
              <strong>YOU CAN CLAIM IN :</strong>
            </span>
            <div>
              {" "}
              <span className="usdt">
                <strong style={{ fontSize: "19px" }}>06 D 23 H 59 M</strong>
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
                <strong style={{ fontSize: "19px" }}>420</strong>
              </span>{" "}
              <span className="usdt">
                <strong>USDT</strong>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="boxadjust mt-4 px-5">
        <div className="bg p-2 widthbox">
          <span className="firstblockshead">
            <strong className="text-center justify-content-center d-flex m-auto">
              CLAIM TOTAL DEPOSIT
            </strong>
          </span>
          <div className="d-flex justify-content-center align-items-center p-1">
            <div>
              {" "}
              <span className="usdt" style={{ color: "#d73cbe" }}>
                <strong style={{ fontSize: "19px" }}>10 000</strong>
              </span>{" "}
              <span className="usdt">
                <strong>USDT</strong>
              </span>
            </div>
          </div>
          <button className="btn btnupdates d-flex justify-content-center m-auto mt-0">
            STOP EVOLVING
          </button>
          <div className="d-flex justify-content-center align-items-center p-1 pb-2">
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
            <strong className="text-center justify-content-center d-flex m-auto">
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
      {/* </Col>
        </Row>
      </Container> */}
      <Foot />
    </>
  );
}

export default App;
