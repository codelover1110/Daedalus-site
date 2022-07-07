import {API} from "../../config";
import axios from "axios";

const alphavantageApiKey = "SQWD5BYVDB9DF4J0";

const _fetchStockSymbols = async () => {
  const gainers = `${API.url}/gainers?apikey=${API.key}`;
  //const gainers = `https://cloud.iexapis.com/stable/stock/market/list/gainers?token=${process.env.REACT_APP_API_KEY_1}`;
  let _symbols = [];
  const { data } = await axios(gainers);

  for (let i = 0; i < 4; i++) {
    if (typeof data[parseInt(i)] !== "undefined") {
      _symbols.push(data[parseInt(i)].ticker);
    }
  }
  // Logger.info('fetch stock symbols ' + _symbols, "[DASHBOARD][HOOK]")
  return _symbols;
};

const _fetchCryptoSymbols = async () => {

}

const _getStockInfo = async (symbol) => {
  let price = null, change = null;
  const percentageChange = `${API.url}/quote/${symbol}?apikey=${API.key}`;
  //const percentageChange = `https://cloud.iexapis.com/stable/stock/${symbol}/quote?displayPercent=true&token=${process.env.REACT_APP_API_KEY_1}`;
  if (typeof symbol !== "undefined") {
    const res = await axios(percentageChange);
    const result = res.data[0];
    if (result.price !== null) {
      price = result.price.toFixed(2);
    } else if (result.iexRealtimePrice !== null) {
      price = result.iexRealtimePrice.toFixed(2);
    }
    if (result.changesPercentage !== null) {
      change = parseFloat(result.changesPercentage).toFixed(2);
    }
    // return await getChart(dataChart, symbol);
  }
  return {
    price, change,
  }
}

/*
 * Fetching data required for charts and adds to array
 * @param {dataChart} array to store info about charts
 * @param {symbol} name of stock as symbol
 * @param {callback} callback
 */

async function _getChart(symbol, stockSymbols) {
  let chartData = [];
  let chartLabels = []
  let api = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=$symbol&interval=1min&apikey=${alphavantageApiKey}`;
  let stockApi = api.replace("$symbol", symbol);
  let res = await axios(stockApi);
  let result = res.data;
  if (!result["Meta Data"]) {
    stockApi = api.replace("$symbol", stockSymbols[2]);
    res = await axios(stockApi);
    result = res.data;
  }
  if (
    !result["Note"] &&
    Object.keys(result["Time Series (1min)"]).length > 1
  ) {
    for (
      let i = Object.keys(result["Time Series (1min)"]).length - 1;
      i > 0;
      i--
    ) {
      chartData.push(
        parseFloat(
          result["Time Series (1min)"][Object.keys(result["Time Series (1min)"])[i]]["4. close"]
        ).toFixed(2)
      );
      chartLabels.push(Object.keys(result["Time Series (1min)"])[i])
    }
    return {
      data: chartData,
      labels: chartLabels
    }
  }
  return [];
}

export {
  _fetchStockSymbols,
  _getStockInfo,
  _getChart,
};
