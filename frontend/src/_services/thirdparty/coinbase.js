import axios from 'axios';
import { callService } from '../callableFunction';
import { config } from '../../config';
import { result } from 'lodash';

const API_URL = "https://api.coinbase.com";

//FrontEnd Config
const defaultParams = {
  client_id: config.coinbase_client_id,
  redirect_uri: config.coinbase_redirect_uri,
}

const setHeaders = (accessToken) => ({ headers: { 'Authorization': `Bearer ${accessToken}` } })

export const getCoinbaseAmount = async (code) => {
  return new Promise(async (resolve, reject) => {
    try {
      const base = API_URL + "/v2/accounts";
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

export const getCoinbaaseUser = async (code) => {
  return new Promise(async (resolve, reject) => {
    try {
      const base = API_URL + "/v2/user";
      const queryParams = {
        ...defaultParams,
        grant_type: "authorization_code",
        code: code
      }
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

const callRefershTooken = async (reqPayload) => {
  try {
    const resultCoinbase = await callService("refreshApiToken", reqPayload);
    return resultCoinbase;
  } catch (err) {
    return { status: false, message: err.message }
  }
}

const callFirebaseFunction = async (reqPayload) => {
  try {
    const resultCoinbase = await callService("apiRouter", reqPayload);
    return resultCoinbase;
  } catch (err) {
    return { status: false, message: err.message }
  }
}

export const callCoinbaseService = async (reqPayload) => {
  try {
    let resultCoinbase = await callFirebaseFunction(reqPayload);
    debugger
    if (!resultCoinbase.data.status && resultCoinbase.data.errors == "expired_token") {
      const refershData = await callRefershTooken(reqPayload);
      if (!refershData.data.status) throw refershData.data
      reqPayload["code"] = refershData.data.code;
      resultCoinbase = await callFirebaseFunction(reqPayload);
    }
    return resultCoinbase;
  } catch (err) {
    throw new Error( { status: false, message: err.message })
  }
}


export const getAllCoinbaseAssets = async ()=>{
  try {
    let coinbaseAssets = await callService("getCoinbaseAssets")
    return coinbaseAssets
  }catch(e){
    return e
  }
}


export const getCoinbaseAssetCurrentPrice = async (payload)=>{
  try {
    let priceData = await callService("getCoinbaseAssetCurrentPrice", payload)
    return priceData
  }catch(e){
    return e
  }
}