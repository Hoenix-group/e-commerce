import * as securedRestClient from '../utils/securedRestClient';
import * as config from '../utils/configuration';
import Util from './../utils/utils';

const AMAP_KEY = config.AMAP_KEY;
const PAGESIZE = config.PAGESIZE;
const PAGE = config.PAGE;
const EXTENSIONS = config.EXTENSIONS;
const RADIUS = config.RADIUS;
const OUTPUT = config.OUTPUT;
const TYPE = config.TYPE;
/**
 * 参数信息：
 * longitude  String   必须
 * latitude   String   必须
 * keyWords   Array    必须
 * radius     String   选填  默认  5000
 * pageSize   int      选填  默认  20
 * pageNumber int      选填  默认  1
 * returnFormat String 选填  默认  JSON
 */

export async function searchAround({longitude, latitude, keyWords, radius, pageSize, pageNumber, returnFormat}) {
  // 经度纬度
  const location = `${longitude},${latitude}`;
  // 搜索关键字
  const keywords = keyWords.join('|');
  // 返回每页数量
  const offset = pageSize || PAGESIZE;
  // 返回页数
  const page = pageNumber || PAGE;
  // 搜索半径
  const searchRadius = radius || RADIUS;
  // 返回格式
  const output = returnFormat || OUTPUT;
  try {
    const url = `http://restapi.amap.com/v3/place/around?key=${AMAP_KEY}&location=${location}&keywords=${keywords}&types=${TYPE}&offset=${offset}&radius=${searchRadius}&page=${page}&extensions=${EXTENSIONS}&output=${output}`;
    return await securedRestClient.getExternal(url, {});
  } catch (err) {
    Util.consoleLog(`错误信息:${err}`);
  }
  return {};
}
