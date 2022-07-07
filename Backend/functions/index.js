const functions = require("firebase-functions");
const encodeDecode = require("./utils/encodeDecode");
const robinhood = require("./controllers/thirdparty/robinhood");
const coinbase = require("./controllers/thirdparty/coinbase");
const alpaca = require("./controllers/thirdparty/alpaca");
const binance = require("./controllers/thirdparty/binance");
const firebaseAdmin = require("./controllers/firebaseAdmin");
const usersController = require("./controllers/users");
const strategyController = require("./controllers/strategies");
const tradingController = require("./controllers/portfolio");
const waitListController = require("./controllers/users/waitlistController");
const subscriptionController = require("./controllers/users/subscriptionController")
const {addBalanceHistory, getBalanceHistory, getAlpacaBalanceHistory, getAlpacaAccount, updateAlpacaBalanceHistory, getAlpacaPosition} = require("./controllers/users/accessController");
const { firestoreDatabase } = firebaseAdmin;
const TA = require("technicalindicators")
const CoinbasePro = require('coinbase-pro');
const cbt = require("./exchanges/coinbase/index").coinbaseTrader
const alp = require("./exchanges/alpaca/index").alpacaTrader
const axios = require("axios")
const config = require('./config')

const coinbaseAuth = {
  apiKey:"58054d15376a178e2129198e65f2713f9049e8f9c7c4dff472abec66c3825ced",
  apiSecret:"74d196b351acc5900f293a64676f7b9be8e6fa8033686625a8ffe2b125d59305",
  passphrase:"",
  useSandbox:true
}

const coinbaseClient = new CoinbasePro.PublicClient() //(coinbaseAuth);

//AccessToken Encode and Decode
const decodeCrypto = encodeDecode.decodeCrypto;

exports.addUser = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      `unauthenticated`,
      `user is not authenticated`
    );
  }
  let result = {};
  try {
    const usersRef = firestoreDatabase.collection("USERS");
    await usersRef.doc(data.uid).set(data);
    result = { success: true };
  } catch (error) {
    throw new functions.https.HttpsError(`unknown`, `Something went wrong!`);
  }

  return result;
});

exports.getUser = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      `unauthenticated`,
      `user is not authenticated`
    );
  }
  let result = {};
  try {
    const usersRef = firestoreDatabase.collection("USERS");
    const docRef = await usersRef.doc(context.auth.uid).get();
    let userData = docRef.data();
    result = { user: userData };
  } catch (error) {
    throw new functions.https.HttpsError(`unknown`, `Something went wrong!`);
  }

  return result;
});

exports.updateUser = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      `unauthenticated`,
      `user is not authenticated`
    );
  }
  const usersRef = firestoreDatabase.collection("USERS");
  await usersRef.doc(context.auth.uid).update(data);
  return { success: true };
});

exports.updateAlpacaUser = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      `unauthenticated`,
      `user is not authenticated`
    );
  }
  let key = ""
  let secret = ""
  data.connectedAccounts.forEach(account => {
    if (account['Alpaca']) {
      key = account.Alpaca.api_key
      secret = account.Alpaca.secret_key
    }
  });
  let account_info = await getAlpacaAccount(key, secret)
  if (account_info.success) {
    data.connectedAccounts.forEach((item, idx) => {
      if (item['Alpaca']) {
        data.connectedAccounts[idx].balance = parseFloat(account_info.account.equity)
        data.connectedAccounts[idx].Alpaca.api_key = btoa(data.connectedAccounts[idx].Alpaca.api_key)
        data.connectedAccounts[idx].Alpaca.secret_key = btoa(data.connectedAccounts[idx].Alpaca.secret_key)
      }
    });
    const usersRef = firestoreDatabase.collection("USERS");
    await usersRef.doc(context.auth.uid).update(data);
    return { success: true };
  } else {
    return {success: false}
  }
  
});

exports.connectAccount = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      `unauthenticated`,
      `user is not authenticated`
    );
  }
  let result = {};
  try {
    result = await usersController.connectAccount(data, context.auth.uid);
  } catch (error) {
    console.log(error);
    throw new functions.https.HttpsError(`unknown`, `Something went wrong!`);
  }
  return result;
});

exports.getApiAuthToken = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      `unauthenticated`,
      `user is not authenticated`
    );
  }
  let result = {};
  try {
    if (data.code && data.redirect_uri) {
      switch (data.apiType) {
        case "Robinhood":
          result = await robinhood.getRobinhoodAuthToken(
            data.code,
            data.redirect_uri
          );
          break;
        case "Coinbase":
          result = await coinbase.getCoinbaseAuthToken(
            data.code,
            data.redirect_uri
          );
          break;
        case "Binance":
          result = await binance.getBinanceConnection(data.code);
          break;
        case "Alpaca":
          result = await alpaca.getAlpacaAuthToken(
            data.code,
            data.redirect_uri
          );
          break;
      }
    } else {
      result = { status: false, err: "required parameter missing." };
    }
  } catch (error) {
    console.log(error);
    throw new functions.https.HttpsError(`unknown`, error.message);
  }
  return result;
});

exports.refreshApiToken = functions.https.onCall(async (data, context) => {
  let result = {};
  try {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        `unauthenticated`,
        `user is not authenticated`
      );
    }
    if (data.authType) {
      let getconnectAccountResult = await usersController.getconnectAccount(
        data,
        context.auth.uid
      );
      const authResultIndex = getconnectAccountResult.findIndex(
        (x) => x.authType == data.authType
      );
      let authResult = getconnectAccountResult[authResultIndex];
      authResult.authData = JSON.parse(decodeCrypto(authResult.authData));
      if (authResult) {
        const reqPayload = {
          refresh_token: authResult.authData.refresh_token,
          access_token: authResult.authData.access_token,
        };
        switch (data.authType) {
          case "Robinhood":
            result = await robinhood.getRobinhoodRefershToken(reqPayload);
            break;
          case "Coinbase":
            result = await coinbase.getCoinbaseRefershToken(reqPayload);
            break;
          case "Binance":
            result = await binance.getBinanceRefershToken(reqPayload);
            break;
          case "Alpaca":
            result = await alpaca.getAlpacaAuthToken(reqPayload);
            break;
        }
        if (result.status) {
          authResult.authData = result.data;
          await usersController.connectAccount(authResult, context.auth.uid);
        }
      } else {
        result = { status: false, err: "required parameter missing." };
      }
    } else {
      result = { status: false, err: "required parameter missing." };
    }
  } catch (err) {
    result = { status: false, err: err.message };
  }
  return result;
});

exports.apiRouter = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      `unauthenticated`,
      `user is not authenticated`
    );
  }
  let result = {};
  if (data.router && data.authType && data.code) {
    const encodeCryptoData = JSON.parse(decodeCrypto(data.code));
    data = { ...data, ...encodeCryptoData };
    console.log(data);
    switch (data.authType) {
      case "Robinhood":
        result = await coinbase.apiRouter(data);
        break;
      case "Coinbase":
        result = await coinbase.apiRouter(data);
        break;
      case "Binance":
        result = await binance.apiRouter(data);
        break;
      case "Alpaca":
        result = await alpaca.apiRouter(data);
        break;
    }
  } else {
    result = { status: false, err: "required parameter missing." };
  }
  return result;
});

exports.saveStrategy = functions.https.onCall(async (payload, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      `unauthenticated`,
      `user is not authenticated`
    );
  }
  let result = {};
  try {
    if (payload) {
      const response = await strategyController.saveStrategy(
        payload,
        context.auth.uid
      );
      if (response.success) {
        result = { status: true, err: null };
      } else {
        result = { status: false, err: response.message };
      }
    } else {
      result = { status: false, err: "required parameter missing." };
    }
  } catch (error) {
    console.log("error", error);
    throw new functions.https.HttpsError(`unknown`, `Something went wrong!`);
  }

  return result;
});

exports.updateStrategy = functions.https.onCall(async (payload, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      `unauthenticated`,
      `user is not authenticated`
    );
  }
  let result = {};
  try {
    if (payload) {
      const response = await strategyController.updateStrategy(
        payload,
        context.auth.uid
      );
      if (response.success) {
        result = { status: true, err: null };
      } else {
        result = { status: false, err: response.message };
      }
    } else {
      result = { status: false, err: "required parameter missing." };
    }
  } catch (error) {
    console.log("error", error);
    throw new functions.https.HttpsError(`unknown`, `Something went wrong!`);
  }

  return result;
});

exports.getStrategies = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      `unauthenticated`,
      `user is not authenticated`
    );
  }
  let result = {};
  try {
    const response = await strategyController.getStrategies(context.auth.uid);
    if (response.success) { 
      result = { status: true, err: null, strategies: response.data };
    } else {
      result = { status: false, err: response.message };
    }
  } catch (error) {
    throw new functions.https.HttpsError(`unknown`, `Something went wrong!`);
  }

  return result;
});
exports.getTemplateStrategies = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      `unauthenticated`,
      `user is not authenticated`
    );
  }
  let result = {};
  try {
    const response = await strategyController.getTemplateStrategies();
    if (response.success) {
      result = { status: true, err: null, strategies: response.data };
    } else {
      result = { status: false, err: response.message };
    }
  } catch (error) {
    throw new functions.https.HttpsError(`unknown`, `Something went wrong!`);
  }

  return result;
});
exports.buy = functions.https.onCall(async (payload, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      `unauthenticated`,
      `user is not authenticated`
    );
  }
  let result = {};
  try {
    if (payload) {
      const response = await tradingController.buy(
        payload,
        context.auth.uid
      );
      if (response.success) {
        result = { status: true, err: null };
      } else {
        result = { status: false, err: response.message };
      }
    } else {
      result = { status: false, err: "required parameter missing." };
    }
  } catch (error) {
    console.log("error", error);
    throw new functions.https.HttpsError(`unknown`, `Something went wrong!`);
  }

  return result;
});

exports.sell = functions.https.onCall(async (payload, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      `unauthenticated`,
      `user is not authenticated`
    );
  }
  let result = {};
  try {
    if (payload) {
      const response = await tradingController.sell(
        payload,
        context.auth.uid
      );
      if (response.success) {
        result = { status: true, err: null };
      } else {
        result = { status: false, err: response.message };
      }
    } else {
      result = { status: false, err: "required parameter missing." };
    }
  } catch (error) {
    console.log("error", error);
    throw new functions.https.HttpsError(`unknown`, `Something went wrong!`);
  }

  return result;
});

exports.getCoinbaseAssets = functions.https.onCall(async ()=>{
      try {
        let allProducts = await axios.get("https://api.exchange.coinbase.com/products").then(data=> data.data.map(datum=> datum.id))
        return allProducts
      }catch(e){
        throw new functions.https.HttpsError("unknown", "can not get products from coinbase")
      }
})

const getAllStrat = async function(exchange){
  try {
    const stratRef = firestoreDatabase.collection("strategies")
    const docRef = await stratRef.where("exchange", "==", exchange).get();
    let userData = docRef.docs.map(x=> {
      let obj = x.data()
      return {...obj, strategyUid: x.id}

    })
    return userData
  } catch (error) {
    console.log(error)
  }
}




// setInterval(async () => {   //setinterval
//   const users = await getAllStrat("Coinbase")
//   await cbt(users)
// }, 1000*60*20)

setInterval(async () => {   //setinterval
  const users = await getAllStrat("Alpaca")
  await alp(users)
}, 1000*60*10)



exports.saveBalanceHistories = functions.pubsub.schedule('every 24 hours')
  .timeZone('Europe/London')
  .onRun(async(context) => {
    await addBalanceHistory()
    console.log('Successfully processed.')
  });

exports.getBalancehistories = functions.https.onCall(async (payload, context) => {
  if (!context.auth) {
      throw new functions.https.HttpsError(
        `unauthenticated`,
        `user is not authenticated`
      );
    }
    try {
      let result
      let response
      if (payload.account == 'Alpaca') {
        const usersRef = firestoreDatabase.collection("USERS");
        const docRef = await usersRef.doc(context.auth.uid).get();
        let userData = docRef.data();
        let key = ""
        let secret = ""
        userData.connectedAccounts.forEach(account => {
          if (account['Alpaca']) {
            key = account.Alpaca.api_key
            secret = account.Alpaca.secret_key
          }
        });
        
        let alpa_bal = await updateAlpacaBalanceHistory(userData, context)
        response = await getAlpacaBalanceHistory(atob(key), atob(secret))
        return {status: true, err: null, histories: response}
      }

      response = await getBalanceHistory(payload.type, context.auth.uid)

      if (response.success) {
        result = { status: true, err: null, histories: response.data };
      } else {
        result = { status: false, err: response.message };
      }
      return result;
    }  catch (error) {
      console.log(error)
      throw new functions.https.HttpsError(`unknown`, `Something went wrong!`);
    }
  }
);

exports.getStripeConfig =  functions.https.onCall(async (payload, context) => {

  if (!context.auth) {
    throw new functions.https.HttpsError(
      `unauthenticated`,
      `user is not authenticated`
    );
  }

  return subscriptionController.getStripeConfig()
})

exports.stripeRetrieveCheckoutSession =  functions.https.onCall(async (payload, context) => {

  if (!context.auth) {
    throw new functions.https.HttpsError(
      `unauthenticated`,
      `user is not authenticated`
    );
  }

  const { sessionId } = payload;
    return await subscriptionController.retrieveCheckoutSession(sessionId)
})

exports.stripeCreateCheckoutSession =  functions.https.onCall(async (payload, context) => {

  if (!context.auth) {
    throw new functions.https.HttpsError(
      `unauthenticated`,
      `user is not authenticated`
    );
  }

  const { priceId } = payload;
  return await subscriptionController.createCheckoutSession(priceId, context.auth.uid)
})

exports.stripeGetCustomerPortal = functions.https.onCall(async (payload, context) => {

  if (!context.auth) {
    throw new functions.https.HttpsError(
      `unauthenticated`,
      `user is not authenticated`
    );
  }

  const { sessionId } = payload;
  return await subscriptionController.getCustomerPortal(sessionId)
})

exports.stripeCancelSubscription = functions.https.onCall(async (payload, context) => {

  if (!context.auth) {
    throw new functions.https.HttpsError(
      `unauthenticated`,
      `user is not authenticated`
    );
  }

  try {
    return await subscriptionController.cancelSubscription(context.auth.uid)
  } catch (error) {
    throw new functions.https.HttpsError(`unknown`, `Something went wrong!`);
  }
})

exports.stripeWebhook = functions.https.onRequest(async (req, res) => {
  return await subscriptionController.handleWebhookRequest(req, res)
})



exports.getCoinbaseAssetCurrentPrice = functions.https.onCall(async (payload)=>{
  try {
    console.log(payload)
    let priceData = await axios.get(`https://api.exchange.coinbase.com/products/${payload.symbol}-USD/candles`).then(data=> data.data.map(datum=> datum[4]))
    return priceData[0]
  }catch(e){
    throw new functions.https.HttpsError("unknown", `can not get ${payload.symbol} from coinbase`)
  }
})

exports.getAlpacaPositions = functions.https.onCall(async (payload)=>{
  try {
    let positions = await getAlpacaPosition(atob(payload.Alpaca.api_key), atob(payload.Alpaca.secret_key))
    return positions
  }catch(e){
    throw new functions.https.HttpsError("unknown", `can not get ${payload.symbol} from coinbase`)
  }
})

exports.getAlpacaAssets = functions.https.onCall(async ()=>{
  try {
    let allAssets = await axios.get('https://api.nasdaq.com/api/screener/stocks?tableonly=true&limit=25&offset=0&download=true').then(data => data.data.data.rows.map(datum => datum.symbol))

    return allAssets
  }catch(e){
    throw new functions.https.HttpsError("unknown", "can not get products from alpaca")
  }
})

exports.getSymbolQuote = functions.https.onCall(async (payload, context) => {

  if (!context.auth) {
    throw new functions.https.HttpsError(
      `unauthenticated`,
      `user is not authenticated`
    );
  }

  try {
    return await tradingController.getSymbolQuote(payload, context.auth.uid)
  } catch (error) {
    throw new functions.https.HttpsError(`unknown`, `Something went wrong!`);
  }
})


exports.calculateLatestPrice = functions.https.onCall(async (payload, context) => {

  if (!context.auth) {
    throw new functions.https.HttpsError(
      `unauthenticated`,
      `user is not authenticated`
    );
  }

  try {
    return await tradingController.calculateLatestPrice(payload.accountType, payload.symbol)
  } catch (error) {
    throw new functions.https.HttpsError(`unknown`, `Something went wrong!`);
  }
})

exports.addToWhiteList = functions.https.onCall(async (payload) => {
  try {
    return await waitListController.addToWaitList(payload.email)
  } catch (error) {
    throw new functions.https.HttpsError(`unknown`, `Something went wrong!`);
  }
})

exports.addToBetaInvites = functions.https.onCall(async (payload) => {
  try {
    return await waitListController.addToBetaInvites(payload.email)
  } catch (error) {
    throw new functions.https.HttpsError(`unknown`, `Something went wrong!`);
  }
})



exports.sendWaitListEmail = functions.pubsub.schedule('every 24 hours')
  .timeZone('Europe/London')
  .onRun(async(context) => {
    await waitListController.sendWaitListEmail()
  });

  exports.getTemplateStrategy = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        `unauthenticated`,
        `user is not authenticated`
      );
    }
    let result = {};
    try {
      const response = await strategyController.getTemplateStrategies();
      if (response.success) {
        result = { status: true, err: null, strategies: response.data };
      } else {
        result = { status: false, err: response.message };
      }
    } catch (error) {
      throw new functions.https.HttpsError(`unknown`, `Something went wrong!`);
    }
  
    return result;
  });
  //Calls returnBetaEmails function in waitListController and returns result
  exports.getBetaEmails = functions.https.onCall(async () => {
    let result = {};
    try {
      const response = await waitListController.returnBetaEmails();
      if (response.success) {
        result = { status: true, err: null, emails: response.data };
      } else {
        result = { status: false, err: response.message };
      }
    } catch (error) {
      throw new functions.https.HttpsError(`unknown`, `Something went wrong!`);
    }
  
    return result;

  });