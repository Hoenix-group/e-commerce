import { Toast } from 'antd-mobile';
import { Actions } from 'react-native-router-flux';
import moment from 'moment';
// import * as paymentService from '../../services/paymentService';
import * as prestoreService from '../../services/prestoreService';
import * as userService from '../../services/userService';
import Util from './../../utils/utils';
import { DEFAULT_PAGESIZE } from '../../utils/configuration';

export default {
  namespace: 'prestore',
  state: {
    totalFee: '0.01',
    orderCode: '00000001',
    timestamp: Date.now(),
    paymentChannel: 'ALIPAY-O2O',
    paymentChannelLabel: '支付宝支付',
    modes: [
      { value: 'ALIPAY-O2O', label: '支付宝支付', imgUrl: require('./../../../images/payment/pay_alipay.png') },
      { value: 'WEIXIN', label: '微信支付', imgUrl: require('./../../../images/payment/pay_weixin.png') },
      { value: 'OTHER', label: '现金支付', imgUrl: require('./../../../images/payment/pay_other.png') },
    ],
    prestoreList: [],
    prestoreDetail: {
      fsPreStorePromotionCode: '',
      preStorePromotionCode: '',
      name: '',
      startTime: '',
      endTime: '',
      prestoreContent: '',
      channel: [],
      storeDetail: [],
      prestorePlan: '',
      undefinedTag: true,
      prestoreable: false,
      preStoreValue: 0,
      preStoreVoucherValue: 0,
      preStoreVoucherName: '',
    },
    customerList: [],
    phoneNumber: '',
    phonenumberExists: true,
    validateCode: '',
    seconds: 60,
    userId: '',
    customerName: '',
    prestoreListPageState: {
      endFlag: false,
      currentPage: 0,
      refreshing: false,
    },
    customerListPageState: {
      endFlag: false,
      currentPage: 0,
      refreshing: false,
    },
  },
  effects: {
    * quickplaceorder({ paymentChannel: channel, timestamp: time, pin, phoneNumber, userId, prestoreId }, { call, put }) {
      // TODO:quick place order
      // if (channel === 'OTHER') {
      //   Toast.fail('该支付方式不可用，请尝试其它选项', 2);
      //   return;
      // }

      // validate pin code
      const validateCodeResult = yield call(prestoreService.validatePinForPrestore, { pin, phoneNumber });
      if (validateCodeResult.errors) {
        Toast.fail('验证码输入错误', 2);
        return;
      }

      // place order
      const prestoreResult = yield call(prestoreService.prestore4user, { userId, code: prestoreId });
      if (!prestoreResult || prestoreResult.errors) {
        Toast.fail(prestoreResult.errors[0] && prestoreResult.errors[0].message ? prestoreResult.errors[0].message : '出错了，预存失败', 2);
        return;
      }

      // save mocked offLine cart
      yield call(prestoreService.saveMockedOffLineCart, userId);

      // TODO: update what?
      // yield put({ type: 'updatePrestoreResult', paymentChannel: channel });

      Util.consoleLog('prestoreResult: ', prestoreResult);
      const orderCode = prestoreResult.code;

      // TODO: get totalPrice or totalPriceWithTax ?
      if (prestoreResult.totalPrice === undefined || prestoreResult.totalPrice.value < 0) {
        Toast.fail('获取预存券价格失败！', 2);
        return;
      }
      const totalFee = prestoreResult.totalPrice.value;
      // const totalFee = 0.01;

      // payment
      if (channel === 'OTHER') {
        const changePaymentStateResult = yield call(prestoreService.changeOrderPaymentStateToPaied, { userId, orderCode });
        Util.consoleLog(changePaymentStateResult);
        if (changePaymentStateResult.status === 'PAID') {
          Actions.addCustomerToPrestoreResultView();
        } else {
          Toast.fail('更新订单状态失败！', 1);
        }
      } else {
        const paymentResult = yield put({ type: 'cashDesk/pay', orderCode, totalFee, paymentChannel: channel, timestamp: Date.now(), resultPage: 'addCustomerToPrestoreResultView' });
        Util.consoleLog('paymentResult: ', paymentResult);
      }
    },

    * fetchPrestoresList({ currentPage, refreshTag }, { call, put }) {
      if (refreshTag) {
        yield put({ type: 'setRefreshingForPrestoreListView' });
      }
      const prestoreList = yield call(prestoreService.getPrestoreList, { currentPage, pageSize: DEFAULT_PAGESIZE });
      // Util.consoleLog('prestoreList: ', prestoreList);
      if ((!prestoreList || prestoreList.errors || (Object.keys(prestoreList).length === 0 && prestoreList.constructor === Object))) {
        Toast.fail('获取活动列表失败', 1);
        yield put({ type: 'cancelRefreshingForPrestoreListView' });
      } else {
        const tempListData = prestoreList.prestoreRules.map(data => ({ ...data, ...data.fsPreStorePromotion, prestoreRuleCode: data.preStorePromotionCode, fsPreStorePromotion: undefined }));
        Util.consoleLog('tempListData: ', tempListData);
        yield put({ type: 'updateprestorelist', prestoreList: tempListData, currentPage, refreshTag });
      }
    },

    * fetchPrestoreDetail({ code }, { call, put }) {
      const result = yield call(prestoreService.getPrestoreDetail, code);
      Util.consoleLog('fetchPrestoreDetail result: ', result);
      if (result.errors) {
        Toast.fail('获取活动详情失败', 1);
      } else {
        yield put({ type: 'updateprestoreDetail', prestoreDetail: result });
      }
    },

    * checkPhoneNumber({ phonenumber }, { put, call }) {
      const result = yield call(userService.validateUserByPhone, phonenumber);
      if (result.dshCustomerUid) {
        yield put({ type: 'updateUserInfo', userId: result.dshCustomerUid, customerName: result.name });
      } else {
        Toast.info('该手机号未注册为五星会员', 1);
        yield put({ type: 'updatePhoneNumberExists', phonenumberExists: false });
      }
    },

    * fetchPinCode({ phoneNumber }, { call }) {
      const fecthPinCodeResult = yield call(prestoreService.getPinForPrestore, phoneNumber);
      if (fecthPinCodeResult.errors) {
        Toast.fail('验证码发送失败', 1);
        return false;
      }
      Toast.info('验证码发送成功', 1);
      return true;
    },

    * fetchCustomerList({ ruleCode, currentPage, refreshTag }, { call, put }) {
      if (refreshTag) {
        yield put({ type: 'setRefreshingForCustomerList' });
      }
      const fetchCustomerListResult = yield call(prestoreService.fetchCustomerList, { code: ruleCode, currentPage, pageSize: DEFAULT_PAGESIZE });
      Util.consoleLog('fetchCustomerListResult: ', fetchCustomerListResult);
      if (fetchCustomerListResult.errors) {
        Toast.fail('获取预存用户列表失败');
        yield put({ type: 'cancelRefreshingForCustomerList' });
      } else {
        yield put({ type: 'updateCustomerList', customerList: fetchCustomerListResult.prestoreRules, refreshTag, currentPage });
      }
    },

    * checkBackUserInfo({ phoneNumber, name }, { call, put }) {
      const result = yield call(userService.validateUserByPhone, phoneNumber);
      if (result.dshCustomerUid) {
        result.phonenumberExists = true;
      } else {
        Toast.info('该手机号未注册为五星会员', 1);
        result.phonenumberExists = false;
      }
      yield put({ type: 'updateUserInfoForBack', userId: result.dshCustomerUid, customerName: result.name, phonenumberExists: result.phonenumberExists });
    },
  },
  reducers: {

    /* ============ prestore list ============ */
    updateprestorelist(state, { prestoreList, currentPage, refreshTag }) {
      const tempList = refreshTag ? [] : state.prestoreList;
      prestoreList.forEach(data => tempList.push(data));
      const prestoreListPageState = {
        currentPage: refreshTag ? 1 : currentPage + 1,
        endFlag: prestoreList.length < DEFAULT_PAGESIZE,
        refreshing: false,
      };
      return { ...state, prestoreList: tempList, prestoreListPageState };
    },
    resetPrestoreList(state) {
      return { ...state, prestoreList: [], prestoreListPageState: { currentPage: 0, endFlag: false, refreshing: false } };
    },
    setRefreshingForPrestoreListView(state) {
      return { ...state, prestoreListPageState: { ...state.prestoreListPageState, refreshing: true } };
    },
    cancelRefreshingForPrestoreListView(state) {
      return { ...state, prestoreListPageState: { ...state.prestoreListPageState, refreshing: false } };
    },

    /* ============ prestore detail ============ */
    updateprestoreDetail(state, { prestoreDetail }) {
      // get storeStr
      // let storeStr = '';
      const storesArray = prestoreDetail.fsPreStorePromotion.scopes ? prestoreDetail.fsPreStorePromotion.scopes.map((data) => {
        const countryStr = data.isWholeCountry ? '全国 ' : '';
        let provinceStr = data.provinceNames.filter(province => (province && province !== '')).join(' ');
        provinceStr = provinceStr === '' ? '' : `${provinceStr} `;
        let cityStr = data.cityNames.filter(city => (city && city !== '')).join(' ');
        cityStr = cityStr === '' ? '' : `${cityStr} `;
        const pointOfServiceStr = data.pointOfServiceNames.filter(pointOfService => (pointOfService && pointOfService !== '')).join(' ');
        // pointOfServiceStr = pointOfServiceStr === '' ? '' : `${pointOfServiceStr} `;
        return `${countryStr}${provinceStr}${cityStr}${pointOfServiceStr}`;
        // storeStr = `${storeStr}${provinceStr}${cityStr}${pointOfServiceStr}`;
      }) : [];
      /* const storesMap = new Map();
      prestoreDetail.fsPreStorePromotion.scopes.forEach((data) => {
        const cityCode = data.cityCodes[0];
        if (!cityCode) {
          return;
        }
        const stores = storesMap.get(cityCode);
        const pointOfService = data.pointOfServiceNames[0] ? data.pointOfServiceNames[0] : '';
        const province = data.provinceNames[0] ? data.provinceNames[0] : '';
        const city = data.cityNames[0] ? data.cityNames[0] : '';
        storesMap.set(cityCode, stores ? `${stores} ${pointOfService}` : `${province} ${city} ${pointOfService}`);
      });
      storesMap.forEach((value) => { storeStr += value; });
      Util.consoleLog('storeStr: ', storeStr); */
      // get other string
      const channelsArray = prestoreDetail.fsPreStorePromotion.scopes ? prestoreDetail.fsPreStorePromotion.scopes.map(data => (data.channelName)) : [];
      const prestorePlan = prestoreDetail.preStoreValue && `预存${prestoreDetail.preStoreValue}元 返${prestoreDetail.preStoreVoucherName} ${prestoreDetail.preStoreVoucherValue}元`;
      // get prestoreDetail display object
      return { ...state,
        prestoreDetail: {
          fsPreStorePromotionCode: prestoreDetail.fsPreStorePromotion.code,
          preStorePromotionCode: prestoreDetail.preStorePromotionCode,
          name: prestoreDetail.fsPreStorePromotion.name,
          startTime: moment(Number(prestoreDetail.fsPreStorePromotion.startTime)).utcOffset(8).format('L'),
          endTime: moment(Number(prestoreDetail.fsPreStorePromotion.endTime)).utcOffset(8).format('L'),
          prestoreContent: prestoreDetail.fsPreStorePromotion.description,
          channel: channelsArray,
          storeDetail: storesArray,
          prestorePlan,
          undefinedTag: false,
          prestoreable: prestoreDetail.prestoreable,
        },
      };
    },
    resetPrestoreDetail(state) {
      return { ...state,
        prestoreDetail: {
          fsPreStorePromotionCode: '',
          preStorePromotionCode: '',
          name: '',
          startTime: '',
          endTime: '',
          prestoreContent: '',
          channel: [],
          storeDetail: [],
          prestorePlan: '',
          undefinedTag: true,
          prestoreable: false,
        },
      };
    },

    /* ============ add customer to prestore ============ */
    changePaymentChannel(state, { payload: channel }) {
      return { ...state, paymentChannel: channel };
    },
    setPaymentData(state, { orderCode, totalFee, created }) {
      return { ...state, orderCode, totalFee, created };
    },
    setModes(state, { modes }) {
      return { ...state, modes };
    },
    updatePhoneNumber(state, { phoneNumber }) {
      return { ...state, phoneNumber };
    },
    updateSeconds(state, { seconds }) {
      return { ...state, seconds };
    },
    updateValidateCode(state, { validateCode }) {
      return { ...state, validateCode };
    },
    updateUserInfo(state, { userId, customerName }) {
      return { ...state, userId, phonenumberExists: true, customerName };
    },
    updatePhoneNumberExists(state, { phonenumberExists }) {
      return { ...state, phonenumberExists };
    },
    updatePrestoreResult(state, { paymentChannel }) {
      return { ...state, timestamp: Date.now(), paymentChannel };
    },
    updatePaymentChannel(state, { paymentChannel, paymentChannelLabel }) {
      return { ...state, paymentChannel, paymentChannelLabel };
    },
    resetAddViewStateData(state) {
      return { ...state, phoneNumber: '', phonenumberExists: true, validateCode: '', seconds: 60, userId: '', paymentChannel: 'ALIPAY-O2O', paymentChannelLabel: '支付宝支付' };
    },
    updateUserInfoForBack(state, { userId, customerName, phonenumberExists }) {
      return { ...state, userId: userId || '', customerName: customerName || '', phonenumberExists };
    },

    /* ============ prestored customer list ============ */
    updateCustomerList(state, { customerList, refreshTag, currentPage }) {
      const tempList = refreshTag ? [] : state.customerList;
      customerList.forEach(data => tempList.push(data));
      const customerListPageState = {
        endFlag: customerList.length < DEFAULT_PAGESIZE,
        currentPage: refreshTag ? 1 : currentPage + 1,
        refreshing: false,
      };
      return { ...state, customerList, customerListPageState };
    },
    resetCustomerList(state) {
      return { ...state, customerList: [], customerListPageState: { endFlag: false, currentPage: 0, refreshing: false } };
    },
    setRefreshingForCustomerList(state) {
      return { ...state, customerListPageState: { ...state.customerListPageState, refreshing: true } };
    },
    cancelRefreshingForCustomerList(state) {
      return { ...state, customerListPageState: { ...state.customerListPageState, refreshing: false } };
    },
  },
};
