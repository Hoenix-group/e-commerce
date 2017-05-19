import * as cartService from '../../services/cartService';

export default {
  namespace: 'home',
  state: {
    selectedTab: 'home',
    cartData: [],
  },

  effects: {
    * switchViewAndData({ selectedTab: selected }, { call, put }) {
      yield put({ type: 'selectedView', selectedTab: selected });
      const carts = yield call(cartService.getCartsByEmploryeeId);
      if (carts) {
        yield put({ type: 'setCartData', cartData: carts });
      } else {
        yield put({ type: 'setCartData', cartData: [] });
      }
    },
  },
  reducers: {
    selectedView(state, { selectedTab: selected }) {
      return { ...state, selectedTab: selected };
    },
    setCartData(state, { cartData: carts }) {
      return { ...state, cartData: carts };
    },
  },
};
