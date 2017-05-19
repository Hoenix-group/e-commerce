import * as securedRestClient from '../utils/securedRestClient';
import * as storage from '../utils/globalStorage';
import Util from './../utils/utils';

// 获取搜索数据
export async function combinedList(productName, pageSize, currentPage, isSearch) {
  try {
    const regionCode = await storage.getCurrentRegionId();
    const isChangeChannel = await storage.isCurrentRegionSameAsDefalutRegion();
    const channelVal = isChangeChannel ? '' : 'ONLINE';
    // const url = `/products/SearchBundlePromotions?regionCode=${regionCode}&currentPage=${currentPage}&pageSize=${pageSize}&productNameList=${productName}`;
    // Util.consoleLog(product);
    let url = '';
    if (productName) {
      if (channelVal === 'ONLINE') {
        url = `/products/SearchBundlePromotions?pageSize=${pageSize}&currentPage=${currentPage}&regionCode=${regionCode}&productNameList=${productName}&channelgroup=${channelVal}`;
      } else {
        url = `/products/SearchBundlePromotions?pageSize=${pageSize}&currentPage=${currentPage}&regionCode=${regionCode}&productNameList=${productName}`;
      }
    } else {
      if (channelVal === 'ONLINE') {
        url = `/products/SearchBundlePromotions?pageSize=${pageSize}&currentPage=${currentPage}&regionCode=${regionCode}&channelgroup=${channelVal}`;
      } else {
        url = `/products/SearchBundlePromotions?pageSize=${pageSize}&currentPage=${currentPage}&regionCode=${regionCode}`;
      }
    }
    // const url = `/products/SearchBundlePromotions?pageSize=${pageSize}&currentPage=${currentPage}&regionCode=10002001&productNameList=小米耳机 黑色`;
    Util.consoleLog(url);
    return await securedRestClient.get(url);
  } catch (err) {
    Util.consoleLog(err);
    return {};
  }
}
