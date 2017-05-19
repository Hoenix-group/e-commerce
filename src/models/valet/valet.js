import { Toast } from 'antd-mobile';
import { Actions } from 'react-native-router-flux';
import * as cartService from '../../services/cartService';
import * as userService from '../../services/userService';

export default {
  namespace: 'valet',
  state: {
    loading: false,
    inputEditable: true,
    disabled: true,
  },
  effects: {
    * fetchUser({ productInfo, phoneNumber }, { call, put }) {
      const userData = yield call(userService.validateUserByPhone, phoneNumber);
      const { dshCustomerUid } = userData;
      const { isPackageProduct } = productInfo;
      let result = {};
      // 根据结果查询当前顾客信息
      if (dshCustomerUid) {
        // 根据isPackageProduct 判断是否是组合销售产品，如果是直接跳到结算页面
        if (isPackageProduct) {
          const { promotionCode, productIds, status } = productInfo;
          result = yield call(cartService.createPackageProductCart, dshCustomerUid, phoneNumber, productIds, promotionCode, status);
        } else {
          const { pid, qty, status, region, excode } = productInfo;
          result = yield call(cartService.createCart, dshCustomerUid, phoneNumber, pid, qty, status, region, excode);
        }
        const { statusCode, userId, cartId, cartType } = result;
        if (statusCode === 'success') {
          if (isPackageProduct) {
            // 如何是组合产品，直接跳转到checkout页面
            Actions.checkout();
          } else {
            // 如果是非组合产品，直接跳转到挂单中心页面
            Toast.success('加入购物车成功', 1, () => {
              Actions.mycart({ userId, cartId, cartType, phoneNumber });
            });
          }
        } else if (statusCode === 'noStock') {
          Toast.fail('该商品库存不足', 1);
        } else {
          Toast.fail('加入购物车失败', 1);
        }
      } else {
        yield put({ type: 'valetRegister/changePhoneNumber', userPn: phoneNumber });
        Toast.info('尚未注册', 1, () => { Actions.valetregister({ productInfo, phoneNumber, isAddToCart: true }); });
      }
    },
  },
};
