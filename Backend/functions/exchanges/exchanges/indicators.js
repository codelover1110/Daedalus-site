const TA = require("technicalindicators")
const {crossOver, crossUnder, maCrossOver, maCrossUnder} = require("./utils")


function calculateIndicators(candles){
    let currentPrice = candles[candles.length -1]
    let secondToTheLastPrice = candles[candles.length -2]
    let thirdToTheLastPrice = candles[candles.length -3]
    let sma50 = TA.sma({period:50, values: [...candles]})
    sma50.reverse()
    let sma200 = TA.sma({period:200, values: [...candles]})
    sma200.reverse()
    let ema9 = TA.ema({period:9, values: [...candles]})
    ema9.reverse()
    let ema20 = TA.ema({period:20, values: [...candles]})
    ema20.reverse()
    let ema55 = TA.ema({period:55, values: [...candles]})
    ema55.reverse()
    let ema89 = TA.ema({period:89, values: [...candles]})
    ema89.reverse()
    let macd =TA.macd({
                        values:[...candles], 
                        fastPeriod:9, 
                        slowPeriod:26, 
                        signalPeriod:3, 
                        SimpleMAOscillator:false, 
                        SimpleMASignal:false
                      }).reverse().map(mac=> mac.histogram)
    let rsi = TA.rsi({values:[...candles], period:14})
    let bb =  TA.bollingerbands({
                                period:20,
                                values:[...candles],
                                stdDev:2
                                }).reverse()
  
    return {
      currentPrice:currentPrice,
      ema9CrossOver: maCrossOver(currentPrice, secondToTheLastPrice, thirdToTheLastPrice, [ema9[0], ema9[1], ema9[2]]),
      ema9CrossUnder: maCrossUnder(currentPrice, secondToTheLastPrice, thirdToTheLastPrice, [ema9[0], ema9[1], ema9[2]]),

      ema20CrossOver: maCrossOver(currentPrice, secondToTheLastPrice, thirdToTheLastPrice, [ema20[0], ema20[1], ema20[2]]),
      ema20CrossUnder: maCrossUnder(currentPrice, secondToTheLastPrice, thirdToTheLastPrice, [ema20[0], ema20[1], ema20[2]]),

      ema55CrossOver: maCrossOver(currentPrice, secondToTheLastPrice, thirdToTheLastPrice, [ema55[0], ema55[1], ema55[2]]),
      ema55CrossUnder: maCrossUnder(currentPrice, secondToTheLastPrice, thirdToTheLastPrice, [ema55[0], ema55[1], ema55[2]]),

      ema89CrossOver: maCrossOver(currentPrice, secondToTheLastPrice, thirdToTheLastPrice, [ema89[0], ema89[1], ema89[2]]),
      ema89CrossUnder: maCrossUnder(currentPrice, secondToTheLastPrice, thirdToTheLastPrice, [ema89[0], ema89[1], ema89[2]]),
      
      sma200CrossOver: maCrossOver(currentPrice, secondToTheLastPrice, thirdToTheLastPrice, [sma200[0], sma200[1], sma200[2]]),
      sma200CrossUnder: maCrossUnder(currentPrice, secondToTheLastPrice, thirdToTheLastPrice, [sma200[0], sma200[1], sma200[2]]),

      sma50CrossOver: maCrossOver(currentPrice, secondToTheLastPrice, thirdToTheLastPrice, [sma50[0], sma50[1], sma50[2]]),
      sma50CrossUnder: maCrossUnder(currentPrice, secondToTheLastPrice, thirdToTheLastPrice, [sma50[0], sma50[1], sma50[2]]),

      macdCrossOver: crossOver([macd[0], macd[1], macd[2]]),
      macdCrossUnder: crossUnder([macd[0], macd[1], macd[2]]),

      rsi14: rsi.reverse()[0],
      bb: [bb[0], bb[1], bb[2]].map(b=> b.middle)
    }
  
  }


  module.exports={
      calculateIndicators
  }