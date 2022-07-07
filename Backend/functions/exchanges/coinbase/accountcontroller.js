const {handleTrades} = require("../exchanges/utils")


async function coinbaseBuyer(client, user, price, result){
   try {
    const buyParams = {
        // price:"",
        size: user.amount,
        product_id: user.asset,
        type:"market"
      }
      if(user.type === "paper_trader"){
          await handleTrades(user, result, price)
      } 
      if(user.type === "live_trader"){
        await client.buy(buyParams)
        await handleTrades(user, result, price)
      }
   } catch (error) {
       console.log(error)
       return error
   }
  
  }
  
  async function coinbaseSeller(client, user, price, result){
   try {
    const sellParams = {
        // price:"",
        size: user.amount,
        product_id: user.asset,
        type:"market",
      }
      if(user.type === "paper_trader"){
        await handleTrades(user, result, price)
    } 
    if(user.type === "live_trader"){
      await client.sell(buyParams)
      await handleTrades(user, "sell", price)
    }
   } catch (error) {
       console.log(error)
       return error
   }
  }


  module.exports = {
    coinbaseBuyer,
    coinbaseSeller
}