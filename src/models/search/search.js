import { Actions } from 'react-native-router-flux';
import { ListView } from 'antd-mobile';
import * as searchService from '../../services/searchService';
import * as storage from '../../utils/globalStorage';
import Util from '../../utils/utils';

export default {
  namespace: 'Search',
  state: {
    searchVal: '',
    open: false,
    key: '',
    order: '',
    searchListVal: {},
    hotTag: '0',
    closable: false,
    showCancelButton: false,
    historyList: '',
    defauleVal: '西门子',
    productListVal: [],
    channel: '',
    isLoading: false,
    pageSize: 10,
    currentPage: 0,
    ds: (new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })).cloneWithRows([]),
    isEnd: true,
    wishlistVal: [],
    facets: [],
    hotCount: [true, false, false, false, false, false, false, false, false, false, false, false, false, false],
    isshowSuggest: false,
    firstload: 0,
    minPrice: '0',    // 最小值
    maxPrice: '',    // 最大值
    productAttr: {}, // 筛选条件
  },
  effects: {
    * queryList({ searchVal, productAttribute, seller, showCancelButton, channel }, { call, put }) {
      yield put({ type: 'changeVal', searchVal, showCancelButton });
      const data = yield call(searchService.suggestionsList, searchVal, productAttribute, seller, channel);
      Util.consoleLog('data', data);
      yield put({ type: 'querySearchList', searchListVal: data });
    },
    * gethistory({ a }, { call, put }) {
      const userId = yield call(storage.getCurrentEmployeeId);
      const historylists = yield call(storage.getSearchHistoryList, userId);
      Util.consoleLog('存放地址', historylists);
      yield put({ type: 'history', historyList: historylists });
    },
    * saveHistory({ searchValue, hotTag }, { call, put }) {
      const userId = yield call(storage.getCurrentEmployeeId);
      const searchStorage = yield call(storage.getSearchHistoryList, userId);
      let searchStorageArr = searchStorage ? searchStorage.split('@#$%!') : [];
      if (searchStorageArr.indexOf(searchValue) === -1 && hotTag === '0') {
        searchStorageArr.unshift(searchValue);
        if (searchStorageArr.length > 9) {
          searchStorageArr = searchStorageArr.slice(0, 9);
        }
      }
      if (searchStorageArr.length > 0) {
        const newSearchStorage = searchStorageArr.join('@#$%!');
        yield call(storage.setSearchHistory, userId, newSearchStorage);
        yield put({ type: 'history', historyList: newSearchStorage });
      }
    },
    * submit({ searchValue, productAttribute, seller, hotTag }, { call, put }) {
      Util.consoleLog('searchValue------------', searchValue);
      yield put({ type: 'cleanSearchList' });
      yield put({ type: 'isLoading', isLoading: true });
      yield put({ type: 'changeVal', searchVal: searchValue });
      yield put({ type: 'cleanClosableList' });
      // const data = yield call(searchService.searchList, searchValue, productAttribute, seller, 0, 10);
      // Util.consoleLog('--------', data);
      // yield put({ type: 'productList', searchVal: searchValue, isLoading: false, currentPage: 0, productListVal: data.data.products, facets: data.data.facets });
    },
    * loadMore({ searchValue, productAttribute, seller, currentPage, pageSize, order, minSalesPrice, maxSalesPrice, channel, attr }, { call, put }) {
      Util.consoleLog('searchValue+++++++++++++++-', channel);
      yield put({ type: 'isLoading', isLoading: true });
      const data = yield call(searchService.searchList, searchValue, productAttribute, seller, currentPage, pageSize, order, minSalesPrice, maxSalesPrice, channel, attr);
      const productlist = data && data.data ? data.data.products : [];
      const fetc = data && data.data ? data.data.facets : [];
      yield put({ type: 'productList', isLoading: false, minPrice: minSalesPrice, maxPrice: maxSalesPrice, order, channel, currentPage, productListVal: productlist, facets: fetc, pageSize, searchVal: searchValue, isshowSuggest: false, productAttr: attr });
    },
    * wishlist({ a }, { call, put }) {
      const data = yield call(searchService.wishlist);
      yield put({ type: 'wishlistAction', wishlistVal: data.entries });
    },
    * removeHistory({ searchValue }, { call, put }) {
      Util.consoleLog('删除第', searchValue);
      const userId = yield call(storage.getCurrentEmployeeId);
      const searchStorage = yield call(storage.getSearchHistoryList, userId);
      const searchStorageArr = searchStorage ? searchStorage.split('@#$%!') : [];
      for (let it = 0; it < searchStorageArr.length; it++) {
        if (searchStorageArr[it] === searchValue) {
          searchStorageArr.splice(it, 1);
          break;
        }
      }
      const newSearchStorage = searchStorageArr.join('@#$%!');
      yield call(storage.setSearchHistory, userId, newSearchStorage);
      yield put({ type: 'history', historyList: newSearchStorage });
    },
    * closeAll({ a }, { call, put }) {
      const historylist = '';
      const userId = yield call(storage.getCurrentEmployeeId);
      yield call(storage.setSearchHistory, userId, historylist);
      yield put({ type: 'history', historyList: historylist });
    },
  },
  reducers: {
    changeVal(state, { searchVal, showCancelButton }) {
      Util.consoleLog('改变输入框内容：', searchVal);
      return { ...state, searchVal, showCancelButton };
    },
    changeButton(state, action) {
      if (action.showCancelButton) {
        return { ...state, showCancelButton: action.showCancelButton };
      }
      Util.consoleLog('这边也改变了输入框内容：');
      return { ...state, showCancelButton: action.showCancelButton, searchListVal: {}, searchVal: '', hotTag: '0', hotCount: [true, false, false, false, false, false, false, false, false, false, false, false, false, false], isshowSuggest: false };
    },
    onLongPress(state, action) {
      return { ...state, closable: action.closable };
    },
    onClose(state, action) {
      return { ...state, closable: action.closable };
    },
    ChangeOrder(state, action) {
      return { ...state, order: action.orderMsg };
    },
    ChangeChannel(state, action) {
      return { ...state, channel: action.channel };
    },
    querySearchList(state, { searchListVal }) {
      return { ...state, searchListVal };
    },
    productList(state, { productListVal, order, minPrice, maxPrice, isLoading, currentPage, facets, searchVal, pageSize, channel, productAttr }) {
      if (productListVal) {
        const list = currentPage === 0 ? productListVal : state.productListVal.concat(productListVal);
        let isEnd = false;
        Util.consoleLog(productListVal.length < pageSize);
        if (productListVal.length < pageSize) {
          isEnd = true;
        }
        return { ...state, minPrice, maxPrice, isEnd, order, productListVal: list, ds: state.ds.cloneWithRows(list), isLoading, currentPage, facets, searchVal, channel, productAttr };
      }
      Util.consoleLog('没数据么？-------');
      return { ...state, isEnd: true };
    },
    cleanProductList(state, action) {
      if (action.channel) {
        return { ...state, minPrice: '0', maxPrice: '', order: '', productAttr: {}, searchListVal: {}, isEnd: true, channel: '', productListVal: [], hotTag: '0', hotCount: [true, false, false, false, false, false, false, false, false, false, false, false, false, false], ds: (new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })).cloneWithRows([]) };
      }
      return { ...state, minPrice: '0', maxPrice: '', order: '', productAttr: {}, searchListVal: {}, isEnd: true, currentPage: 0, productListVal: [], ds: (new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })).cloneWithRows([]) };
    },
    defMsg(state, { attr, minSalesPrice, maxSalesPrice }) {
      return { ...state, minPrice: minSalesPrice, maxPrice: maxSalesPrice, productAttr: attr };
    },
    isLoading(state, { isLoading }) {
      return { ...state, isLoading, showCancelButton: false, searchListVal: {}, isEnd: false };
    },
    wishlistAction(state, { wishlistVal }) {
      Util.consoleLog('wishlistVal>>>>>>', wishlistVal);
      if (wishlistVal) {
        return { ...state, wishlistVal };
      }
      return { ...state, wishlistVal: [] };
    },
    history(state, { historyList }) {
      Util.consoleLog(historyList);
      return { ...state, historyList };
    },
    changeOpen(state, { open, channel }) {
      if (channel || channel === '') {
        return { ...state, open, channel };
      }
      return { ...state, open };
    },
    onChangeHot(state, action) {
      const datas = [];
      for (let it = 0; it < state.hotCount.length; it++) {
        state.hotCount[it] = false;
        if (parseInt(action.id, 10) === it) {
          state.hotCount[it] = true;
        }
        datas.push(state.hotCount[it]);
      }
      return { ...state, hotCount: datas, hotTag: action.id, searchVal: '' };
    },
    changeSugg(state, action) {
      return { ...state, isshowSuggest: action.isshowSuggest };
    },
    cleanSearchList(state) {
      return { ...state, searchListVal: {} };
    },
    cleanClosableList(state) {
      return { ...state, closable: false };
    },
    cleanHistoryList(state) {
      return { ...state, historyList: '' };
    },
    chageFirst(state, action) {
      return { ...state, firstload: action.firstload };
    },
    cleanAllState(state) {
      return { ...state,
        searchVal: '',
        open: false,
        key: '',
        order: '',
        searchListVal: {},
        hotTag: '0',
        closable: false,
        showCancelButton: false,
        historyList: '',
        defauleVal: '西门子',
        productListVal: [],
        channel: '',
        isLoading: false,
        pageSize: 10,
        currentPage: 0,
        ds: (new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })).cloneWithRows([]),
        isEnd: true,
        wishlistVal: [],
        facets: [],
        hotCount: [true, false, false, false, false, false, false, false, false, false, false, false, false, false],
        isshowSuggest: false,
        firstload: 0,
        productAttr: {},
        minPrice: '0',
        maxPrice: '',
      };
    },
  },
};
