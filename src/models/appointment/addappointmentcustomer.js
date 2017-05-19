import moment from 'moment';
import { Toast } from 'antd-mobile';
import { Actions } from 'react-native-router-flux';
import 'moment/locale/zh-cn';
import * as appointmentService from '../../services/appointmentService';
import * as userService from '../../services/userService';
import Util from './../../utils/utils';

export default {
  namespace: 'addappointmentcustomer',
  state: {
    name: '',
    phonenumber: '',
    appointmentDate: '',
    phonenumberExists: true,
    appointmentResultData: undefined,
    validateCode: '',
    seconds: 60,
  },

  effects: {
    * checkPhoneNumber({ phonenumber }, { put, call }) {
      let result = yield call(userService.validateUserByPhone, phonenumber);
      if (result === false || (Object.keys(result).length === 0 && result.constructor === Object)) {
        Toast.info('该手机号未注册为五星会员', 1);
        result = false;
      }
      yield put({ type: 'updatePhoneNumberExistsTag', result });
    },

    * fetchAppointmentDetail({ code }, { put, call }) {
      const result = yield call(appointmentService.getAppointmentDetail, { code });
      if ((Object.keys(result).length === 0 && result.constructor === Object)) {
        Toast.fail('获取活动信息失败', 1);
      } else {
        yield put({ type: 'updateAppointmentDetailData', appointmentResultData: result });
      }
    },

    * reserveAppointment4Customer({ code, name, phonenumber, pin, appointmentDate }, { put, call }) {
      const validatePinResult = yield call(appointmentService.validatePinForAddCustomer, { phoneNumber: phonenumber, pin });
      Util.consoleLog('validatePinResult: ', validatePinResult);
      if (validatePinResult.errors) {
        Toast.fail('验证码输入错误', 1);
        return;
      }
      Util.consoleLog('reserveAppointment4Customer.code: ', code);
      const parm = { code, customerName: name, phoneNumber: phonenumber, date: appointmentDate };
      const result = yield call(appointmentService.reserveAppointment4Customer, parm);
      Util.consoleLog('reserveResult: ', result);
      if (result.alreadyReserved) {
        Toast.info('客户已经预约过本活动', 1);
      } else if (result.errors && result.errors[0]) {
        if (result.errors[0].message.includes('Quantity FULL')) {
          Toast.fail('抱歉，可预约数已满', 1);
        } else if (result.errors[0].message.includes('does not have a store')) {
          Toast.fail('顾客缺少门店信息，无法预约!', 1);
        }
      } else if (result.errors) {
        Toast.fail('预约失败', 1);
      } else {
        yield put({ type: 'updateAppointmentResultData', result });
        yield call(Actions.addAppointmentCustomerResult);
        Toast.info('预约成功', 1);
      }
    },

    * fetchPinCode({ phoneNumber }, { call }) {
      const fecthPinCodeResult = yield call(appointmentService.getPinForAddCustomer, phoneNumber);
      if (fecthPinCodeResult.errors) {
        return false;
      }
      Toast.info('验证码发送成功', 1);
      return true;
    },

    * checkBackUserInfo({ name, phoneNumber }, { call, put }) {
      let result = yield call(userService.validateUserByPhone, phoneNumber);
      if (result === false || (Object.keys(result).length === 0 && result.constructor === Object)) {
        Toast.info('该手机号未注册为五星会员', 1);
        result = false;
      }
      yield put({ type: 'updateUserInfoForBackParm', phoneNumber, name, result });
    },
  },

  reducers: {
    setDefaultAppointmentDate(state, { appointmentDate }) {
      // const appointmentDate = moment(appointmentdetail.activityStartTime, 'YYYY-MM-DD').utcOffset(8);
      return { ...state, appointmentDate: moment(appointmentDate, 'YYYY-MM-DD').utcOffset(8) };
    },

    updateAppointmentDetailData(state, { appointmentResultData }) {
      const appointmentDate = moment(appointmentResultData.activityStartTime, 'YYYY-MM-DD').utcOffset(8);
      return { ...state, appointmentResultData, appointmentDate };
    },

    setName(state, { name }) {
      return { ...state, name };
    },

    setPhoneNumber(state, { phonenumber }) {
      return { ...state, phonenumber };
    },

    updatePhoneNumberExistsTag(state, { result }) {
      Util.consoleLog('PhoneNumberExistsTag:', result);
      return { ...state, phonenumberExists: !(result === false) };
    },

    updateAppointmentResultData(state, { result }) {
      Util.consoleLog('AppointmentResultData:', result);
      return { ...state, appointmentResultData: result };
    },

    resetAppointmentCustomerState(state) {
      return { ...state, name: '', phonenumber: '', phonenumberExists: true, appointmentResultData: undefined, validateCode: '', seconds: 60, appointmentDate: '' };
    },

    setAppointmentDate(state, { appointmentDate }) {
      return { ...state, appointmentDate };
    },

    setValidateCode(state, { validateCode }) {
      return { ...state, validateCode };
    },

    updateSeconds(state, { seconds }) {
      return { ...state, seconds };
    },

    updateUserInfoForBackParm(state, { phoneNumber, name, result }) {
      return { ...state, phonenumber: phoneNumber, name, phonenumberExists: !(result === false) };
    },
  },
};
