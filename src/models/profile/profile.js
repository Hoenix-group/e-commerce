import { Toast } from 'antd-mobile';
import * as userService from '../../services/userService';

const initializeState = {
  profile: {},
  oldPassword: '',
  newPassword: '',
  newPasswordConfirmation: '',
};

export default {
  namespace: 'profile',
  state: initializeState,
  effects: {
    * loadProfile(action, { call, put }) {
      const { data } = yield call(userService.getEmployeeDetails);
      if (data) {
        yield put({ type: 'setProfile', profile: data });
      }
    },
    * changePassword({ oldPassword, newPassword }, { call }) {
      const data = yield call(userService.changeEmployeePassword, oldPassword, newPassword);
      if (data) {
        Toast.success('修改密码成功');
      } else {
        Toast.fail('修改密码失败', 1);
      }
    },
  },
  reducers: {
    setProfile(state, { profile }) {
      return { ...state, profile };
    },
    setOldPassword(state, { oldPassword }) {
      return { ...state, oldPassword };
    },
    setNewPassword(state, { newPassword }) {
      return { ...state, newPassword };
    },
    setNewPasswordConfirmation(state, { newPasswordConfirmation }) {
      return { ...state, newPasswordConfirmation };
    },
    initializeState() {
      return initializeState;
    },
  },
};
