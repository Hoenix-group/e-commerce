import * as securedRestClient from '../utils/securedRestClient';
import * as gloabStorage from '../utils/globalStorage';
import Util from './../utils/utils';

const analyzeErrors = (errors) => {
  if (errors && errors.length > 0) {
    const errorData = errors[0];
    return errorData;
  }
  return {};
};

/**
 * 注册用户获取短信验证码方法
 */
export const fetchVerCode = async (userPn) => {
  try {
    const employeeId = await gloabStorage.getCurrentEmployeeId();
    const ops = {
      body: {
        phoneNumber: userPn,
      },
      isJson: true,
    };
    return await securedRestClient.post(`/users/${employeeId}/getPIN`, ops);
  } catch (err) {
    // 解析获取返回的异常信息
    return analyzeErrors(err.data.errors);
  }
};

/**
 * 忘记密码获取短信验证码方法
 */
export const fetchValidateCode = async (userPn, employeeId) => {
  try {
    const ops = {
      body: {
        number: userPn,
      },
    };
    return await securedRestClient.put(`/users/${employeeId}/validateCode`, ops);
  } catch (err) {
    // 解析获取返回的异常信息
    Util.consoleLog('err::', err);
    return analyzeErrors(err.data.errors);
  }
};

export const register = async (userInfor) => {
  try {
    const ops = {
      body: userInfor,
      isJson: true,
    };
    const { data } = await securedRestClient.post('/users', ops);
    return data;
  } catch (error) {
    // 解析获取返回的异常信息
    Util.consoleLog(error);
    return analyzeErrors(error.data.errors);
  }
};

