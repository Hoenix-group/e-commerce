import moment from 'moment';
import * as securedRestClient from '../utils/securedRestClient';
import * as storage from '../utils/globalStorage';
import * as config from '../utils/configuration';
import Util from './../utils/utils';

export function formateDateString(date) {
  if (isNaN(date.getTime())) {
    return '';
  }
  return moment(date).utcOffset(8).format('L');
}

export async function getAppointmentsList({ currentPage, pageSize }) {
  try {
    const employeeId = await storage.getCurrentEmployeeId();
    const currentPageParm = currentPage === undefined ? '' : `&currentPage=${currentPage}`;
    const pageSizeParm = pageSize ? `&pageSize=${pageSize}` : '';
    const url = `/reservations/search?employeeId=${employeeId}${currentPageParm}${pageSizeParm}`;
    const { data } = await securedRestClient.get(url, {});
    return data;
  } catch (err) {
    Util.consoleLog(`错误信息${err}`);
  }
  return {};
}

export async function getAppointmentDetail({ code }) {
  try {
    const url = `/reservations/${code}`;
    const { data } = await securedRestClient.get(url, {});
    data.activityStartTime = formateDateString(new Date(data.activityStartTime));
    data.activityEndTime = formateDateString(new Date(data.activityEndTime));
    data.startTime = formateDateString(new Date(data.startTime));
    data.endTime = formateDateString(new Date(data.endTime));
    const getReleTime = (date) => {
      if (isNaN(date.getTime())) {
        return '';
      }
      return moment(date).utcOffset(8).format('MMMDo hh:mm');
    };
    data.releTime = getReleTime(new Date(data.startTime));
    return data;
  } catch (err) {
    Util.consoleLog(`错误信息${err}`);
  }
  return {};
}

export async function checkPhoneNumber(phoneNumber) {
  if (phoneNumber === undefined) {
    return false;
  }
  return true;
}

export async function reserveAppointment4Customer({ code, customerName, phoneNumber, date }) {
  try {
    // const employeeId = await storage.getCurrentEmployeeId();
    const { employeeId, erpCabinetCode, pointOfServiceCode } = await storage.getCurrentLogin();
    Util.consoleLog(code);
    const url = '/reservations/reserve4user';
    // Util.consoleLog(url);
    const opt = {
      body: {
        code,
        employeeId,
        phoneNumber: phoneNumber.replace(/\s/ig, ''),
        userName: customerName,
        date,
        posCode: pointOfServiceCode,
        salesGrpCode: erpCabinetCode,
      },
      isJson: true,
    };
    const { data } = await securedRestClient.post(url, opt);
    return data;
  } catch (err) {
    const errors = err.data.errors;
    let tag = false;
    errors.forEach((error) => {
      tag = tag || error.message.includes('The User already had the Reservation');
    });
    Util.consoleLog(err.data.errors);
    return tag ? { alreadyReserved: true } : err.data;
  }
}

export async function getAppointmentCustomers({ code, currentPage, pageSize }) {
  try {
    const currentPageParm = currentPage === undefined ? '' : `&currentPage=${currentPage}`;
    const url = `/reservations/${code}/users?pageSize=${pageSize}${currentPageParm}`;
    const { data } = await securedRestClient.get(url, {});
    return data;
  } catch (err) {
    Util.consoleLog(`错误信息${err}`);
  }
  return {};
}

export async function getAppointmentList4Employee({ currentPage, pageSize, filterParms }) {
  try {
    const employeeId = await storage.getCurrentEmployeeId();
    const filterParmStr = filterParms.map(data => (data.value && data.value !== '' ? `&${data.name}=${data.value}` : '')).join('');
    // const storeNameStr = storeName ? `&storeName=${storeName}` : '';
    // const statusStr = status ? `&status=${status}` : '';
    // const sortStr = sort ? `&sort=${sort}` : '';
    const currentPageParm = currentPage === undefined ? '' : `&currentPage=${currentPage}`;
    const pageSizeParm = pageSize ? `&pageSize=${pageSize}` : '';
    const url = `/reservations/searchByEmployee?employeeId=${employeeId}${currentPageParm}${pageSizeParm}${filterParmStr}`;
    const { data } = await securedRestClient.get(url, {});
    return data;
  } catch (err) {
    Util.consoleLog(`错误信息${err}`);
    return err.data;
  }
}

export async function getAppointmentDetail4Employee(code) {
  try {
    const url = `/reservations/searchFSReservation/${code}`;
    const { data } = await securedRestClient.get(url, {});
    return data;
  } catch (err) {
    Util.consoleLog(`错误信息${err}`);
    return err.data;
  }
}

export async function getPinForAddCustomer(phoneNumber) {
  try {
    const url = '/promotionPin/getReservationPIN';
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

export async function validatePinForAddCustomer({ pin, phoneNumber }) {
  try {
    const url = '/promotionPin/reservationValidate';
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

export async function updateAppointmentStatus({ code, status }) {
  try {
    const url = `/reservations/searchFSReservation/${code}/status?reservationStatus=${status}`;
    const { data } = await securedRestClient.put(url, {});
    return data;
  } catch (err) {
    Util.consoleLog(`错误信息${err}`);
    return err.data;
  }
}

export async function signin(code, address) {
  try {
    const employeeId = await storage.getCurrentEmployeeId();
    return await securedRestClient.post(`/reservations/${code}/signin/${employeeId}`, {
      body: {
        id: address.id,
        name: address.name,
        provinceName: address.pname,
        cityName: address.cityname,
        addressName: address.adname,
        address: address.address,
      },
      isJson: true,
    });
  } catch (err) {
    return {};
  }
}

export async function signinLog(code, pageSize, currentPage) {
  try {
    const employeeId = await storage.getCurrentEmployeeId();
    return await securedRestClient.get(`/reservations/${code}/signinLog/${employeeId}`, {
      params: {
        pageSize,
        currentPage,
      },
    });
  } catch (err) {
    return {};
  }
}
