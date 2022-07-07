const {updateStrategy} = require("../../controllers/strategies/index")
firebaseAdmin = require("../../controllers/firebaseAdmin/index"),
{ firestoreDatabase } = firebaseAdmin;

const stratOwner = async function(uid){
        const usersRef = firestoreDatabase.collection("USERS").doc(uid)
        snapshot = await usersRef.get()
        user = snapshot.data();
        return user;
    
}

const updateOwner = async function(uid){

}

async function changeAccountBalance(owner, amount, type, action,uid, pnl, newPosition, details){
    let account = ''
    let accountTypes = {
        "paper_trader": "Crypto Paper Trading",
        "spaper_trader": "Stock Paper Trading",
        // "live_trader": :"Coinbase"
    }
    let accounts = owner.connectedAccounts
    accounts.forEach(function(a){
        if(a.name === accountTypes[type]){
            let fixedPnl = pnl.toFixed(2)
            
            action === "buy"? a.balance=a.balance - amount : a.balance= a.balance + amount + Number(fixedPnl)
            if(newPosition === true){
                a.positions.push(details)
            } else if( newPosition === false){
                let currentPosition = a.positions[a.positions.length - 1]
                a.positions[a.positions.length - 1] = {...currentPosition, ...details}
            }
        }
    })
    const usersRef = firestoreDatabase.collection("USERS").doc(uid)
    await usersRef.update({connectedAccounts: accounts})
    // console.log(accounts)
    // return account.balance
}
async function handleTrades(user, result, price){
    if(user.type === "paper_trader"){
     await handleTradeActions(result, user, "paperTraderPerformance", price)
    } else if(user.type === "live_trader"){
     await handleTradeActions(result, user, "liveTraderPerformance", price)
    }
        
}

async function handleTradeActions(result, user, performance, price){
    let tradeArray = user[performance]
    let currentTrade = tradeArray[tradeArray.length -1] || {}
    let executedTrades = currentTrade.executed || []
    // console.log(tradeArray, currentTrade, result.side, executedTrades, currentTrade.status)
    if(result.side === "buy"){
        if(currentTrade.status === "incomplete" && executedTrades.indexOf(result.id) < 0 ){
            currentTrade.bought += result.qty
            currentTrade.executed.push(result.id)
            currentTrade.executionDetails.push(result)
            currentTrade.price = (currentTrade.price + price)/(currentTrade.executed.length)
            user.side = "long"
            let owner = await stratOwner(user.user)
            await updateStrategy ({...user}, user.user)
            user.type === "paper_trader"? changeAccountBalance(owner, result.qty, "paper_trader", "buy", user.user, 0, false, currentTrade) : null
            

        }
        if(currentTrade.status === "complete" || currentTrade.status === undefined){
            let newTrade = { 
                price: price, 
                asset: user.asset, 
                timeframe: user.timeframe, 
                type:user.type, 
                id: Date.now(), 
                side:result.side === 'buy'? "long":"",
                status:"incomplete",
                performance:0,
                pnl: 0,
                timeCompleted:0,
                bought:result.qty,
                sold:0,
                executed:[result.id],
                executionDetails:[{...result, timestamp:Date.now()}]
            }
            console.log("Xxxxxxxxxxxxxxx")
            user[performance].push(newTrade)
        user.side = "long"
        let owner = await stratOwner(user.user)
        await updateStrategy ({...user}, user.user)
        user.type === "paper_trader"? changeAccountBalance(owner, result.qty, "paper_trader", "buy", user.user, 0, true, newTrade) : null
        
    }
        // user.side = "long"
        // let owner = await stratOwner(user.user)
        // user.type === "paper_trader"? changeAccountBalance(owner, result.qty, "paper_trader", "buy", user.user) : null
        // await updateStrategy ({...user}, user.user)

    } else if(result.side === "sell" && executedTrades.indexOf(result.id) < 0){
        const performances = user[performance]
        currentTrade = performances[performances.length -1]
        currentTrade.sold += result.qty
        currentTrade.side= currentTrade.sold === currentTrade.bought? "" : "long"
        currentTrade.status = currentTrade.sold >= currentTrade.bought ? "complete" : "incomplete"
        currentTrade.timeCompleted = Date.now()
        currentTrade.executed.push(result.id)
        currentTrade.executionDetails.push(result)
        user.side = currentTrade.sold >= currentTrade.bought? "" : "long"
        currentTrade.closePrice = price
        const change = (price - currentTrade.price) / currentTrade.price
        currentTrade.performance = change * 100
        currentTrade.pnl = change * result.qty
        await updateStrategy ({...user}, user.user)
        let owner = await stratOwner(user.user)
        user.type === "paper_trader"? changeAccountBalance(owner, result.qty, "paper_trader", "sell", user.user, currentTrade.pnl, false, currentTrade) : null

    } else {
      

    }
}
async function alpacaBuyer(client, user, price, result){
   try {
    const buyParams = {
        // price:"",
        size: result.amount,
        product_id: result.asset,
        type:"market"
      }
      if(user.type === "paper_trader"){
          await handleTrades(user, result, price)
      } 
      if(user.type === "live_trader"){
        //   console.log(buyParams, result)
        //   console.log(user, result, price)
        // await client.buy(buyParams)
        let order_result = await client.createOrder({
            symbol: buyParams.product_id,
            qty: result.amount,
            side: 'buy',
            type: 'market',
            time_in_force: 'day'
          });
        
        await handleTrades(user, order_result, price)
      }
   } catch (error) {
       console.log(error)
       return error
   }
  
  }
  
  async function alpacaSeller(client, user, price, result){
   try {
    const sellParams = {
        // price:"",
        size: result.amount,
        product_id: result.asset,
        type:"market",
      }
      if(user.type === "paper_trader"){
        await handleTrades(user, result, price)
    } 
    if(user.type === "live_trader"){
    //   await client.sell(buyParams)
    let order_result = await client.createOrder({
        symbol: sellParams.product_id,
        qty: result.amount,
        side: 'sell',
        type: 'market',
        time_in_force: 'day'
      });
      await handleTrades(user, order_result, price)
    }
   } catch (error) {
       console.log(error)
       return error
   }
  }


  module.exports = {
    alpacaBuyer,
    alpacaSeller
}