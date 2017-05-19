import { Toast } from 'antd-mobile';
import * as appointmentService from '../../services/appointmentService';
import { DEFAULT_PAGESIZE } from '../../utils/configuration';

export default {
  namespace: 'listAppointedCustomers',
  state: {
    appointmentCustomers: [],
    currentPage: 0,
    endFlag: false,
    refreshing: false,
  },
  effects: {
    * fetchAppointmentCustoms({ code, currentPage, refreshTag }, { call, put }) {
      if (refreshTag) {
        yield put({ type: 'setRefreshing' });
      }
      const customersList = yield call(appointmentService.getAppointmentCustomers, { code, currentPage, pageSize: DEFAULT_PAGESIZE });
      if (customersList && customersList.reservations) {
        yield put({ type: 'updateAppointmentCustoms', customersList: customersList.reservations, refreshTag, currentPage });
      } else {
        Toast.fail('获取预约用户列表失败');
        yield put({ type: 'cancelRefreshing' });
      }
    },

  },
  reducers: {
    updateAppointmentCustoms(state, { customersList, refreshTag, currentPage }) {
      const tempList = refreshTag ? [] : state.appointmentCustomers;
      customersList.forEach(data => tempList.push(data));
      // const endTag = customersList.reservations.length < DEFAULT_PAGESIZE;
      // customersList.reservations.map(data => state.appointmentCustomers.push(data));
      return {
        ...state,
        currentPage: refreshTag ? 1 : currentPage + 1,
        endFlag: customersList.length < DEFAULT_PAGESIZE,
        refreshing: false,
        appointmentCustomers: tempList,
      };
    },

    setRefreshing(state) {
      return { ...state, refreshing: true };
    },

    cancelRefreshing(state) {
      return { ...state, refreshing: false };
    },

    resetCustomerList(state) {
      return { ...state, currentPage: 0, appointmentCustomers: [], endFlag: false, refreshing: false };
    },
  },
};
