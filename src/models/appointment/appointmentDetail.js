import { Toast, ListView } from 'antd-mobile';
import * as appointmentService from '../../services/appointmentService';

const initialState = {
  pageSize: 20,
  currentPage: 0,
  logs: [],
  dataSource: (new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })).cloneWithRows([]),
  isFullyLoaded: false,
};

export default {
  namespace: 'appointmentDetail',
  state: initialState,
  effects: {
    * searchSigninLog({ code, pageSize, currentPage }, { call, put, select }) {
      const { data } = yield call(appointmentService.signinLog, code, pageSize, currentPage);

      if (data) {
        yield put({ type: 'setLogs', logs: data.logs, pageSize, currentPage });
        yield put({ type: 'setSearchParams', pageSize, currentPage });
      } else {
        Toast.fail('获取签到列表失败');
        const { pageSize: oldPageSize, currentPage: lastCurrentPage } = yield select(({ appointmentDetail }) => appointmentDetail);
        yield put({ type: 'setSearchParams', pageSize: oldPageSize, currentPage: lastCurrentPage });
      }
    },

  },
  reducers: {
    setLogs(state, { logs, pageSize, currentPage }) {
      if (logs) {
        const list = (currentPage === 0) ? logs : state.logs.concat(logs);
        let isFullyLoaded = false;
        if (logs.length < pageSize) {
          isFullyLoaded = true;
        }

        return { ...state, isFullyLoaded, logs: list, dataSource: state.dataSource.cloneWithRows(list) };
      }
      return { ...state, isFullyLoaded: true, logs: [], dataSource: state.dataSource.cloneWithRows([]) };
    },
    setSearchParams(state, { pageSize, currentPage }) {
      return { ...state, pageSize, currentPage };
    },
    initializeState() {
      return initialState;
    },
  },
};
