import { Toast } from 'antd-mobile';
import * as notificationService from '../../services/notificationService';
import Util from './../../utils/utils';

export default {
  namespace: 'notification',
  state: {
    // notificationList: [],
  },
  effects: {
    * fetchNotificationList(action, { call, put }) {
      const notificationList = yield call(notificationService.getNotificationList);
      if ((notificationList.company && notificationList.company.length > 0) || (notificationList.system && notificationList.system.length > 0)) {
        const system = notificationList.system;
        const company = notificationList.company;
        Util.consoleLog(system);
        yield put({ type: 'updateNotificationList', systemList: system, companyList: company });
      } else {
        Toast.fail('获取消息列表失败', 1);
      }
    },
    * removeNotification({ messageCode }, { call, put }) {
      const result = yield call(notificationService.deleteNotification, messageCode);
      if (result.data.success) {
        //const data = yield put({ type: 'Search/wishlist', productCode });
        // Util.consoleLog('收藏列表返回值', data);
        Toast.success('删除消息成功', 1);
        yield put({ type: 'fetchNotificationList' });
        // Util.consoleLog('productCode>>>>', productCode);
      } else {
        Toast.success('删除消息失败', 1);
      }
    },

  },
  reducers: {
    updateNotificationList(state, { systemList, companyList }) {
      // notificationList.map((data) => {
      //   data.startTime = notificationService.formateDateString(new Date(data.startTime));
      //   data.endTime = notificationService.formateDateString(new Date(data.endTime));
      //   return data;
      // });
      Util.consoleLog(systemList);
      return { ...state, systemList, companyList };
    },

  },
};

