import * as securedRestClient from '../utils/securedRestClient';
import * as storage from '../utils/globalStorage';
import Util from './../utils/utils';

export async function productDetail(productCode, regionCode, channelCode, productAttribute, wishflag) {
  try {
    Util.consoleLog('商品明细查询', productCode);
    const region = await storage.getCurrentRegionId();
    const newRegionCode = wishflag ? region: regionCode;
    const url = `/products/${productCode}?regionCode=${newRegionCode}&channelCode=${channelCode}&productAttribute=${productAttribute}`;
    const { data } = await securedRestClient.get(url);
    // Util.consoleLog(data);
    // Util.consoleLog('--------------------------------------------data-service');
    return data;
  } catch (err) {
    Util.consoleLog(`productDetail错误信息:${err}`);
  }
  return {};
}
export async function addwishlist(productCode, regionCode, channelCode, productAttribute) {
  try {
    // Util.consoleLog('加入收藏夹');
    const userUID = await storage.getCurrentEmployeeId();
    const url = '/wishlist/add';
    const ops = {
      body: {
        userUID,
        productCode, // 'FSP920000000102',
        regionCode,
        channelCode,
        productAttribute,
      },
    };
    const response = await securedRestClient.post(url, ops);
    // Util.consoleLog('收藏的数据', response);
    return response;
  } catch (err) {
    // Util.consoleLog(`productDetail错误信息:${err}`);
  }
  return {};
}
export async function alreadyInWishlist(productCode, regionCode, channelCode, productAttribute) {
  try {
    Util.consoleLog('是否已经添加收藏夹', productCode);
    const userUID = await storage.getCurrentEmployeeId();
      // const url = `wishlist/alreadyInWishlist?productCode=${productCode}&userUID=${userUID}&regionCode=${regionCode}&channelCode=${channelCode}&productAttribute=${productAttribute}`;
    const url = `/wishlist/alreadyInWishlist?productCode=${productCode}&userUID=${userUID}&regionCode=${regionCode}&channelCode=${channelCode}&productAttribute=${productAttribute}`;
    const { data } = await securedRestClient.get(url);
        // Util.consoleLog(data);
        // Util.consoleLog('--------------------------------------------data-service');
    return data;
  } catch (err) {
    Util.consoleLog(`productDetail错误信息:${err}`);
  }
  return {};
}
export async function removeTowishList(productCode, regionCode, channelCode, productAttribute) {
  try {
    // Util.consoleLog('删除收藏记录');
    const userUID = await storage.getCurrentEmployeeId();
    const url = `/wishlist/remove?productCode=${productCode}&userUID=${userUID}&regionCode=${regionCode}&channelCode=${channelCode}&productAttribute=${productAttribute}`;
    const response = await securedRestClient.remove(url);
    // Util.consoleLog('删除收藏的数据', response);
    return response;
  } catch (err) {
    // Util.consoleLog(`productDetail错误信息:${err}`);
  }
  return {};
}
