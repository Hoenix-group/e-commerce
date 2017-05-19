import { Actions } from 'react-native-router-flux';
import { Toast } from 'antd-mobile';
import * as amapService from '../../services/amapService';
import * as appointmentService from '../../services/appointmentService';
import * as config from '../../utils/configuration';

export default {
  namespace: 'signAppointment',
  state: {
    appointmentLocations: [],
    currentPage: config.PAGE,
    endTag: false,
    position: { coords: {} },
  },
  effects: {
    * fetchAppointmentLocations({ position, currentPage }, { call, put }) {
      // const longitude = 116.481488;
      // const latitude = 39.990464;
      const longitude = position.coords.longitude;
      const latitude = position.coords.latitude;
      // position.coords.latitude  //39.990464
      // position.coords.longitude //116.481488
      yield put({ type: 'loading', showtext: '加载中...', inputEditable: false });
      const locationDatas = yield call(amapService.searchAround, { longitude, latitude, keyWords: ['小区'], pageNumber: currentPage });

      yield put({ type: 'updateAppointmentLocation', appointmentLocations: locationDatas.data.pois });
    },

    * signin({ code, address }, { call }) {
      const { data } = yield call(appointmentService.signin, code, address);

      if (data) {
        Actions.pop();
        Toast.info('签到成功');
      } else {
        Toast.info('签到失败');
      }
    },

  },
  reducers: {
    selectAppointmentLocation(state, { locatoin }) {
      return { ...state, locatoin };
    },

    updateAppointmentLocation(state, { appointmentLocations }) {
      const endTag = appointmentLocations.length < config.PAGESIZE;
      const currentPage = state.currentPage + 1;
      appointmentLocations.map(data => state.appointmentLocations.push(data));
      return { ...state, currentPage, endTag };
    },

    initStateData(state, { position }) {
      return { ...state, appointmentLocations: [], currentPage: config.PAGE, endTag: false, position };
    },

    resetAppointmentLocations(state) {
      return { ...state, appointmentLocations: [], currentPage: config.PAGE, endTag: false, position: { coords: {} } };
    },
  },
};
