import axios from 'axios';
import qs from 'querystring';
import { config } from '../../config';
import { callService } from '../callableFunction';

const API_URL = "https://api.alpaca.markets";

//FrontEnd Config
const defaultParams = {
  client_id: config.alpaca_client_id,
  redirect_uri: config.alpaca_redirect_uri,
}

const setHeaders = (accessToken) => ({ headers: { 'Authorization': `Bearer ${accessToken}` } })

export const getAlpacaAccount = async (code) => {
  return new Promise(async (resolve, reject) => {
    try {
      const base = API_URL + "/v2/account";
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


export const getAlpacaAssets = async ()=>{
  try {
    let alpacaAssets = await callService("getAlpacaAssets")
    return alpacaAssets
  }catch(e){
    return e
  }
}
