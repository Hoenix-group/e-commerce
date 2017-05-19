import * as cartService from '../../services/cartService';
import { ListView } from 'antd-mobile';

export default {
  namespace: 'home',
  state: {
    cartData: [],
    dataSource: (new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })).cloneWithRows([]),
    cartPageSize: 10,
    cartCurrentPage: 0,
    isLoadedAll: true,
    isSearchAction: false,
  },

  effects: {
    * fetchCartsData({ param, cb }, { call, put }) {
      const { cartCurrentPage, cartPageSize } = param;
      const carts = yield call(cartService.getCartsByEmploryeeId, cartCurrentPage, cartPageSize);
      if (carts) {
        yield put({ type: 'setCartData', carts, isSearchAction: false, cartCurrentPage, cartPageSize });
      } else {
        yield put({ type: 'setCartData', carts: [], isSearchAction: false, cartCurrentPage, cartPageSize });
      }
      if (Object.prototype.toString.call(cb) === '[object Function]') {
        cb();
      }
    },
    * getCartsByUserId({ nameOrPhoneNumber }, { call, put }) {
      const carts = yield call(cartService.getCartsByUserId, nameOrPhoneNumber);
      yield put({ type: 'setCartData', carts, isSearchAction: true });
    },
  },
  reducers: {
    setCartData(state, { carts, isSearchAction, cartCurrentPage, cartPageSize }) {
      if (isSearchAction) {
        return { ...state, dataSource: state.dataSource.cloneWithRows(carts), isSearchAction };
      }
      let resultList = [];
      let isLoadedAll = false;
      if (carts) {
        resultList = (cartCurrentPage === 0) ? carts : state.cartData.concat(carts);
        if (carts.length < cartPageSize) {
          isLoadedAll = true;
        }
      }
      return { ...state, dataSource: state.dataSource.cloneWithRows(resultList), isSearchAction, isLoadedAll, cartPageSize, cartCurrentPage, cartData: resultList };
    },
  },
};
