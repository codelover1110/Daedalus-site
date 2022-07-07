import React, {useEffect, useState} from 'react'
import {_fetchStockSymbols, _getStockInfo} from "../../containers/utils/Dashboard";
import StockChart from "./StockChart";

const StockChartGroup = () => {
  /** stock symbols */
const [stockSymbols, setStockSymbols] = useState([]);
  /** stock changes */
  const [stockChanges, setStockChanges] = useState([]);

  /** stock prices */
  const [stockPrices, setStockPrices] = useState([]);

  const [changeColors, setChangeColors] = useState([]);

  useEffect(()=>{

    (async () => {
        const stockSymbols = await _fetchStockSymbols();
        setStockSymbols(stockSymbols);

        if (stockSymbols.length > 0) {
          const prices = [], changes = [];
          const result0 = await _getStockInfo(stockSymbols[0]);
          prices.push(result0.price)
          changes.push(result0.change)
          setTimeout(async ()=>{
            const result1 = await _getStockInfo(stockSymbols[1]);
            prices.push(result1.price)
            changes.push(result1.change)
            setStockPrices(prices)
            setStockChanges(changes)
          },1000)
        }
      }
    )()
  },[])

  /*
   * changes colors for portfolio prices, depends on price,
   */
  useEffect(()=>{
    let ch = [];
    for (let i = 0; i < stockSymbols.length; i++) {
      if (Math.sign(stockChanges[i]) === -1) {
        ch[i] = "#f45485";
      } else if (Math.sign(stockChanges[i]) === 1) {
        ch[i] = "#66f9da";
        stockChanges[i] = "+" + stockChanges[i];
        if (
          stockChanges[i].charAt(0) === "+" &&
          stockChanges[i].charAt(1) === "+"
        ) {
          stockChanges[i] = stockChanges[i].substr(1);
        }
      } else {
        ch[i] = "#999eaf";
      }
    }
    setChangeColors(ch);
  },[stockChanges])
  return (
    <div className="panel__item__charts flex mt-3 ">
      <StockChart
        stockSymbols={stockSymbols}
        stockChange={stockChanges[0]}
        stockPrice={stockPrices[0]}
        selectedStockSymbol={stockSymbols[0]}
        changesColor={changeColors[0]}
        symbolChart={stockSymbols[0]}
      />
      <StockChart
        stockSymbols={stockSymbols}
        stockChange={stockChanges[1]}
        stockPrice={stockPrices[1]}
        selectedStockSymbol={stockSymbols[1]}
        changesColor={changeColors[1]}
        symbolChart={stockSymbols[1]}
      />
    </div>
  )
}
export default StockChartGroup
