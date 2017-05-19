import * as userService from '../../services/userService';
import * as taskScheduler from '../../utils/taskScheduler';


const initializeState = {
  profile: {
    name: '张五星',
    photo: 'https://camo.githubusercontent.com/7c73f8cfbb808b9a451dac7d9ff5cbc2b4883419/68747470733a2f2f7a6f732e616c697061796f626a656374732e636f6d2f726d73706f7274616c2f70736167534356484f4b515671714e6a6a4d64662e6a7067',
  },
  fontSize: 'NORMAL',
  wifiLoading: true,
  version: 'V0.0.1',
};

export default {
  namespace: 'preference',
  state: initializeState,
  effects: {
    * logout(action, { call }) {
      yield call(taskScheduler.stopLogoutTask);
      yield call(userService.logout);
    },
  },
  reducers: {
    setWIFILoading(state, { wifiLoading }) {
      return { ...state, wifiLoading };
    },
    setFontSize(state, { fontSize }) {
      return { ...state, fontSize };
    },
    initializeState() {
      return initializeState;
    },
  },
};
