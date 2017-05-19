import { Toast } from 'antd-mobile';
import { Actions } from 'react-native-router-flux';
import * as userService from '../../services/userService';
import * as storage from '../../utils/globalStorage';

const initializeState = {
  userName: '',
  password: '',
  remember: false,
  inputEditable: true,
  disabled: false,
  showtext: '登录',
  loading: false,
  region: {},
};

export default {
  namespace: 'login',
  state: initializeState,
  effects: {
    * loadLoginInfo(action, { call, put }) {
      const userName = yield call(storage.getCurrentEmployeeLoginId);
      const password = yield call(storage.getCurrentEmployeePwd);
      const preference = yield call(storage.getPreference);

      yield put({ type: 'setLoginInfo', userName, password, remember: preference ? preference.remember : false });
    },
    * fetchUser({ userName: name, password: pwd, remember }, { call, put }) {
      yield put({ type: 'loading', showtext: '登录中...', inputEditable: false });
      const data = yield call(userService.login, name, pwd, remember);
      if (data) {
        const { data: userDetails } = yield call(userService.getEmployeeDetails);
        if (userDetails) {
          const loginData = yield call(storage.getCurrentLogin);
          yield call(storage.setCurrentLogin, { ...loginData, employeeId: userDetails.id, erpCabinetCode: userDetails.erpCabinetCode, pointOfServiceCode: userDetails.pointOfServiceCode, region: userDetails.cityCode });

          const defaultRegion = {
            value: userDetails.cityCode || '320100000000',
            label: userDetails.city || '南京市',
            parent: userDetails.provinceCode || '320000000000',
          };
          const region = {
            default: defaultRegion,
            current: defaultRegion,
          };

          yield put({ type: 'updateCurrentRegion', region });

          Actions.home();
        } else {
          Toast.fail('获取账户信息失败', 1);
        }
      } else {
        Toast.fail('登录失败', 1);
      }

      yield put({ type: 'loading', showtext: '登录', inputEditable: true });
    },
    * updateRemember({ remember }, { call, put }) {
      yield call(storage.setPreference, { remember });
      yield put({ type: 'setRemember', remember });
    },
    * updateCurrentRegion({ region }, { call, put }) {
      yield call(storage.setCurrentRegion, region);
      yield put({ type: 'setRegion', region });
    },
  },
  reducers: {
    loading(state, { showtext, inputEditable }) {
      return { ...state, showtext, inputEditable };
    },

    changeUserName(state, { userName: name }) {
      return { ...state, userName: name, disabled: name === '' || state.password === '' };
    },

    changePassword(state, { password: pwd }) {
      return { ...state, password: pwd, disabled: pwd === '' || state.userName === '' };
    },

    setLoginInfo(state, { userName, password, remember }) {
      return { ...state, userName, password, remember };
    },

    setRemember(state, { remember }) {
      return { ...state, remember };
    },

    setRegion(state, { region }) {
      return { ...state, region };
    },

    initializeState() {
      return initializeState;
    },
  },
};
