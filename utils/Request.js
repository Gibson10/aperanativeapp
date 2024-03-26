// import {REACT_APP_SERVER_URL} from '@env';

const REACT_APP_SERVER_URL = "https://www.prod.api.apera.us";
// const REACT_APP_SERVER_URL ='https://www.prod.api.apera.us'

// export const SERVER_URL = 'prod.api.apera.us'

// https://www.prod.api.apera.us';
// import fetch from 'dva/fetch';
import AsyncStorage from "@react-native-async-storage/async-storage";
var STORAGE_KEY = "userToken";
function parseJSON(response) {
  return response.json();
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */

export default async function request(url, options) {
  // console.log("TOKENNNNNNNN",await AsyncStorage.getItem(STORAGE_KEY))
  console.log(REACT_APP_SERVER_URL);
  const newOptions = { ...options };
  if (newOptions.method === "POST" || newOptions.method === "PUT") {
    console.log(newOptions.body instanceof FormData);
    if (!(newOptions.body instanceof FormData)) {
      newOptions.headers = {
        Accept: "application/json; ",
        "Content-Type": "application/json; charset=utf-8",
        Authorization: "Bearer " + (await AsyncStorage.getItem(STORAGE_KEY)),
        ...newOptions.headers,
      };
      newOptions.body = JSON.stringify(newOptions.body);
    } else {
      newOptions.headers = {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
        Authorization: "Bearer " + (await AsyncStorage.getItem(STORAGE_KEY)),
        ...newOptions.headers,
      };
      newOptions.body = newOptions.body;
    }
  } else {
    var DEMO_TOKEN = await AsyncStorage.getItem(STORAGE_KEY);
    newOptions.headers = {
      Accept: "application/json",
      "Content-Type": "application/json; charset=utf-8",
      Authorization: "Bearer " + DEMO_TOKEN,
      ...newOptions.headers,
    };
  }

  return fetch(REACT_APP_SERVER_URL + url, newOptions)
    .then(checkStatus)
    .then(parseJSON)
    .then((data) => {
      //  //console.log("data",data)
      if (newOptions.method === "DELETE" || data.status === 204) {
        return data;
      }
      return data;
    })
    .catch((err) => {
      //console.log('ERR', err.message);
    });
}

export async function updateProfilePic(url, options) {
  const newOptions = { ...options };
  newOptions.headers = {
    Accept: "application/json",
    "Content-Type": "multipart/form-data",
    Authorization: "Bearer " + (await AsyncStorage.getItem(STORAGE_KEY)),
    ...newOptions.headers,
  };
  newOptions.body = newOptions.body;
  return fetch(REACT_APP_SERVER_URL + url, newOptions)
    .then(checkStatus)
    .then(parseJSON)
    .then((data) => {
      return data;
    })
    .catch((err) => {
      //console.log('ERR', err.message);
    });
}

export async function updateDriversLicense(url, options) {
  const newOptions = { ...options };
  newOptions.headers = {
    Accept: "application/json",
    "Content-Type": "multipart/form-data",
    Authorization: "Bearer " + (await AsyncStorage.getItem(STORAGE_KEY)),
    ...newOptions.headers,
  };
  newOptions.body = newOptions.body;
  return fetch(REACT_APP_SERVER_URL + url, newOptions)
    .then(checkStatus)
    .then(parseJSON)
    .then((data) => {
      return data;
    })
    .catch((err) => {
      //console.log('ERR', err.message);
    });
}
