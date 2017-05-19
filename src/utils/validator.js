import { Toast } from 'antd-mobile';

const applyValidationResult = (result, defaultFailCallback, failCallback, successCallback) => {
  if (!result) {
    if (!failCallback) {
      defaultFailCallback();
    } else {
      failCallback();
    }
    return;
  }

  if (successCallback) {
    successCallback();
  }
};

export const removeSpace = (value) => {
  if (!value || !(typeof value === 'string')) {
    return value;
  }

  return value.replace(/\s/ig, '');
};

export const formatPhoneNumber = (value) => {
  const regMobile = /^1[3|4|5|7|8][0-9]\d{8,8}$/;
  const regTel = /^(0\d{2,3})(\d{7,8})?$/;
  const clearValue = removeSpace(value);

  if (clearValue && !(regMobile.test(clearValue) || regTel.test(clearValue))) {
    Toast.info('电话号码格式不正确');
    return value;
  }

  if (clearValue && regMobile.test(clearValue)) {
    // 手机，格式为1xx xxxx xxxx
    return `${clearValue.substr(0, 3)} ${clearValue.substr(3, 4)} ${clearValue.substr(7)}`;
  }

  if (clearValue && regTel.test(clearValue)) {
    // 固话,2位区号格式为0xx xxxx xxxx, 3位区号格式为0xxx xxxx xxxx 或 0xxx xxxx xxx
    return clearValue.substr(1, 1).toString() === '1' || clearValue.substr(1, 1).toString() === '2' ?
      `${clearValue.substr(0, 3)} ${clearValue.substr(3, 4)} ${clearValue.substr(7)}` :
      `${clearValue.substr(0, 4)} ${clearValue.substr(4, 4)} ${clearValue.substr(8)}`;
  }
};

export const validateNotNull = (value, name, failCallback, successCallback) => {
  const result = !!value && ((typeof value === 'string' && !!value.trim()) || typeof value === 'object');
  const defaultFailCallback = () => { Toast.info(`请输入${name}`, 1); };
  applyValidationResult(result, defaultFailCallback, failCallback, successCallback);

  return result;
};

export const validatePhoneFormat = (value, name, failCallback, successCallback) => {
  const regMobile = /^1[3|4|5|7|8][0-9]\d{8,8}$/;
  const regTel = /^(0\d{2,3})(\d{7,8})?$/;
  // const result = regMobile.test(removeSpace(value));
  const result = name.indexOf('手机') >= 0 ? regMobile.test(removeSpace(value)) : regMobile.test(removeSpace(value)) || regTel.test(removeSpace(value));

  const defaultFailCallback = () => { Toast.info(`${name}格式不正确`); };
  applyValidationResult(result, defaultFailCallback, failCallback, successCallback);

  return result;
};

export const validateEmailFormat = (value, name, failCallback, successCallback) => {
  const reg = /^[a-zA-Z0-9]+([._\\-]*[a-zA-Z0-9])*@([a-zA-Z0-9]+[-a-zA-Z0-9]*[a-zA-Z0-9]+\.){1,63}[a-zA-Z0-9]+$/;
  const result = reg.test(removeSpace(value));

  const defaultFailCallback = () => { Toast.info(`${name}格式不正确`); };
  applyValidationResult(result, defaultFailCallback, failCallback, successCallback);

  return result;
};

/**
 * 验证数字
 */
export const validateNumberFormat = (value) => {
  const reg = /^\d+(\.\d+)?$/;
  const result = reg.test(value);

  return result;
};

export const validateNumber = (value, name, failCallback, successCallback) => {
  const reg = /^[1-9]+[0-9]*]*$/;
  const result = reg.test(removeSpace(value));

  const defaultFailCallback = () => { Toast.info(`${name}不是正整数`); };
  applyValidationResult(result, defaultFailCallback, failCallback, successCallback);

  return result;
};
