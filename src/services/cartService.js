import * as securedRestClient from '../utils/securedRestClient';
import * as storage from '../utils/globalStorage';
import * as config from '../utils/configuration.js';
import Util from './../utils/utils';

const channel = config.TSK_CHANNEL;
const b2CChannel = config.B2C_CHANNEL;
const productAttribute = config.PRODUCT_ATTRIBTUE;
const ONLINE = config.ONLINE;
const MAXSELLQUANTITY = config.MAXSELLQUANTITY;
const ADDTOCARTERRORARRAY = config.ADDTOCARTERRORARRAY;
const POINTMULTIPLEUSED = 'pointMultipleUsed';

export async function getCartsByEmploryeeId(currentPage, pageSize) {
  try {
    const { employeeId, erpCabinetCode, pointOfServiceCode, region } = await storage.getCurrentLogin();
    let url = `/users/${employeeId}/carts?&posCode=${pointOfServiceCode}&salesGrpCode=${erpCabinetCode}&channel=${channel}&employee=${employeeId}&region=${region}`;
    if (currentPage !== undefined && pageSize !== undefined) {
      url = url.concat(`&currentPage=${currentPage}&pageSize=${pageSize}`);
    }
    const { data } = await securedRestClient.get(url);
    const { carts } = data;
    return carts;
  } catch (err) {
    Util.consoleLog('错误信息', err);
  }
  return [];
}

/**
 * userId不作为查询条件，可以任意穿一个employeeId
*/
export async function getCartsByUserId(nameOrPhoneNumber) {
  try {
    Util.consoleLog('根据手机号查询用户所有购物车信息', nameOrPhoneNumber);
    const { employeeId, erpCabinetCode, pointOfServiceCode, region } = await storage.getCurrentLogin();
    let phone = '';
    if (nameOrPhoneNumber === undefined || nameOrPhoneNumber === '') {
      const { phoneNumber } = await storage.getCurrentCart();
      Util.consoleLog('电话号码:', nameOrPhoneNumber, '存储电话', phoneNumber);
      phone = phoneNumber;
    } else {
      phone = nameOrPhoneNumber;
    }
    const url = `/users/${employeeId}/carts?posCode=${pointOfServiceCode}&salesGrpCode=${erpCabinetCode}&channel=${channel}&employee=${employeeId}&region=${region}&nameOrPhoneNumber=${phone}`;
    const { data } = await securedRestClient.get(url);
    const { carts } = data;
    return carts;
  } catch (err) {
    Util.consoleLog('错误信息', err);
  }
  return [];
}

/**
 * 查询顾客线上或者线下购物车
 */

export async function getCartsByUserIdAndCartType(nameOrPhoneNumber, cartType) {
  try {
    const carts = await getCartsByUserId(nameOrPhoneNumber);
    Util.consoleLog(`查询购物车 CartType${{ carts }}`);
    for (const item of carts) {
      if (item.cartType && item.cartType === cartType) {
        return item;
      }
    }
  } catch (err) {
    Util.consoleLog('错误信息', err);
  }
  return {};
}

/**
 * 选择购物车entry
 */
export async function selectCartEntry(userId, cartId, entryNumber, checked, cartType) {
  try {
    Util.consoleLog('购物车entry选择', 'userId', userId, 'cartId', cartId, 'entryNumber', entryNumber, 'checked', checked, 'cartType', cartType);
    const employeeId = await storage.getCurrentEmployeeId();
    const region = await storage.getCurrentRegionId();
    const url = `/users/${userId}/carts/${cartId}/entries/${entryNumber}?channel=${cartType === ONLINE ? b2CChannel : channel}&employee=${employeeId}&region=${region}&checked=${checked}`;
    const { data } = await securedRestClient.put(url);
    return data;
  } catch (err) {
    Util.consoleLog('错误信息', err);
  }
  return false;
}

/**
 * 根据购物车ID获取购物车信息
 * 参数: userId，cartId,region
 */
export async function getCartByUserIdAndCartId(userId, cartId, cartType) {
  try {
    Util.consoleLog('根据购物车ID获取购物车信息', 'userId', userId, 'cartId', cartId, 'cartType', cartType);
    const currentChannel = (cartType === ONLINE) ? b2CChannel : channel;
    const { employeeId, erpCabinetCode, pointOfServiceCode } = await storage.getCurrentLogin();
    const region = await storage.getCurrentRegionId();
    const url = `/users/${userId}/carts/${cartId}?posCode=${pointOfServiceCode}&salesGrpCode=${erpCabinetCode}&channel=${currentChannel}&employee=${employeeId}&region=${region}&fields=FULL`;
    const { data } = await securedRestClient.get(url);
    return data;
  } catch (err) {
    Util.consoleLog('错误信息', err);
  }
  return {};
}

/**
 * 删除购物车
 * 这个地方有可能会需要门店的信息，但是目前接口没有要求，暂时不传
 * erpCabinetCode, pointOfServiceCode
 * 虽然接口需要提供channel和region 实际上不用
 * tsk有的时候无法提供channel
 * 因为创建购物车的时候没有保存channel
 * 如果加入购物车失败，则需要删除购物车，
 * 此时是没有channel信息的
 */

export async function deleteCart(userId, cartId) {
  try {
    Util.consoleLog('删除购物车', userId, cartId);
    const url = `/users/${userId}/carts/${cartId}`;
    const result = await securedRestClient.remove(url);
    if (result) {
      return { deleteCart: true, cartId };
    }
    return { deleteCart: false, cartId };
  } catch (err) {
    Util.consoleLog('错误信息', err);
    return { deleteCart: false, cartId };
  }
}

/**
 * 判断当前购物车是否可以被删除
 * 参数 userId cartId
 * cartType 不是必须
 */
async function deleteCartWhenNoEntry(userId, cartId, cartType) {
  // 查询购物车信息
  let result = {};
  const cartData = await getCartByUserIdAndCartId(userId, cartId, cartType);
  if (cartData && cartData.entries && cartData.entries.length === 0) {
    result = await deleteCart(userId, cartId);
  }
  return result;
}

/**
 * 删除cartEntry
 * 如果该购物车没有entry，则删除购物车
 */
export async function deleteCartEntry(userId, cartId, entryNumber, cartType, region) {
  try {
    Util.consoleLog('删除购物车entry', userId, cartId, entryNumber, cartType);
    const employeeId = await storage.getCurrentEmployeeId();
    const url = `/users/${userId}/carts/${cartId}/entries/${entryNumber}?channel=${cartType === ONLINE ? b2CChannel : channel}&employee=${employeeId}&region=${region}`;
    const { data } = await securedRestClient.remove(url);
    // 如果购物车为空，删除购物车
    const result = await deleteCartWhenNoEntry(userId, cartId, cartType);
    return { ...result, deleteEntry: !!data };
  } catch (err) {
    Util.consoleLog('错误信息', err);
    return { ...{}, deleteEntry: false };
  }
}

/**
 * 购物车主商品延保产品查询
 */

export async function getWarrantyProducts(userId, cartId, cartType, region, productId, productPrice) {
  try {
    Util.consoleLog('获取延保产品', productId, productPrice);
    const currentChannel = cartType === ONLINE ? b2CChannel : channel;
    // added by bao gang, 2017-04-11 延保查询增加员工ID
    const employeeId = await storage.getCurrentEmployeeId();
    const url = `/users/${userId}/carts/${cartId}/extWarrantyProducts?productCode=${productId}&productPrice=${productPrice}&region=${region}&employee=${employeeId}&channel=${currentChannel}`;
    const { data } = await securedRestClient.get(url);
    Util.consoleLog('延保产品', data);
    return data;
  } catch (err) {
    Util.consoleLog('错误信息', err);
  }
  return [];
}


export async function removeUnAvailableWarranty(cartData) {
  try {
    // 初始化购物车每一个entry的延保商品
    // 如果在PDP页面选择一个延保商品加入购物车，然后在购物车中应用促销，导致商品的价格变化，从而导致PDP页面选择的促销已经不满足当前条件
    // 所以我们要判断并且删除购物车上延保的信息；否则价格会不准确
    const { uid: userId } = cartData.customer;
    const { code: cartId, cartType, areaCode: region } = cartData;
    // 初始化所有选中的延保信息
    const selectedWarrantyInfo = {};
    // 初始化保存所有的延保信息
    const cartAvailableWarrantyInfo = {};
    if (cartData && cartData.entries && cartData.entries.length > 0) {
      for (const entry of cartData.entries) {
        const entryNumber = entry.entryNumber;
        const quantity = entry.quantity;
        const totalPrice = entry.totalPrice.value;
        const productPrice = Math.ceil(totalPrice / quantity);
        const productId = entry.product.code;
        const data = await getWarrantyProducts(userId, cartId, cartType, region, productId, productPrice);
        Util.consoleLog('延保信息查询参数', userId, cartId, cartType, region, productId, productPrice, '延保信息结果', data, '当前entryNumber', entryNumber);
        // key: entryNumber, value : 延保data
        cartAvailableWarrantyInfo[entryNumber] = data; // 如果需要可以改成 key:主产品ID
        // 查询当前entry上是否有延保，如果有，是否在返回列表内
        // entry中有一个productAttribute属性会标识那些是赠品，那些是延保
        let applyWarrantyProductCode = '';
        let applyWarrantyEntry = '';
        if (entry.entries && entry.entries.length > 0) {
          for (const subEntry of entry.entries) {
            // 判断当前entry是否是延保？有可能是赠品
            const isWarranty = subEntry.product.productAttribute === undefined;
            const isSelected = subEntry.selected;
            if (isWarranty && isSelected) {
              applyWarrantyEntry = subEntry.entryNumber;
              applyWarrantyProductCode = subEntry.product.code;
            }
          }
        }
        // 如果entry是延保数据正确
        if (applyWarrantyProductCode && applyWarrantyProductCode !== '') {
          let flag = true;// 标记延保是否需要删除
          for (const key in data) {
            const value = data[key];
            for (const item of value) {
              if (item.code === applyWarrantyProductCode) {
                flag = false;
                // 把apply的延保初始化到state中
                selectedWarrantyInfo[entryNumber] = { code: item.code, type: key, applyWarrantyEntry };
                Util.consoleLog('循环逻辑里面的数据', selectedWarrantyInfo);
                break;
              }
            }
          }
          if (flag) {
            // 如果已经应用的促销不在可用促销的列表中，则删除
            Util.consoleLog('删除不在可用范围内的延保商品');
            await deleteCartEntry(userId, cartId, applyWarrantyEntry, cartType, region);
          }
        }
      }
    }
    Util.consoleLog('初始化延保信息', selectedWarrantyInfo, cartAvailableWarrantyInfo);
    return { selectedWarrantyInfo, cartAvailableWarrantyInfo };
  } catch (err) {
    return { selectedWarrantyInfo: {}, cartAvailableWarrantyInfo: {} };
  }
}


/**
 * 创建一个空的购物车
 * 参数:channel tsk 03  没有线上线下的概念
 */
async function createAnEmptyCart(userId, region) {
  try {
    const { employeeId, erpCabinetCode, pointOfServiceCode } = await storage.getCurrentLogin();
    const url = `/users/${userId}/carts`;
    const ops = {
      body: {
        channel,
        employee: employeeId,
        posCode: pointOfServiceCode,
        salesGrpCode: erpCabinetCode,
        region,
      },
    };
    Util.consoleLog('创建一个空的购物车', ops);
    const { data } = await securedRestClient.post(url, ops);
    return data;
  } catch (err) {
    return {};
  }
}
/**
 * 加入购物车entry
 * 参数:
 * cartId,
 * userId,
 * productCode,
 * qty,
 * employee,
 * region:320100000000
 * channel:TSK
 * productAttribute:NORMAL
 * channelGroup:ONLINE
 */
export async function addEntry(cartId, userId, productId, quantity, status, region) {
  Util.consoleLog('调用addEntry方法,请求加入购物车');
  try {
    const employee = await storage.getCurrentEmployeeId();
    const url = `/users/${userId}/carts/${cartId}/entries`;
    const ops = {
      body: {
        code: productId, // 'FSP920000000102',
        qty: quantity,
        employee,
        region,
        channel: status === 'ONLINE' ? b2CChannel : channel,
        productAttribute,
        channelGroup: status,
      },
    };
    const { data } = await securedRestClient.post(url, ops);
    return data;
  } catch (err) {
    return { statusCode: 'unavailable' };
  }
}

/**
 * add package product 时候要调用这个方法
 * 参数:
 * cartId,
 * userId,
 * productIds:这个是产品Id 的list集合
 * promoitonCode:这个是promotionCode 不是ruleCode
 * quantity
 * status
 * region
 */
export async function addPackageProductEntry(cartId, userId, productIds, promotionCode, status, region) {
  Util.consoleLog('组合产品加入购物车,调用addEntry方法');
  Util.consoleLog(cartId, userId, productIds.join(','), promotionCode, status, region);
  const employee = await storage.getCurrentEmployeeId();
  const url = `/users/${userId}/carts/${cartId}/entries/bundleProducts`;
  const ops = {
    body: {
      employee,
      region,
      channel: status === 'ONLINE' ? b2CChannel : channel,
      productCodes: productIds.join(','),
      bundlePromotionCode: promotionCode,
    },
  };
  const { data } = await securedRestClient.post(url, ops);
  return data;
}

/**
 * 购物车entry增加延保商品
 */
export async function applyWarranty(userId, cartId, entryNumber, productCode, cartType, region) {
  try {
    const url = `/users/${userId}/carts/${cartId}/entries/${entryNumber}/warrant`;
    const employee = await storage.getCurrentEmployeeId();
    const opt = {
      body: {
        channel: cartType === 'ONLINE' ? b2CChannel : channel,
        employee,
        region,
        productCode,
      },
    };
    const { data } = await securedRestClient.post(url, opt);
    return data;
  } catch (err) {
    Util.consoleLog('错误信息', err);
  }
  return {};
}
/**
 * 主商品和延保商品加入购物车
 */
async function addToCartAndApplyWarranty(userId, cartId, mainProductId, quantity, status, region, warrantyProductId) {
  try {
    // 加入entry
    const entryRes = await addEntry(cartId, userId, mainProductId, quantity, status, region);
    Util.consoleLog('加入购物车结果', entryRes);
    const { statusCode } = entryRes;
    // 判断加入购物车返回结果是否异常
    if (ADDTOCARTERRORARRAY.includes(statusCode)) {
      await deleteCartWhenNoEntry(userId, cartId);
    } else {
      const entryNumber = entryRes.entry.entryNumber;
      Util.consoleLog('加入的购物车entryNumber', entryNumber);
      // 加入购物车成功后用返回的entryNumber加入延保产品
      if (warrantyProductId && warrantyProductId !== '') {
        const warrantRes = await applyWarranty(userId, cartId, entryNumber, warrantyProductId, status, region);
        Util.consoleLog('应用延保商品返回结果', warrantRes);
      } else {
        Util.consoleLog('没有应用延保商品');
      }
    }
    const { cartType } = entryRes;
    const response = {
      cartId,
      statusCode,
      userId,
      region,
      cartType,
    };
    return response;
  } catch (err) {
    Util.consoleLog('异常信息', err);
    return { cartId, statusCode: 'unavailable', userId, region };
  }
}

/**
 * 创建一个新的购物车，然后主产品和延保商品加入购物车
 */
async function createAndAddToCartAndApplyWarranty(userId, mainProductId, quantity, status, region, warrantyProductId) {
  try {
    const cart = await createAnEmptyCart(userId, region);
    const { code: cartId } = cart;
    Util.consoleLog('创建一个新的购物车信息', cartId);
    return await addToCartAndApplyWarranty(userId, cartId, mainProductId, quantity, status, region, warrantyProductId);
  } catch (err) {
    return { statusCode: 'unavailable' };
  }
}

/**
 * 判断加入购物车的产品在购物车中的数量，如果超过200，则不再调用addToCart的操作，直接提示加入购物车成功
 *
 */
function calculateActualQuantity(productId, onSellQuantity, cartData) {
  Util.consoleLog('计算实际加入购物车商品的数量');
  let actualQuantity = 0;
  if (cartData && cartData.entries.length > 0) {
    cartData.entries.map((v) => {
      if (v.product.code === productId) {
        const soldQuantity = v.quantity;
        const totalNum = onSellQuantity + soldQuantity;
        // 1.如果已售是200 则actualQuantity = 0
        if (soldQuantity === MAXSELLQUANTITY) {
          Util.consoleLog('已售200', 'onSellQuantity:', onSellQuantity, 'soldQuantity', soldQuantity, 'totalNum', totalNum, 'actualQuantity', actualQuantity);
          return false;
        }
        // 2.如果已售和待售总和小于等于200 则actualQuantity = onSellQuantity
        if (totalNum <= MAXSELLQUANTITY) {
          actualQuantity = onSellQuantity;
          Util.consoleLog('已售+待售<200', 'onSellQuantity:', onSellQuantity, 'soldQuantity', soldQuantity, 'totalNum', totalNum, 'actualQuantity', actualQuantity);
          return false;
        }
        // 2.如果已售和待售总和大于200而已售的数量小于200 则actualQuantity = 200 - soldQuantity
        if (totalNum > MAXSELLQUANTITY) {
          actualQuantity = MAXSELLQUANTITY - soldQuantity;
          Util.consoleLog('已售<200 . 已售+待售>200', 'onSellQuantity:', onSellQuantity, 'soldQuantity', soldQuantity, 'totalNum', totalNum, 'actualQuantity', actualQuantity);
          return false;
        }
      } else {
        actualQuantity = onSellQuantity;
        Util.consoleLog('无匹配，直接加入数量', 'onSellQuantity:', onSellQuantity);
      }
    });
  } else {
    Util.consoleLog('空购物车，直接加入商品数量');
    actualQuantity = onSellQuantity;
  }
  return actualQuantity;
}


/**
 *加入购物车
 *参数：用户ID
 *查询当前用户是否有购物车，如果有，则加entry，如果没有，创建
 */
export async function createCart(userId, nameOrphoneNumber, productId, quantity, status, region, warrantyProductId) {
  Util.consoleLog('加入购物车开始', userId, '|nameOrphoneNumber:', nameOrphoneNumber, '|productId:', productId, '|quantity:', quantity, '|status:', status, '|region:', region, '|warrantyProductId', warrantyProductId);
  try {
    const carts = await getCartsByUserId(nameOrphoneNumber, channel, region);
    if (carts && carts.length > 0) {
      for (const item of carts) {
        Util.consoleLog(`购物车ID:${item.code} ,购物车类型:${item.cartType},产品类型:${status}`);
        const { cartType, code: cartId } = item;
        // 1.在循环内先匹配cartType的cart
        if (cartType && cartType.indexOf(status) > 0) {
          Util.consoleLog('该用户已有与商品同属性的购物车，无需创建');
          // 计算实际加入购物车的数量
          const actualQuantity = calculateActualQuantity(productId, quantity, item);
          Util.consoleLog('购物车实际加入商品的数量', actualQuantity);
          if (actualQuantity > 0) {
            const response = await addToCartAndApplyWarranty(userId, cartId, productId, actualQuantity, status, region, warrantyProductId);
            return response;
          }
          return { statusCode: 'success', userId, cartId, cartType, region };
        }
      }
    }
    // 当前用户没有与产品匹配的购物车，则创建一个新的购物车
    return await createAndAddToCartAndApplyWarranty(userId, productId, quantity, status, region, warrantyProductId);
  } catch (err) {
    Util.consoleLog(`加入购物车错误:${err}`);
    return { statusCode: 'unavailable' };
  }
}

/**
 * 加入购物车
 * 这个方法为了组合销售产品，组合销售产品没有购物车页面，只接跳转到checkout页面，而且每次都创建一个新的购物车；
 * 除了这个功能，其他功能不要使用这个方法
 */
export async function createPackageProductCart(userId, phoneNumber, productIds, promotionCode, status) {
  const region = await storage.getCurrentRegionId();
  Util.consoleLog('组合产品创建购物车', userId, '|productIds:', productIds, '|productIds', promotionCode, '|status:', status, '|region:', region);
  try {
    const { code: cartId } = await createAnEmptyCart(userId, region);
    const entryRes = await addPackageProductEntry(cartId, userId, productIds, promotionCode, status, region);
    const { code, cartType } = entryRes;
    // 这个地方需要channel信息
    if (code) {
      storage.setCurrentCart({
        customerId: userId,
        phoneNumber,
        cartId,
        channel: status,
        areaCode: region,
      });
      return { statusCode: 'success', cartId: code, cartType, userId };
    }
    return false;
  } catch (err) {
    Util.consoleLog('创建组合产品购物车错误', err);
    return false;
  }
}

/**
 * 更新购物车产品数量
 */
export async function updateProductQty(userId, cartId, entryNumber, qty, cartType) {
  try {
    const actualQuantity = qty > MAXSELLQUANTITY ? MAXSELLQUANTITY : qty;
    const employeeId = await storage.getCurrentEmployeeId();
    const region = await storage.getCurrentRegionId();
    const url = `/users/${userId}/carts/${cartId}/entries/${entryNumber}?channel=${cartType === ONLINE ? b2CChannel : channel}&employee=${employeeId}&region=${region}&qty=${actualQuantity}`;
    const { data } = await securedRestClient.patch(url);
    const { entry } = data;
    return entry;
  } catch (err) {
    Util.consoleLog('错误信息', err);
  }
  return {};
}


/**
 *  重新格式化B D折扣传给后台的数据格式
 * from:  {ruleCode,{entryNumber1:ruleValue1,entryNumber2:ruleValue2}}
 * to:    {ruleCode:"0,10;1,17"}
 */
function rebuildBDRuleValue(cartAppliedPromoitons) {
  // 1,循环已经应用的促销，有value的是B D促销
  const newCartAppliedPromotions = {};
  Util.consoleLog('重构前应用的促销参数结构', cartAppliedPromoitons);
  for (const ruleCode in cartAppliedPromoitons) {
    const ruleValue = cartAppliedPromoitons[ruleCode];
    if (ruleValue && ruleValue !== '' && ruleValue instanceof Object) {
      let value = '';
      for (const entryNumber in ruleValue) {
        value = value.concat(entryNumber.concat(',').concat(ruleValue[entryNumber]).concat(';'));
      }
      newCartAppliedPromotions[ruleCode] = value;
    } else {
      newCartAppliedPromotions[ruleCode] = '';
    }
  }
  Util.consoleLog('重构后应用的促销参数结构', newCartAppliedPromotions);
  return newCartAppliedPromotions;
}


/**
 * 购物车促销应用
 */
export async function applyPromotion(userId, cartId, cartType, cartAppliedPromoitons, region) {
  try {
    Util.consoleLog(['apply的promotion', userId, cartId, cartType, cartAppliedPromoitons]);
    const currentChannel = cartType === ONLINE ? b2CChannel : channel;
    const newCartAppliedPromotions = rebuildBDRuleValue(cartAppliedPromoitons);
    const { employeeId } = await storage.getCurrentLogin();
    const url = `/users/${userId}/carts/${cartId}/cartpromotions`;
    const ops = {
      params: {
        region,
        channel: currentChannel,
        employee: employeeId,
      },
      body: newCartAppliedPromotions,
      isJson: true,
    };
    const { data } = await securedRestClient.post(url, ops);
    // 解析返回值
    for (const key in data) {
      const ruleApplyResult = data[key];
      Util.consoleLog('应用的促销code:', key, '结果:', data[key]);
      const result = ruleApplyResult.map((item) => {
        if (item.status === 'false') {
          return false;
        }
      });
      if (!result) {
        return false;
      }
    }
    return true;
  } catch (err) {
    Util.consoleLog('错误信息', err);
  }
  return false;
}


/**
 * 购物车修改价格
 */

export async function modifyCartEntryPrice(userId, cartId, cartType, region, entryNumber, newPrice) {
  try {
    const { employeeId } = await storage.getCurrentLogin();
    const url = `/users/${userId}/carts/${cartId}/entries/${entryNumber}/price`;
    const currentChannel = cartType === ONLINE ? b2CChannel : channel;
    const ops = {
      body: {
        channel: currentChannel,
        employee: employeeId,
        region,
        newPrice,
      },
    };
    const { data } = await securedRestClient.post(url, ops);
    return data;
  } catch (err) {
    Util.consoleLog('错误信息:', err);
  }
  return {};
}
