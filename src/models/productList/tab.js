/**
 * Created by F162228 on 2017/1/20.
 */
export default {
  namespace: 'ProductListTabs',
  state: {
    tabsNum: 1,
  },
  reducers: {
    changeType(state, action) {
      return { ...state, tabsNum: action.tabsNum };
    },
    cleanType(state) {
      return { ...state, tabsNum: 1 };
    },
  },
};
