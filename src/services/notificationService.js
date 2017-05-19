// import { Actions } from 'react-native-router-flux';
import moment from 'moment';
import * as securedRestClient from '../utils/securedRestClient';
import * as storage from '../utils/globalStorage';
import Util from './../utils/utils';

export function formateDateString(date) {
  if (isNaN(date.getTime())) {
    return '';
  }
  return moment(date).utcOffset(8).format('L');
}

export async function getNotificationList() {
  try {
    const loginData = await storage.getCurrentLogin();
    const loginID = loginData.loginId;
    const url = `/messages/user/${loginID}`;
    const { data } = await securedRestClient.get(url, {});
    return data;
  } catch (err) {
    Util.consoleLog(`错误信息${err}`);
  }
  return {};
}

export async function deleteNotification(messageCode) {
  try {
    const url = `/messages/${messageCode}`;
   // const url = '/messages?receiver=' + logindata.loginId; // ${userId}';
    const response = await securedRestClient.remove(url);
    return response;
  } catch (err) {
    Util.consoleLog(`错误信息${err}`);
  }
  return {};
}

