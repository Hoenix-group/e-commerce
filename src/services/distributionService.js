import * as securedRestClient from '../utils/securedRestClient';
import * as storage from '../utils/globalStorage';
import Util from '../utils/utils';

export async function getSelfPickupAdds(entryNumber) {
  try {
    const { customerId, cartId, channel } = await storage.getCurrentCart();
    const region = await storage.getCurrentRegionId();
    const url = `/users/${customerId}/carts/${cartId}/entries/${entryNumber}/selfPickup?region=${region}&channel=${channel}`;
    const { data } = await securedRestClient.get(url, {});
    return data;
  } catch (error) {
    Util.consoleLog(error);
    return false;
  }
}

export async function getDeliveryAndInstallDates(productCode, regionCode, number, dateType) {
  try {
    const { channel } = await storage.getCurrentCart();
    const region = await storage.getCurrentRegionId();
    const url = `/products/${productCode}/regions/${regionCode}?number=${number}&type=${dateType}&region=${region}&channel=${channel}`;
    const { data } = await securedRestClient.get(url, {});
    return data;
  } catch (error) {
    Util.consoleLog(error);
    return false;
  }
}

// 购物车中设置商品行的自提门店
export async function setEntryPickupPlaceInCart(entryNum, pickupPlace) {
  try {
    const { customerId, cartId, channel } = await storage.getCurrentCart();
    const employeeId = await storage.getCurrentEmployeeId();
    const region = await storage.getCurrentRegionId();
    const ops = { params: { pickupPlace, region, employee: employeeId, channel } };
    const url = `/users/${customerId}/carts/${cartId}/entries/${entryNum}/pickupPlace`;
    const { data } = await securedRestClient.put(url, ops);
    return data;
  } catch (error) {
    Util.consoleLog(error);
    return false;
  }
}

// 修改订单行项目配送信息
export async function changeEntryDistributionTime(entryNum, conCode, distributionDate, distributionTime) {
  try {
    const employeeId = await storage.getCurrentEmployeeId();
    const { customerId, channel } = await storage.getCurrentCart();
    const region = await storage.getCurrentRegionId();
    const url = `/users/${customerId}/orders/${conCode}/entries/${entryNum}/distribution`;
    const ops = { params: { distributionDate, distributionTime, region, employee: employeeId, channel } };
    const { data } = await securedRestClient.put(url, ops);
    return data;
  } catch (error) {
    Util.consoleLog(error);
    return false;
  }
}

// 修改订单行项目安装信息
export async function changeEntryInstallTime(entryNum, conCode, installDate, installTime) {
  try {
    const employeeId = await storage.getCurrentEmployeeId();
    const { customerId, channel } = await storage.getCurrentCart();
    const region = await storage.getCurrentRegionId();
    const url = `/users/${customerId}/orders/${conCode}/entries/${entryNum}/installation`;
    const ops = { params: { installDate, installTime, region, employee: employeeId, channel } };
    const { data } = await securedRestClient.put(url, ops);
    return data;
  } catch (error) {
    Util.consoleLog(error);
    return false;
  }
}
