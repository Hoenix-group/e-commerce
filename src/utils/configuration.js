import Util from './utils';

const __config__ = __DEV__ ? require('../config.dev.json') : require('../config.pro.json');
export const APP_CONTEXT_ROOT = 'rootContext';
export const APP_TIMEOUT = 'timeout';
export const APP_DOMAIN = 'domain';
export const HOST = 'host';
export const PATH_ACCESS_TOKEN = 'path_access_token';
export const CLIENT_ID = 'client_id';
export const CLIENT_SECRET = 'client_secret';
export const CLIENT_ID_TRUST = 'client_id_trust';
export const CLIENT_SECRET_TRUST = 'client_secret_trust';
export const PATH_OCC = 'path_occ';

export const TSK_CHANNEL = '03';
export const B2C_CHANNEL = '01';
export const ONLINE = 'TSK_ONLINE';
export const OFFLINE = 'TSK_OFFLINE';
export const PRODUCT_ATTRIBTUE = 'NORMAL';

// 这个key 是个人申请，上线时候请以公司申请
export const AMAP_KEY = '516fffafe1b82ed78406db0ee38ec05c';
export const PAGE = 1;
export const PAGESIZE = 20;
export const EXTENSIONS = 'all';
export const RADIUS = '1000';
export const OUTPUT = 'JSON';
export const TYPE = '120000|120100|120200|120201|120202|120203|120300|120301|120302|120303|120304';


// 购物车产品类型
export const GIFT = 'GIFT';

// 购物车促销类型

export const B_DISCOUNT = 'B-Discount';
export const D_DISCOUNT = 'D-Discount';
export const JF_DISCOUNT = 'pointMultipleUsed';
// 积分翻倍用 买返积分  满返积分
export const JF_DIS_ARR = ['pointMultipleUsed', 'purchaseReturnPoint', 'AchieveThresholdPoint'];

// 加入购物车失败返回类型
export const ADDTOCARTERRORARRAY = ['noStock', 'unavailable', 'lowStock', 'maxOrderQuantityExceeded', 'configurationError'];


// 产品在购物车最大的销售数量 默认200
export const MAXSELLQUANTITY = 200;

// Appointment
export const LIST_APPOINTMENTED_CUSTOMERS_PAGE_SIZE = 10;
export const DEFAULT_PAGESIZE = 10;

// 获取验证码按钮
export const DEFAULT_SECOUNDS = 60;

Util.consoleLog('^^^^^^^^^^^^^ come into configuration  ^^^^^^^^^^^^^^^');
export const getConfiguration = key => __config__[key];

/**
 *  for most case , DO NOT use this method, environmnet should be ransparent for your business
 * */
export const isDev = () => __DEV__;

const PERFORMANCE_PROFILE = false;
const PROFILER = (isDev() && PERFORMANCE_PROFILE) ? require('./performanceProfiler') : null;

console.disableYellowBox = true;

