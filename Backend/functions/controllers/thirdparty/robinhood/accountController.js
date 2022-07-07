var request = require('request');
var qs = require('querystring');
const config = require("../../../config");
const API_URL = "https://api.robinhood.com";

//BackEnd Config
const defaultParams = {
    client_id: config.robinhood_client_id,
    client_secret: config.robinhood_client_secret
}

const callRequest = (options) => {
    return new Promise(async (resolve, reject) => {
        try {
            request(options, function (error, response) {
                if (error) throw new Error(error);
                var data = response.body;
                if (data) {
                    resolve({ status: true, data: data });
                } else {
                    resolve({ status: true, data: data });
                }
            });
        } catch (err) {
            resolve({ status: false, err: err.message });
        }
    });
}

const getAccounts = async (code, redirect_uri) => {
    return new Promise(async (resolve, reject) => {
        try {
            const base = API_URL + "/oauth/token?";
            const queryParams = {
                client_id: config.robinhood_client_id,
                client_secret: config.robinhood_client_secret,
                redirect_uri: redirect_uri,
                grant_type: "authorization_code",
                code: code
            }
            var options = {
                'method': 'POST',
                'url': base + qs.stringify(queryParams),
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