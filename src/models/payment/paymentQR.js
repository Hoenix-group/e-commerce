import { Toast } from 'antd-mobile';
import { Actions, ActionConst } from 'react-native-router-flux';
import * as paymentService from '../../services/paymentService';

const initializeState = {
  orderCode: '',
  address: '',
  gwTradeNo: '201701231338323010177479271892',
  payChannelTypeNo: '',
};

export default {
  namespace: 'paymentQR',
  state: initializeState,
  effects: {
    * payStatus({ orderCode, payChannelTypeNo, gwTradeNo, showMessage, resultPage }, { call }) {
      const { data } = yield call(paymentService.queryStatus, orderCode, payChannelTypeNo, gwTradeNo);
      if (data === true) {
        if (resultPage) {
          Actions[resultPage]({ type: ActionConst.REPLACE });
        } else {
          Actions.paymentSummary();
        }
      } else if (showMessage === true) {
        Toast.fail('未得到支付结果，请稍后再试', 2);
      }
    },
  },
  reducers: {
    setPaymentData(state, { orderCode, address, gwTradeNo, payChannelTypeNo }) {
      return { ...state, orderCode, address, gwTradeNo, payChannelTypeNo };
    },
    initializeState() {
      return initializeState;
    },
  },
};
