var request = require('request');
var qs = require('querystring');
const encodeCrypto = require('../../../utils/encodeDecode').encodeCrypto
const config = require("../../../config");
const API_URL = "https://api.alpaca.markets";

//BackEnd Config
const defaultParams = {
    client_id: config.alpaca_client_id,
    client_secret: config.alpaca_client_secret
}

const getAlpacaAuthToken = async (code, redirect_uri) => {
    return new Promise(async (resolve, reject) => {
        try {
            const base = API_URL + "/oauth/token?";
            const queryParams = {
                client_id: config.alpaca_client_id,
                client_secret: config.alpaca_client_secret,
                redirect_uri: redirect_uri,
                grant_type: "authorization_code",
                code: code
            }
            var options = {
                'method': 'POST',
                'url': base + qs.stringify(queryParams),
                'headers': {
                    'Content-Type': 'application/json'
                },
                "body": JSON.stringify({ data: { code: code } })
            };
            request(options, function (error, response) {
                if (error) throw new Error(error);
                var data = response.body;
                resolve({ status: true, data: encodeCrypto(data) });
            });
        } catch (err) {
            reject({ status: false, err: err.message });
        }
    });
}


//get New refresh Token
const getAlpacaRefreshToken = async (refresh_token) => {
    return new Promise(async (resolve, reject) => {
        try {
            const base = API_URL + "/oauth/token?";
            const queryParams = {
                ...defaultParams,
                'refresh_token': reqPayload.refresh_token,
                'grant_type': 'refresh_token',
            }
            var options = {
                'method': 'POST',
                'url': base + qs.stringify(queryParams),
                'headers': { 'authorization': reqPayload.refresh_token }
            };
            const data = await callRequest(options);
            resolve(data);
        } catch (err) {
            resolve({ status: false, err: err.message });
        }
    });
}

module.exports = {
    getAlpacaAuthToken,
    getAlpacaRefreshToken
}
