import { Actions } from 'react-native-router-flux';
import moment from 'moment';
import 'moment/locale/zh-cn';
import { Toast } from 'antd-mobile';
import * as vrService from '../../services/valetRegisterService';
import * as commonData from './../../utils/staticDataSupplier';
import * as cartService from '../../services/cartService';
import Util from './../../utils/utils';

export default {
  namespace: 'valetRegister',
  state: {
    processStatus: {
      loading: false,
      disableVerCodeInput: false,
      disableGetVerCode: true,
    },
    register: {
      userName: '',
      userPn: '',
      livArea: '',
      verCode: '',
      agreeToBeMember: false,
      birthDayValue: moment('1990-01-01', 'YYYY-MM-DD').utcOffset(8),
      addressValue: ['320000000000', '320100000000', '320102000000', '320102002000'],
      detailAddress: '',
      chooseMale: false,
      chooseFemale: false,
      houseType: commonData.houseType,
      houseTypeData: '',
      houseTypeValue: '',
      molds: commonData.houseMold,
      moldData: '',
      moldValue: '',
      interests: commonData.interestData,
      interestValue: [],
      interestData: [],
    },
    seconds: 60,
  },

  effects: {
    * fetchCode({ userPn, cb }, { call }) {
      const result = yield call(vrService.fetchVerCode, userPn);
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
      }
      Toast.info(fetchPinCodeResult.msg);
      if (fetchPinCodeResult.status) {
        cb(fetchPinCodeResult);
      }
    },
    * fetchUser({ userInfor, addToCartInfo, backScene }, { call, put }) {
      yield put({ type: 'resetTimerSeconds' });
      const data = yield call(vrService.register, userInfor);
      const { uid } = data;
      if (uid) {
        Toast.success('注册成功', 1);
        // 注册成功后清空注册信息
        yield put({ type: 'clearRegisterInfoInState' });
        if (addToCartInfo.isAddToCart) {
          Util.consoleLog('注册成功后加入购物车');
          const { isPackageProduct } = addToCartInfo.productInfo;
          const { phoneNumber } = addToCartInfo;
          let result = {};
          if (isPackageProduct) {
            const { promotionCode, productIds, status } = addToCartInfo.productInfo;
            result = yield call(cartService.createPackageProductCart, uid, phoneNumber, productIds, promotionCode, status);
          } else {
            const { pid, qty, status, region, excode } = addToCartInfo.productInfo;
            result = yield call(cartService.createCart, uid, phoneNumber, pid, qty, status, region, excode);
          }
          const { statusCode, userId, cartId, cartType } = result;
          if (statusCode === 'success') {
            if (isPackageProduct) {
              // 如何是组合产品，直接跳转到checkout页面
              Actions.checkout();
            } else {
              // 如果是非组合产品，直接跳转到挂单中心页面
              Toast.success('加入购物车成功', 1, () => { Actions.mycart({ userId, cartId, cartType, phoneNumber }); });
            }
          } else if (statusCode === 'noStock') {
            Toast.fail('该商品库存不足', 1);
          } else {
            Toast.fail('加入购物车失败', 1);
          }
        } else {
          Actions.popTo({ scene: backScene || 'home', refresh: { selectedTab: 'home', backUserInfo: userInfor } });
          // Actions.home({ selectedTab: 'home' });
        }
      } else {
        const { message } = data;
        if (message && message !== '') {
          Toast.info(message, 1);
        } else {
          Toast.fail('注册失败', 1);
        }
      }
    },
  },
  reducers: {
    clearRegisterInfoInState(state) {
      const register = {
        userName: '',
        userPn: '',
        livArea: '',
        verCode: '',
        agreeToBeMember: false,
        birthDayValue: moment('1990-01-01', 'YYYY-MM-DD').utcOffset(8),
        addressValue: [],
        chooseMale: false,
        chooseFemale: false,
        houseType: commonData.houseType,
        houseTypeData: '',
        houseTypeValue: '',
        molds: commonData.houseMold,
        moldData: '',
        moldValue: '',
        interests: commonData.interestData,
        interestValue: [],
        interestData: [],
      };
      const processStatus = {
        loading: false,
        disableVerCodeInput: false,
        disableGetVerCode: true,
      };
      return { ...state, register, processStatus, seconds: 60 };
    },

    resetTimerSeconds(state) {
      return { ...state, seconds: 60 };
    },

    changeSwitch(state, { agreeToBeMember: value }) {
      let verCode = '';
      let disableGetVerCode = false;
      let disableVerCodeInput = false;
      if (value === true) {
        disableGetVerCode = false;
        disableVerCodeInput = true;
      } else {
        disableGetVerCode = true;
        disableVerCodeInput = false;
        verCode = '';
      }
      const register = { ...state.register, agreeToBeMember: value, verCode };
      const processStatus = { ...state.processStatus, disableGetVerCode, disableVerCodeInput };
      return { ...state, register, processStatus };
    },
    changeName(state, { userName: name }) {
      const register = { ...state.register, userName: name };
      return { ...state, register };
    },

    changeGenderValue(state, { gender: value, checked }) {
      let chooseMale = false;
      let chooseFemale = false;
      if (checked && value === 0) { // select male
        chooseMale = true;
        if (state.register.chooseFemale) {
          chooseFemale = false;
        }
      }

      if (checked && value === 1) { // select female
        chooseFemale = true;
        if (state.register.chooseMale) {
          chooseMale = false;
        }
      }
      const register = { ...state.register, chooseMale, chooseFemale };

      return { ...state, register };
    },

    changeCode(state, { verCode: code }) {
      const register = { ...state.register, verCode: code };
      return { ...state, register };
    },

    changeBirthDayValue(state, { birthDayValue: val }) {
      const register = { ...state.register, birthDayValue: val };
      return { ...state, register };
    },

    changeAddressValue(state, { addressValue }) {
      const register = { ...state.register, addressValue };
      return { ...state, register };
    },

    changeDetailAddressValue(state, { detailAddress }) {
      const register = { ...state.register, detailAddress };
      return { ...state, register };
    },

    changeMoldValue(state, { moldValue, moldData }) {
      let newMoldVal;
      let newMoldData;
      if (state.register.moldValue === moldValue) { // 反选取消
        newMoldVal = '';
        newMoldData = '';
      } else {
        newMoldVal = moldValue;
        newMoldData = moldData;
      }
      const register = { ...state.register, moldValue: newMoldVal, moldData: newMoldData };
      return { ...state, register };
    },

    changeHouseTypeValue(state, { houseTypeValue, houseTypeData }) {
      let newHouseTypeValue;
      let newHouseTypeData;
      if (state.register.houseTypeValue === houseTypeValue) { // 反选取消
        newHouseTypeValue = '';
        newHouseTypeData = '';
      } else {
        newHouseTypeValue = houseTypeValue;
        newHouseTypeData = houseTypeData;
      }
      const register = { ...state.register, houseTypeValue: newHouseTypeValue, houseTypeData: newHouseTypeData };
      return { ...state, register };
    },

    changeInterestValue(state, { interestValue }) {
      const newInterestData = state.register.interests.filter(item => interestValue.includes(item.value)).map(item => item.label);
      const register = { ...state.register, interestValue, interestData: newInterestData };
      return { ...state, register };
    },

    changeArea(state, { livArea: area }) {
      const register = { ...state.register, livArea: area };
      return { ...state, register };
    },

    changePhoneNumber(state, { userPn: value }) {
      const register = { ...state.register, userPn: value };
      return { ...state, register };
    },
    updateSeconds(state, { seconds }) {
      return { ...state, seconds };
    },
  },
};
