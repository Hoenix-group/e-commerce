import { Toast } from 'antd-mobile';
import * as appointmentService from '../../services/appointmentService';
import Util from './../../utils/utils';
import { DEFAULT_PAGESIZE } from '../../utils/configuration';

export default {
  namespace: 'appointment',
  state: {
    appointmentdetail: {},
    appointmentlist: [],
    endFlag: false,
    currentPage: 0,
    refreshing: false,
  },
  effects: {
    * fetchAppointmentsList({ currentPage, refreshTag }, { call, put }) {
      if (refreshTag) {
        yield put({ type: 'setRefreshing' });
      }
      const appointmentlist = yield call(appointmentService.getAppointmentsList, { currentPage, pageSize: DEFAULT_PAGESIZE });
      if (appointmentlist.reservations) {
        yield put({ type: 'updateAppointmentList', appointmentlist: appointmentlist.reservations, refreshTag, currentPage });
      } else {
        Toast.fail('获取活动列表失败', 1);
        yield put({ type: 'cancelRefreshing' });
      }
    },

    * fetchAppointmentDetail(code, { put, call }) {
      const appointmentdetail = yield call(appointmentService.getAppointmentDetail, code);
      if (appointmentdetail !== undefined) {
        yield put({ type: 'updateAppointmentDetails', appointmentdetail });
      } else {
        Toast.fail('获取活动详细失败', 1);
      }
    },
  },
  reducers: {
    selectAppointment(state) {
      return { ...state, appointmentdetail: state.appointmentlist[1] };
    },

    updateAppointmentList(state, { appointmentlist, refreshTag, currentPage }) {
      const tempList = refreshTag ? [] : state.appointmentlist;
      appointmentlist.forEach((data) => {
        const tempData = data;
        tempData.activityStartTime = appointmentService.formateDateString(new Date(data.activityStartTime));
        tempData.activityEndTime = appointmentService.formateDateString(new Date(data.activityEndTime));
        tempData.startTime = appointmentService.formateDateString(new Date(data.startTime));
        tempData.endTime = appointmentService.formateDateString(new Date(data.endTime));
        tempList.push(tempData);
      });
      Util.consoleLog(appointmentlist);
      return {
        ...state,
        appointmentlist: tempList,
        currentPage: refreshTag ? 1 : currentPage + 1,
        endFlag: appointmentlist.length < DEFAULT_PAGESIZE,
        refreshing: false,
      };
    },

    updateAppointmentDetails(state, { appointmentdetail }) {
      const tempDetailData = { ...appointmentdetail, activityName: appointmentdetail.name };
      delete tempDetailData.name;
      Util.consoleLog('tempDetailData', tempDetailData);
      return { ...state, appointmentdetail: tempDetailData };
    },

    resetAppointmentDetailData(state) {
      return { ...state, appointmentdetail: {} };
    },

    resetAppointmentsList(state) {
      return { ...state, appointmentdetail: {}, appointmentlist: [], endFlag: false, currentPage: 0, refreshing: false };
    },

    setRefreshing(state) {
      return { ...state, refreshing: true };
    },

    cancelRefreshing(state) {
      return { ...state, refreshing: false };
    },
  },
};

