import { Actions } from 'react-native-router-flux';
import * as securedRestClient from '../utils/securedRestClient';
import * as storage from '../utils/globalStorage';
import * as validator from './../utils/validator';
import Util from './../utils/utils';

export function login(uid, pwd, remember) {
  return securedRestClient.getToken(uid, pwd, remember);
}

export async function getCustomers() {
  try {
    const url = '/users';
    const { data } = await securedRestClient.get(url, { });
    return data;
  } catch (err) {
    Util.consoleLog(`错误信息${err}`);
  }
  return {};
}

export async function searchCustomer(param) {
  const sParam = Object.keys(param).map((e, i) => `${e}=${param[e]}`).join('&');
  try {
    const url = `/users?${sParam}`;
    Util.consoleLog(url);
    const { data } = await securedRestClient.get(url, {});
    return data;
  } catch (err) {
    Util.consoleLog(`错误信息${err}`);
  }
  return {};
}

export async function getPointDetail(phone) {
  try {
    const url = `/users/anonymous/get/${validator.removeSpace(phone)}`;
    // const url = '/users/anonymous/get/15522333333';
    Util.consoleLog(url);
    const { data } = await securedRestClient.get(url, {});
    return data;
  } catch (err) {
    Util.consoleLog(`错误信息${err}`);
  }
  return {};
}

/**
 * 存储customer信息
 */

export async function saveCurrentCustomerInfo(customerData) {
  // return await storage.setCurrentCustomer(customerData);
}

/**
 * 存储employee信息
 */
export async function saveCurrentEmployeeInfo(employeeData) {
  // return await storage.setCurrentLogin(employeeData);
}


export async function getUserInfoByUserName(userName) {
  try {
    const url = `/users/${userName}?uid=${userName}`;
    const { data } = await securedRestClient.get(url, {});
    return data;
  } catch (err) {
    Util.consoleLog(`错误信息${err}`);
  }
  return {};
}

export async function resetPassword(userId, validateCode, newPassword) {
  try {
    const url = `/users/${userId}/resetPassword`;
    const opt = {
      body: {
        validateCode,
        newPassword,
      },
    };
    const response = await securedRestClient.put(url, opt);
    Util.consoleLog('response', response);
    return response;
  } catch (err) {
    console.debug('Error:', err);
    return err;
  }
}


/**
 *参数:登录用户ID，顾客手机号
 */
export async function validateUserByPhone(phoneNumber) {
  try {
    // 格式化手机号码
    const formatUserPhoneNumber = validator.removeSpace(phoneNumber);
    const employee = await storage.getCurrentEmployeeId();
    const url = `/users/${employee}?uid=${formatUserPhoneNumber}`;
    const { data } = await securedRestClient.get(url, {});
    return data;
  } catch (err) {
    Util.consoleLog(`错误信息:${err}`);
  }
  return false;
}

export async function logout() {
  storage.setToken(null);

  Actions.userLogin();
}

export async function getEmployeeDetails() {
  try {
    const userId = await storage.getCurrentEmployeeLoginId();
    return await securedRestClient.get(`/users/${userId}/employee`);
  } catch (err) {
    return {};
  }
}

export async function changeEmployeePassword(oldPassword, newPassword) {
  try {
    const userId = await storage.getCurrentEmployeeId();
    await securedRestClient.put(`/users/${userId}/password`, {
      body: {
        old: oldPassword,
        new: newPassword,
      },
    });

    return true;
  } catch (err) {
    return false;
  }
}


export async function getCurrentShoppingUser() {
  const data = await storage.getCurrentShoppingUser();
  return data;
}
