
const initializeState = {
  inputValue: '',
  dataSource: null,
};

export default {
  namespace: 'region',
  state: initializeState,
  effects: {
  },
  reducers: {
    updateSearch(state, { inputValue, dataSource }) {
      return { ...state, inputValue, dataSource };
    },
    initializeState() {
      return initializeState;
    },
  },
};
