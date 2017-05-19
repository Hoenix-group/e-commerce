import { Toast } from 'antd-mobile';
import { Actions } from 'react-native-router-flux';
import * as dService from '../../services/distributionService';
import Util from '../../utils/utils';

export default {
  namespace: 'dateList',
  state: {
    availableDates: [],
  },
  effects: {
    * getDeliveryAndInstallDates({ productCode, regionCode, number, dateType }, { call, put }) {
      const data = yield call(dService.getDeliveryAndInstallDates, productCode, regionCode, number, dateType);
      if (data) {
        yield put({ type: 'updateAvailableDates', availableDates: data.fsTimeOfAppointmentList || [] });
      } else {
        Toast.fail('获取配送安装时间失败');
      }
    },
    // 修改订单行项目配送信息
    * changeEntryDistributionTime({ entryNumber, conCode, distributionDate, distributionTime }, { call, put }) {
      const data = yield call(dService.changeEntryDistributionTime, entryNumber, conCode, distributionDate, distributionTime);
      if (data) {
        Util.consoleLog(data);
        yield put({ type: 'distribution/updateAllDis', conId: conCode });
        yield put({ type: 'distribution/updateDistribution', code: conCode, date: distributionDate, time: distributionTime })
        Actions.distribution();
      } else {
        Toast.fail('设置配送时间失败');
      }
    },
    // 修改订单行项目安装信息
    * changeEntryInstallTime({ entryNumber, conCode, installDate, installTime }, { call, put }) {
      const data = yield call(dService.changeEntryInstallTime, entryNumber, conCode, installDate, installTime);
      if (data) {
        Util.consoleLog(data);
        yield put({ type: 'distribution/updateAllIns', conId: conCode });
        yield put({ type: 'distribution/updateInstall', code: conCode, date: installDate, time: installTime})
        Actions.distribution();
      } else {
        Toast.fail('设置安装时间失败');
      }
    },
  },
  reducers: {
    init(state, { entryNumber, productCode, regionCode, number, dateType, conCode }) {
      return { ...state, entryNumber, productCode, regionCode, number, dateType, conCode };
    },
    updateAvailableDates(state, { availableDates }) {
      return { ...state, availableDates };
    },
  },
};
