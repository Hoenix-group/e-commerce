import { Toast, Modal } from 'antd-mobile';
import { Actions } from 'react-native-router-flux';
import * as voucherService from '../../services/voucherService';
import Util from './../../utils/utils';

const alert = Modal.alert;

export default {
  namespace: 'voucher',
  state: {
    voucherList: [],
    voucherApplyCount: undefined,
    selectedVouchers: [],
    transferAccount: undefined,
    avaliableVouchers: [],
    applyVoucherType: [],
    avaliableVoucherAmounts: [],
    applyVoucherAmount: [],
    avaliableVoucherTypeRel: {},
    avaliableVoucherAmountRel: {},
  },
  effects: {
    * fetchVoucherList(action, { call, put }) {
      const voucherList = yield call(voucherService.getVoucherList);
      let listData = [];
      if (voucherList) {
        Util.consoleLog(voucherList);
        // 先mock点假数据 从这里开始删
        if (voucherList.results && voucherList.results.length === 0) {
          voucherList.results = [{
            'currentValue': 50,
            'endTime': 1519000000000,
            'orderAmount': 0,
            'startTime': 1485878400000,
            'status': 'USED',
            'voucherCode': 'vd001',
            'voucherValue': 50,
            'vourcherType': 'deposit',
          },{
            'currentValue': 10,
            'endTime': 1519315200000,
            'orderAmount': 0,
            'startTime': 1485878400000,
            'status': 'USED',
            'voucherCode': 'vd002',
            'voucherValue': 10,
            'vourcherType': 'deposit',
          },{
            'currentValue': 20,
            'endTime': 1519000000000,
            'orderAmount': 0,
            'startTime': 1485878400000,
            'status': 'USED',
            'voucherCode': 'vd003',
            'voucherValue': 20,
            'vourcherType': 'deposit',
          },{
            'currentValue': 10,
            'endTime': 1510000000000,
            'orderAmount': 0,
            'startTime': 1485878400000,
            'status': 'USED',
            'voucherCode': 'vd004',
            'voucherValue': 100,
            'vourcherType': 'deposit',
          }];

          listData = voucherList.results;
        }

        // mock的数据 删到这里
        yield put({ type: 'updateVoucherList', listData });
      } else {
        Toast.fail('获取卡券列表失败', 1);
      }
    },
    * fetchAvaliableVouchers(action, { call, put }) {
      const data = yield call(voucherService.getAvaliableVouchers);
      if (data) {
        Util.consoleLog(data);
        yield put({ type: 'updateAvaliableVouchers', data });
        yield put({ type: 'mapAvaliableVouchers', data });
      } else {
        Toast.fail('获取可申请卡券列表失败', 1);
      }
    },
    * createApply({ newVoucher }, { call }) {
      const data = yield call(voucherService.createApply, newVoucher);
      if (data || data.success) {
        Util.consoleLog(data);
        Actions.pop();
        Toast.info('您已成功提交申请。', 1);
        // alert('', '您已成功提交申请。', [{ text: '确定', onPress: () => { Actions.pop(); } }]);
      } else {
        Toast.fail('提交申请失败。', 1);
        // alert('', '提交申请失败', [{ text: '确定', onPress: () => {} }]);
      }
    },
    * transferVouchers(action, { call }) {
      const data = yield call(voucherService.transferVouchers, this.selectedVouchers );
      if (data || data.success) {
        Util.consoleLog(data);
        Actions.pop();
        Toast.info('转赠成功', 1);
        // alert('', '您已成功提交申请。', [{ text: '确定', onPress: () => { Actions.pop(); } }]);
      } else {
        // Toast.fail('转赠失败', 1);
        alert('', '提交申请失败', [{ text: '确定', onPress: () => {} }]);
      }
    },

  },
  reducers: {
    updateVoucherList(state, { listData }) {
      const ListData = listData;

      if (ListData && ListData.length > 0) {
        ListData.forEach((data) => {
          data.startTime = voucherService.formateDateString(new Date(data.startTime));
          data.endTime = voucherService.formateDateString(new Date(data.endTime));
        });
      }

      return { ...state, voucherList: listData };
    },
    updateAvaliableVouchers(state, { data }) {
      Util.consoleLog(data);
      const avaliableVouchers = data.vourcherTypes;
      avaliableVouchers.map((item) => {
        item.label = item.type;
        item.value = item.typeCode;//可能需要改字段
      });
      return { ...state, avaliableVouchers };
    },
    mapAvaliableVouchers(state, { data }) {
      const avaliableVouchers = data.vourcherTypes;
      const avaliableVoucherTypeRel = {};
      if (avaliableVouchers) {
        avaliableVouchers.map((item) => {
          const typeCode = item.typeCode;
          avaliableVoucherTypeRel[typeCode] = item;
        });
      }
      return { ...state, avaliableVoucherTypeRel };
    },
    setVoucherApplyCount(state, { count }) {
      return { ...state, voucherApplyCount: count };
    },
    setSelectedCheckbox(state, { newState }) {
      return { ...state, selectedVouchers: newState };
    },
    resetSelectedCheckbox(state) {
      return { ...state,
        // voucherList: [],
        voucherApplyCount: undefined,
        selectedVouchers: [],
        transferAccount: undefined,
        avaliableVouchers: [],
        applyVoucherType: [],
        avaliableVoucherAmounts: [],
        applyVoucherAmount: [],
        avaliableVoucherTypeRel: {},
        avaliableVoucherAmountRel: {} };
    },
    setVoucherTransferAccount(state, { account }) {
      return { ...state, transferAccount: account };
    },
    updateApplyVoucherType(state, { typeCode }) {
      return { ...state, applyVoucherType: typeCode };
    },
    updateAvaliableoucherAmount(state, { voucherType }) {
      const { avaliableVoucherTypeRel } = state;
      let amounts = [];
      let amountRel = {};
      if (voucherType && voucherType.length === 1){
        const mapArr = avaliableVoucherTypeRel[voucherType[0]];
        mapArr.vourchers.map((item) => {
          const formattedData = {
            value: item.code,
            count: item.count,
            label: item.value,
          }
          amountRel[item.code] = formattedData;
          amounts.push(formattedData);
        });
      }

      return { ...state, avaliableVoucherAmounts: amounts, avaliableVoucherAmountRel: amountRel };

      // const avaliables = state.avaliableVouchers;
      // let amounts = [];
      // if (avaliables) {
      //   avaliables.map((item) => {
      //     if (item.typeCode === voucherType[0]) {
      //       item.vourchers.map((each) => {
      //         amounts.push({
      //           value: each.code,
      //           count: each.count,
      //           label: each.value,
      //         });
      //       });
      //       //amounts = item.vourchers;
      //     }
      //   });
      // }
      // return { ...state, avaliableVoucherAmounts: amounts };
    },
    updateAvpplyVoucherAmount(state, { voucherAmount }) {
      return { ...state, applyVoucherAmount: voucherAmount };
    },

  },
};

