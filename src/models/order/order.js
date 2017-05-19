import { Toast, ListView } from 'antd-mobile';
import * as storage from '../../utils/globalStorage';
import * as orderService from '../../services/orderService';
import * as dictionaryService from '../../services/dictionaryService';

const initialState = {
  orderId: '',
  order: {},
  orders: [],
  input: '',
  pageSize: 20,
  currentPage: 0,
  dataSource: (new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })).cloneWithRows([]),
  isFullyLoaded: false,
};

export default {
  namespace: 'order',
  state: initialState,
  effects: {
    * getOrders({ input, pageSize, currentPage }, { call, put, select }) {
      const { data } = yield call(orderService.getOrders, input, pageSize, currentPage);
      if (data) {
        yield put({ type: 'setOrders', orders: data.results, pageSize, currentPage });
        yield put({ type: 'setSearchParams', input, pageSize, currentPage });
      } else {
        Toast.fail('获取订单列表失败');
        const { pageSize: oldPageSize, currentPage: lastCurrentPage } = yield select(({ order }) => order);
        yield put({ type: 'setSearchParams', input, pageSize: oldPageSize, currentPage: lastCurrentPage });
      }
    },
    * getOrder({ code }, { call, put }) {
      const { data } = yield call(orderService.getOrder, code);
      if (data) {
        yield put({ type: 'setOrder', order: data });
      } else {
        Toast.fail('获取订单详情失败');
      }
    },
    * cancel({ code }, { call, put, select }) {
      const { data } = yield call(orderService.cancelOrder, code);
      if (data) {
        Toast.success('取消订单成功');

        const { input, pageSize, currentPage } = yield select(({ order }) => order);
        yield put({ type: 'getOrders', input, pageSize, currentPage });
      } else {
        Toast.fail('取消订单失败');
      }
    },
    * buyAgain({ order }, { put }) {
      if (!order.entries || order.entries.length === 0) {
        Toast.fail('订单无商品信息');
        return;
      }

      const { deliveryAddress, channelType } = order;

      const { user: { uid: userId, phoneNumber } } = order;
      storage.setCurrentShoppingUser({ userId, phoneNumber });

      for (let i = 0; i < order.entries.length; i += 1) {
        const product = order.entries[i].product;
        yield put({ type: 'Details/addToCart',
          productInfo: {
            pid: product.code,
            status: dictionaryService.getChannelString(channelType),
            qty: 1,
            region: deliveryAddress.cityCode,
            excode: '',
          } });
      }
    },
    * getLogistics({ code }, { call, put }) {
      Toast.info('开发中');
    },
    * downloadInvoice({ code }, { call, put }) {
      Toast.info('开发中');
    },
  },
  reducers: {
    setOrders(state, { orders, pageSize, currentPage }) {
      if (orders) {
        const list = (currentPage === 0) ? orders : state.orders.concat(orders);
        let isFullyLoaded = false;
        if (orders.length < pageSize) {
          isFullyLoaded = true;
        }

        return { ...state, isFullyLoaded, orders: list, dataSource: state.dataSource.cloneWithRows(list) };
      }
      return { ...state, isFullyLoaded: true, orders: [], dataSource: state.dataSource.cloneWithRows([]) };
    },
    setOrder(state, { order }) {
      return { ...state, order };
    },
    setOrderId(state, { code, uid }) {
      return { ...state, orderId: code, userId: uid };
    },
    setSearchParams(state, { input, pageSize, currentPage }) {
      return { ...state, input, pageSize, currentPage };
    },
    initializeState() {
      return initialState;
    },
  },
};
