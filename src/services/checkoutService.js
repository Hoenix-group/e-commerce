import * as securedRestClient from '../utils/securedRestClient';
import * as storage from '../utils/globalStorage';
import Util from '../utils/utils';

/**
 * retrieve cart entries for order page
 */
export const retrieveCart = async () => {
  try {
    const employeeId = await storage.getCurrentEmployeeId();
    const { cartId, customerId, channel } = await storage.getCurrentCart();
    const region = await storage.getCurrentRegionId();
    return await securedRestClient.get(`/users/${customerId}/carts/${cartId}`, {
      params: {
        channel,
        region,
        employee: employeeId,
        fields: 'FULL',
      },
    });
  } catch (error) {
    return await storage.getCurrentCart();
  }
};


export const checkout = async () => {
  try {
    const employeeId = await storage.getCurrentEmployeeId();
    const { cartId, customerId, channel } = await storage.getCurrentCart();
    const region = await storage.getCurrentRegionId();
    const url = `/users/${customerId}/carts/${cartId}/checkout?channel=${channel}&region=${region}&employee=${employeeId}`;
    return await securedRestClient.get(url);
  } catch (err) {
    return {};
  }
};


export const placeOrder = async () => {
  try {
    const { employeeId, erpCabinetCode, pointOfServiceCode } = await storage.getCurrentLogin();
    const { cartId, customerId, channel } = await storage.getCurrentCart();
    const region = await storage.getCurrentRegionId();
    const ops = {
      body: {
        channel,
        cartId,
        employee: employeeId,
        fields: 'FULL',
        posCode: pointOfServiceCode,
        salesGrpCode: erpCabinetCode,
        region,
      },
    };
    return await securedRestClient.post(`/users/${customerId}/orders`, ops);
  } catch (error) {
    return { error };
  }
};

export const changeDeliveryMode = async (entryNumber, deliveryMode) => {
  try {
    const region = await storage.getCurrentRegionId();
    const { cartId, customerId, channel } = await storage.getCurrentCart();
    const ops = { params: { deliveryMode, region, channel } };
    const url = `/users/${customerId}/carts/${cartId}/entries/${entryNumber}/deliveryModes`;
    const data = await securedRestClient.put(url, ops);
    return data;
  } catch (error) {
    Util.consoleLog(error);
    return false;
  }
};

export const fetchVouchers = async () => {
  try {
    const region = await storage.getCurrentRegionId();
    const { cartId, customerId, channel } = await storage.getCurrentCart();
    const url = `/users/${customerId}/carts/${cartId}/fsvouchers?region=${region}&channel=${channel}`;
    const data = await securedRestClient.get(url);
    return data;
  } catch (error) {
    Util.consoleLog(error);
    return false;
  }
};

export const useOrCancelVouchers = async (code, isUse, value) => {
  try {
    const region = await storage.getCurrentRegionId();
    const { cartId, customerId, channel } = await storage.getCurrentCart();
    const url = `/users/${customerId}/carts/${cartId}/fsvouchers/${code}?region=${region}&channel=${channel}`;
    const ops = { body: { value } };
    const data = isUse ? await securedRestClient.post(url, ops) : await securedRestClient.remove(url);
    return data;
  } catch (error) {
    Util.consoleLog(error);
    return false;
  }
};

export const usePoint = async (point) => {
  try {
    const region = await storage.getCurrentRegionId();
    const { cartId, customerId, channel } = await storage.getCurrentCart();
    const ops = { params: { point, region, channel } };
    const url = `/users/${customerId}/carts/${cartId}/redeemPoint`;
    const data = await securedRestClient.post(url, ops);
    return data;
  } catch (error) {
    Util.consoleLog(error);
    return false;
  }
};

export async function addGift(entryNumber, ruleCode, gifts) {
  try {
    const array = gifts.map((item) => { return `"${item.code}":${item.qty}`; });
    const string = `{${array.join(',')}}`;
    const bodyContent = JSON.parse(string);

    const employee = await storage.getCurrentEmployeeId();
    const { cartId, customerId, channel, areaCode } = await storage.getCurrentCart();
    return await securedRestClient.put(`/users/${customerId}/carts/${cartId}/gifts`, {
      params: {
        entryNumber: entryNumber || '',
        promotionSourceRuleCode: ruleCode,
        channel,
        region: areaCode,
        employee,
      },
      body: bodyContent,
      isJson: true,
    });
  } catch (err) {
    return {};
  }
}
