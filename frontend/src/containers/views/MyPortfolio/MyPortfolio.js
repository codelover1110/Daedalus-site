import React, {useState, useEffect} from "react";
import {useSelector} from "react-redux";
import Sidebar from "../../../components/elements/dashboard/sidebar";
import {Button} from "react-bootstrap";
import BuySellModal from "./BuySellModal";
import {callService} from "../../../_services/callableFunction";

let isFetched = false

const MyPortfolio = () => {
  const [account, setAccount] = useState(useSelector(state=>state.account));
  const [accountBalance, setAccountBalance] = useState(0)
  const user = useSelector(state => state.authentication.user)

  const [tradingType, setTradingType] = useState(null)
  const [showTradingModal, setTradingModal] = useState(false)
  const [positions, setPositions] = useState([]);
  const [positionsAlpaca, setPositionsAlpaca] = useState([]);
  useEffect(()=>{
    (async()=>{
      const newAccount = user.connectedAccounts.filter((acct)=>(acct.name === account.name))
      setAccountBalance(parseFloat(newAccount[0]?.balance))
      const newPositions = []
      newAccount[0]?.positions.forEach((newPosition)=>{
        const filteredResult = positions.filter((oldPosition)=>newPosition.symbol===oldPosition.symbol && newPosition.quantity===oldPosition.quantity)
        if(filteredResult.length > 0) {
          newPositions.push(filteredResult[0])
        }else{
          newPositions.push(newPosition)
        }
      })
      isFetched = false;
      setPositions(newPositions)
      setAccount(account)
    })()
  },[user])

  useEffect(() => {
    (async () => {
      if (positions.length > 0 && !isFetched) {
        isFetched = true;
        await calculatePositionValue()
      }
    })()
  }, [positions])

  useEffect(() => {
    getAlpacaPositions(account)
  }, account)

  const getAlpacaPositions = async (account)=>{
    try {
      let alpacaPositions = await callService("getAlpacaPositions", account)
      if (alpacaPositions.data.success) {
        console.log(alpacaPositions.data.account)
        setPositionsAlpaca(alpacaPositions.data.account)
      }
    }catch(e){
      return e
    }
  }

  const calculatePositionValue = async() => {
    const newPositions = []
    for (let position of positions) {
      let newPosition = {...position}
      let symbol = position.symbol;
      if(!newPosition.latestPrice){
        if(account.type==='crypto') symbol = symbol.replace('USD','')
        const response = await callService('getSymbolQuote',{accountType: account.type, symbol, accountName: account.name});
        newPosition = {...newPosition, ...response.data}
      }
      newPositions.push(newPosition)
    }
    setPositions(newPositions)
  }
  const openTradingModal = (type) => {
    setTradingType(type)
    setTradingModal(true)
  }
  const onSaveTrading = () => {
    setTradingModal(false)
    setTradingType(null)
    console.log('On save trading...')
  }
  const onCloseTradingModal = () => {
    setTradingModal(false)
    setTradingType(null)
  }
  if(!account) return <h1>loading...</h1>

  const formatGainText = (gl) => {
    if (gl === undefined) return 'Calculating...'
    else if(gl === null) return '0%'
    return  gl.toFixed(4)+' %'
  }
  return (
    <>
      <section className="flex">
        <Sidebar/>
        <div className="flex-1 p-8" style={{color: "white"}}>
          <h1 style={{color: "white"}}> My {account?.name} Portfolio </h1>
          <div className="d-flex flex-row justify-content-end">
            <span className="mr-3">Current account balance : {accountBalance.toFixed(2)}</span>
            {/* <Button variant="success" size="sm" className="mr-3" onClick={()=>openTradingModal('buy')}>Buy</Button>
            <Button variant="danger" size="sm" onClick={()=>openTradingModal('sell')}>Sell</Button> */}
          </div>
          <table className="min-w-full">
            <thead>
            <tr>
              <th className="px-6 py-3">Symbol</th>
              <th className="px-6 py-3">Quantity</th>
              <th className="px-6 py-3">Current Value</th>
              <th className="px-6 py-3">Last Price</th>
              <th className="px-6 py-3">Total Gain/Loss</th>
              <th className="px-6 py-3">Today's Gain/Loss</th>
            </tr>
            </thead>
            <tbody>
            {
              account.name == 'Alpaca' ?
              positionsAlpaca.map((position, index) => {
                return (
                  <tr
                    key={index}
                    className="cursor-pointer border-b transition duration-300 ease-in-out hover:bg-gray-300 hover:text-black">
                    <td className="px-6 py-4">{position.symbol}</td>
                    <td className="px-6 py-4">{position.qty}</td>
                    <td className="px-6 py-4">{position.current_price}</td>
                    <td className="px-6 py-4">{position.lastday_price}</td>
                    <td className="px-6 py-4">{parseFloat(position.market_value) - parseFloat(position.cost_basis)}</td>
                    <td className="px-6 py-4">{position.unrealized_intraday_pl}</td>
                  </tr>
                );
              }) :
              positions.map((position, index) => {
                return (
                  <tr
                    key={index}
                    className="cursor-pointer border-b transition duration-300 ease-in-out hover:bg-gray-300 hover:text-black">
                    <td className="px-6 py-4">{position.symbol}</td>
                    <td className="px-6 py-4">{position.quantity}</td>
                    <td className="px-6 py-4">{position.latestPrice ? '$'+(position.quantity * position.latestPrice).toFixed(2): 'Calculating...'}</td>
                    <td className="px-6 py-4">{position.latestPrice ? '$'+ position.latestPrice: 'Calculating...'}</td>
                    <td className="px-6 py-4">{formatGainText(position.totalGL)}</td>
                    <td className="px-6 py-4">{formatGainText(position.todayGL)}</td>
                  </tr>
                );
              })
            }
            </tbody>
          </table>
        </div>
      </section>
      <BuySellModal type={tradingType} isOpen={showTradingModal} onSave={()=>onSaveTrading()} onClose={()=>onCloseTradingModal()}/>
    </>
  );
};

export default MyPortfolio