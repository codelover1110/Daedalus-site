const Binance = require('node-binance-api');
const decodeCrypto = require('../../../utils/encodeDecode').decodeCrypto

//BackEnd Config

const getBinanceConnection = async (reqPayload) => {
    return new Promise(async (resolve, reject) => {
        try {
            const key = JSON.parse(decodeCrypto(reqPayload.code))
            const binance = new Binance().options({ APIKEY: key.api_key, APISECRET: key.secret_key });
            const data = await binance.futuresPrices();
            resolve({ status: true });
        } catch (err) {
            resolve({ status: false, err: err.message });
        }
    });
}

module.exports = {
    getBinanceConnection: getBinanceConnection
}