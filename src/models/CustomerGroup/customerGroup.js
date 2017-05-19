import { Toast } from 'antd-mobile';
import * as searchService from '../../services/searchService';
import * as userService from '../../services/userService';

export default {
  namespace: 'CustomerGroup',
  state: {
    customers: [],
    refreshingList: false,
    searchKeyword: '',
    selectedCustomers: [],
    newGroupName: '',
    groups: [],
    isVisibleAddGroupModal: false,
  },
  effects: {
    * getCustomers(action, { call, put }) {
      yield put({ type: 'setRefreshingList', refreshingList: true });
      yield put({ type: 'setSearchKeyword', searchKeyword: '' });
      const data = yield call(userService.getCustomers);
      if (data && data.members) {
        yield put({ type: 'setCustomers', customers: data.members });
      } else {
        Toast.fail('获取顾客列表失败');
        console.debug(data);
        yield put({ type: 'setCustomers', customers: [] });
      }
      yield put({ type: 'setRefreshingList', refreshingList: false });
    },
    * searchCustomer({ searchKeyword }, { call, put }) {
      yield put({ type: 'setRefreshingList', refreshingList: true });
      yield put({ type: 'setSearchKeyword', searchKeyword });
      const param1 = {
        name: searchKeyword,
      };
      const data1 = yield call(userService.searchCustomer, param1);
      const param2 = {
        phoneNumber: searchKeyword,
      };
      const data2 = yield call(userService.searchCustomer, param2);

      var customers = [];

      if (data1 && data1.members) {
        customers = [...data1.members];
      }

      if (data2 && data2.members) {
        customers = [...customers, ...data2.members];
      }

      yield put({ type: 'setCustomers', customers });
      yield put({ type: 'setRefreshingList', refreshingList: false });
    },
    * getGroups(action, { put, select }) {
      // 调用service获取分组
      const groups = yield select(state => state.CustomerGroup.groups);
      yield put({ type: 'setGroups', groups });
    },
    * updateSelectedCustomers({ selectedCustomer }, { put, select }) {
      const selectedCustomers = yield select(state => state.CustomerGroup.selectedCustomers);

      const index = selectedCustomers.indexOf(selectedCustomer.uid);
      if (index === -1) {
        selectedCustomers.push(selectedCustomer.uid);
      } else {
        selectedCustomers.splice(index, 1);
      }

      yield put({ type: 'setSelectedCustomers', selectedCustomers });
    },
    * unselectAllCustomers(action, { put }) {
      yield put({ type: 'setSelectedCustomers', selectedCustomers: [] });
    },
    * updateCustomerGroup({ group, customers }, { call, put }) {
      // 更新客户分组

      yield put({ type: 'setSelectedCustomers', selectedCustomers: [] });
    },
  },
  reducers: {
    setCustomers(state, { customers }) {
      return { ...state, customers };
    },
    setGroups(state, { groups }) {
      return { ...state, groups: Array.from(groups) };
    },
    removeGroup(state, { group }) {
      const groups = Array.from(state.groups);
      groups.splice(groups.indexOf(group), 1);
      return { ...state, groups };
    },
    addGroup(state, { group }) {
      const groups = Array.from(state.groups);
      groups.push(group);
      return { ...state, groups };
    },
    setRefreshingList(state, { refreshingList }) {
      return { ...state, refreshingList };
    },
    setSearchKeyword(state, { searchKeyword }) {
      return { ...state, searchKeyword };
    },
    setSelectedCustomers(state, { selectedCustomers }) {
      return { ...state, selectedCustomers };
    },
    setNewGroupName(state, { newGroupName }) {
      return { ...state, newGroupName };
    },
    swithAddGroupModal(state) {
      const isVisibleAddGroupModal = !state.isVisibleAddGroupModal;
      return { ...state, isVisibleAddGroupModal, newGroupName: '' };
    },
  },
};
