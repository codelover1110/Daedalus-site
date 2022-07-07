var request = require('request');
var qs = require('querystring');
const config = require("../../../config");

const API_URL = "https://api.robinhood.com";

//BackEnd Config
const defaultParams = {
    client_id: config.robinhood_client_id,
    client_secret: config.robinhood_client_secret
}

const getRobinhoodAuthToken = async (code, redirect_uri) => {
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
            request(options, function (error, response) {
                if (error) throw new Error(error);
                var data = response.body
                resolve({ status: true, data: JSON.parse(data) });
            });
        } catch (err) {
            resolve({ status: false, err: err.message });
        }
    });
}

const getRobinhoodRefershToken = async (code, redirect_uri) => {
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
            request(options, function (error, response) {
                if (error) throw new Error(error);
                var data = response.body
                resolve({ status: true, data: JSON.parse(data) });
            });
            resolve(data);
        } catch (err) {
            resolve({ status: false, err: err.message });
        }
    });
}


module.exports = {
    getRobinhoodAuthToken,
    getRobinhoodRefershToken
}