import { Toast } from 'antd-mobile';
import * as dictionaryService from '../../services/dictionaryService';

const initializeState = {
  defaultCounty: '',
  defaultTown: '',
  counties: [],
  towns: [],
};

export default {
  namespace: 'district',
  state: initializeState,
  effects: {
    * getCounties({ cityCode, callback }, { call, put }) {
      const { data } = yield call(dictionaryService.getRegionChildren, cityCode);
      if (data) {
        yield put({ type: 'setCounties', counties: data.members });
        if (callback) {
          callback(data.members);
        }
      } else {
        Toast.fail('获取区县列表失败');
      }
    },
    * getTowns({ countyCode, callback }, { call, put }) {
      const { data } = yield call(dictionaryService.getRegionChildren, countyCode);
      if (data) {
        yield put({ type: 'setTowns', towns: data.members });
        if (callback) {
          callback(data.members);
        }
      } else {
        Toast.fail('获取街道列表失败');
      }
    },
  },
  reducers: {
    setCounties(state, { counties }) {
      const defaultCounty = (counties && counties.length > 0) ? counties[0].value : '';
      return { ...state, counties, defaultCounty };
    },
    setTowns(state, { towns }) {
      const defaultTown = (towns && towns.length > 0) ? towns[0].value : '';
      return { ...state, towns, defaultTown };
    },
    initializeState() {
      return initializeState;
    },
  },
};
