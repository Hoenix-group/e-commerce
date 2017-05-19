import BackgroundTimer from 'react-native-background-timer';
import * as userService from '../services/userService';

const taskMap = {
  LOGOUT: {
    interval: 15 * 60 * 1000,
    timer: null,
  },
};

export const stopLogoutTask = () => {
  const logoutObj = taskMap.LOGOUT;

  console.debug('scheduleLogout, existing timer: ', logoutObj.timer);
  if (logoutObj.timer) {
    console.debug('scheduleLogout, clearing timer: ', logoutObj.timer);
    BackgroundTimer.clearTimeout(logoutObj.timer);
    logoutObj.timer = null;
  }
};

export const scheduleLogout = () => {
  stopLogoutTask();

  const logoutObj = taskMap.LOGOUT;
  logoutObj.timer = BackgroundTimer.setTimeout(
      async () => {
        console.debug('scheduleLogout, timeout timer: ', logoutObj.timer);
        await userService.logout();
      },
      logoutObj.interval,
    );
};

export const scheduleTask = (callback, inverval) => {
  BackgroundTimer.setTimeout(
      () => {
        callback();
      },
      inverval,
  );
};
