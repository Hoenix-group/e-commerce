import { Toast } from 'antd-mobile';
import * as cartService from '../../services/cartService';
import * as oService from '../../services/checkoutService';
import * as validator from '../../utils/validator';
import Util from './../../utils/utils';
import * as config from './../../utils/configuration';

const B = config.B_DISCOUNT;
const D = config.D_DISCOUNT;
const JF = config.JF_DISCOUNT;
const BDJ = [B, D, JF];

const initialState = {
  activeTab: '',
  cartData: {},
  cartSelectedAll: false,
  cartEntrySelect: [],
  cartAppliedPromoitons: {},  // BD 折扣传递的参数变化，所以后台需要的格式更改为"0,10;1,17"，我们这里存储的格式是{ruleCode,{entryNumber1:ruleValue1,entryNumber2:ruleValue2}}
  cartEntryBDSelectedInfo: {}, // {entryCode:[{ruleCode1:false},{ruleCode2:false}]}
  promotionMutualExclusives: [], // 互斥信息
  selectedWarrantyInfo: {}, // 延保 跟PDP保持一致   格式要在前端转一次 // selectedWarrantyInfo: { 0: { code: 'FSP000000201773', type: '延保1' } },
  cartAvailableWarrantyInfo: {},    // 初始化延保的时候根据每一个entry的产品都查询了可用的延保，这个放在state中，以后不用再查询了 目的是减少调用接口的次数
  entryNumber: 0, // 当前选择延保的entryNumber
  extendwarrant: true, // 默认选中无延保信息
  extendwarrantTag: [], // 默认延保不选择
  extendwarrantVal: [], // 默认延保年限
  extendcode: '-1', // 延保商品id
    // 修改行项目价格
  newPrice: '',
  isValidMember: false,

  gifts: [],
  giftSelection: [],
  giftTotalPrice: 0,
  giftTotalQty: 0,
  targetGift: '',
  autoSelectGifts: undefined,

  showCartPromotionModal: false,
};

export default {
  namespace: 'myCart',
  state: initialState,

  effects: {
    * getCartByCartId({ userId, cartId, cartType, updateWarranty, phoneNumber }, { call, put }) {
      // 更新当前请求的购物车用户和手机号码 这个地方不能从购物车获取，因为购物车可能为空，一定存储传过来的数据
      const currentUser = { userId, phoneNumber, cartType };
      if (phoneNumber && phoneNumber !== '') {
        yield put({ type: 'updateCurrentUser', currentUser });
      }
      const cartData = yield call(cartService.getCartByUserIdAndCartId, userId, cartId, cartType);
      let warrantyData = { selectedWarrantyInfo: {}, cartAvailableWarrantyInfo: {} };
      if (updateWarranty) {
        Util.consoleLog('该操作需要重新更新延保产品');
        warrantyData = yield call(cartService.removeUnAvailableWarranty, cartData);
        yield put({ type: 'updateCartDataInfo', cartData, cartType, warrantyData });
      } else {
        yield put({ type: 'updateCartDataInfo', cartData, cartType });
      }
    },

    * switchCartByCartType({ userId, cartType, phoneNumber }, { call, put }) {
      // 在线上购物车切换线下购物车的时候，无法获取线下购物车的ID，所以要根据手机号查询用户线上和线下的购物车，获取Id，再根据ID查询
      // 用CartId去查询购物车才能查出promotion等信息
      yield put({ type: 'clearState' });
      const carts = yield call(cartService.getCartsByUserId, phoneNumber);
      let cartData = {};
      let warrantyData = {};
      for (const item of carts) {
        if (item.cartType && item.cartType === cartType) {
          const cartId = item.code;
          Util.consoleLog('购物车类型:', cartType, '购物车ID', cartId);
          cartData = yield call(cartService.getCartByUserIdAndCartId, userId, cartId, cartType);
          warrantyData = yield call(cartService.removeUnAvailableWarranty, cartData);
          break;
        }
      }
      // 更新当前请求的购物车用户和手机号码 这个地方不能从购物车获取，因为购物车可能为空，一定存储传过来的数据
      const currentUser = { userId, phoneNumber, cartType };
      yield put({ type: 'updateCurrentUser', currentUser });
      // 更新购物车信息
      yield put({ type: 'updateCartDataInfo', cartData, cartType, warrantyData });
    },

    * updateCartDataInfo({ cartData, cartType, warrantyData }, { put }) {
      // 更新tab页选中的状态
      yield put({ type: 'updateActiveTab', activeTab: cartType });

      // 设置当前购物车是否是五星用户的
      yield put({ type: 'updateIsValidMember', cartData });

      // 初始化购物车entry的选中状态
      yield put({ type: 'initCartEntrySelectedInfo', cartData });

      // 先清空互斥状态
      yield put({ type: 'resetPromotion' });

      // 初始化购物车促销选中状态
      yield put({ type: 'initPromotionData', cartData });

      // 初始化购物车促销互斥的状态
      yield put({ type: 'initPromotionExclusiveData', cartData });

      // 初始化购物车延保状态
      yield put({ type: 'initCartWarrantyAndGiftInfo', warrantyData });

      // 更新state购物车数据信息
      yield put({ type: 'updateCartData', cartData });
    },
    * switchCartTab({ cartType }, { put, select }) {
      const { userId, phoneNumber } = yield select(state => state.myCart.currentUser);
      Util.consoleLog('切换购物车:', cartType, userId, phoneNumber);
      yield put({ type: 'switchCartByCartType', userId, cartType, phoneNumber });
    },

    * refreshPreviousCartData({ payload }, { put, select }) {
      const { userId, phoneNumber, cartType } = yield select(state => state.myCart.currentUser);
      yield put({ type: 'switchCartByCartType', userId, cartType, phoneNumber });
    },

    * updateProductQty({ userId, cartId, entryNumber, qty, cartType }, { call, put }) {
      Util.consoleLog(`要更新的购物车:${userId}|${cartId}|${entryNumber}|${qty}|${cartType}`);
      const entryInfo = yield call(cartService.updateProductQty, userId, cartId, entryNumber, qty, cartType);
      if (entryInfo) {
        yield put({ type: 'getCartByCartId', userId, cartId, cartType, updateWarranty: false });
      }
    },

    * selectWarranty({ userId, cartId, cartType, region }, { call, put, select }) {
      const extendcode = yield select(state => state.myCart.extendcode);
      if (extendcode !== '-1') {
        const entryNumber = yield select(state => state.myCart.entryNumber);
        const selectedWarrantyInfo = yield select(state => state.myCart.selectedWarrantyInfo);
        let oldExtendCode = '';
        // 比较选择的延保和购物车entry上assign的延保，如果相同则不更新，不相同，删除旧的entry，新增新的延保商品
        if (selectedWarrantyInfo[entryNumber]) {
          oldExtendCode = selectedWarrantyInfo[entryNumber].code;
          if (oldExtendCode && oldExtendCode !== extendcode) {
            const applyWarrantyEntry = selectedWarrantyInfo[entryNumber].applyWarrantyEntry;
            Util.consoleLog(['删除上一次apply的延保产品，entry是：', applyWarrantyEntry]);
            yield call(cartService.deleteCartEntry, userId, cartId, applyWarrantyEntry, cartType, region);
          }
        }
        // 如果新增的延保商品是无延保，也就是说extendCode为空，则不apply
        if (extendcode && extendcode !== '') {
          Util.consoleLog('选择延保商品', userId, cartId, entryNumber, cartType, region, 'oldExtendCode', oldExtendCode, 'extendcode', extendcode);
          yield call(cartService.applyWarranty, userId, cartId, entryNumber, extendcode, cartType, region);
        }
        yield put({ type: 'getCartByCartId', userId, cartId, cartType, updateWarranty: true });
      } else {
        Util.consoleLog('延保无变化，不更新');
      }
    },

    * selectCartEntry({ userId, cartId, entryNumber, checked, cartType }, { call, put }) {
      Util.consoleLog(` 用户名:${userId}|购物车ID:${cartId}|entryCode:${entryNumber}|checked:${checked}`);
      const data = yield call(cartService.selectCartEntry, userId, cartId, entryNumber, checked, cartType);
      if (data) {
        yield put({ type: 'getCartByCartId', userId, cartId, cartType, updateWarranty: false });
      }
    },

    * deleteCartEntry({ userId, cartId, entryNumber, cartType, region }, { call, put }) {
      const result = yield call(cartService.deleteCartEntry, userId, cartId, entryNumber, cartType, region);
      console.log(['删除购物车entry结果', result]);
      const { deleteEntry, deleteCart } = result;
      if (deleteEntry) {
        Toast.success('删除成功', 1);
      } else {
        Toast.fail('删除失败', 1);
      }
      if (!deleteCart) {
        yield put({ type: 'getCartByCartId', userId, cartId, cartType, updateWarranty: true });
      } else {
        yield put({ type: 'updateCartDataInfo', cartData: {}, cartType, warrantyData: { selectedWarrantyInfo: {}, cartAvailableWarrantyInfo: {} } });
      }
    },

    * updateSelectAll({ cartType, checked }, { put, call, select }) {
      // 购物车信息
      const cartData = yield select(state => state.myCart.cartData);
      const userId = cartData.customer.uid;
      const cartId = cartData.code;
      const cartEntrySelect = yield select(state => state.myCart.cartEntrySelect);
      for (const entry of cartData.entries) {
        const entryNumber = entry.entryNumber;
        if (cartEntrySelect[entryNumber] !== checked) {
          yield call(cartService.selectCartEntry, userId, cartId, entryNumber, checked, cartType);
        }
      }
      yield put({ type: 'getCartByCartId', userId, cartId, cartType, updateWarranty: false });
    },

    * applyPromotion({ userId, cartId, cartType, region, checked }, { call, select, put }) {
      const { cartAppliedPromoitons, autoSelectGifts } = yield select(state => state.myCart);
      const result = yield call(cartService.applyPromotion, userId, cartId, cartType, cartAppliedPromoitons, region);
      if (result) {
        if (checked) {
          Toast.success('使用优惠成功', 2);
          if (autoSelectGifts) {
            const { entryNumber, ruleCode, gifts } = autoSelectGifts;
            const data = yield call(oService.addGift, entryNumber, ruleCode, gifts);
            if (data) {
              yield put({ type: 'changeGifts', code: ruleCode, gifts });
            } else {
              Toast.info('添加赠品失败');
            }
          }
        } else {
          Toast.success('取消优惠成功', 2);
        }
      } else {
        Toast.fail('促销优惠失败', 2);
      }
      yield put({ type: 'setAutoSelectGifts', gifts: [] });
      yield put({ type: 'getCartByCartId', userId, cartId, cartType, updateWarranty: true });
    },

    * getWarrantyProducts({ userId, cartId, cartType, region, productId, productPrice, entryNumber }, { put, select }) {
      Util.consoleLog('查询延保产品输入参数', cartId, userId, cartType, region, productId, productPrice, entryNumber);

      // 根据entryNumber 获取延保信息
      const cartAvailableWarrantyInfo = yield select(state => state.myCart.cartAvailableWarrantyInfo);
      const data = cartAvailableWarrantyInfo[entryNumber];

      // 根据entryNumber 获取apply的延保信息 这个要判断是否默认选中
      const selectedWarrantyInfo = yield select(state => state.myCart.selectedWarrantyInfo);
      const defaultWarrantyData = selectedWarrantyInfo[entryNumber] ? selectedWarrantyInfo[entryNumber] : {};

      // 判断无延保是否默认选中
      let extendwarrant = true;
      if (defaultWarrantyData.code) {
        extendwarrant = false;
      }

      // 开始按照前端显示的格式进行处理
      const attedata = [];
      const attdataVal = [];
      for (const keys in data) {
        const obj = {};
        // 因为后台传过来的数据有空格，所以要清除空格
        const formatName = validator.removeSpace(keys);

        obj.name = keys;
        obj.select = defaultWarrantyData.type === formatName;
        // obj.child = false;// 判断默认选中
        attedata.push(obj);
        const values = data[keys];
        const valueData = [];
        for (let it = 0; it < values.length; it++) {
          const objVal = {};
          // objVal.show = false;
          objVal.select = defaultWarrantyData.code === values[it].code; // 判断默认选中
          const newobjVal = Object.assign({}, values[it], objVal);
          valueData.push(newobjVal);
        }
        attdataVal.push(valueData);
      }
      Util.consoleLog('延保格式化后的数据', attedata, attdataVal);
      // 这里-1 代表延保商品没有操作，就是没有变化，也没有选无延保
      yield put({ type: 'changeExtendwarrant', extendwarrant, extendwarrantTag: attedata, extendwarrantVal: attdataVal, extendcode: '-1' });
      yield put({ type: 'updateEntryNumber', entryNumber });
    },

    * modifyCartEntryPrice({ userId, cartId, cartType, region, entryNumber }, { call, put, select }) {
      const newPrice = yield select(state => state.myCart.newPrice);
      const data = yield call(cartService.modifyCartEntryPrice, userId, cartId, cartType, region, entryNumber, newPrice);
      if (data) {
        Toast.success('修改价格成功', 1);
      } else {
        Toast.fail('修改价格失败', 1);
      }
      yield put({ type: 'updatePrice', newPrice: '' });// 修改后清空保存的价格，以防止其他修改操作混乱
      yield put({ type: 'getCartByCartId', userId, cartId, cartType, updateWarranty: true });
    },


    * addGift({ entryNumber, ruleCode, gifts, callback }, { call, put, select }) {
      const data = yield call(oService.addGift, entryNumber, ruleCode, gifts);
      if (data) {
        yield put({ type: 'changeGifts', code: ruleCode, gifts });

        const { cartData: { code: cartId, customer: { uid: userId }, cartType } } = yield select(({ myCart }) => myCart);
        yield put({ type: 'getCartByCartId', userId, cartId, cartType, updateWarranty: false });

        if (callback) {
          callback();
        }
      } else {
        Toast.info('添加赠品失败');
      }
    },

  },
  reducers: {
    clearState(state) {
      return initialState;
    },

    updateActiveTab(state, { activeTab: cartType }) {
      return { ...state, activeTab: cartType };
    },

    setShowCartPromotionModal(state, { visible }) {
      return { ...state, showCartPromotionModal: visible };
    },

    updateIsValidMember(state, { cartData }) {
      if (cartData !== undefined && cartData.customer !== undefined) {
        return { ...state, isValidMember: cartData.customer.isValidMember };
      }
      return state;
    },

    updateCartData(state, { cartData }) {
      return { ...state, cartData };
    },

    updateCurrentUser(state, { currentUser }) {
      return { ...state, currentUser };
    },

    initCartEntrySelectedInfo(state, { cartData }) {
      const cartEntrySelect = [];
      let cartSelectedAll = true;
      if (cartData !== undefined && cartData.entries) {
        for (const entry of cartData.entries) {
          cartEntrySelect[entry.entryNumber] = entry.selected; // entry.selected;
          if (!entry.selected) {
            cartSelectedAll = entry.selected;
          }
        }
      }
      return { ...state, cartEntrySelect, cartSelectedAll };
    },

    updateCartEntrySelectedInfo(state, { cartEntrySelect }) {
      return { ...state, cartEntrySelect };
    },

    updateCartSelectedAll(state, { cartSelectedAll }) {
      return { ...state, cartSelectedAll };
    },

    initPromotionData(state, { cartData }) {
      // 初始化购物车的已选促销信息
      const cartAppliedPromoitons = {};
      if (cartData && cartData.availablePromotions) {
        // 当前购物车cart level 促销
        cartData.availablePromotions.map((item) => {
          const { ruleCode, applied } = item;
          if (applied) {
            cartAppliedPromoitons[ruleCode] = '';// 购物车级别的促销没有B2 和 D 折扣
          }
        });
        // 当前购物车cart entry level 促销
        if (cartData.entries) {
          cartData.entries.map((entry) => {
            if (entry && entry.availablePromotions) {
              entry.availablePromotions.map((item) => {
                const { ruleCode, applied, promotionType, promotionResult } = item;
                const { entryNumber } = entry;
                if (applied) {
                  if (BDJ.includes(promotionType)) {
                    // 如果是B2 和 D 折扣，有输入值
                    if (promotionResult && promotionResult.length > 0) {
                      for (const promoEntry of promotionResult) {
                        if (promoEntry.consumedEntries && promoEntry.consumedEntries.length > 0) {
                          let adjustedUnitPrice = 0;
                          for (const consumedEntry of promoEntry.consumedEntries) {
                            adjustedUnitPrice = consumedEntry.adjustedUnitPrice;
                          }
                          const val = {};
                          const { quantity } = entry;
                          val[entryNumber] = Math.round(adjustedUnitPrice / quantity);// 计算单个产品减免的数额
                          cartAppliedPromoitons[ruleCode] = val;
                        }
                      }
                    }
                  } else {
                    // 其他折扣信息
                    cartAppliedPromoitons[ruleCode] = '';
                  }
                }
              });
            } else {
              Util.consoleLog('entry上没有促销信息');
            }
          });
        }
      }
      Util.consoleLog('初始化促销信息:', cartAppliedPromoitons);
      return { ...state, cartAppliedPromoitons };
    },

    initPromotionExclusiveData(state, { cartData }) {
      const allPromotionMutualExclusives = [];

      // 先遍历cart级别的
      if (cartData.availablePromotions) {
        cartData.availablePromotions.map((promotion) => {
          const { applied, promotionMutualExclusives } = promotion;
          if (applied && promotionMutualExclusives) {
            allPromotionMutualExclusives.push(...promotionMutualExclusives);
          }
        });
      }

      // 再遍历cart entry level级别的
      if (cartData.entries) {
        cartData.entries.map((entry) => {
          if (entry.availablePromotions) {
            entry.availablePromotions.map((promotion) => {
              const { applied, promotionMutualExclusives } = promotion;
              if (applied && promotionMutualExclusives) {
                allPromotionMutualExclusives.push(...promotionMutualExclusives);
              }
            });
          }
        });
      }
      return { ...state, promotionMutualExclusives: allPromotionMutualExclusives };
    },

    updatePromotionData(state, { ruleCode, ruleValue, checked }) {
      // 更新state中购物车promotion的数据
      // cartType 用户更新线上 还是线下购物车的数据
      // checked 用于判断当前购物车的promotion是否选中，如果ture，查询现有的apply的promotion，有则修改value，没有则添加；如果false，删除state中的该条促销
      // ruleCode 是促销的code，ruleValue 则用于B 或者 D 折扣输入的值， 其他类型的折扣则没有这个值，置空即可
      const cartAppliedPromoitons = state.cartAppliedPromoitons;
      Util.consoleLog('已经选择的促销:', cartAppliedPromoitons);
      if (!checked) {
        delete cartAppliedPromoitons[ruleCode];
      } else {
        cartAppliedPromoitons[ruleCode] = ruleValue;
      }
      return { ...state, cartAppliedPromoitons };
    },

    updatePromotionMutualExclusives(state, { mutualExclusiveRuleCodes, checked }) {
      // 更新state中互斥的信息。每选择一个促销，将它互斥的数据存储到state中
      let promotionMutualExclusives = [];
      promotionMutualExclusives = state.promotionMutualExclusives;
      if (mutualExclusiveRuleCodes !== undefined) {
        if (checked) {
          // 不判断重复，因为不同的促销可能对同一个促销互斥；
          promotionMutualExclusives.push(...mutualExclusiveRuleCodes);
        } else {
          // promotionMutualExclusives = promotionMutualExclusives.filter(el => !mutualExclusiveRuleCodes.includes(el));
          mutualExclusiveRuleCodes.map((item) => { promotionMutualExclusives.splice(promotionMutualExclusives.indexOf(item), 1); });
        }
        Util.consoleLog('互斥的信息为', promotionMutualExclusives);
        return { ...state, promotionMutualExclusives };
      }
      return state;
    },

    resetPromotion(state) {
      return { ...state, cartAppliedPromoitons: {}, promotionMutualExclusives: [] };
    },

    initWarrantyData(state, { selectedWarrantyInfo, cartAvailableWarrantyInfo }) {
      return { ...state, selectedWarrantyInfo, cartAvailableWarrantyInfo };
    },

    changeExtendwarrant(state, { extendwarrant, extendwarrantTag, extendwarrantVal, extendcode }) {
      return {
        ...state,
        extendwarrant,
        extendwarrantTag,
        extendwarrantVal,
        extendcode,
      };
    },

    updateEntryNumber(state, { entryNumber }) {
      return {
        ...state, entryNumber,
      };
    },

    initCartWarrantyAndGiftInfo(state, { warrantyData }) {
      if (warrantyData !== undefined) {
        const { selectedWarrantyInfo, cartAvailableWarrantyInfo } = warrantyData;
        if (selectedWarrantyInfo !== undefined && cartAvailableWarrantyInfo !== undefined) {
          return { ...state, selectedWarrantyInfo, cartAvailableWarrantyInfo };
        }
      }
      return state;
    },

    updatePrice(state, { newPrice }) {
      return { ...state, newPrice };
    },

    updatePromoAndExcFromPopup(state, { promo, exclu }) {
      return { ...state, cartAppliedPromoitons: promo, promotionMutualExclusives: exclu };
    },

    changeGiftSelection(state, { code, isSelect, price, channelCode }) {
      let totalQty = 0;
      let totalPrice = 0;
      const modification = [];
      if (isSelect === true) {
        totalQty += 1;
        totalPrice += price;
        modification.push({ code, qty: 1, price, channelCode });
      }
      state.giftSelection.forEach((item) => {
        if ((item.code === code) && (item.channelCode === channelCode)) {
          return;
        }

        totalQty += item.qty;
        totalPrice += item.qty * item.price;
        modification.push(item);
      });

      return { ...state, giftSelection: modification, giftTotalQty: totalQty, giftTotalPrice: totalPrice, targetGift: code };
    },
    changeGiftQty(state, { code, qty, price, totalQtyLimit, totalPriceLimit, channelCode }) {
      const { giftSelection, giftTotalQty, giftTotalPrice } = state;
      let totalQty = 0;
      let totalPrice = 0;
      let modification = [];
      state.giftSelection.forEach((item) => {
        if ((item.code === code) && (item.channelCode === channelCode)) {
          totalQty += qty;
          totalPrice += qty * price;
          modification.push({ code, qty, price, channelCode });
          return;
        }

        totalQty += item.qty;
        totalPrice += item.qty * item.price;
        modification.push(item);
      });

      if (totalQty > totalQtyLimit || totalPrice > totalPriceLimit) {
        modification = giftSelection;
        totalQty = giftTotalQty;
        totalPrice = giftTotalPrice;
      }

      return { ...state, giftSelection: modification, giftTotalQty: totalQty, giftTotalPrice: totalPrice, targetGift: code };
    },
    changeGifts(state, { code, gifts }) {
      let isExisting = false;
      let modification = state.gifts.map((item) => {
        if (item.code === code) {
          isExisting = true;
          return { ...item, products: gifts };
        }

        return item;
      });

      if (!isExisting) {
        modification = [...modification, { code, products: gifts }];
      }

      return { ...state, gifts: modification };
    },
    setAutoSelectGifts(state, { entryNumber, ruleCode, gifts }) {
      return { ...state, autoSelectGifts: (ruleCode && gifts && gifts.length > 0) ? { entryNumber, ruleCode, gifts } : undefined };
    },
  },
};
