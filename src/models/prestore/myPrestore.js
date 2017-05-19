import { Toast } from 'antd-mobile';
// import { Actions } from 'react-native-router-flux';
import moment from 'moment';
import * as prestoreService from '../../services/prestoreService';
import Util from './../../utils/utils';
import { DEFAULT_PAGESIZE } from '../../utils/configuration';

export default {
  namespace: 'myPrestore',
  state: {
    prestoreList: [],
    prestoreDetail: {
      prestoreName: '',
      prestoreDescription: '',
      prestoreTime: '',
      voucherExpiryDate: '',
      channels: '',
      channelsList: [],
      stores: '',
      prestorePlan: '',
      orderCode: '',
    },
    filterDatas: [
      {
        title: '所有门店',
        filterItems: [{ text: '所有门店', key: '' }],
      },
      {
        title: '时间状态',
        filterItems: [{ text: '全部', key: '' }, { text: '预约中', key: 'inPreStore' }, { text: '活动中', key: 'inActivity' }],
      },
      {
        title: '生效时间',
        filterItems: [{ text: '', key: 'byEffectTime' }, { text: '', key: 'byEffectTimeAsc' }],
        isSort: true,
        isDefault: false,
        defaultItemIndex: 0,
        arrowChange: true,
      },
    ],
    filterParms: [{ name: 'storeId', value: '' }, { name: 'status', value: '' }, { name: 'sort', value: '' }],
    endFlag: false,
    currentPage: 0,
    refreshing: false,
  },
  effects: {
    * fetchPrestoreList({ filterParms, currentPage, refreshTag }, { put, call }) {
      if (refreshTag) {
        yield put({ type: 'setRefreshing' });
      }
      const listResult = yield call(prestoreService.fetchPrestoreListForEmployee, { filterParms, currentPage, pageSize: DEFAULT_PAGESIZE });
      Util.consoleLog('listResult: ', listResult);
      if (listResult.errors || !listResult.prestoreRules) {
        Toast.fail('获取我的预存列表失败', 1);
        yield put({ type: 'cancelRefreshing' });
      } else if (!listResult.stores) {
        Toast.info('获取门店信息失败', 1);
        yield put({ type: 'updatePrestoreList', prestoreList: listResult.prestoreRules, refreshTag, filterParms });
      } else {
        yield put({ type: 'updatePrestoreList', prestoreList: listResult.prestoreRules, refreshTag, filterParms });
        yield put({ type: 'updateFilterData', stores: listResult.stores });
      }
    },

    * fetchPrestoreDetail({ code }, { put, call }) {
      const detailResult = yield call(prestoreService.fetchPrestoreDetailForEmployee, code);
      Util.consoleLog('detailResult: ', detailResult);
      if (detailResult.errors || !detailResult.prestoreRules) {
        Toast.fail('获取预约详细失败', 1);
      } else {
        yield put({ type: 'updatePrestoreDetail', prestoreDetail: detailResult.prestoreRules[0], store: detailResult.stores[0] });
      }
    },
  },

  reducers: {
    updatePrestoreList(state, { prestoreList, refreshTag, filterParms }) {
      const tempList = refreshTag ? [] : state.prestoreList;
      prestoreList.forEach((data) => {
        tempList.push({ ...data, prestorePlan: `预存${data.preStoreValue}元 返${data.preStoreVoucherName} ${data.preStoreVoucherValue}元` });
      });
      return {
        ...state,
        endFlag: prestoreList.length < DEFAULT_PAGESIZE,
        currentPage: refreshTag ? 1 : state.currentPage + 1,
        prestoreList: tempList,
        filterParms,
        refreshing: false,
      };
    },

    setRefreshing(state) {
      return { ...state, refreshing: true };
    },

    cancelRefreshing(state) {
      return { ...state, refreshing: false };
    },

    updatePrestoreDetail(state, { prestoreDetail, store }) {
      Util.consoleLog('prestoreDetail: ', prestoreDetail);
      const prestoreTime = prestoreDetail.prestoreTime ? moment(prestoreDetail.prestoreTime).utcOffset(8).format('MMMDo h:mm') : '';
      const voucherExpiryDate = prestoreDetail.voucherStartTime && prestoreDetail.voucherEndTime ?
        `${moment(prestoreDetail.voucherStartTime).utcOffset(8).format('L')} 至 ${moment(prestoreDetail.voucherEndTime).utcOffset(8).format('L')}` : '';
      const channelsList = prestoreDetail.fsPreStorePromotion ? prestoreDetail.fsPreStorePromotion.scopes.map(data => (data.channelName)) : [];
      // const channels = channelsList.join(' ');
      const channels = store ? store.channelType : '';
      const prestorePlan = prestoreDetail.preStoreValue ? `预存${prestoreDetail.preStoreValue}元 返${prestoreDetail.preStoreVoucherName} ${prestoreDetail.preStoreVoucherValue}元` : '';

      // get storeStr
      let storeStr = '';
      if (store) {
        const province = store.province ? `${store.province} ` : '';
        const city = store.city ? `${store.city} ` : '';
        const area = store.area ? `${store.area} ` : '';
        const storeName = store.displayName ? `${store.displayName} ` : '';
        storeStr = `${province}${city}${area}${storeName}`;
      }
      return { ...state,
        prestoreDetail: {
          prestoreName: prestoreDetail.fsPreStorePromotion ? prestoreDetail.fsPreStorePromotion.name : '',
          prestoreDescription: prestoreDetail.fsPreStorePromotion ? prestoreDetail.fsPreStorePromotion.description : '',
          prestoreTime,
          voucherExpiryDate,
          channels,
          channelsList,
          stores: storeStr,
          prestorePlan,
          orderCode: prestoreDetail.orderCode,
        },
      };
    },

    updateFilterData(state, { stores }) {
      const storeMenuItems = [{ text: '所有门店', key: '' }];
      stores.forEach(data => (storeMenuItems.push({ text: data.displayName, key: data.name })));
      const menuList = state.filterDatas;
      menuList[0].filterItems = storeMenuItems;
      return { ...state, filterDatas: menuList };
    },

    resetPrestoreListState(state) {
      const filterDatas = state.filterDatas;
      filterDatas[0] = { title: '所有门店', filterItems: [{ text: '所有门店', key: '' }] };
      const filterParms = [{ name: 'storeId', key: '' }, { name: 'status', key: '' }, { name: 'sort', key: '' }];
      return { ...state, prestoreList: [], endFlag: false, currentPage: 0, filterDatas, filterParms };
    },

    resetPrestoreDetail(state) {
      return { ...state,
        prestoreDetail: {
          prestoreName: '',
          prestoreDescription: '',
          prestoreTime: '',
          voucherExpiryDate: '',
          channels: '',
          channelsList: [],
          stores: '',
          prestorePlan: '',
          orderCode: '',
        },
      };
    },
  },
};
