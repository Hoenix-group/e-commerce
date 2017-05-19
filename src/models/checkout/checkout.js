import { Actions } from 'react-native-router-flux';
import { Toast } from 'antd-mobile';
import * as oService from '../../services/checkoutService';
import * as dService from '../../services/distributionService';
import Util from '../../utils/utils';

const initializeState = {
  cartData: [],
  pointToUse: '0',
  pointWarning: false,
  pv: [], // 小额现金卡券以外的卡券
  cv: [], // 小额现金卡券
  av: [], // 匿名卡券
  selectedVouchers: [], // 已使用卡券的名称数组
  vouchersAmount: 0,
  tempCash: '0',
  cashChecked: false,
  anonymous: false,
  anonymousCode: '',
  anonymousChecked: false,
};

export default {
  namespace: 'checkout',
  state: initializeState,
  effects: {

    * retrieveCart({ cb }, { call, put }) {
      yield call(oService.checkout);
      const { data } = yield call(oService.retrieveCart);
      if (data) {
        yield put({ type: 'updateCart', checkoutCartData: data });
        // 积分抵扣金额转换成已使用积分
        if (+data.pointDeduction) {
          yield put({ type: 'changePointToUse', pointToUse: `${data.pointDeduction * 100}`, pointWarning: false });
        }
        cb();
      } else {
        Toast.fail('获取购物车失败');
      }
    },
    * placeOrder({ cb }, { call }) {
      const { data, error } = yield call(oService.placeOrder);
      if (data) {
        const { created, code, totalPrice: { value } } = data;
        cb({ created, code, value });
        // cb(data);
      } else {
        let failure = '下单失败';
        const { data: { errors } } = error;
        if (errors && errors.length > 0) {
          for (let i = 0; i < errors.length; i += 1) {
            const { message } = errors[i];
            console.debug(message.toLowerCase());
            if (message && message.toLowerCase().indexOf('stock') >= 0) {
              failure = '商品库存不足';
              break;
            }
          }
        }
        Toast.fail(failure);
      }
    },
    * configureAddress({ address }, { put }) {
      yield put({ type: 'address/setSelectedId', selectedId: address.deliveryAddress ? address.deliveryAddress.code : '' });
      Actions.addressList();
    },
    * updateDeliveryMode({ entryNumber, deliveryMode, cb }, { call, put }) {
      // DMStatus -> delivery mode status
      const DMStatus = yield call(oService.changeDeliveryMode, entryNumber, deliveryMode);
      if (DMStatus) {
        cb();
        if (deliveryMode === 'BYSELF') {
          yield put({ type: 'getSelfPickupAdds', entryNumber });
        }
      } else {
        Toast.fail('设置配送方式失败');
      }
    },
    * getSelfPickupAdds({ entryNumber }, { call, put }) {
      const { fsWarehouseList } = yield call(dService.getSelfPickupAdds, entryNumber);
      if (fsWarehouseList && fsWarehouseList.length) {
        // 将自提点转换成picker需要的格式
        const wareHouses = [];
        for (const w of fsWarehouseList) {
          wareHouses.push({
            value: w.code,
            label: w.name,
          });
        }

        yield put({ type: 'updateSelfPickupAdds', wareHouses });
      } else {
        Toast.fail('未获取到可用自提门店');
      }
    },
    * fetchVouchers(action, { call, put }) {
      const { data } = yield call(oService.fetchVouchers);
      if (data) {
        const pv = [];
        const cv = [];
        const av = [];
        const selectedVouchers = [];

        data.vouchers.map((v) => {
          if (!v.isAnonymous) {
            v.vourcherType === 'smallCashVoucher' ? cv.push(v) : pv.push(v);
          } else {
            av.push(v);
          }

          if (v.selected) { selectedVouchers.push(v.name); }
        });

        for (const item of cv) {
          item.valueToUse = '0';
          item.checked = false;
        }

        yield put({ type: 'setVouchers', pv, cv, av, selectedVouchers, vouchersAmount: data.vouchers.length });
      } else {
        Util.consoleLog('获取卡券信息失败');
      }
    },
    * useOrCancelVouchers({ code, isUse, value, cb }, { call }) {
      const data = yield call(oService.useOrCancelVouchers, code, isUse, value);
      if (data) {
        cb();
      } else {
        const msg = isUse ? '使用卡券失败' : '取消使用卡券失败';
        Toast.info(msg);
      }
    },
    * usePoint({ point, cb }, { call, put }) {
      if (+point) {
        const { data } = yield call(oService.usePoint, point);
        if (data) {
          yield put({ type: 'placeOrder', cb });
        } else {
          Toast.info('积分使用失败');
        }
      } else {
        yield put({ type: 'placeOrder', cb });
      }
    },
  },
  reducers: {
    updateCart(state, { checkoutCartData }) {
      return {
        ...state,
        checkoutCartData,
      };
    },
    updateSelfPickupAdds(state, { wareHouses }) {
      return { ...state, wareHouses };
    },
    initializeState() {
      return initializeState;
    },
    setVouchers(state, { pv, cv, av, selectedVouchers, vouchersAmount }) {
      return { ...state, pv, cv, av, selectedVouchers, vouchersAmount };
    },
    anonymousChange(state, { anonymous }) {
      return { ...state, anonymous };
    },
    anonymousCodeChange(state, { anonymousCode, anonymousChecked }) {
      return { ...state, anonymousCode, anonymousChecked };
    },
    anonymousCheckedChange(state, { anonymousChecked }) {
      return { ...state, anonymousChecked };
    },
    changePointToUse(state, { pointToUse, pointWarning }) {
      return { ...state, pointToUse, pointWarning };
    },
    changeTempCash(state, { tempCash, index }) {
      const { cv } = state;
      cv[index].valueToUse = tempCash;
      return { ...state, cv, tempCash };
    },
    changeCashChecked(state, { cashChecked, index }) {
      const { cv } = state;
      cv[index].checked = cashChecked;
      return { ...state, cv, cashChecked };
    },
  },
};
