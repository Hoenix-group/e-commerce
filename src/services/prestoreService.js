import * as securedRestClient from '../utils/securedRestClient';
import * as storage from '../utils/globalStorage';
import { TSK_CHANNEL } from '../utils/configuration';
import Util from './../utils/utils';

export async function getPrestoreList({ pageSize, currentPage }) {
  try {
    const employeeId = await storage.getCurrentEmployeeId();
    const pageSizeParm = pageSize ? `&pageSize=${pageSize}` : '';
    const currentPageParm = currentPage === undefined ? '' : `&currentPage=${currentPage}`;
    const url = `/prestores/search?employeeId=${employeeId}${pageSizeParm}${currentPageParm}`;
    const { data } = await securedRestClient.get(url, {});
    return data;
  } catch (err) {
    Util.consoleLog(`错误信息${err}`);
    return err.data;
  }
}

export async function getPrestoreDetail(code) {
  try {
    const url = `/prestores/${code}`;
    const { data } = await securedRestClient.get(url, {});
    return data;
  } catch (err) {
    Util.consoleLog(`错误信息${err}`);
    return err.data;
  }
}

export async function getPinForPrestore(phoneNumber) {
  try {
    const url = '/promotionPin/getPrestorePIN';
    const opt = {
      body: {
        phoneNumber: phoneNumber.replace(/\s/ig, ''),
      },
    };
    const { data } = await securedRestClient.post(url, opt);
    return data;
  } catch (err) {
    Util.consoleLog(`错误信息${err}`);
    return err.data;
  }
}

export async function validatePinForPrestore({ pin, phoneNumber }) {
  try {
    const url = '/promotionPin/prestoreValidate';
    const opt = {
      body: {
        pin,
        phoneNumber: phoneNumber.replace(/\s/ig, ''),
      },
    };
    const { data } = await securedRestClient.post(url, opt);
    return data;
  } catch (err) {
    Util.consoleLog(`错误信息${err}`);
    return err.data;
  }
}

export async function prestore4user({ userId, code }) {
  try {
    const url = `/users/${userId}/prestore4user`;
    const { erpCabinetCode, pointOfServiceCode } = await storage.getCurrentLogin();
    const employee = await storage.getCurrentEmployeeId();
    const opt = {
      body: {
        code,
        employee,
        posCode: pointOfServiceCode,
        salesGrpCode: erpCabinetCode,
      },
    };
    const { data } = await securedRestClient.post(url, opt);
    return data;
  } catch (err) {
    Util.consoleLog(`错误信息${err}`);
    return err.data;
  }
}

export async function fetchCustomerList({ code, currentPage, pageSize }) {
  try {
    const currentPageParm = currentPage === undefined ? '' : `&currentPage=${currentPage}`;
    // const pageSizeParm = pageSize ? `&pageSize=${pageSize}` : '';
    const url = `/prestores/${code}/users?pageSize=${pageSize}${currentPageParm}`;
    const { data } = await securedRestClient.get(url, {});
    return data;
  } catch (err) {
    Util.consoleLog(`错误信息${err}`);
    return err.data;
  }
}

export async function fetchPrestoreListForEmployee({ filterParms, currentPage, pageSize }) {
  try {
    const employeeId = await storage.getCurrentEmployeeId();
    // const storeIdParm = storeId ? `&storeId=${storeId}` : '';
    // const statusPram = status ? `&status=${status}` : '';
    // const sortParm = sort ? `&sort=${sort}` : '';
    const filterParmStr = filterParms.map(data => (data.value && data.value !== '' ? `&${data.name}=${data.value}` : '')).join('');
    const pageParm = currentPage !== undefined ? `&currentPage=${currentPage}` : '';
    const pageSizeParm = pageSize ? `&pageSize=${pageSize}` : '';
    const url = `/prestores/searchByEmployee?employeeId=${employeeId}${pageParm}${pageSizeParm}${filterParmStr}`;
    const { data } = await securedRestClient.get(url, {});
    return data;
  } catch (err) {
    Util.consoleLog(`错误信息${err}`);
    return err.data;
  }
}

export async function fetchPrestoreDetailForEmployee(orderCode) {
  try {
    const employeeId = await storage.getCurrentEmployeeId();
    const url = `/prestores/searchByEmployee?employeeId=${employeeId}&orderCode=${orderCode}&fields=FULL`;
    const { data } = await securedRestClient.get(url, {});
    return data;
  } catch (err) {
    Util.consoleLog(`错误信息${err}`);
    return err.data;
  }
}

export async function saveMockedOffLineCart(userId) {
  const result = await storage.setCurrentCart({
    customerId: userId,
    channel: TSK_CHANNEL,
  });
  Util.consoleLog('saveMockedOffLineCart', result);
  return result;
}

export async function changeOrderPaymentStateToPaied({ userId, orderCode }) {
  try {
    const url = `/users/${userId}/orders/${orderCode}/paymentinfo`;
    // const employeeId = await storage.getCurrentEmployeeId();
    const opt = {
      body: {
        paymentStatus: 'PAID',
      },
      isJson: true,
    };
    const { data } = await securedRestClient.put(url, opt);
    return data;
  } catch (err) {
    Util.consoleLog(`错误信息${err}`);
    return err.data;
  }
}
