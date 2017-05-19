import { Toast, Modal } from 'antd-mobile';
import { Actions } from 'react-native-router-flux';
import * as userService from '../../services/userService';

export default {
  namespace: 'ConsumptionPoint',
  state: {
    visibleInputPhoneModal: false,
    phoneToQueryPoint: '',
    loading: false,
    isToastVisible: true,
  },
  effects: {
    * searchCustomer({ phone }, { call, put }) {
      yield put({ type: 'switchLoading' });
      if (phone === '') {
        yield put({ type: 'swithQueryPointModal' });
        Toast.fail('请输入手机号', 1);
        return;
      }
      const data = yield call(userService.getPointDetail, phone);
      yield put({ type: 'switchLoading' });
      yield put({ type: 'swithQueryPointModal' });
      if (data && data.data) {
        yield put({ type: 'setPointDetail', detail: data.data });
        Actions.consumptionPointDetail({ detail: data.data });
      } else {
        Toast.fail('未找到该手机用户的积分信息', 1);
        yield put({ type: 'setPhoneToQueryPoint', phone: '' });
      }
    },
  },
  reducers: {
    setPointDetail(state, { detail }) {
      return { ...state, detail };
    },
    swithQueryPointModal(state) {
      const visibleInputPhoneModal = !state.visibleInputPhoneModal;
      return { ...state, visibleInputPhoneModal, phoneToQueryPoint: '' };
    },
    setPhoneToQueryPoint(state, { phone }) {
      return { ...state, phoneToQueryPoint: phone };
    },
    switchLoading(state) {
      const { loading } = state.loading;
      return { ...state, loading: !loading };
    },
    setIsToastVisible(state, { isToastVisible }) {
      return { ...state, isToastVisible };
    },
  },
};
