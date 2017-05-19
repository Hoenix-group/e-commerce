// import { Actions } from 'react-native-router-flux';
import moment from 'moment';
import * as securedRestClient from '../utils/securedRestClient';
import * as storage from '../utils/globalStorage';
import Util from './../utils/utils';

export async function getVoucherList() {
  try {
    const loginData = await storage.getCurrentLogin();
    const loginID = loginData.loginId;
    const channel = await storage.getCurrentChannel();
    const region = await storage.getCurrentRegionId();
    //"vouchers/getMemeberVoucher?userId=&status=&region={regionId}&system=B2C&channel="
    //const url2 = `/messages?receiver=${loginID}`;
    const url = `/vouchers/getMemeberVoucher?userId=${loginID}&status=0&region=${region}&system=TSK&channel=03`;
    const { data } = await securedRestClient.get(url, {});
    return data;
  } catch (err) {
    Util.consoleLog(`错误信息${err}`);
  }
  return {};
}

export async function getAvaliableVouchers() {
  try {
    const loginData = await storage.getCurrentLogin();
    const { pointOfServiceCode } = loginData;
    // const pointOfServiceId = 'POS1001-01';
    const url = `/vouchers/voucherTypes/${pointOfServiceCode}`;
    const { data } = await securedRestClient.get(url, {});
    return data;
  } catch (err) {
    Util.consoleLog(`错误信息${err}`);
  }
  return {};
}

export async function createApply(newVoucher) {
  try {
    const loginData = await storage.getCurrentLogin();
    const { pointOfServiceCode, loginId } = loginData;
    newVoucher.applicantId = loginId;
    // newVoucher.pointOfServiceId = 'POS1001-01';
    newVoucher.pointOfServiceId = pointOfServiceCode;
    const url = `/vouchers/createApply`;
    const opt = { body: newVoucher, isJson: true };
    const { data } = await securedRestClient.post(url, opt);
    return data;
  } catch (error) {
    Util.consoleLog('提交申请失败->', error);
    return false;
  }
}

export function formateDateString(date) {
  if (isNaN(date.getTime())) {
    return '';
  }
  return moment(date).utcOffset(8).format('YYYY.MM.DD');
}

export async function transferVouchers(voucherCode, transferID) {
  try {
    const loginData = await storage.getCurrentLogin();
    const { loginId } = loginData;
    const region = await storage.getCurrentRegionId();
    // const pointOfServiceId = 'POS1001-01';
    const url = `/vouchers/${voucherCode}/users/${loginId}/transfer?employee=${transferID}&region=${region}&system=TSK&channel=03`;
    const { data } = await securedRestClient.put(url, {});
    return data;
  } catch (err) {
    Util.consoleLog(`错误信息${err}`);
  }
  return {};
}

