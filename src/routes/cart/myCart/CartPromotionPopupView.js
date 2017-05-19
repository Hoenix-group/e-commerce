import React, { Component, PropTypes } from 'react';
import { connect } from 'dva/mobile';
import { Checkbox, Button, Text } from 'antd-mobile';
import Modal from 'rc-dialog/lib/Modal';
import { ScrollView, TouchableHighlight, View, Dimensions, Image } from 'react-native';
import Util from './../../../utils/utils';
import * as config from '../../../utils/configuration';

import styles from './styles';
import styles2 from './../../../components/ProductDetails/styles';


const JF_DIS_ARR = config.JF_DIS_ARR;

class CartPromotionPopupView extends Component {
  constructor() {
    super();
    this.state = {
      keyboardHeight: 0,
    };
  }

  componentWillMount() {
  }

  componentWillUnmount() {
  }

  onSelect(cartData, ruleCode, ruleValue, checked, mutualExclusiveRuleCodes, gifts) {
    // 购物车页面出初始化的时候也要把所有apply的promotion信息set 到 state中
    // 每次选择promotion时候要更新 state 信息 check 添加  unCheck 删除
    // apply促销的时候不明确区分是cart级别还是entry级别，后台会去判断
    // 发送请求到后台
    // this.hidePopupWindow();
    Util.consoleLog('互斥的促销', mutualExclusiveRuleCodes);
    const userId = cartData.customer.uid;
    const cartId = cartData.code;
    const cartType = cartData.cartType;
    const region = cartData.areaCode;
    Util.consoleLog('更新state中已选的促销信息', userId, cartId, cartType, ruleCode, ruleValue, checked);
    this.props.dispatch({ type: 'myCart/updatePromotionData', ruleCode, ruleValue, checked });
    this.props.dispatch({ type: 'myCart/setAutoSelectGifts', ruleCode, gifts });

    // 每次选择后要进行互斥验证，
    this.props.dispatch({ type: 'myCart/updatePromotionMutualExclusives', mutualExclusiveRuleCodes, checked });
    this.props.dispatch({ type: 'myCart/applyPromotion', userId, cartId, cartType, region, checked });
  }

  hidePopupWindow() {
    this.props.dispatch({ type: 'myCart/setShowCartPromotionModal', visible: false });
  }

  // 判断当前的优惠是否可用
  isPromotionDisabled(item) {
    const { promotionMutualExclusives, isValidMember } = this.props;
    const { code } = item;
    const isMultualExc = promotionMutualExclusives.includes(code);
    // 如果当前的优惠是与积分有关的，如果是非会员，则无法使用，只能展示
    let isDisabled = false;
    if (isMultualExc) {
      isDisabled = true;
    } else if (this.isMemberPromotion(item)) {
      isDisabled = !isValidMember;
    }
    return isDisabled;
  }

  isMemberPromotion(item) {
    const { promotionType } = item;
    return JF_DIS_ARR.includes(promotionType);
  }

  showMemberReserve(item) {
    const { isValidMember } = this.props;
    if (this.isMemberPromotion(item)) {
      return isValidMember;
    }

    return false;
  }

  generateAutoSelectGifts(promotion, checked) {
    if (!checked || !(promotion.promotionType === 'AchieveThresholdGift' || promotion.promotionType === 'purchaseReturnGift')) {
      return [];
    }

    if (!promotion.ruleAddFreeProducts || promotion.ruleAddFreeProducts.length === 0) {
      return [];
    }

    const ruleAddFreeProduct = promotion.ruleAddFreeProducts[0];

    const autoAdd = ruleAddFreeProduct.groupOperator === 'CONTAINS_ALL';
    if (autoAdd) {
      const products = ruleAddFreeProduct.freeProducts
        .filter((item) => { return item.avaliableAmount > 0; })
        .map((item) => { return { code: item.productCode, qty: 1 }; });

      return products;
    }

    const showPicker = ruleAddFreeProduct.groupOperator === 'CONTAINS_ANY';
    if (showPicker) {
      const products = ruleAddFreeProduct.freeProducts.filter((item) => { return item.avaliableAmount > 0; })
        .map((item) => { return { code: item.productCode, qty: 1 }; });

      if (products.length > 0) {
        return [products[0]];
      }
    }

    return [];
  }

  renderCartPromotion() {
    const { cartData } = this.props;
    const cartPromotions = cartData.availablePromotions;
    const cartPromotionView = [];
    if (cartPromotions && cartPromotions.length > 0) {
      cartPromotions.forEach(
        (item, i) => {
          cartPromotionView.push(
            <View key={i} style={[{ flex: 1, paddingHorizontal: 10 }]}>
              <View style={[{ flex: 1, paddingVertical: 20, borderTopWidth: 0.5, borderTopColor: '#D9D9D9' }, styles2.row1, styles2.left1]}>
                <View style={[{ paddingHorizontal: 5, flex: 8 }, styles2.row1, styles2.left1]}>
                  <Checkbox
                    style={{ width: 18, height: 18 }}
                    checked={!!item.applied}
                    disabled={this.isPromotionDisabled(item)}
                    onChange={(checked) => { this.onSelect(cartData, item.ruleCode, '', checked.target.checked, item.promotionMutualExclusives, this.generateAutoSelectGifts(item, checked.target.checked)); }}
                  >
                    <Text style={[{ paddingLeft: 5, paddingRight: 10 }, styles2.contitle]}>优惠: {item.title}</Text>
                  </Checkbox>
                </View>
                <View style={[{ flex: 2 }, styles.row1, styles2.left1]}>
                  <Text style={[styles2.checkallsmall, { color: 'red' }]}>{this.showMemberReserve(item) ? '会员专享' : ''}</Text>
                </View>
              </View>
            </View>
            ,
          );
        });
    }

    return (
      <View style={{ maxHeight: Dimensions.get('window').height - 50 }}>
        <View style={[styles2.closeList, styles2.promView]} >
          <View style={[styles2.center, styles2.row1]}>
            <Text style={[styles2.promTitle, { fontSize: 14 }]}>选择整单优惠</Text>
          </View>
        </View>
        <ScrollView>
          {cartPromotionView}
        </ScrollView>
        {/* 关闭按钮 */}
        <TouchableHighlight style={styles2.closeIcon} underlayColor={'rgba(0,0,0,0)'} onPress={() => { this.hidePopupWindow(); }}>
          <Image style={{ width: 12, height: 12 }} source={require('./../../../../images/productDetallsImgs/icons/rn-close-s.png')} />
        </TouchableHighlight>
        <Button style={{ borderRadius: 0 }} type="primary" onClick={() => { this.hidePopupWindow(); }}>确定</Button>
        <View style={parseInt(this.state.keyboardHeight, 10) > 0 ? { height: parseInt(this.state.keyboardHeight, 10) } : {}} />
      </View >
    );
  }

  render() {
    const { showCartPromotionModal } = this.props;
    return (
      <Modal
        animateAppear
        transparent
        animationType="slide-up"
        wrapStyle={{
          flexDirection: 'column',
          justifyContent: 'flex-end',
        }}
        visible={showCartPromotionModal}
        maskClosable
        onClose={() => { this.hidePopupWindow(); }}
      >
        {this.renderCartPromotion()}
      </Modal>);
  }
}

CartPromotionPopupView.propTypes = {
  cartData: PropTypes.object,
  showCartPromotionModal: PropTypes.bool,
  promotionMutualExclusives: PropTypes.array,
  isValidMember: PropTypes.bool,
  dispatch: PropTypes.func,
};

const mapStateToProps = ({ myCart }) => {
  const { cartData, showCartPromotionModal, promotionMutualExclusives, isValidMember } = myCart;
  return { cartData, showCartPromotionModal, promotionMutualExclusives, isValidMember };
};

export default connect(mapStateToProps)(CartPromotionPopupView);
