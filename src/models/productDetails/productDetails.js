/**
 * Created by F162228 on 2017/1/19.
 */
import { Actions } from 'react-native-router-flux';
import { Toast } from 'antd-mobile';

import * as storage from '../../utils/globalStorage';
import * as productDeailService from '../../services/productDetailService';
import * as cartService from '../../services/cartService';
import * as userService from '../../services/userService';
import Util from './../../utils/utils';

export default {
  namespace: 'Details',
  state: {
    typeNum: 1,
    productDeailObj: {},
    inWishlist: false, // 是否在在收藏夹
    popupState: false, // 设置弹出窗状态
    region: {},
    channeldefcode: 'ONLINE', // 设置默认渠道，当没有组货信息时，查询通过默认值查询
    productdefAttribute: 'NORMAL', // 设置默认销售，当没有组货信息时，查询通过默认值查询
    defultregion: '', // 设置默认的区域编码
    cartNum: 1,
    extendwarrant: true, // 默认选中无延保信息
    extendwarrantTag: [], // 默认延保不选择
    extendwarrantVal: [], // 默认延保年限
    extendcode: '', // 延保id
    extendname: '未选择', // 默认延保信息 
  },
  effects: {
    // 加入购物车
    * addToCart({ productInfo }, { call, put }) {
      // 判断当前内存中是否有正在购物的顾客继续购物
      const userData = yield call(userService.getCurrentShoppingUser);
      if (userData) {
        const { userId, phoneNumber } = userData;
        const result = yield call(cartService.createCart, userId, phoneNumber.replace(/\s/ig, ''),
          productInfo.pid, productInfo.qty, productInfo.status, productInfo.region, productInfo.excodes);
        // 恢复购物车默认值
        yield put({ type: 'cleanCartNum', cartNum: 1 });
        const { statusCode, cartId, cartType } = result;
        if (statusCode === 'success') {
          Toast.success('加入购物车成功', 1, () => { Actions.mycart({ userId, cartId, cartType, phoneNumber }); });
        } else if (statusCode === 'noStock') {
          Toast.fail('该商品库存不足', 1);
        } else {
          Toast.fail('加入购物车失败', 1);
        }
        storage.setCurrentShoppingUser(null);
      } else {
        Actions.valet({ productInfo });
      }
    },

    // 加入收藏夹
    *  addTowishList({ productCode, regionCode, channel, product }, { call, put }) {
      // Util.consoleLog('参数》》》》', productCode, regionCode, channel, product);
      const result = yield call(productDeailService.addwishlist, productCode, regionCode, channel, product);
      if (result.data.success) {
        yield put({ type: 'Search/wishlist', productCode });
        yield put({ type: 'queryalreadyInWishlist', productCode, regionCode, channel, product });
        Toast.success('加入收藏成功', 1);
      } else {
        Toast.success('加入收藏失败', 1);
      }
    },
    // 是否已经添加收藏夹
    *  queryalreadyInWishlist({ productCode, regionCode, channel, product }, { call, put }) {
      // Util.consoleLog('**************************************************', productCode, regionCode, channel, product);
      if (productCode === undefined) {
        return;
      }
      const result = yield call(productDeailService.alreadyInWishlist, productCode, regionCode, channel, product);
      // Util.consoleLog(`--------------------------------------------------${result}`);
      // Util.consoleLog(result);
      yield put({ type: 'qalreadyInWishlist', inWishlist: result.alreadyInWishlist });
    },

    *  removeTowishList({ productCode, regionCode, channel, product }, { call, put }) {
      const result = yield call(productDeailService.removeTowishList, productCode, regionCode, channel, product);
      if (result.data.success) {
        const data = yield put({ type: 'Search/wishlist', productCode });
        // Util.consoleLog('收藏列表返回值', data);
        Toast.success('删除收藏纪录成功', 1);
        // Util.consoleLog('productCode>>>>', productCode);
      } else {
        Toast.success('删除收藏纪录失败', 1);
      }
    },

    /* 商品详细页 */
    * queryProductDeail({ productCode, regionCode, channel, product, changeflag, wishflag }, { call, put }) {
      // Util.consoleLog('商品明细查询----model');
      if (productCode === undefined) {
        return;
      }
      let data = yield call(productDeailService.productDetail, productCode, regionCode, channel, product, wishflag);
      yield put({ type: 'queryProduct', productDeailObj: data });
      // yield put({ type: 'queryalreadyInWishlist', productCode, regionCode, channel, product });
      yield put({ type: 'address/getDistricts', productCode });
      yield put({ type: 'queryalreadyInWishlist', productCode, regionCode, channel, product });
      if (!changeflag) {
        yield put({ type: 'changeDefultMsg', defultregion: regionCode, channeldefcode: channel, productdefAttribute: product });
      }
      // Util.consoleLog(data);
      // Util.consoleLog('--------------------------------------------data-model');
      // data = JSON.stringify(data);
      const attedata = [];
      const attdataVal = [];
      if (data) {
        Util.consoleLog(data);
        //         const text = 
        //         {
        //         "延保1": [
        //             {
        //                 "code": "FSPTEST820408",
        //                 "duration": 1,
        //                 "maxCoverage": 3500,
        //                 "minCoverage": 0,
        //                 "name": "空调.1501-2500元.延保一年.故障保障",
        //                 "status": "VALID",
        //                 "type": "延保1"
        //             },
        //             {
        //                 "code": "FSPTEST820409",
        //                 "duration": 2,
        //                 "maxCoverage": 3500,
        //                 "minCoverage": 0,
        //                 "name": "空调.1501-2500元.延保一年.故障保障",
        //                 "status": "VALID",
        //                 "type": "延保1"
        //             },
        //             {
        //                 "code": "FSPTEST820409",
        //                 "duration": 2,
        //                 "maxCoverage": 3500,
        //                 "minCoverage": 0,
        //                 "name": "空调.1501-2500元.延保一年.故障保障",
        //                 "status": "VALID",
        //                 "type": "延保1"
        //             },{
        //                 "code": "FSPTEST820409",
        //                 "duration": 2,
        //                 "maxCoverage": 3500,
        //                 "minCoverage": 0,
        //                 "name": "空调.1501-2500元.延保一年.故障保障",
        //                 "status": "VALID",
        //                 "type": "延保1"
        //             }
        //             ,{
        //                 "code": "FSPTEST820409",
        //                 "duration": 2,
        //                 "maxCoverage": 3500,
        //                 "minCoverage": 0,
        //                 "name": "空调.1501-2500元.延保一年.故障保障",
        //                 "status": "VALID",
        //                 "type": "延保1"
        //             }
        //         ],
        //         "延保2": [
        //             {
        //                 "code": "FSPTEST820410",
        //                 "duration": 3,
        //                 "maxCoverage": 3500,
        //                 "minCoverage": 0,
        //                 "name": "空调.1501-2500元.延保两年.故障保障",
        //                 "status": "VALID",
        //                 "type": "延保2"
        //             },
        //             {
        //                 "code": "FSPTEST820411",
        //                 "duration": 4,
        //                 "maxCoverage": 3500,
        //                 "minCoverage": 0,
        //                 "name": "空调.2501-3500元.延保两年.故障保障",
        //                 "status": "VALID",
        //                 "type": "延保2"
        //             }
        //         ]
        // };
        const text = data.extendWarrantyProductAttributeMap;
        for (const keys in text) {
          const obj = {};
          obj.name = keys;
          obj.select = false;
          obj.child = false;
          attedata.push(obj);
          const values = text[keys];
          const valueData = [];
          for (let it = 0; it < values.length; it++) {
            const objVal = {};
            objVal.show = false;
            objVal.select = false;
            const newobjVal = Object.assign({}, values[it], objVal);
            valueData.push(newobjVal);
          }
          attdataVal.push(valueData);
        }
        // Util.consoleLog('走到这里-----', attdataVal);
        const name = attedata && attedata.length > 0 ? '未选择' : '无延保';
        yield put({ type: 'changeExtendwarrant', extendwarrant: true, extendwarrantTag: attedata, extendwarrantVal: attdataVal, extendcode: '', extendname: name });
      }
      // Util.consoleLog(data.name);
    },
  },
  reducers: {
    changeType(state, action) {
      return { ...state, typeNum: action.typeNum };
    },
    queryProduct(state, { productDeailObj }) {
      return { ...state, productDeailObj };
    },
    qalreadyInWishlist(state, { inWishlist }) {
      return { ...state, inWishlist };
    },
    setPopupState(state, action) {
      return { ...state, popupState: action.popupState };
    },
    changeAddress(state, { recode }) {
      return { ...state, region: { ...recode } };
    },
    changeCartNum(state, action) {
      return { ...state, cartNum: action.cartNum };
    },
    cleanCartNum(state, { cartNum }) {
      return { ...state, cartNum };
    },
    changeDefultMsg(state, { defultregion, channeldefcode, productdefAttribute }) {
      return { ...state, defultregion, channeldefcode, productdefAttribute };
    },
    cleanProduct(state) {
      return {
        ...state,
        productDeailObj: {},
        typeNum: 1,
        inWishlist: false, // 是否在在收藏夹
        popupState: false, // 设置弹出窗状态
        region: {},
        channeldefcode: 'ONLINE', // 设置默认渠道，当没有组货信息时，查询通过默认值查询
        productdefAttribute: 'NORMAL', // 设置默认销售，当没有组货信息时，查询通过默认值查询
        defultregion: '', // 设置默认的区域编码
        cartNum: 1,
      };
    },
    changeExtendwarrant(state, { extendwarrant, extendwarrantTag, extendwarrantVal, extendcode, extendname }) {
      Util.consoleLog(extendwarrant);
      return {
        ...state,
        extendwarrant,
        extendwarrantTag,
        extendwarrantVal,
        extendcode,
        extendname,
      };
    },
  },
};
