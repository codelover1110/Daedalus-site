var request = require('request');
var qs = require('querystring');
const config = require("../../../config");
const API_URL = "https://api.coinbase.com";

//BackEnd Config
const defaultParams = {
    client_id: config.coinbase_client_id,
    client_secret: config.coinbase_client_secret
}

const callRequest = (options) => {
    return new Promise(async (resolve, reject) => {
        try {
            request(options, function (error, response) {
                if (error) throw new Error(error);
                var data = JSON.parse(response.body);
                if (data && data.errors) {
                    if (data.errors[0].id == 'expired_token') {
                        resolve({ status: false, errors: data.errors[0].id });
                    } else {
                        resolve({ status: false, errors: data.errors[0].message });
                    }
                } else {
                    resolve({ status: true, data: data });
                }
            });
        } catch (err) {
            resolve({ status: false, err: err.message });
        }
    });
}

//generate Token
const getAccounts = async (reqPayload) => {
    return new Promise(async (resolve, reject) => {
        try {
            const base = API_URL + "/v2/accounts";
            var options = {
                'method': 'GET',
                'url': base,
                'headers': { 'Authorization': `Bearer ${reqPayload.access_token}` }
            };
            const data = await callRequest(options);
            resolve(data);
        } catch (err) {
            resolve({ status: false, err: err.message });
        }
    });
}

module.exports = {
    getAccounts
}