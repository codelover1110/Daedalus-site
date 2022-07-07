import axios from 'axios';
import qs from 'querystring';
import { config } from '../../config';

const API_URL = "https://accounts.binance.com";

const defaultParams = {
  client_id: config.binance_client_id,
  client_secret: config.binance_client_secret,
  redirect_uri: config.binance_redirect_uri,
}

const setHeaders = (accessToken) => ({ headers: { 'Authorization': `Bearer ${accessToken}` } })


export const getBinanceAuthToken = async (code) => {
  return new Promise(async (resolve, reject) => {
    try {
      const base = API_URL + "/oauth/token?";
      const queryParams = {
        ...defaultParams,
        grant_type: "authorization_code",
        code: code
      }
      const data = await axios.post(base + qs.stringify(queryParams));
      console.log(data);
      if (data.status) {
        resolve({ status: true, data: data.data });
      } else {
        resolve({ status: true, data: data.data });
      }
    } catch (err) {
      reject({ status: false, err: err.message });
    }
  });
};

export const getBinanceAccount = async (code) => {
  return new Promise(async (resolve, reject) => {
    try {
      const base = API_URL + "/oauth-api/v1/balance";
      const data = await axios.get(base, setHeaders(code.access_token));
      if (data.status) {
        resolve({ status: true, data: data.data });
      } else {
        resolve({ status: true, data: data.data });
      }
    } catch (err) {
      reject({ status: false, err: err.message });
    }
  });
};