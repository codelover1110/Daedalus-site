import React, {useState, useEffect} from "react";
import GenericSection from "../../../components/sections/GenericSection";
import {Row, Col} from "react-bootstrap";
import {Link} from "react-router-dom";
import MiniDashboard from "../../../components/elements/MiniDashboard/minidashboard.js";
import { Button } from "react-bootstrap";
import { callService } from "../../../_services/callableFunction";
import { callCoinbaseService } from "../../../_services/thirdparty/coinbase";
import { getAlpacaAccount } from "../../../_services/thirdparty/alpaca";
import { useAuth } from "../../../contexts/auth_ctx";
import Logger from "../../../helpers/logger";
import firebase from "firebase/app";
import {fb} from "../../utils/fb"
import { connect } from "react-redux";

function Home({ user }) {
  let dummyConnected= {
    name:"",
   connectedAccounts: [
   
]
  }
  const { currentUser } = useAuth();
  const [connectedAccounts, setConnectedAccounts] = useState({...dummyConnected}) ;
  
  console.log(connectedAccounts, user)
  const [coinbase_balance, setCoinbase_balance] = useState([]);
  const [is_connected_coinbase, setIs_connected_coinbase] = useState(true);
  const [is_connected_alpaca, setIs_connected_alpaca] = useState(false);
  const [is_connected_binance, setIs_connected_binance] = useState(false);
  const [is_connected_robinhood, setIs_connected_robinhood] = useState(false);
  const [alpaca_balance, setAlpaca_balance] = useState(0);
  const [binance_balance, setBinance_balance] = useState(0);
  const [robinhood_balance, setRobinhood_balance] = useState(0);
  const brokerageObj = {
    "Coinbase": "coinbase",
    "Stock Paper Trading":"papertradingcrypto",
    "Crypto Paper Trading":"papertradingstocks",
    "Alpaca":"alpaca",
    "Binance": "binance"

  }
  useEffect(() => {
    console.log(user)
    const fetchAccount = async () => {
      try {
        const result = await fb.findUser(user.uid)// callService("getUser");
        console.log(result)
        if (result.connectedAccounts) {
          setConnectedAccounts(result)
        }
  
      } catch (error) {
        Logger.error(error, "[HOME][FETCH USER ACCOUNTS]")
  
      }
  
    }
    if (user !== null) {
      fetchAccount()
    }
  
  }, [currentUser])

  // fetch coinbase account
  // useEffect(() => {
  //   const fetchData = async (Coinbase) => {
  //     try {
  //       let reqPayload = { "router": "/getAccount", "authType": "Coinbase", code: Coinbase.authData }
  //       const resultCoinbase = await callCoinbaseService(reqPayload);
  //       if (resultCoinbase.data.status) {
  //         let balance = resultCoinbase.data.data.data.reduce((total, obj) => Number(obj.balance.amount) + Number(total), 0);
  //         setIs_connected_coinbase(true)
  //         setCoinbase_balance(balance)
  //       }
  //     } catch (error) {
  //       Logger.error(error, "[HOME][FETCH COINBASE ACCOUNT]")
  //     }
  //
  //   }
  //   const Coinbase = connectedAccounts.find(x => x.authType === "Coinbase")
  //   if (Coinbase) fetchData(Coinbase)
  //
  // }, [connectedAccounts])
  //
  //
  // // fetch alpaca account
  // useEffect(() => {
  //   const fetchData = async (Alpaca) => {
  //     try {
  //       let reqPayload = { "router": "/getAccount", "authType": "Alpaca", code: Alpaca.authData }
  //       const resultAlpaca = await callService("apiRouter", reqPayload);
  //       if (resultAlpaca.data.status) {
  //         setIs_connected_alpaca(true)
  //         setAlpaca_balance(resultAlpaca.data.data.portfolio_value)
  //       }
  //     } catch (error) {
  //       Logger.error(error, "[HOME][FETCH ALPACA ACCOUNT]")
  //     }
  //
  //
  //   }
  //   const Alpaca = connectedAccounts.find(x => x.authType === "Alpaca");
  //   if (Alpaca) fetchData(Alpaca)
  //
  // }, [connectedAccounts])
  //
  // // fetch binance account
  // useEffect(() => {
  //   const fetchData = async (Binance) => {
  //     try {
  //       setIs_connected_binance(true)
  //       let reqPayload = { "router": "/getAccount", "authType": "Binance", code: Binance.authData }
  //       const resultBinance = await callService("apiRouter", reqPayload);
  //       if (resultBinance.data.status) {
  //         let balance = parseFloat(Object.keys(resultBinance.data.data).reduce((total, obj) => Number(resultBinance.data.data[obj]) + Number(total), 0)).toFixed(2);
  //         setBinance_balance(balance)
  //       }
  //     } catch (error) {
  //       Logger.error(error, "[HOME][FETCH BINANCE ACCOUNT]")
  //     }
  //   }
  //   const Binance = connectedAccounts.find(x => x.authType === "Binance");
  //   if (Binance) fetchData(Binance)
  //
  // }, [connectedAccounts])

  return (
    <React.Fragment>
      <GenericSection topDivider>
        <div
          style={{
            color: "white",
            fontSize: "40px",
            fontWeight: "bold",
            marginBottom: "40px",
          }}
        >
          Welcome Back to Daedalus,{" "}
          {!!currentUser ? currentUser.displayName : ""}
        </div>
      

        <Row>
          {
            connectedAccounts.connectedAccounts.map((account)=>{
              return (<Col xs="6" className="mb-2">
              <MiniDashboard
                brokerage={brokerageObj[account.name]}
                changeDir="down"
                changePercent="0"
                account={account}
              />
            </Col>)
            })
          }
          {/* {
            <Col xs="6" className="mb-2">
              <MiniDashboard
                brokerage="papertradingstocks"
                changeDir="down"
                changePercent="0"
                account={connectedAccounts.connectedAccounts[0]}
              />
            </Col>
          }
          {
            <Col xs="6" className="mb-2">
              <MiniDashboard
                brokerage="papertradingcrypto"
                changeDir="down"
                changePercent="0"
                account={connectedAccounts.connectedAccounts[1]}
              />
            </Col>
          }
          {is_connected_coinbase && (
            <Col xs="6" className="mb-2">
              <MiniDashboard
                brokerage="coinbase"
                balance={coinbase_balance}
                changeDir="down"
                changePercent="0"
                account={connectedAccounts.connectedAccounts[2]}
              />
            </Col>
          )}

          {is_connected_binance && (
            <MiniDashboard
              brokerage="binance"
              balance={binance_balance}
              changeDir="down"
              changePercent="45.3"
            />
          )}

          {is_connected_robinhood && (
            <MiniDashboard
              brokerage="robinhood"
              balance="0"
              changeDir="up"
              changePercent="00.00"
            />
          )}

          {is_connected_alpaca && (
            <MiniDashboard
              brokerage="alpaca"
              balance={alpaca_balance}
              changeDir="down"
              changePercent="0.0"
            />
          )}
        </div>
          */}
        </Row>
        <div className="d-flex">
          <Button
            href="/Connect"
            className="mx-auto mt-5"
            style={{
              color: "#000",
              backgroundColor: "white",
              width: "300px",
              height: "50px",
              fontWeight: "bold",
              borderRadius: "20px",
              border: "none",
              fontSize: "17px",
              cursor: "pointer",
            }}
          >
            {" "}
            Connect Additional Accounts{" "}
          </Button>
        </div>
      </GenericSection>
    </React.Fragment>
  );
}

const mapStateToProps = (state) => {
  return {user: state.authentication.user};
};
export default connect(mapStateToProps, null)(Home);
