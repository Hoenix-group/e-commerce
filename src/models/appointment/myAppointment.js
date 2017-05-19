import { Toast } from 'antd-mobile';
import * as appointmentService from '../../services/appointmentService';
import Util from './../../utils/utils';
import { DEFAULT_PAGESIZE } from '../../utils/configuration';

export default {
  namespace: 'myAppointment',
  state: {
    acData: {
      aclist: [],
      acFilterInfos: [],
    },
    appointmentDetail: {
      reservationStatus: {},
      reservationType: {},
    },
    noMorePageTag: false,
    filterDatas: [
      {
        title: '所有门店',
        filterItems: [
          { text: '所有门店', key: '' },
          // { text: '苏州市新街口店', key: '' },
          // { text: '南京市中山店', key: '' },
          // { text: '南京市鼓楼店', key: '' },
        ],
        isSort: false,
        isDefault: false,
        defaultItemIndex: -1,
      },
      {
        title: '时间状态',
        filterItems: [{ text: '全部', key: '' }, { text: '预约中', key: 'inReservation' }, { text: '活动中', key: 'inactivity' }],
        isSort: false,
        isDefault: false,
        defaultItemIndex: -1,
      },
      {
        title: '生效时间',
        filterItems: [{ text: '', key: 'byEffectTime' }, { text: '', key: 'byEffectTimeAsc' }],  // byEffectTimeAsc
        isSort: true,
        isDefault: false,
        defaultItemIndex: 0,
        arrowChange: true,
      },
    ],
    filterSelectedParms: [{ name: 'storeName', value: '' }, { name: 'status', value: '' }, { name: 'sort', value: '' }],
    currentPage: 0,
    endFlag: false,
    refreshing: false,
  },
  effects: {
    * fetchAppointmentListData({ currentPage, filterSelectedParms, refreshTag }, { put, call }) {
      if (refreshTag) {
        yield put({ type: 'setRefreshing' });
      }
      const result = yield call(appointmentService.getAppointmentList4Employee, { currentPage, filterParms: filterSelectedParms, pageSize: DEFAULT_PAGESIZE });
      if (result && result.reservations) {
        yield put({ type: 'updateAppointmentList', appointmentList: result.reservations, currentPage, refreshTag });
        yield put({ type: 'updateFilterDatas', storeList: result.stores, filterSelectedParms });
      } else {
        Toast.fail('获取活动列表失败', 1);
        yield put({ type: 'cancelRefreshing' });
      }
    },
    * fetchAppointmentDetailData({ code }, { put, call }) {
      const result = yield call(appointmentService.getAppointmentDetail4Employee, code);
      Util.consoleLog(result);
      if (result.errors) {
        Toast.fail('获取活详细失败', 1);
      } else {
        yield put({ type: 'updateAppointmentDatail', appointmentDetail: result });
      }
    },

    * updateAppointmentStatus({ code, status }, { call, put }) {
      const result = yield call(appointmentService.updateAppointmentStatus, { code, status });
      if (result.errors) {
        Toast.fail('更新活动状态失败', 1);
      } else {
        Toast.info('更新活动状态成功', 1);
        yield put({ type: 'updateReservationStatus', reservationStatusCode: status });
      }
    },
  },

  reducers: {
    changeFilterItemState(state, { buttonIndex, itemIndex }) {
      const filterDatas = state.acData.acFilterInfos;
      filterDatas[buttonIndex].filterItems[itemIndex].trigerTag = !filterDatas[buttonIndex].filterItems[itemIndex].trigerTag;
      return { ...state, acData: { ...state.acData, acFilterInfos: filterDatas } };
    },

    updateAppointmentList(state, { appointmentList, currentPage, refreshTag }) {
      const tempList = refreshTag ? [] : state.acData.aclist;
      appointmentList.forEach(data => tempList.push(data));
      return {
        ...state,
        acData: { ...state.acData, aclist: tempList },
        currentPage: refreshTag ? 1 : currentPage + 1,
        endFlag: appointmentList.length < DEFAULT_PAGESIZE,
        refreshing: false,
      };
    },

    setRefreshing(state) {
      return { ...state, refreshing: true };
    },

    cancelRefreshing(state) {
      return { ...state, refreshing: false };
    },

    resetAppointmentList(state) {
      const filterSelectedParms = [{ name: 'storeName', value: '' }, { name: 'status', value: '' }, { name: 'sort', value: '' }];
      return { ...state, acData: { ...state.acData, aclist: [] }, currentPage: 0, endFlag: false, refreshing: false, filterSelectedParms };
    },

    initStateData(state) {
      return { ...state, currentPage: 0, noMorePageTag: false };
    },

    updateAppointmentDatail(state, { appointmentDetail }) {
      const reservationStatus = { name: '', code: appointmentDetail.reservationStatus };
      const stateOptsData = appointmentDetail.reservationStatusOpts.map((data) => {
        if (reservationStatus.code === data.code) {
          reservationStatus.name = data.name;
        }
        return { label: data.name, value: data.code };
      });
      return { ...state, appointmentDetail: { ...appointmentDetail, stateOptsData, reservationStatus } };
    },

    updateReservationStatus(state, { reservationStatusCode }) {
      // Util.consoleLog({ ...state.appointmentDetail, reservationStatus });
      const reservationStatus = { code: reservationStatusCode, name: '' };
      state.appointmentDetail.reservationStatusOpts.forEach((data) => {
        if (reservationStatus.code === data.code) {
          reservationStatus.name = data.name;
        }
      });
      return { ...state, appointmentDetail: { ...state.appointmentDetail, reservationStatus } };
    },

    updateFilterDatas(state, { storeList, filterSelectedParms }) {
      if (!storeList) {
        return { state };
      }
      const storeMenuItems = [{ text: '所有门店', key: '' }];
      storeList.forEach(data => (storeMenuItems.push({ text: data.displayName, key: data.name })));
      // Util.consoleLog(storeMenuItems);
      // const storeMenuItem = { title: '所有门店', filterItems: storeMenuItems, isSort: false, isDefault: false, defaultItemIndex: -1 };
      const menuList = state.filterDatas;
      menuList[0].filterItems = storeMenuItems;
      return { ...state, filterDatas: menuList, filterSelectedParms };
    },
  },
};
