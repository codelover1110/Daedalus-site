var request = require('request');
var qs = require('querystring');
const encodeCrypto = require('../../../utils/encodeDecode').encodeCrypto
const config = require("../../../config");
const API_URL = "https://api.coinbase.com";

//BackEnd Config
const defaultParams = {
    client_id: config.coinbase_client_id,
    client_secret: config.coinbase_client_secret
}

//generate Token
const getCoinbaseAuthToken = async (code, redirect_uri) => {
    return new Promise(async (resolve, reject) => {
        try {
            const base = API_URL + "/oauth/token?";
            const queryParams = {
                client_id: config.coinbase_client_id,
                client_secret: config.coinbase_client_secret,
                redirect_uri: redirect_uri,
                grant_type: "authorization_code",
                code: code
            }
            var options = {
                'method': 'POST',
                'url': base + qs.stringify(queryParams),
            };

            console.log(options);
            request(options, function (error, response) {
                if (error) throw new Error(error);
                var data = response.body
                resolve({ status: true, data: encodeCrypto(data) });
            });
        } catch (err) {
            resolve({ status: false, err: err.message });
        }
    });
}

//get New refresh Token 
const getCoinbaseRefershToken = async (reqPayload) => {
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
                'headers': { 'authorization': reqPayload.access_token }
            };
            request(options, function (error, response) {
                if (error) throw new Error(error);
                var data = response.body
                resolve({ status: true, data: encodeCrypto(data) });
            });
        } catch (err) {
            resolve({ status: false, err: err.message });
        }
    });
}

//
module.exports = {
    getCoinbaseAuthToken,
    getCoinbaseRefershToken,
}