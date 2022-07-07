const { default: axios } = require("axios"),
  firebaseAdmin = require("../firebaseAdmin"),
  { firestoreDatabase } = firebaseAdmin;
const config  = require("../../config")
const buy = async (payload, uid) => {
  const { accountType, accountName, quantity, symbol, latestPrice } = payload,
    user = await getUser(uid);
  
  let connectedAccounts = user.connectedAccounts;

  const accountIndex = connectedAccounts.findIndex((account) => {
      return account.type === accountType && account.name === accountName;
    }),
    // { latestPrice } = await calculateLatestPrice(accountType, symbol, payload.latestPrice),
    account = connectedAccounts[accountIndex],
    positionIndex = account.positions.findIndex((x) => x.symbol === symbol),
    updatedAccount = updateAccount(
      positionIndex,
      account,
      latestPrice,
      quantity,
      symbol,
      true
    );

  connectedAccounts[accountIndex] = updatedAccount;


  return await updateDatabase(connectedAccounts, uid);
};

const sell = async (payload, uid) => {
  const { accountType, accountName, quantity, symbol, latestPrice } = payload,
    user = await getUser(uid);

  let connectedAccounts = user.connectedAccounts;

  const accountIndex = connectedAccounts.findIndex((account) => {
      return account.type === accountType && account.name === accountName;
    }),
    // { latestPrice } = await calculateLatestPrice(accountType, symbol, payload.latestPrice),
    account = connectedAccounts[accountIndex],
    positionIndex = account.positions.findIndex((x) => x.symbol === symbol),
    updatedAccount = updateAccount(
      positionIndex,
      account,
      latestPrice,
      quantity,
      symbol,
      false
    );

  connectedAccounts[accountIndex] = updatedAccount;

  return await updateDatabase(connectedAccounts, uid);
};

const updateAccount = (
    positionIndex,
    account,
    latestPrice,
    quantity,
    symbol,
    isBuying
  ) => {
    if (positionIndex >= 0) {
      let positionQuantity = Number(account.positions[positionIndex].quantity);
      isBuying
        ? (positionQuantity += Number(quantity))
        : (positionQuantity -= Number(quantity));
      account.positions[positionIndex].quantity = positionQuantity
      if(account.positions[positionIndex].first_trading_date){
        account.positions[positionIndex].first_trading_date = +new Date()
      }
      if(account.positions[positionIndex].original_price){
        account.positions[positionIndex].original_price = latestPrice
      }
    } else {
      if(!account.positions){
        account.positions = []
      }
      account.positions.push({ symbol, quantity, first_trading_date: +new Date(), original_price: latestPrice });
    }

    let newBalance = account.balance = isBuying
      ? account.balance - latestPrice * quantity
      : account.balance + latestPrice * quantity;

    account.balance = newBalance;
    console.log(account )
    return account;
  },
  calculateLatestPrice = async (accountType, symbol, price) => {

    if(accountType === 'crypto'){

      const response = price || await axios
        .get(
          `${config.iexapis_base_url}/stable/crypto/${symbol}usd/price?token=${config.iexapis_base_key}`
        ).catch((error)=>console.log('API error: '+error.message))

      const latestPrice = response ? response.price : price;

      return {latestPrice: price}  // { latestPrice }
    }else if(accountType === 'stock') {

      return await axios
        .get(
          `${config.iexapis_base_url}/stable/stock/${symbol}/quote?token=${config.iexapis_base_key}`
        )
        .then(function (response) {
          return response.data;
        })
        .catch((error)=>console.log('API error: '+error.message))
    }
  },
  getUser = async (uid) => {
    const usersRef = firestoreDatabase.collection("USERS").doc(uid),
      snapshot = await usersRef.get(),
      user = snapshot.data();
    return user;
  },
  updateDatabase = async (connectedAccounts, uid) => {
    return await firestoreDatabase
      .collection("USERS")
      .doc(uid)
      .update({ connectedAccounts: connectedAccounts });
  };

const getSymbolQuote = async (payload, uid) => {
  let { accountType, symbol, accountName } = payload, user = await getUser(uid);
  if(accountType === 'crypto') symbol = (symbol+'usd').toUpperCase()
  return await axios
    .get(
      `${config.iexapis_base_url}/stable/${accountType}/${symbol}/quote?token=${config.iexapis_base_key}`
    )
    .then((response) => {
      const result = response.data
      const data  = {}
      if(result) {
        let totalGL = 0;
        try {
          let connectedAccounts = user.connectedAccounts;
          const accountIndex = connectedAccounts.findIndex((account) => {
            return account.type === accountType && account.name === accountName;
          })
          const account = connectedAccounts[accountIndex];
          const positionIndex = account.positions.findIndex((x) => x.symbol === symbol)

          if(account.positions[positionIndex].original_price) {
            const originalPrice = Number(account.positions[positionIndex].original_price);
            totalGL = 100 / (originalPrice / (originalPrice - result.latestPrice))
          }
        }catch (e){}
        data.latestPrice = result.latestPrice;
        data.todayGL = accountType==='crypto' ? 0:  result.changePercent * 100;
        data.totalGL = totalGL;
        data.symbol = symbol;
      }
      return data;
    })
    .catch((error)=>console.log('API error: '+error.message))
}
module.exports = {
  buy,
  sell,
  calculateLatestPrice,
  getSymbolQuote,
};
