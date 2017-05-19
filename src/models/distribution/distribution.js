import { Toast } from 'antd-mobile';
import * as dService from '../../services/distributionService';

export default{
  namespace: 'distribution',
  state: {

  },
  effects: {
    // 购物车中设置商品行的自提门店,place={pickupPlace}
    * setEntryPickupPlaceInCart({ entryNum, place, cb }, { call }) {
      const data = yield call(dService.setEntryPickupPlaceInCart, entryNum, place);
      if (data) {
        cb();
      } else {
        Toast.fail('设置自提门店失败');
      }
    },
  },
  reducers: {
    initDistribution(state, { consignments, orderCode, regionCode, totalFee, created, allDis, allIns }) {
      return { ...state, consignments, orderCode, regionCode, totalFee, created, allDis, allIns };
    },
    updateAllDis(state, { conId }) {
      const { allDis } = state;
      allDis.map((con) => {
        if (con.conId === conId) {
          con.dated = true;
        }
      });
      return { ...state, allDis };
    },
    updateAllIns(state, { conId }) {
      const { allIns } = state;
      allIns.map((con) => {
        if (con.conId === conId) {
          con.dated = true;
        }
      });
      return { ...state, allIns };
    },
    updateDistribution(state, { code, date, time }) {
      const { consignments } = state;
      consignments.map((con) => {
        if (con.code === code) {
          con.disDate = date;
          con.disTime = time;
        }
      });
      return { ...state, consignments };
    },
    updateInstall(state, { code, date, time }) {
      const { consignments } = state;
      consignments.map((con) => {
        if (con.code === code) {
          con.insDate = date;
          con.insTime = time;
        }
      });
      return { ...state, consignments };
    },
  },
};
