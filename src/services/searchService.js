import * as securedRestClient from '../utils/securedRestClient';
import * as storage from '../utils/globalStorage';
import Util from './../utils/utils';

const term = 'fsp';
const channelGroup = 'OFFLINE';
const brandName = 'iphone';
const maxSize = '1700';
const max = 10;

// 获取搜索数据
export async function searchList(searchVal, productAttribute, seller, currentPage, pageSize, sort, minSalesPrice, maxSalesPrice, channel, attr) {
  try {
    Util.consoleLog('run here');
    Util.consoleLog(parseFloat(minSalesPrice));
   //  const url = `/products/search?regionCode=${regionCode}&term=${term}&channelGroup=${channelGroup}&brandName=${brandName}&productAttribute=${productAttribute}&currentPage=${currentPage}&pageSize=${pageSize}&maxSalesPrice=${maxSize}`;
    const regionCode = await storage.getCurrentRegionId();
    Util.consoleLog('我切换数据了', regionCode);
    const maxPrice = parseFloat(maxSalesPrice) ? parseFloat(minSalesPrice) ? parseFloat(maxSalesPrice) > parseFloat(minSalesPrice) ? parseFloat(maxSalesPrice) : parseFloat(minSalesPrice) : parseFloat(maxSalesPrice) : '';
    const minPrice = parseFloat(minSalesPrice) ? parseFloat(maxSalesPrice) ? parseFloat(minSalesPrice) < parseFloat(maxSalesPrice) ? parseFloat(minSalesPrice) : parseFloat(maxSalesPrice) : parseFloat(minSalesPrice) : 0;
    Util.consoleLog(minPrice);
    const sortdesc = sort ? sort : ''; 
    const isChangeChannel = await storage.isCurrentRegionSameAsDefalutRegion();
    const channelVal = isChangeChannel ? channel ? channel : '' : 'ONLINE';
    // 筛选条件
    Util.consoleLog('筛选条件-----------------', attr);
    let url = '';
    if (!attr) {
       url = `/products/search?regionCode=${regionCode}&term=${searchVal}&productAttribute=${productAttribute}&currentPage=${currentPage}&pageSize=${pageSize}&seller=${seller}&sort=${sortdesc}&minSalesPrice=${minPrice}&maxSalesPrice=${maxPrice}&channelGroup=${channelVal}`;
    } else {
      let term = '';
      for (let key in attr) {
        const cons = key;
        const value = attr[key];
        if (term) {
          term = term + '&' + cons + '=' + value.join(',');
        } else {
          term = '&' + cons + '=' + value.join(',');
        } 
      }
      url = `/products/search?regionCode=${regionCode}&term=${searchVal}&productAttribute=${productAttribute}&currentPage=${currentPage}&pageSize=${pageSize}&seller=${seller}&sort=${sortdesc}&minSalesPrice=${minPrice}&maxSalesPrice=${maxPrice}&channelGroup=${channelVal}${term}`;
    }  
    Util.consoleLog(url);
    return await securedRestClient.get(url);
  } catch (err) {
    return {};
  }
}
export async function suggestionsList(searchVal, productAttribute, seller, channel) {
  try {
    Util.consoleLog('关联搜索列表查询信息');
    Util.consoleLog(searchVal);
    const regionCode = await storage.getCurrentRegionId();
    const isChangeChannel = await storage.isCurrentRegionSameAsDefalutRegion();
    const channelVal = isChangeChannel ? channel ? channel : '' : 'ONLINE';
    const url = `/products/suggestions?regionCode=${regionCode}&term=${searchVal}&productAttribute=${productAttribute}&seller=${seller}&max=${max}&channelGroup=${channelVal}`;
    Util.consoleLog(url);
    const { data } = await securedRestClient.get(url);
    Util.consoleLog(data);
    return data;
  } catch (err) {
    Util.consoleLog(`错误信息:${err}`);
  }
  return {};
}
export async function wishlist() {
  try {
    const userId = await storage.getCurrentEmployeeId();
    Util.consoleLog(userId);
    const url = `/wishlist/search?userUID=${userId}`;
    const { data } = await securedRestClient.get(url);
    Util.consoleLog('收藏数据 》》》》》》》》', data);
    return data;
  } catch (err) {
    Util.consoleLog(`错误信息:${err}`);
  }
  return {};
}

export async function sethistory(values) {
  try {
    const history = await storage.getHistory();
    Util.consoleLog('history', history);
    Util.consoleLog(history.indexOf(values));
    if (history.indexOf(values) === -1 && history.length < 8) {
      history.push(values);
      storage.setSearchHistory({ history });
    }
    return history;
  } catch (err) {
    Util.consoleLog(`错误信息:${err}`);
  }
  return {};
}
export async function gethistory(values) {
  try {
    const history = await storage.getHistory();
    return history;
  } catch (err) {
    Util.consoleLog(`错误信息:${err}`);
  }
  return {};
}
export async function savethistory(values, id) {
  try {
    let history = await storage.getHistory();
    Util.consoleLog(history.indexOf(values));
    if (history.indexOf(values) === -1 && id === '0') {
      history.unshift(values);
      if (history.length > 9) {
        history = history.slice(0, 9);
      }
      storage.setSearchHistory({ history });
    }
    return history;
  } catch (err) {
    Util.consoleLog(`错误信息:${err}`);
  }
  return {};
}
export async function removehistory(values) {
  try {
    const history = await storage.getHistory();
    for (let it = 0; it < history.length; it++) {
      if (history[it] == values) {
        history.splice(it, 1);
        break;
      }
    }
    Util.consoleLog('当前和istory', history);
    storage.setSearchHistory({ history });
    return history;
  } catch (err) {
    Util.consoleLog(`错误信息:${err}`);
  }
  return {};
}
export async function removeAll() {
  try {
    const history = [];
    storage.setSearchHistory({ history });
    return history;
  } catch (err) {
    Util.consoleLog(`错误信息:${err}`);
  }
  return {};
}