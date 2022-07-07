globalThis.CoinbasePro = require('coinbase-pro');
globalThis.coinbaseClient = new CoinbasePro.PublicClient()
globalThis.updateStrategy = require("../../controllers/strategies/index").updateStrategy

globalThis.calculateIndicators = require("../exchanges/indicators").calculateIndicators
globalThis.coinbaseBuyer = require("./accountcontroller").coinbaseBuyer
globalThis.coinbaseSeller = require("./accountcontroller").coinbaseSeller

globalThis.CoinbaseGranularity = {"1m": 60, "5m": 300, "15m": 900, "1h": 3600, "6h": 21600, "1d": 86400}

  async function coinbaseBuyerAndSeller(user, coinbaseClient){
    try {
        // let indicators = calculateIndicators(candles.reverse().map(candle=>candle[4]))
        
        // let INDMACDCROSSOVER = indicators.macdCrossOver
        // let INDMACDCROSSUNDER = indicators.macdCrossUnder


        // let INDEMA9CROSSUNDER = indicators.ema9CrossUnder
        // let INDEMA9CROSSOVER = indicators.ema9CrossOver

        // let INDEMA20CROSSUNDER = indicators.ema20CrossUnder
        // let INDEMA20CROSSOVER = indicators.ema20CrossOver

        // let INDEMA55CROSSUNDER = indicators.ema55CrossUnder
        // let INDEMA55CROSSOVER = indicators.ema55CrossOver

        // let INDEMA89CROSSUNDER = indicators.ema89CrossUnder
        // let INDEMA89CROSSOVER = indicators.ema89CrossOver

        // let INDSMA50CROSSOVER = indicators.sma50CrossOver
        // let INDSMA50CROSSUNDER = indicators.sma50CrossUnder

        // let INDSMA200CROSSOVER = indicators.sma200CrossOver
        // let INDSMA200CROSSUNDER = indicators.sma200CrossUnder

        // let INDRSI14 = indicators.rsi14
        // let INDPRICE = indicators.currentPrice
        var result = {}
        var priceUpdate=0
        async function executeTrade(obj){
          result = obj//   {action: action, amount: amount, id: id, asset: asset}
          result.symbol = result.asset.match(/.*(?=-)/)[0]
          if(!result.qtySpecified){
            let newAmount = Number(result.amount) / INDPRICE
            let fixedAmount = newAmount.toFixed(2)
            result.amount = Number(fixedAmount)
          }
          if(result.action === "buy" && user){
            await coinbaseBuyer(coinbaseClient, user, INDPRICE, result) //then update db
            console.log(`${user.user} is buying`)
            return "buying"
          }else if(result.action === "sell" && user.side === "long" && user){
            await coinbaseSeller(coinbaseClient, user, INDPRICE, result) //then update db
            console.log(`${user.user} is selling`)
            return "selling"
          } else {
              console.log(priceUpdate)
              let currentClosePrice = priceUpdate
              await updateStrategy({currentClosePrice: currentClosePrice, strategyUid: user.strategyUid }, user.user)
              console.log(`waiting for trigger for ${user.asset} @${user.timeframe}`)
          }
          
        }

        async function calculateIndicatorValues({indicator, asset}){
          let res = {}
          let timeframe = "1m"
          const candles = await coinbaseClient.getProductHistoricRates(`${asset}`, {granularity: CoinbaseGranularity[timeframe]}) 
          let indicators = calculateIndicators(candles.reverse().map(candle=>candle[4]))
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
        let resx = new AsyncFunction(`${executeTrade} ${calculateIndicatorValues}; ${strategy}`)
        await resx()
        // eval(strategy)
      
    } catch (error) {
        console.log(error)
        return error
    }

  }



  async function coinbaseTrader(users){
    try {
      let uri = "https://api.pro.coinbase.com"
      let filteredUsers = users.filter(user=> user.paid == true ) //&& user.isLive === true
      // return Promise.all(
      //   filteredUsers.map(async function (user){
      //     const coinbaseClient = user.key == ""? new CoinbasePro.PublicClient() : new CoinbasePro.AuthenticatedClient({key: user.key, secret: user.secret, passphrase: user.passphrase, apiURI:uri})
      //     if(user.paid ){
      //       // let assetOrPair = user.asset || user.pair
      //       // const candles = await coinbaseClient.getProductHistoricRates(`${assetOrPair}`, {granularity: CoinbaseGranularity[user.timeframe]}) 
      //       globalThis.user = user
      //       const coinbaseBuyAndSell = await coinbaseBuyerAndSeller(user, coinbaseClient)
      //     }
      //     //  else if(user.type == "live_trader"){
      //     //   const candles = await coinbaseClient.getProductHistoricRates(user.asset, {granularity: CoinbaseGranularity[user.timeframe]})
      //     //   const coinbaseBuyAndSell = await coinbaseBuyerAndSeller(candles, user, coinbaseClient)
      //     // }
      //   })
      // )

      for(let i =0; i<filteredUsers.length; i++){
        let user = filteredUsers[i]
        if(user.paid){
          // let assetOrPair = user.asset || user.pair
          // const candles = await coinbaseClient.getProductHistoricRates(`${assetOrPair}`, {granularity: CoinbaseGranularity[user.timeframe]}) 
          globalThis.user = user
          const coinbaseBuyAndSell = await coinbaseBuyerAndSeller(user, coinbaseClient)
        }
        //  else if(user.type == "live_trader"){
        //   const candles = await coinbaseClient.getProductHistoricRates(user.asset, {granularity: CoinbaseGranularity[user.timeframe]})
        //   const coinbaseBuyAndSell = await coinbaseBuyerAndSeller(candles, user, coinbaseClient)
        // }
      }

    } catch (error) {
      console.log(error)
    }
  }


  module.exports = {
      coinbaseTrader
  }
