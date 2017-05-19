import { Toast } from 'antd-mobile';
import { Actions } from 'react-native-router-flux';
import * as paymentService from '../../services/paymentService';

const initializeState = {
  totalFee: '0.01',
  orderCode: '00000001',
  timestamp: Date.now(),
  paymentChannel: 'ALIPAY-O2O',
  modes: [
      { value: 'ALIPAY-O2O', label: '支付宝支付', imgUrl: require('./../../../images/payment/pay_alipay.png') },
      { value: 'WEIXIN', label: '微信支付', imgUrl: require('./../../../images/payment/pay_weixin.png') },
      { value: 'OTHER', label: '其他支付', imgUrl: require('./../../../images/payment/pay_other.png') },
  ],
};

export default {
  namespace: 'cashDesk',
  state: initializeState,
  effects: {
    * pay({ orderCode: code, totalFee: fee, paymentChannel: channel, timestamp: time, reresh, resultPage }, { call, put }) {
      if (channel === 'OTHER') {
        Toast.fail('该支付方式不可用，请尝试其它选项', 2);
        return;
      }

      let showFailure = true;
      const { data } = yield call(paymentService.pay, code, channel);
      if (data && data.result === 'SUCCESS') {
        const innerData = JSON.parse(data.returnData);
        if (innerData && innerData.data) {
          yield put({ type: 'paymentQR/setPaymentData',
            orderCode: code,
            address: innerData.data,
            gwTradeNo: innerData.gwTradeNo,
            payChannelTypeNo: channel });

          if (!reresh) {
            Actions.paymentQR({ resultPage });
          }

          showFailure = false;
        }
      }

      if (showFailure && !reresh) {
        Toast.fail('获取二维码失败', 2);
      }
    },
    * getPromotions({ modes, totalFee }, { call, put }) {
      const { data } = yield call(paymentService.getPaymentPromotions);
      if (data && data[0]) {
        const newModes = [];
        for (let id = 0; id < modes.length; id += 1) {
          const entry = modes[id];
          const promotion = data.find((obj) => {
            if (entry.value === obj.value) {
              return obj;
            }
            return null;
          });

          if (promotion) {
            entry.promotionLabel = promotion.label;
            entry.promotionPrice = totalFee * promotion.discount;
          }
          newModes.push(entry);
        }
        yield put({ type: 'setModes', modes: newModes });
      } else {
        Toast.fail('获取支付方式促销失败', 2);
      }
    },
  },
  reducers: {
    changePaymentChannel(state, { payload: channel }) {
      return { ...state, paymentChannel: channel };
    },
    setPaymentData(state, { orderCode, totalFee, created }) {
      return { ...state, orderCode, totalFee, timestamp: created };
    },
    setModes(state, { modes }) {
      return { ...state, modes };
    },
    initializeState() {
      return initializeState;
    },
  },
};
