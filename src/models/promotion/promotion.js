import { Toast, ListView } from 'antd-mobile';
import * as promotionService from '../../services/promotionService';
import * as storage from '../../utils/globalStorage';

const initialState = {
  promotionId: '',
  promotion: {},
  promotions: [],
  filters: {
    province: '',
    city: '',
    pos: '',
    channel: '',
    type: '',
  },
  pageSize: 20,
  currentPage: 0,
  dataSource: (new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })).cloneWithRows([]),
  isFullyLoaded: false,
};

export default {
  namespace: 'promotion',
  state: initialState,
  effects: {
    * getAll({ filters, pageSize, currentPage }, { call, put }) {
      let newfilters = filters;
      if (!filters) {
        const { pointOfServiceCode } = yield call(storage.getCurrentLogin);
        const { default: defaultRegion } = yield call(storage.getCurrentRegion);
        newfilters = {
          province: defaultRegion.parent || '',
          city: defaultRegion.value || '',
          pos: pointOfServiceCode || '',
          channel: '',
          type: '',
        };
      }
      const { data } = yield call(promotionService.getAll, newfilters, pageSize, currentPage);
      if (data) {
        yield put({ type: 'setPromotions', promotions: data.results, pageSize, currentPage });
      } else {
        Toast.fail('获取促销列表失败');
      }

      yield put({ type: 'setSearchParams', filters: newfilters, pageSize, currentPage });
    },
    * get({ promotionId }, { call, put }) {
      const { data } = yield call(promotionService.get, promotionId);
      if (data) {
        yield put({ type: 'setPromotion', promotion: data });
      } else {
        Toast.fail('获取促销详情失败');
      }
    },
  },
  reducers: {
    setPromotions(state, { promotions, pageSize, currentPage }) {
      if (promotions) {
        const list = (currentPage === 0) ? promotions : state.promotions.concat(promotions);
        let isFullyLoaded = false;
        if (promotions.length < pageSize) {
          isFullyLoaded = true;
        }

        return { ...state, isFullyLoaded, promotions: list, dataSource: state.dataSource.cloneWithRows(list) };
      }

      return { ...state, isFullyLoaded: true, promotions: [], dataSource: state.dataSource.cloneWithRows([]) };
    },
    setPromotion(state, { promotion }) {
      return { ...state, promotion };
    },
    setPromotionId(state, { promotionId }) {
      return { ...state, promotionId };
    },
    setSearchParams(state, { filters, pageSize, currentPage }) {
      return { ...state, filters, pageSize, currentPage };
    },
    initializeState() {
      return initialState;
    },
  },
};
