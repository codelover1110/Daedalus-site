const firebaseAdmin = require("../firebaseAdmin");
const {calculateLatestPrice} = require("../portfolio/tradingController");
const { firestoreDatabase, Timestamp } = firebaseAdmin;
const Alpaca = require('@alpacahq/alpaca-trade-api');

const connectAccount = async (data, uid) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (data.authData) {
                const usersRef = firestoreDatabase.collection("USERS");
                const userRef = usersRef.doc(uid);
                await firestoreDatabase.runTransaction(transaction => {
                    return transaction.get(userRef).then(doc => {
                        if (!doc.data().connectedAccounts) {
                            userRef.update({ connectedAccounts: [data] })
                            resolve([data])
                        } else {
                            let connectedAccounts = doc.data().connectedAccounts;
                            const findIndex = connectedAccounts.findIndex(x => x.authType == data.authType);
                            if (findIndex >= 0) {
                                connectedAccounts[findIndex] = data;
                            } else {
                                connectedAccounts.push(data);
                            }
                            transaction.update(userRef, { connectedAccounts: connectedAccounts });
                            resolve(connectedAccounts)
                        }
                    }).catch(err => {
                        resolve({ success: false, message: error.message });
                    });
                });
            } else {
                resolve({ success: false, message: "request input missing" });
            }
        } catch (error) {
            resolve({ success: false, message: error.message });
        }
    });
}

const getconnectAccount = async (data, uid) => {
    return new Promise(async (resolve, reject) => {
        try {
            const usersRef = firestoreDatabase.collection("USERS");
            const userRef = usersRef.doc(uid);
            await firestoreDatabase.runTransaction(transaction => {
                return transaction.get(userRef).then(doc => {
                    let connectedAccounts = doc.data().connectedAccounts;
                    resolve(connectedAccounts);
                }).catch(err => {
                    resolve([]);
                });
            });
        } catch (error) {
            resolve([]);
        }
    })
}

const updateAlpacaBalanceHistory = async(data, context) => {
    let key = ""
    let secret = ""
    data.connectedAccounts.forEach(account => {
        if (account['Alpaca']) {
            key = account.Alpaca.api_key
            secret = account.Alpaca.secret_key
        }
    });
    let account_info = await getAlpacaAccount(atob(key), atob(secret))
    if (account_info.success) {
        data.connectedAccounts.forEach((item, idx) => {
        if (item['Alpaca']) {
            data.connectedAccounts[idx].balance = parseFloat(account_info.account.equity)
        }
        });
        const usersRef = firestoreDatabase.collection("USERS");
        await usersRef.doc(context.auth.uid).update(data);
        return { success: true };
    } else {
        return {success: false}
  }
}

const addBalanceHistory = async() => {
    const userSnapshot = await firestoreDatabase.collection("USERS").get();
    const balanceHistoriesRef = firestoreDatabase.collection("balance_histories");

    const latestPrices = {};

    userSnapshot.docs.map(async(doc)=>{
        const connectedAccounts = doc.data()?.connectedAccounts;
        if(Array.isArray(connectedAccounts)){
            for(let connectedAccount of connectedAccounts) {
                const positions = [];
                if(Array.isArray(connectedAccount.positions)){
                    for(let position of connectedAccount.positions){
                        const key = `${connectedAccount.type}_${position.symbol}`.toLowerCase();
                        if(!latestPrices[key]){
                            const sleep = ms => new Promise(r => setTimeout(r, ms));
                            await sleep(1000);
                            const response = await calculateLatestPrice(connectedAccount.type, position.symbol)
                            latestPrices[key] = response?.latestPrice
                        }
                        positions.push(
                          {
                              quantity : position.quantity,
                              symbol : position.symbol,
                              price: latestPrices[key]
                          }
                        )
                    }
                }
                if(connectedAccount.balance || positions.length > 0) {
                    await balanceHistoriesRef.doc().set({
                        user_id: doc.data()?.uid || '',
                        type: connectedAccount.type || '',
                        name: connectedAccount.name || '',
                        balance: connectedAccount.balance || '',
                        positions,
                        date: Timestamp.now(),
                    });
                }
            }
        }
    })
}

const getBalanceHistory = async (type, uid) => {
    return new Promise(async (resolve, reject) => {
        try {
            const balanceHistoriesRef = firestoreDatabase.collection("balance_histories");
            const snapshot = await balanceHistoriesRef
              .where("user_id", "==", uid)
              .where("type", "==", type)
              .get();
            let histories = []
            snapshot.forEach((doc) => {
                histories.push({ ...doc.data(), uid: doc.id });
            });
            resolve({ success: true, data: histories });
        } catch (error) {
            resolve({ success: false, message: error.message });
        }
    })
}

const getAlpacaBalanceHistory = async (key, secret)  => {
    try {
        const alpaca = new Alpaca({
            keyId: key,
            secretKey: secret,
            paper: true,
        })
        
        let resp = await alpaca.getPortfolioHistory({
            period: 'intraday',
            extended_hours: true
        });
        return resp
    } catch (error) {
        return {}
    }
  
}

const getAlpacaAccount = async (key, secret)  => {
    const alpaca = new Alpaca({
        keyId: key,
        secretKey: secret,
        paper: true,
    })
    let data = {}
    try {
        data = await alpaca.getAccount()
        return {success: true, account: data}
    } catch (error) {
        return {success: false}
    }
  
}

const getAlpacaPosition = async (key, secret)  => {
    const alpaca = new Alpaca({
        keyId: key,
        secretKey: secret,
        paper: true,
    })
    let data = {}
    try {
        data = await alpaca.getPositions()
        return {success: true, account: data}
    } catch (error) {
        return {success: false}
    }
  
}

module.exports = {
    connectAccount,
    getconnectAccount,
    addBalanceHistory,
    getBalanceHistory,
    getAlpacaBalanceHistory,
    getAlpacaAccount,
    updateAlpacaBalanceHistory,
    getAlpacaPosition
}
