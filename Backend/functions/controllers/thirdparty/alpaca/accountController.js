var request = require('request');
var qs = require('querystring');
const config = require("../../../config");
const SENDBOX_MODE = true;

const API_URL = SENDBOX_MODE == true ? "https://paper-api.alpaca.markets" : "https://api.alpaca.markets";

const getHeaders = (reqPayload) => {
    let headers = "";
    if (SENDBOX_MODE == true) {
        headers = { 'APCA-API-KEY-ID': `CK9PJHY49RNZ4X8NTHP3`, 'APCA-API-SECRET-KEY': `WsooIotUcRPrOgOF2nE6G7yVc3Fdw4uOy2zVDF5o`, }
    } else {
        headers = { 'Authorization': `Bearer ${reqPayload.access_token}` }
    }
    return headers
}

const callRequest = (options) => {
    return new Promise(async (resolve, reject) => {
        try {
            request(options, function (error, response) {
                if (error) throw new Error(error);

                if (response.body) {
                    var data = JSON.parse(response.body);
                    if (data) {
                        resolve({ status: true, data: data });
                    } else {
                        resolve({ status: true, data: data });
                    }
                } else {
                    resolve({ status: false, err: response.body });
                }
            });
        } catch (err) {
            resolve({ status: false, err: err.message });
        }
    });
}

//get New refresh Token
const getAccounts = async (reqPayload) => {
    return new Promise(async (resolve, reject) => {
        try {
            const base = API_URL + "/v2/account";
            var options = { 'method': 'GET', 'url': base, 'headers': getHeaders(reqPayload) };
            const data = await callRequest(options);
            resolve(data);
        } catch (err) {
            resolve({ status: false, err: err.message });
        }
    });
}

//get positions
const getPositions = async (reqPayload) => {
    return new Promise(async (resolve, reject) => {
        try {
            const base = API_URL + "/v2/positions";
            var options = { 'method': 'GET', 'url': base, 'headers': getHeaders(reqPayload) };
            const data = await callRequest(options);
            resolve(data);
        } catch (err) {
            resolve({ status: false, err: err.message });
        }
    });
}

//Delete positions
const closePosition = async (reqPayload) => {
    return new Promise(async (resolve, reject) => {
        try {
            const base = API_URL + "/v2/positions/" + reqPayload.position.assets;
            const payload = { qty: reqPayload.position.quantity, 'percentage': reqPayload.position.percentage }
            var options = { 'method': 'DELETE', 'url': base, 'headers': getHeaders(reqPayload), 'body': JSON.stringify(payload) };
            const data = await callRequest(options);
            resolve(data);
        } catch (err) {
            resolve({ status: false, err: err.message });
        }
    });
}

//Get Orders
const getOrders = async (reqPayload) => {
    return new Promise(async (resolve, reject) => {
        try {
            const base = API_URL + "/v2/orders";
            var options = { 'method': 'GET', 'url': base, 'headers': getHeaders(reqPayload) };
            const data = await callRequest(options);
            resolve(data);
        } catch (err) {
            resolve({ status: false, err: err.message });
        }
    });
}

//Request a new order
const orderLimitBuy = async (reqPayload) => {
    return new Promise(async (resolve, reject) => {
        try {
            const base = API_URL + "/v2/orders";
            const payload = {
                'assets': reqPayload.order.assets,
                'qty': reqPayload.order.quantity,
                'notional': reqPayload.order.price,
                'side': 'buy',
                'type': reqPayload.order.type,
                'time_in_force': reqPayload.order.time_in_force,
                'limit_price': reqPayload.order.limit_price,
                'trail_price': reqPayload.order.trail_price,
                'trail_percent': reqPayload.order.trail_percent,
            }
            var options = { 'method': 'POST', 'url': base, 'headers': getHeaders(reqPayload), 'body': JSON.stringify(payload) };
            const data = await callRequest(options);
            resolve(data);
        } catch (err) {
            resolve({ status: false, err: err.message });
        }
    });
}
//Request a new order
const orderLimitSell = async (reqPayload) => {
    return new Promise(async (resolve, reject) => {
        try {
            const base = API_URL + "/v2/orders";
            const payload = {
                'assets': reqPayload.order.assets,
                'qty': reqPayload.order.quantity,
                'notional': reqPayload.order.price,
                'side': 'sell',
                'type': reqPayload.order.type,
                'time_in_force': reqPayload.order.time_in_force,
                'limit_price': reqPayload.order.limit_price,
                'trail_price': reqPayload.order.trail_price,
                'trail_percent': reqPayload.order.trail_percent,
            }
            var options = { 'method': 'POST', 'url': base, 'headers': getHeaders(reqPayload), 'body': JSON.stringify(payload) };
            const data = await callRequest(options);
            resolve(data);
        } catch (err) {
            resolve({ status: false, err: err.message });
        }
    });
}

module.exports = {
    getAccounts,
    getPositions,
    closePosition,
    getOrders,
    orderLimitBuy,
    orderLimitSell
}
