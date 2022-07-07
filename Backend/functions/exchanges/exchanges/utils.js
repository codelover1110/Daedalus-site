const {updateStrategy} = require("../../controllers/strategies/index")
firebaseAdmin = require("../../controllers/firebaseAdmin/index"),
{ firestoreDatabase } = firebaseAdmin;
const tradingController = require("../../controllers/portfolio/tradingController")

function indicatorsAndActionsExtractor(strategy){
    let rgx = /^IND|^ACT/g
    let splited = strategy.split(/[\s(){}]+|result=/)
    // console.log(splited)
    let filtered = splited.filter(function(element){
        return element.match(rgx)
    })
    return filtered
  }

  function crossOver(arr) {
    if (arr[0] >= 0 && arr[1] < 0) {
        //if (arr[arr.length - 1] < 0 && arr[arr.length - 1] > arr[arr.length - 2] && arr[arr.length - 2] < 0 && arr[arr.length - 2] > arr[arr.length - 3]) {
        return "True"
    } else if(arr[0] >= 0 && arr[1] >= 0 &&  arr[2] < 0) {
        //if (arr[arr.length - 1] < 0 && arr[arr.length - 1] > arr[arr.length - 2] && arr[arr.length - 2] < 0 && arr[arr.length - 2] > arr[arr.length - 3]) {
        return "True"
    }  else {
        return false
    }
}

function crossUnder(arr) {
    if (arr[1] >= 0 && arr[0] < 0) {
        //if (arr[arr.length - 1] < 0 && arr[arr.length - 1] > arr[arr.length - 2] && arr[arr.length - 2] < 0 && arr[arr.length - 2] > arr[arr.length - 3]) {
        return "True"
    } else if(arr[0] <= 0 && arr[1] <= 0 &&  arr[2] > 0) {
        //if (arr[arr.length - 1] < 0 && arr[arr.length - 1] > arr[arr.length - 2] && arr[arr.length - 2] < 0 && arr[arr.length - 2] > arr[arr.length - 3]) {
        return "True"
    }  else {
        return false
    }
}

function maCrossOver(price, secondToTheLastPrice, thirdToTheLastPrice, ma){
    if(price > ma[0] && secondToTheLastPrice < ma[1]){
        return "True"
    } else if(price > ma[0] && secondToTheLastPrice > ma[1] && thirdToTheLastPrice < ma[2]){
        return "True"
    } else {
        return ""
    }
}

function maCrossUnder(price, secondToTheLastPrice, thirdToTheLastPrice, ma){
    if(price < ma[0] && secondToTheLastPrice > ma[1]){
        return "True"
    } else if(price < ma[0] && secondToTheLastPrice < ma[1] && thirdToTheLastPrice > ma[2]){
        return "True"
    } else {
        return ""
    }
}

const stratOwner = async function(uid){
    const usersRef = firestoreDatabase.collection("USERS").doc(uid)
    snapshot = await usersRef.get()
    user = snapshot.data();
    return user;

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
 await handleTradeActions(action, user, "liveTraderPerformance", price)
}
    
}

async function handleTradeActions(result, user, performance, price){
let tradeArray = user[performance]
let currentTrade = tradeArray[tradeArray.length -1] || {}
let executedTrades = currentTrade.executed || []
// console.log(result.action, executedTrades, currentTrade.status)
if(result.action === "buy"){
    if(currentTrade.status === "incomplete" && executedTrades.indexOf(result.id) < 0 ){
        currentTrade.bought += result.amount
        currentTrade.executed.push(result.id)
        currentTrade.executionDetails.push(result)
        currentTrade.price = (currentTrade.price + price)/(currentTrade.executed.length)
        user.side = "long"
        let owner = await stratOwner(user.user)
        await updateStrategy ({...user}, user.user)
        // user.type === "paper_trader"? changeAccountBalance(owner, result.amount, "paper_trader", "buy", user.user, 0, false, currentTrade) : null
        await tradingController.buy({
            accountType: user.marketType,
            accountName: user.accountName,
            quantity: (Number(result.amount)).toFixed(2) ,
            symbol: result.symbol,
            latestPrice: price,
        }, user.user)

    }
    if(currentTrade.status === "complete" || currentTrade.status === undefined){
        let newTrade = { 
            price: price, 
            asset: result.asset, 
            timeframe: user.timeframe, 
            type:user.type, 
            id: Date.now(), 
            side:result.action === 'buy'? "long":"",
            status:"incomplete",
            performance:0,
            pnl: 0,
            timeCompleted:0,
            bought:result.amount,
            sold:0,
            executed:[result.id],
            executionDetails:[{...result, timestamp:Date.now(), quantity: (Number(result.amount)).toFixed(2)}]
        }
        console.log("Xxxxxxxxxxxxxxx")
        user[performance].push(newTrade)
    user.side = "long"
    let owner = await stratOwner(user.user)
    await updateStrategy ({...user}, user.user)
    console.log("user.user", user.user)
    await tradingController.buy({
        accountType: user.marketType,
        accountName: user.accountName,
        quantity: (Number(result.amount)).toFixed(2) ,
        symbol: result.symbol,
        latestPrice: price,
    }, user.user)
    // user.type === "paper_trader"? changeAccountBalance(owner, result.amount, "paper_trader", "buy", user.user, 0, true, newTrade) : null
    
}
    // user.side = "long"
    // let owner = await stratOwner(user.user)
    // user.type === "paper_trader"? changeAccountBalance(owner, result.amount, "paper_trader", "buy", user.user) : null
    // await updateStrategy ({...user}, user.user)

} else if(result.action === "sell" && executedTrades.indexOf(result.id) < 0){
    const performances = user[performance]
    currentTrade = performances[performances.length -1]
    currentTrade.sold += result.amount
    currentTrade.side= currentTrade.sold >= currentTrade.bought? "" : "long"
    currentTrade.status = currentTrade.sold >= currentTrade.bought ? "complete" : "incomplete"
    currentTrade.timeCompleted = Date.now()
    currentTrade.executed.push(result.id)
    currentTrade.executionDetails.push({...result, timestamp:Date.now(), quantity: (Number(result.amount)).toFixed(2)})
    user.side = currentTrade.sold >= currentTrade.bought? "" : "long"
    currentTrade.closePrice = price
    const change = (price - currentTrade.price) / currentTrade.price
    currentTrade.performance = change * 100
    currentTrade.pnl = change * result.amount
    await updateStrategy ({...user}, user.user)
    let owner = await stratOwner(user.user)
    // user.type === "paper_trader"? changeAccountBalance(owner, result.amount, "paper_trader", "sell", user.user, currentTrade.pnl, false, currentTrade) : null
    await tradingController.sell({
        accountType: user.marketType,
        accountName: user.accountName,
        quantity: (Number(result.amount)).toFixed(2) ,
        symbol: result.symbol,
        latestPrice: price,
    }, user.user)
} else {
  

}
}



  module.exports = {
      indicatorsAndActionsExtractor,
      crossUnder,
      crossOver,
      maCrossOver,
      maCrossUnder,
      stratOwner,
      changeAccountBalance,
      handleTrades,
      handleTradeActions,
  }