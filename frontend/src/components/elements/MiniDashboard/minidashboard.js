import React, {useEffect, useState} from "react";
import {Image} from "react-bootstrap";
import RobinHoodLogo from "../img/robinhoodlogo.png";
import CoinbaseLogo from "../img/coinbaselogo.png";
import BinanceLogo from "../img/binancelogo.png";
import AlpacaLogo from "../img/alpacalogo.png";
import DaedalusLogo from "../img/logo.png";
import {Link} from "react-router-dom";
import {useDispatch} from "react-redux";
import {selectAccount} from "../../../store/_actions";
import styled from "styled-components";
import {getCoinbaseAssetCurrentPrice} from "../../../_services/thirdparty/coinbase"
import {callService} from "../../../_services/callableFunction";
import {config} from "../../../config"
const Container = styled.div`
  background-color: #212329;
  border-radius: 15px;
  padding-top: 20px;
  opacity: ${props => props.opacity ? props.opacity : 1};
  margin-bottom: 20px;
  height: 275px;
  @media screen and (min-width: 992px) {
    width: 35vw;
  }
`

const ImageWrapper = styled.div`
  color: white;
  font-size: 60px;
  font-weight: bold;
  margin-top: 50px;
  margin-left: 25px;
  img {
    width: 145px;
    height: 50px;
    margin-top: 25px;
    float:right;
    padding-right:30px;
  }
`

let isFetched = false
const getCorrectAPI = async (type, symbol) => {
  if (type === "stock") {
    return `${config.iex_base_url}/stable/stock/${symbol}/quote?displayPercent=true&token=${config.iex_publish_key}`
  }
  // if (type === "crypto") {
  //   let exchangeData = {
  //     "Coinbase": getCoinbaseAssetCurrentPrice({symbol: `${symbol}`})
  //   }
  //   let price = await exchangeData['Coinbase']
  //   return price.data
  // }
}

function separateWithComa(numbr){ //seprte numbers with comma
  let number = String(numbr)
  if(number.split('.').length === 1){
      let na = number.split(''); //new array
      let nnl = na.length // array length
      let counter = nnl
      let returnable = []
      for(let i = 0; i< Math.ceil(nnl/3); i++){
          na.length <= 3  ? returnable.push(na.join('')):
          //let nn =  //new number
          returnable.push(na.splice(counter-3 ,3).join(''))
          counter = counter - 3
      }
      return returnable.reverse().join(',')
  }
  else {
     return separateWithComa(number.split('.')[0]) + '.' + number.split('.')[1]
  }
}

const MiniDashboard = ({inFocus, brokerage, account}) => {
  const [totalBalance, setTotalBalance] = useState(0)
  const [positions, setPositions] = useState([]);
  const dispatch = useDispatch()
  useEffect(() => {
    if (account) {
      setPositions(account.positions)
    }
  }, [])
  useEffect(() => {
    (async () => {
      if (positions.length > 0 && !isFetched) {
        isFetched = true;
        const newPositions = []
        for (let position of positions) {
          let newPosition = {...position}
          let symbol = position.symbol;
          const url = await getCorrectAPI(account.type, symbol)
          const response = url // await fetch(url);
          const result = {latestPrice: response}  //await response.json()
          console.log(result, newPosition, )
          if (result.latestPrice) {
            newPosition.latestPrice = result.latestPrice;
          if(!newPosition.latestPrice){
            const response = await callService('getSymbolQuote',{accountType: account.type, symbol, accountName: account.name});
            newPosition = {...newPosition, ...response.data}
          }
          newPositions.push(newPosition)
        }
        calculateTotalBalance(newPositions)
      }
  
    }
    if (positions.length === 0) {
      setTotalBalance(account.balance.toFixed(2))
    }
  })()
  }, [positions])
  const calculateTotalBalance = (positions) => {
    let totalBalance = account.balance;
    for (let position of positions) {
      totalBalance += (position.latestPrice * position.quantity)
    }
    setTotalBalance(totalBalance.toFixed(2))
  }
  let opacity = "100%";
  if (inFocus === "True") opacity = "100%";
  if (inFocus === "False") opacity = "50%";
  let image = RobinHoodLogo;
  if (brokerage === "robinhood") image = RobinHoodLogo;
  if (brokerage === "coinbase") image = CoinbaseLogo;
  if (brokerage === "binance") image = BinanceLogo;
  if (brokerage === "alpaca") image = AlpacaLogo;
  if (brokerage === "papertradingstocks") image = DaedalusLogo;
  if (brokerage === "papertradingcrypto") image = DaedalusLogo;
  return (
    <Link
      to={`/Dashboard`}
      style={{textDecoration: "none"}}
      onClick={() => dispatch(selectAccount(account))}
    >
      <Container opacity={opacity}>
        <div style={{marginLeft: "20px"}}>{account.name}</div>
        <ImageWrapper >
          ${separateWithComa(totalBalance)}
          <div>
            <Image src={image} />
          </div>
        </ImageWrapper>
      </Container>
    </Link>
  );
}
export default MiniDashboard
