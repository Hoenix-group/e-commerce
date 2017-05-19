import { Actions } from 'react-native-router-flux';
import { Toast } from 'antd-mobile';

import * as userService from './../../services/userService';
import * as fetchPinCodeService from './../../services/valetRegisterService.js';
import Util from './../../utils/utils';

export default {
  namespace: 'forget',
  state: {
    employeeNumber: '',
    employeePhone: '',
    code: '',
    newPassword: '',
    againPassword: '',
    seconds: 60,
  },
  effects: {
    * fetchGetCode({ employeePhone, employeeNumber, cb }, { call }) {
      Util.consoleLog('获取手机验证码:开始');
      const result = yield call(fetchPinCodeService.fetchValidateCode, employeePhone, employeeNumber);
      Util.consoleLog('获取手机验证码:结果');
      Util.consoleLog({ result });
      const fetchPinCodeResult = {};
      if (result.type === undefined) {
        // 成功发送
        fetchPinCodeResult.status = true;
        fetchPinCodeResult.msg = '发送验证码成功';
      } else {
        // 发送失败，请查看异常信息
        fetchPinCodeResult.status = false;
        fetchPinCodeResult.msg = result.message;
        if (result.message.indexOf('Cannot find user with uid') >= 0) {
          fetchPinCodeResult.msg = `工号${employeeNumber}不存在`;
        }
      }
      Toast.info(fetchPinCodeResult.msg);
      if (fetchPinCodeResult.status) {
        cb(fetchPinCodeResult);
      }
    },
    * fetchUpdate({ updateInfo }, { call }) {
      Util.consoleLog('重置密码');
      Util.consoleLog({ updateInfo });
      const { data } = yield call(userService.resetPassword, updateInfo.employeeNumber, updateInfo.pinCode, updateInfo.newPassword);
      if (data && data.errors === undefined) {
        Toast.success('重置密码成功', 1, Actions.userLogin());
      } else {
        Toast.fail(data.errors.map(error => error.message).join('-'), 1);
      }
    },
  },
  reducers: {
    changeNumber(state, { employeeNumber: val }) {
      return { ...state, employeeNumber: val };
    },
    changePhone(state, { employeePhone: val }) {
      return { ...state, employeePhone: val };
    },
    changeCode(state, { code: val }) {
      return { ...state, code: val };
    },
    changeNewPassword(state, { newPassword: val }) {
      return { ...state, newPassword: val };
    },
    changeAgainPassword(state, { againPassword: val }) {
      return { ...state, againPassword: val };
    },
    updateSeconds(state, { seconds }) {
      return { ...state, seconds };
    },
  },
};
