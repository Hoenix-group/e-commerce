import { Toast } from 'antd-mobile';
import { Actions } from 'react-native-router-flux';
import * as approvalService from '../../services/approvalService';

export default {
  namespace: 'approval',
  state: {
    approvalList: [],
  },
  effects: {
    * fetchApprovalList(action, { call, put }) {
      const result = yield call(approvalService.getApprovalList);
      if (result && result.needApproveApplys) {
        console.log(result.needApproveApplys);
        yield put({ type: 'updateApprovalList', approvalList: result.needApproveApplys });
      } else {
        Toast.fail('获取审批列表失败', 1);
      }
    },
    * updateApproval({ approve, applyId }, { call, put }) {
      const result = yield call(approvalService.updateApproval, { approve, applyId });
      if (result.success) {
        Actions.pop();
        yield put({ type: 'fetchApprovalList' });
        Toast.info('更新审批成功', 1);
      } else {
        Toast.fail('更新审批失败', 1);
      }
    },

  },
  reducers: {
    updateApprovalList(state, { approvalList }) {
      return { ...state, approvalList };
    },

  },
};

