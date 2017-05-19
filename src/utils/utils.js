import {
  Dimensions,
  Platform,
} from 'react-native';
import { district } from '../data';

/**
 * 传入省的code
 * 注意！返回的是对象
 */
const getProvinceByCode = (code) => {
  for (let idx = 0; idx < district.length; idx++) {
    const item = district[idx];
    if (item.value === code) {
      return item;
    }
  }
  return null;
};

/**
 * 传入省的code和市的code
 * 注意！返回的是对象
 */
const getCityByCode = (provinceCode, cityCode) => {
  const obj = getProvinceByCode(provinceCode);
  if (obj && obj.children && obj.children.length > 0) {
    for (let idx = 0; idx < obj.children.length; idx++) {
      const item = obj.children[idx];
      if (item.value === cityCode) {
        return item;
      }
    }
  }
  return null;
};

/**
 * 传入区的code和区的数据源
 * 注意！返回的是对象
 */
const getCountyByCode = (countyCode, countyArr) => {
  if (countyArr && countyArr.length > 0) {
    for (let idx = 0; idx < countyArr.length; idx++) {
      const item = countyArr[idx];
      if (item.value === countyCode) {
        return item;
      }
    }
  }
  return null;
};

/**
 * 传入街道的code和街道的数据源
 * 注意！返回的是对象
 */
const getTownByCode = (townCode, townArr) => {
  if (townArr && townArr.length > 0) {
    for (let idx = 0; idx < townArr.length; idx++) {
      const item = townArr[idx];
      if (item.value === townCode) {
        return item;
      }
    }
  }
  return null;
};

const consoleLog = (...msg) => {
  if (__DEV__) {
    console.log(msg);
  }
};

const formatPhoneNumber = (phoneNumber) => {
  const matchResult = phoneNumber.match(/^(\d{3}) ?(\d{0,4}) ?(\d{0,4})$/);
  return (!matchResult) ? phoneNumber : `${matchResult[1]}${matchResult[2] === '' ? '' : ` ${matchResult[2]}`}${matchResult[3] === '' ? '' : ` ${matchResult[3]}`}`;
};

const toDecimal2 = (x) => {
  let f = parseFloat(x);
  if (isNaN(f)) {
    return x;
  }

  f = Math.round(x * 100) / 100;
  let s = f.toString();
  let rs = s.indexOf('.');
  if (rs < 0) {
    rs = s.length;
    s += '.';
  }
  while (s.length <= rs + 2) {
    s += '0';
  }
  return s;
};

const Util = {
  size: {
    width: Dimensions.get('window').width,
    height: Platform.OS === 'ios' ? Dimensions.get('window').height - 20 : Dimensions.get('window').height,
  },
  consoleLog,
  formatPhoneNumber,
  getProvinceByCode,
  getCityByCode,
  getCountyByCode,
  getTownByCode,
  toDecimal2,
};

export default Util;
