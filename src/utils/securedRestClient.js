import { Buffer } from 'buffer/';
import { Toast } from 'antd-mobile';
import * as config from './configuration';
import * as storage from './globalStorage';
import * as taskScheduler from './taskScheduler';

const HOST = config.getConfiguration(config.HOST);
const PATH_ACCESS_TOKEN = config.getConfiguration(config.PATH_ACCESS_TOKEN);
const CLIENT_ID = config.getConfiguration(config.CLIENT_ID);
const CLIENT_SECRET = config.getConfiguration(config.CLIENT_SECRET);
const PATH_OCC = config.getConfiguration(config.PATH_OCC);
const GRANT_TYPE_LOGIN = 'password';
const GRANT_TYPE_TRUST = 'client_credentials';
const GRANT_TYPE_TOKEN = 'refresh_token';
const AUTHORIZATION = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
const HEADER_AUTHORIZATION_BASIC = 'Basic';
const HEADER_AUTHORIZATION_BEARER = 'Bearer';

const HTTP_STATUS_FETCH_ERROR = 486;

const HTTP_STATUS_NETWORK_ERROR = 408;

const HTTP_EXCEPTIONS_FOR_APP = [
  { code: 403, type: 'ForbiddenError', message: 'Access is denied' },
];
const HTTP_EXCEPTIONS_FOR_SYSTEM = [
  { code: 200, type: 'Unknown', message: 'Unknown' },
];
const HTTP_EXCEPTIONS_FOR_NETWORK = [
  { code: 408, type: 'Network', message: '网络超时，请重试' },
];

function filterException(array, response, data) {
  for (let id = 0; id < array.length; id += 1) {
    const entry = array[id];
    if ((entry.code !== response.status)) {
      return false;
    }

    if (!data.errors) {
      return false;
    }

    for (let i = 0; i < data.errors.length; i += 1) {
      const err = data.errors[i];
      if ((entry.type === err.type) && (entry.message === err.message)) {
        console.debug('Filter in exception matching: ', entry);
        return true;
      }
    }
  }

  return false;
}

async function checkStatus(response) {
  let data = response;

  if (response.status !== HTTP_STATUS_FETCH_ERROR && response.status !== HTTP_STATUS_NETWORK_ERROR) {
    if (response.headers.get('content-length') === '0') {
      data = {};
    } else {
      data = await response.json();
    }
  }

  if (response.ok) {
    return data;
  }

  console.debug(`Status: ${response.status} statusText: ${response.statusText}`);
  console.debug('Exception data:', data);

  const isAPPException = filterException(HTTP_EXCEPTIONS_FOR_APP, response, data);
  const isSystemException = filterException(HTTP_EXCEPTIONS_FOR_SYSTEM, response, data);
  if (!isAPPException || isSystemException) {
    Toast.fail('系统异常', 2);
  }

  const isNetworkException = filterException(HTTP_EXCEPTIONS_FOR_NETWORK, response, data);
  if (isNetworkException) {
    Toast.fail('网络连接超时，请检查网络', 2);
  }

  const error = new Error(response.statusText);
  error.status = response.status;
  error.data = data;
  throw error;
}

function toQueryString(obj) {
  return obj ? Object.keys(obj).sort().map((key) => {
    const val = obj[key];
    if (Array.isArray(val)) {
      return val.sort().map(val2 => `${encodeURIComponent(key)}=${encodeURIComponent(val2)}`).join('&');
    }

    return `${encodeURIComponent(key)}=${encodeURIComponent(val)}`;
  }).join('&') : '';
}

function mergeURL(url, params) {
  if (url[0] !== '/') {
    return url;
  }

  let newURL = `${HOST}${PATH_OCC}${url}`;
  if (PATH_ACCESS_TOKEN === url) {
    newURL = `${HOST}${url}`;
  }

  const paramStr = toQueryString(params);
  if (paramStr && paramStr.length > 0) {
    newURL += `?${paramStr}`;
  }

  return newURL;
}

function saveLogin(uid, pwd) {
  storage.setCurrentLogin({
    loginId: uid,
    password: pwd,
  });
}

function saveToken(response, timestamp) {
  const { data } = response;
  if (data.access_token) {
    storage.setToken({
      issue_on: timestamp,
      token: data,
    });

    return true;
  }

  return false;
}

async function refreshToken(token) {
  let response = null;
  const timestamp = Date.now();
  try {
    response = await post(PATH_ACCESS_TOKEN, {
      body: {
        refresh_token: token,
        grant_type: GRANT_TYPE_TOKEN,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
      },
      isAuthorized: false,
    });
  } catch (err) {
    return false;
  }

  if (saveToken(response, timestamp)) {
    return response.data;
  }

  return undefined;
}

async function loadToken() {
  const loginData = await storage.getCurrentLogin();
  if (!loginData) {
    await getToken();
  }

  let tokenData = await storage.getToken();
  if (!tokenData) {
    await getToken();
    tokenData = await storage.getToken();
  }

  const token = tokenData.token;
  if ((Date.now() >= (((token.expires_in - 60) * 1000) + tokenData.issue_on))) {
    return await refreshToken(token.refresh_token);
  }

  return token;
}

async function mergeOptions(options) {
  let headers = options.headers;
  if ((options.isAuthorized === false) || (options.isOCC === false)) {
    console.debug('Unauthorized/Non-OCC request, do not merge existing token.');
  } else {
    const token = await loadToken();
    headers = { ...headers, Authorization: `${HEADER_AUTHORIZATION_BEARER} ${token.access_token}` };
  }

  return {
    ...options,
    headers: {
      ...headers,
      Accept: 'text/plain, application/json, application/*+json, */*',
    },
  };
}

function timeout(ms, promise) {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      const error = new Error();
      error.network = true;
      error.type = 'Network';
      error.message = '网络超时，请重试';
      reject(error);
    }, ms);
    promise.then(
      (res) => {
        clearTimeout(timeoutId);
        resolve(res);
      },
      (err) => {
        clearTimeout(timeoutId);
        reject(err);
      },
    );
  });
}

export async function request(url, options) {
  taskScheduler.scheduleLogout();

  const mergedOptions = await mergeOptions(options);
  const mergedURL = mergeURL(url, options.params);

  console.debug('Request url: ', mergedURL);
  console.debug('Request options: ', mergedOptions);

  let response = {};
  try {
    response = await timeout(10 * 1000, fetch(mergedURL, mergedOptions));
    console.debug('Fetch response: ', response);
  } catch (err) {
    if (err.network) {
      response = {
        ok: false,
        status: HTTP_STATUS_NETWORK_ERROR,
        statusText: '网络超时，请重试',
        errors: [err],
      };
    } else {
      response = {
        ok: false,
        status: HTTP_STATUS_FETCH_ERROR,
        statusText: `Fetch error: ${err}`,
      };
    }
  }

  const data = await checkStatus(response);

  const ret = {
    data,
    headers: {},
  };

  if (response.headers.get('x-total-count')) {
    ret.headers['x-total-count'] = response.headers.get('x-total-count');
  }

  console.debug('Response: ', ret);
  return ret;
}

/**
 * 用户访问外部的web APi 接口
 * 百度地图
 */
export async function requestExternal(url, options) {
  console.debug('Request url: ', url);
  let response = {};
  try {
    response = await timeout(10 * 1000, fetch(url, options));
    console.debug('Fetch response: ', response);
  } catch (err) {
    if (err.network) {
      response = {
        ok: false,
        status: HTTP_STATUS_NETWORK_ERROR,
        statusText: '网络超时，请重试',
        errors: [err],
      };
    } else {
      response = {
        ok: false,
        status: HTTP_STATUS_FETCH_ERROR,
        statusText: `Fetch error: ${err}`,
      };
    }
  }
  const data = await checkStatus(response);
  const ret = {
    data,
    headers: {},
  };
  console.debug('Response: ', ret);
  return ret;
}


function assembleBody(options) {
  if (!options.body) {
    return undefined;
  }
  return (options.isJson === true) ? JSON.stringify(options.body) : toQueryString(options.body);
}

function assembleOptions(options, restMethod) {
  let newOptions = options;
  if (!options) {
    newOptions = {};
  }

  return {
    ...newOptions,
    headers: { ...newOptions.headers, 'Content-Type': ((newOptions.isJson === true) ? 'application/json' : 'application/x-www-form-urlencoded') },
    body: assembleBody(newOptions),
    method: restMethod,
  };
}

export function getExternal(url, options) {
  return requestExternal(url, assembleOptions(options, 'GET'));
}

export function post(url, options) {
  return request(url, assembleOptions(options, 'POST'));
}

export function get(url, options) {
  return request(url, assembleOptions(options, 'GET'));
}

export function put(url, options) {
  return request(url, assembleOptions(options, 'PUT'));
}

export function patch(url, options) {
  return request(url, assembleOptions(options, 'PATCH'));
}

export function remove(url, options) {
  return request(url, assembleOptions(options, 'DELETE'));
}

export function head(url, options) {
  return request(url, assembleOptions(options, 'HEAD'));
}

export async function getToken(uid, pwd, remember) {
  let response = null;

  let bodyContent = {
    password: pwd,
    username: uid,
    grant_type: GRANT_TYPE_LOGIN,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
  };

  if (!uid && !pwd) {
    bodyContent = {
      grant_type: GRANT_TYPE_TRUST,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
    };
  }

  const timestamp = Date.now();
  try {
    response = await post(PATH_ACCESS_TOKEN, {
      headers: { Authorization: `${HEADER_AUTHORIZATION_BASIC} ${AUTHORIZATION}` },
      body: bodyContent,
      isAuthorized: false,
    });
  } catch (err) {
    return false;
  }

  if (uid && pwd) {
    saveLogin(uid, remember ? pwd : '');
  }

  return saveToken(response, timestamp);
}
