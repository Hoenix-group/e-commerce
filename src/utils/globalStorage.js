import { AsyncStorage } from 'react-native';
import Storage from 'react-native-storage';
import Util from './utils';

const LOGIN_DATA = { key: 'LoginData', interval: undefined };
const TOKEN_DATA = { key: 'TokenData', interval: undefined };
const PREFERENCE_DATA = { key: 'PreferenceData', interval: undefined };
const CART_DATA = { key: 'CartData', interval: undefined };
const SEARCHHISTORY_DATA = 'SearchHistory';
const REGION_DATA = { key: 'RegionData', interval: undefined };
const SHPPING_USER_DATA = { key: 'ShoppingUserData', interval: 1000 * 300 };
let userId = '';

const storage = new Storage({
    // 最大容量，默认值2000条数据循环存储
  size: 2000,
  storageBackend: AsyncStorage,
    // 数据过期时间，默认一整天（1000 * 3600 * 24 毫秒），设为null则永不过期
  defaultExpires: null,
    // 读写时在内存中缓存数据。默认启用。
  enableCache: true,
    // 如果storage中没有相应数据，或数据已过期，
    // 则会调用相应的sync方法，无缝返回最新数据。
    // sync方法的具体说明会在后文提到
    // 你可以在构造函数这里就写好sync的方法
    // 或是写到另一个文件里，这里require引入
    // 或是在任何时候，直接对storage.sync进行赋值修改
    //sync: require('./sync')
});

export const put = (keyObj, valueObj, expiresObj) => {
  console.debug(`Put to storage, expires: ${expiresObj}, key: ${keyObj}, value: `, valueObj);

  if (expiresObj !== undefined) {
    storage.save({
      key: keyObj,
      rawData: valueObj,
      expires: expiresObj,
    });
  } else {
    storage.save({
      key: keyObj,
      rawData: valueObj,
    });
  }

  console.debug('Cache storage: ', storage);
};

export const get = async (keyObj) => {
  console.debug(`Get from storage, key: ${keyObj}`);
  try {
    const data = await storage.load({
      key: keyObj,
      autoSync: true,
      syncInBackground: true,
    });

    console.debug('Got from storage, value: ', data);
    return data;
  } catch (err) {
    console.debug('Getting from storage meets error: ', err);
    return null;
  }
};

export const clear = async (keyObj) => {
  console.debug(`Clear from storage, key: ${keyObj}`);
  try {
    await storage.remove({
      key: keyObj,
    });

    console.debug('Cleared from storage.');
  } catch (err) {
    console.debug('Clearing from storage meets error: ', err);
  }
};

export const setCurrentShoppingUser = (userInfo) => {
  put(SHPPING_USER_DATA.key, userInfo, LOGIN_DATA.interval);
};

export const getCurrentShoppingUser = async () => await get(SHPPING_USER_DATA.key);

export const setCurrentLogin = (values) => {
  put(LOGIN_DATA.key, values, LOGIN_DATA.interval);
};

export const getCurrentLogin = async () => await get(LOGIN_DATA.key);

export const getCurrentEmployeeLoginId = async () => {
  const login = await getCurrentLogin();
  if (login) {
    return login.loginId;
  }

  return null;
};

export const getCurrentEmployeeId = async () => {
  const login = await getCurrentLogin();
  if (login) {
    return login.employeeId;
  }

  return null;
};

export const getCurrentEmployeePwd = async () => {
  const login = await getCurrentLogin();
  if (login) {
    return login.password;
  }

  return null;
};

export const setToken = (values) => {
  put(TOKEN_DATA.key, values, TOKEN_DATA.interval);
};

export const getToken = async () => await get(TOKEN_DATA.key);

export const setCurrentRegion = (values) => {
  put(REGION_DATA.key, values, REGION_DATA.interval);
};

export const getCurrentRegion = async () => await get(REGION_DATA.key);

export const getCurrentRegionId = async () => {
  const region = await getCurrentRegion();
  if (region && region.current) {
    return region.current.value;
  }

  return '';
};

export const getDefaultRegionId = async () => {
  const region = await getCurrentRegion();
  if (region && region.default) {
    return region.default.value;
  }

  return '';
};

export const isCurrentRegionSameAsDefalutRegion = async () => {
  const region = await getCurrentRegion();
  if (region && region.default && region.current) {
    return region.default.value === region.current.value;
  }

  return false;
};

export const setCurrentCart = (values) => {
  put(CART_DATA.key, values, CART_DATA.interval);
};

export const getCurrentCart = async () => await get(CART_DATA.key);

export const getCurrentCartId = async () => {
  const cart = await getCurrentCart();
  if (cart) {
    return cart.cartId;
  }

  return null;
};

export const setSearchHistory = (key, values) => {
  put(key, values);
};

export const getSearchHistory = async (key) => {
  const data = await get(key);
  Util.consoleLog(data);
  return data;
};

export const getSearchHistoryList = async (key) => {
  const searchhistory = await getSearchHistory(key);
  if (searchhistory || searchhistory === 0 || searchhistory === '0') {
    return searchhistory;
  }

  return '';
};

export const getCurrentUserPhone = async () => {
  const cart = await getCurrentCart();
  if (cart) {
    return cart.phoneNumber;
  }

  return null;
};

export const getCurrentCustomerId = async () => {
  const cart = await getCurrentCart();
  if (cart) {
    return cart.customerId;
  }

  return null;
};

export const getCurrentChannel = async () => {
  const cart = await getCurrentCart();
  if (cart) {
    return cart.channel;
  }

  return null;
};

export const getCurrentCartType = async () => {
  const cart = await getCurrentCart();
  if (cart) {
    return cart.cartType;
  }

  return null;
};

export const getPreference = async () => await get(PREFERENCE_DATA.key);

export const setPreference = (values) => {
  put(PREFERENCE_DATA.key, values, PREFERENCE_DATA.interval);
};
