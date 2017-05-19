import { Actions } from 'react-native-router-flux';
import { Toast } from 'antd-mobile';
import * as addressService from '../../services/addressService';

const initializeState = {
  record: {},
  addresses: [],
  selectedId: '',
};

export default {
  namespace: 'address',
  state: initializeState,
  effects: {
    * getAll(action, { call, put }) {
      const { data } = yield call(addressService.getAll);
      if (data) {
        if (data.addresses) {
          yield put({ type: 'setAddress', addresses: data.addresses });
        }
      } else {
        Toast.fail('获取地址列表失败');
      }
    },
    * create({ record }, { call }) {
      const data = yield call(addressService.create, record);
      if (data) {
        Actions.addressList();
      } else {
        Toast.fail('新增失败');
      }
    },
    * update({ record }, { call }) {
      const data = yield call(addressService.update, record);
      if (data) {
        Actions.addressList();
      } else {
        Toast.fail('修改失败');
      }
    },
    * remove({ addresses, code }, { call, put }) {
      const data = yield call(addressService.remove, code);
      if (data) {
        const newAddresses = [];
        for (let id = 0; id < addresses.length; id += 1) {
          if (addresses[id].code !== code) {
            newAddresses.push(addresses[id]);
          }
        }
        yield put({ type: 'setAddress', addresses: newAddresses });
      } else {
        Toast.fail('删除失败');
      }
    },
    * select({ code }, { call, put }) {
      const data = yield call(addressService.select, code);
      if (data) {
        yield put({ type: 'setSelectedId', selectedId: code });
        yield put({ type: 'checkout/updateSelfPickupAdds', wareHouses: [] });
        Actions.checkout();
      } else {
        Toast.fail('设置失败');
      }
    },
  },
  reducers: {
    setAddress(state, { addresses }) {
      return { ...state, addresses };
    },
    setRecordDetails(state, { record }) {
      return { ...state, record: { ...state.record, ...record } };
    },
    setRecord(state, { record }) {
      return { ...state, record };
    },
    setSelectedId(state, { selectedId }) {
      return { ...state, selectedId };
    },
    initializeState() {
      return initializeState;
    },
  },
};
