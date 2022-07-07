globalThis.updateStrategy = require("../../controllers/strategies/index").updateStrategy

globalThis.calculateIndicators = require("../exchanges/indicators").calculateIndicators
globalThis.alpacaBuyer = require("./accountcontroller").alpacaBuyer
globalThis.alpacaSeller = require("./accountcontroller").alpacaSeller
const Alpaca = require('@alpacahq/alpaca-trade-api');

// let alpacaClient

globalThis.CoinbaseGranularity = {"1m": 60, "5m": 300, "15m": 900, "1h": 3600, "6h": 21600, "1d": 86400}

  async function alpacaBuyerAndSeller(user){
    try {
        var result = {}
        var priceUpdate=0
        async function executeTrade(obj){
          result = obj//   {action: action, amount: amount, id: id, asset: asset}
          result.symbol = result.asset
          if(result.qtySpecified){
            let newAmount = Number(result.amount) * INDPRICE
            let fixedAmount = newAmount.toFixed(2)
            result.amount = Number(fixedAmount)
          }
          if(result.action === "buy" && user){
            await alpacaBuyer(globalThis.alpacaClient, user, INDPRICE, result) //then update db
            console.log(`${user.user} is buying`)
            return "buying"
          }else if(result.action === "sell" && user.side === "long" && user){
            await alpacaSeller(globalThis.alpacaClient, user, INDPRICE, result) //then update db
            console.log(`${user.user} is selling`)
            return "selling"
          } else {
              console.log(priceUpdate)
              let currentClosePrice = priceUpdate
              await updateStrategy({currentClosePrice: currentClosePrice, strategyUid: user.strategyUid }, user.user)
              console.log(`waiting for trigger for ${user.asset} @${user.timeframe}`)
          }
          
        }

        async function getCryptoCandles(asset) {
          let resp = globalThis.alpacaClient.getCryptoBars(
              asset,
              {
                  limit: 200,
                  timeframe: "1Min",
              },
          );
          const closeValues = [];
          
          for await (let b of resp) {
            closeValues.push(b.Close)
          }
          
          return closeValues
        }

        
        async function getStockCandles(asset) {
            let resp = alpacaClient.getBarsV2(
            asset,
                {
                    // start: "2022-04-08",
                    // end: "2022-04-12",
                    limit: 200,
                    timeframe: "1Min",
                    adjustment: "all",
                },
                alpaca.configuration
            );
            const closeValues = [];
            
            for await (let b of resp) {
            closeValues.push(b.ClosePrice)
            }
            
            return closeValues
        }

        async function calculateIndicatorValues({indicator, asset}){
          let res = {}
          let timeframe = "1m"
          const candles = await getCryptoCandles(asset)
          candles.reverse()
          let indicators = calculateIndicators(candles)
          let INDMACDCROSSOVER = indicator === "INDMACDCROSSOVER"? res.result = indicators.macdCrossOver : null
          let INDMACDCROSSUNDER = indicator === "INDMACDCROSSUNDER"? res.result = indicators.macdCrossUnder : null
  
  
          let INDEMA9CROSSUNDER = indicator === "INDEMA9CROSSUNDER"? res.result = indicators.ema9CrossUnder  : null
          let INDEMA9CROSSOVER = indicator === "INDEMA9CROSSOVER"? res.result = indicators.ema9CrossOver : null
  
          let INDEMA20CROSSUNDER = indicator === "INDEMA20CROSSUNDER"? res.result = indicators.ema20CrossUnder : null
          let INDEMA20CROSSOVER = indicator === "INDEMA20CROSSOVER"? res.result = indicators.ema20CrossOver : null
  
          let INDEMA55CROSSUNDER = indicator === "INDEMA55CROSSUNDER"? res.result =  indicators.ema55CrossUnder : null
          let INDEMA55CROSSOVER = indicator === "INDEMA55CROSSOVER"?  res.result =  indicators.ema55CrossOver : null
  
          let INDEMA89CROSSUNDER = indicator === "INDEMA89CROSSUNDER"? res.result =  indicators.ema89CrossUnder : null
          let INDEMA89CROSSOVER = indicator === "INDEMA89CROSSOVER"? res.result = indicators.ema89CrossOver : null
  
          let INDSMA50CROSSOVER = indicator === "INDSMA50CROSSOVER"? res.result=  indicators.sma50CrossOver : null
          let INDSMA50CROSSUNDER = indicator === "INDSMA50CROSSUNDER"? res.result = indicators.sma50CrossUnder : null
  
          let INDSMA200CROSSOVER = indicator === "INDSMA200CROSSOVER"? res.result = indicators.sma200CrossOver : null
          let INDSMA200CROSSUNDER = indicator === "INDSMA200CROSSUNDER"? res.result = indicators.sma200CrossUnder : null
  
          let INDRSI14 = indicator === "INDRSI14"? res.result = indicators.rsi14 : null
          globalThis.INDPRICE = indicators.currentPrice
          priceUpdate = INDPRICE
          res.priceUpdate = priceUpdate
          console.log(res)
          return res.result
        } 
        let strategy = user.strategy
        
        const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor
        console.log(strategy)
        let resx = new AsyncFunction(`${executeTrade} ${calculateIndicatorValues} ${getCryptoCandles}; ${strategy}`)
        await resx()
        // eval(strategy)
      
    } catch (error) {
        console.log(error)
        return error
    }

  }


  async function alpacaTrader(users){
    try {
      let filteredUsers = users.filter(user=> user.paid == true ) //&& user.isLive === true
      return Promise.all(
        filteredUsers.map(async function (user){
          if(user.paid ){
            globalThis.alpacaClient = new Alpaca({
              keyId: atob(user.key),
              secretKey: atob(user.secret),
              paper: true,
            })
            globalThis.user = user
            await alpacaBuyerAndSeller(user)
          }
        })
      )
    } catch (error) {
      console.log(error)
    }
  }


  module.exports = {
      alpacaTrader
  }
