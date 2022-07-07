const Binance = require('node-binance-api');
const ccxt = require('ccxt')

const SENDBOX_MODE = true;

const binanceClient = (reqPayload) => {
    try {

        //Test Key 1
        //258ezAxDfwncjw91oMUAi6OTicGHMU1MRof6GaGHp8nBOV1vvruLQgP03x00Iu0q
        //gC36JI3pOQkohNpcmHBp3DG1TBeZTeRXRt2OpylD1wAzx5gMt7vfuaS5ZCZTnqdr

        //Test Key 1 
        //Type defaultType  = future
        //https://testnet.binancefuture.com/
        //6a95378e34e384d33a92eb92b4710e70ef17d023af3e15d55fb4c849c702ea9a 
        //d62131feabcbe7fff31eb5d97c3064a8f7f5cd2aa7cd768bea005ad7a937a038

        const APIKEY = SENDBOX_MODE ? '6a95378e34e384d33a92eb92b4710e70ef17d023af3e15d55fb4c849c702ea9a' : reqPayload.api_key;
        const APISECRET = SENDBOX_MODE ? 'd62131feabcbe7fff31eb5d97c3064a8f7f5cd2aa7cd768bea005ad7a937a038' : reqPayload.secret_key;

        const binance = new ccxt.binance({
            apiKey: APIKEY,
            secret: APISECRET,
            'options': {
                'defaultType': 'future'
            }
        });

        binance.set_sandbox_mode(SENDBOX_MODE);

        return binance;
    } catch (err) {
        return false;
    }
}

const getAccount = async (reqPayload) => {
    return new Promise(async (resolve, reject) => {
        try {
            const balance = await binanceClient(reqPayload).fetchBalance({ 'recvWindow': 10000000 });
            const free = balance["free"]
            resolve({ status: true, data: free });
        } catch (err) {
            resolve({ status: false, err: err.message });
        }
    });
}

const fatechOpenOrders = async (reqPayload) => {
    try {
        const market = `${reqPayload.order.assets}/${reqPayload.order.base}`
        const orders = await binanceClient(reqPayload).fetchOpenOrders(market);
        return ({ status: true, data: orders });
    } catch (err) {
        return ({ status: false, err: err.message });
    }
}

const orderLimitBuy = async (reqPayload) => {
    try {
        const market = `${reqPayload.order.assets}/${reqPayload.order.base}`
        const orders = await binanceClient(reqPayload).createLimitBuyOrder(market, reqPayload.order.quantity, reqPayload.order.price);
        return ({ status: true, data: orders });
    } catch (err) {
        return ({ status: false, err: err.message });
    }
}

const orderLimitSell = async (reqPayload) => {
    try {
        const market = `${reqPayload.order.assets}/${reqPayload.order.base}`
        const orders = await binanceClient(reqPayload).createLimitSellOrder(market, reqPayload.order.quantity, reqPayload.order.price);
        return ({ status: true, data: orders });
    } catch (err) {
        return ({ status: false, err: "err.message" });
    }
}

module.exports = {
    getAccount,
    fatechOpenOrders,
    orderLimitBuy,
    orderLimitSell
}