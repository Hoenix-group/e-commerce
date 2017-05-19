import * as config from '../../utils/configuration';

export default {
  namespace: 'smsPinGetter',
  state: {
    seconds: config.DEFAULT_SECOUNDS,
    disabled: false,
    countStartTick: 0,
    timerCode: -1,
  },
  effects: {
  },
  reducers: {
    resetButtonState(state) {
      clearInterval(state.timerCode);
      return { ...state, seconds: config.DEFAULT_SECOUNDS, disabled: false, countStartTick: 0, timerCode: -1 };
    },

    setTimerCode(state, { timerCode }) {
      return { ...state, timerCode, countStartTick: Date.now(), disabled: true };
    },

    updateSeconds(state, { seconds }) {
      let stopTag = false;
      const now = Date.now();
      let tempSeconds = seconds;
      if (now - state.countStartTick > ((config.DEFAULT_SECOUNDS - seconds) + 1) * 1000) {
        tempSeconds = config.DEFAULT_SECOUNDS - Math.ceil((now - state.countStartTick) / 1000);
      }
      if (tempSeconds <= 0) {
        clearInterval(state.timerCode);
        stopTag = true;
      }
      return {
        ...state,
        seconds: stopTag ? config.DEFAULT_SECOUNDS : tempSeconds,
        disabled: !stopTag,
        timerCode: stopTag ? -1 : state.timerCode,
      };
    },
  },
};
