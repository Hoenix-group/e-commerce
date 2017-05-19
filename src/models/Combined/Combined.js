import { ListView } from 'antd-mobile';
import * as combinedService from '../../services/combinedService';
import Util from '../../utils/utils';

export default {
  namespace: 'combined',
  state: {
    isLoading: false,
    ds: (new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })).cloneWithRows([]),
    isEnd: true,
    combinedData: [],
    details: [],
    productname: '',
    currentPage: 0,
    pageSize: 10,
    isSearch: false,
  },
  reducers: {
    combinedList(state, { combinedData, details, isLoading, pageSize, productName, currentPage }) {
      if (combinedData) {
        let newobj = {};
        const newarray = [];
        for (let it = 0; it < combinedData.length; it++) {
          const obj = {};
          obj.isselect = '';
          newobj = Object.assign({}, combinedData[it], obj);
          newarray.push(newobj);
        }
        console.log('-------->', currentPage, state.combinedData.length);
        const list = (currentPage === 0) ? newarray : state.combinedData.concat(newarray);
        console.log('-------->', list.length);
        let isEnd = false;
        if (combinedData.length < pageSize) {
          isEnd = true;
        }
        return { ...state, combinedData: list, details, ds: state.ds.cloneWithRows(list), isLoading, isEnd, productname: productName, currentPage };
      }
      return { ...state, isEnd: true };
    },
    cleanCombinedList(state) {
      return {
        ...state,
        isLoading: false,
        ds: (new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })).cloneWithRows([]),
        isEnd: true,
        combinedData: [],
        details: [],
        currentPage: 0,
        pageSize: 2,
        isSearch: false,
      };
    },
    isEndChange(state) {
      return { ...state, isEnd: false };
    },
    showDetail(state, { selectProduct, rowID }) {
      const newData = state.ds._dataBlob.s1;
      const item = Object.assign({}, newData[rowID], { 'isselect': selectProduct }); 
      return { ...state, ds: state.ds.cloneWithRows(Object.assign({}, newData, { [rowID]: item })) };
    },
  },
  effects: {
    * getcombinedData({ param, cb }, { call, put }) {
      const { productName, pageSize, currentPage, isSearch } = param;
      const data = yield call(combinedService.combinedList, productName, pageSize, currentPage, isSearch);
      const combined = data && data.data.products ? data.data.products : [];
      yield put({ type: 'combinedList', combinedData: combined, details: data, currentPage, isSearch, isLoading: true, pageSize, productName });
      if (Object.prototype.toString.call(cb) === '[object Function]') {
        cb();
      }
    },
  },
};
