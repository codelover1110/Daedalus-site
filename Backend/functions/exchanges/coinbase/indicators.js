const TA = require("technicalindicators")

function calculateIndicators(candles){
    let currentPrice = candles[candles.length -1]
    let secondToTheLastPrice = candles[candles.length -2]
    let thirdToTheLastPrice = candles[candles.length -3]
    let sma = TA.sma({period:55, values: [...candles]})
    let ema = TA.ema({period:55, values: [...candles]})
    let macd =TA.macd({
                        values:[...candles], 
                        fastPeriod:9, 
                        slowPeriod:26, 
                        signalPeriod:3, 
                        SimpleMAOscillator:false, 
                        SimpleMASignal:false
                      }).reverse()
    let rsi = TA.rsi({values:[...candles], period:14})
    let bb =  TA.bollingerbands({
                                period:20,
                                values:[...candles],
                                stdDev:2
                                }).reverse()
  
    return {
      currentPrice:currentPrice,
      ema55: ema.reverse()[0],
      sma55: sma.reverse()[0],
      macd: [macd[0], macd[1], macd[2]].map(mac=> mac.histogram),
      rsi14: rsi.reverse()[0],
      bb: [bb[0], bb[1], bb[2]].map(b=> b.middle)
    }
  
  }


//   module.exports={
//       calculateIndicators
//   }