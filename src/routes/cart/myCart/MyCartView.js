import React, { PropTypes, Component } from 'react';
import { connect } from 'dva/mobile';
import { Actions } from 'react-native-router-flux';
import { Text, Checkbox, Stepper, Popup, Flex, Button, SwipeAction, Toast, Picker } from 'antd-mobile';
import {
  ScrollView, View, Image, ListView, TouchableHighlight, KeyboardAvoidingView, Modal, Platform, InteractionManager, TextInput,
} from 'react-native';
import styles from './styles';
import CartEntryPromotionPopupView from './CartEntryPromotionPopupView';
import CartPromotionPopupView from './CartPromotionPopupView';
import CartWarrantyProductsPopupView from './CartWarrantyProductsPopupView';
import * as storage from '../../../utils/globalStorage';
import * as config from '../../../utils/configuration';
import FsRootView from './../../../components/common/FsRootView';
import GiftPrickerContent from './GiftPrickerContent';
import * as validator from '../../../utils/validator';
import Util from './../../../utils/utils';

const tskChannel = config.TSK_CHANNEL;
const b2CChannel = config.B2C_CHANNEL;
const ONLINE = config.ONLINE;
const MAXSELLQUANTITY = config.MAXSELLQUANTITY;
const B = config.B_DISCOUNT;
const D = config.D_DISCOUNT;
const BD = [B, D];
let updateWarrantyView = false;

const iconRight = (<Image style={[styles.arrowIcon]} source={require('./../../../../images/productDetallsImgs/icons/rn-chevron-right.png')} />);

class MyCartView extends Component {

  constructor() {
    super();
    this.state = {
      modalOpen: false,
      transparent: true,
      behavior: 'padding',
      entryNumber: -1,
      entryOriginedPrice: 0,
      keyboardHeight: 0,
    };
  }

  componentWillMount() {
    const { userId, cartId, cartType, phoneNumber, refresh } = this.props;
    if (refresh) {
      this.props.dispatch({
        type: 'myCart/refreshPreviousCartData',
      });
    } else {
      InteractionManager.runAfterInteractions(() => {
        this.props.dispatch({
          type: 'myCart/getCartByCartId',
          userId,
          cartId,
          cartType,
          updateWarranty: true,
          phoneNumber,
        });
      });
    }
  }

  componentWillReceiveProps(props) {
    const rowData = {};
    if (updateWarrantyView) {
      this.showWarranty(rowData, props);
    }
  }

  componentWillUnmount() {
    this.clearTimers();
    this.props.dispatch({
      type: 'myCart/clearState',
    });
  }

  selectCartEntry(userId, cartId, val, entryNumber, cartType) {
    this.props.dispatch({
      type: 'myCart/selectCartEntry',
      userId,
      cartId,
      entryNumber,
      checked: val.target.checked,
      cartType,
    });
  }

  deleteCartEntry(userId, cartId, entryNumber, cartType) {
    const { areaCode: region } = this.props.cartData;
    this.props.dispatch({
      type: 'myCart/deleteCartEntry',
      userId,
      cartId,
      entryNumber,
      cartType,
      region,
    });
  }

  clearTimers() {
    if (!this.timer) {
      return;
    }

    this.timer.forEach((item) => { clearTimeout(item); });
  }

  clearTimer(entryNumber) {
    if (this.timer && this.timer[entryNumber]) {
      clearTimeout(this.timer[entryNumber]);
      this.timer[entryNumber] = null;
    }
  }

  updateProductQty(userId, cartId, entryNumber, cartType) {
    this.clearTimer(entryNumber);

    const qty = this.quantity ? this.quantity[entryNumber] : 0;

    if (!qty || !validator.validateNumber(qty, '产品数量')) {
      return;
    }

    this.props.dispatch({
      type: 'myCart/updateProductQty',
      userId,
      cartId,
      entryNumber,
      qty,
      cartType,
    });
  }

  hidePopupWindow() {
    Popup.hide();
  }

  onChangePrice() {
    const { cartData } = this.props;
    const cartId = cartData.code;
    const userId = cartData.customer.uid;
    const cartType = cartData.cartType;
    const region = cartData.areaCode;
    const newPrice = this.props.newPrice;
    const { entryNumber, entryOriginedPrice } = this.state;
    this.setState({ modalOpen: false });

    // 验证价格
    let validate = true;
    if (!validator.validateNumberFormat(newPrice)) {
      Toast.info('输入格式有误,请输入数字', 1);
      validate = false;
    }
    // 验证修改的价格比之前的价格要高
    if (newPrice < entryOriginedPrice) {
      Toast.info('修改的价格不能低于限价', 1);
      validate = false;
    }
    if (validate) {
      this.props.dispatch({
        type: 'myCart/modifyCartEntryPrice',
        userId,
        cartId,
        cartType,
        region,
        entryNumber,
        newPrice,
      });
    }
  }

  updateInputPrice(val) {
    this.props.dispatch({
      type: 'myCart/updatePrice',
      newPrice: String(val),
    });
  }

  updateProductQtyWithDelay(userId, cartId, entryNumber, qty, cartType) {
    this.clearTimer(entryNumber);

    if (!qty || !validator.validateNumber(qty, '产品数量')) {
      return;
    }

    if (!this.quantity) {
      this.quantity = [];
    }
    this.quantity[entryNumber] = qty;

    if (!this.timer) {
      this.timer = [];
    }

    this.timer[entryNumber] = setTimeout(
      () => {
        this.props.dispatch({
          type: 'myCart/updateProductQty',
          userId,
          cartId,
          entryNumber,
          qty,
          cartType,
        });
      },
      1000,
    );
  }
  /**
   * 修改价格弹出层
   */
  renderShow() {
    return (
      <Modal
        animationType="none"
        transparent={this.state.transparent}
        visible={this.state.modalOpen}
        onRequestClose={() => { this.setState({ modalOpen: false }); }}
      >
        <View
          style={{
            backgroundColor: this.state.transparent ? 'rgba(0, 0, 0, 0.5)' : '#f5fcff',
            flex: 1,
            justifyContent: 'center',
            paddingLeft: 20,
            paddingRight: 20,
          }}
        >
          <KeyboardAvoidingView
            behavior={this.state.behavior}
            style={{
              flex: Platform.OS === 'android' ? 0 : 1,
              justifyContent: 'center',
              paddingHorizontal: 20,
              paddingTop: 20,
            }}
          >
            <View
              style={{
                borderRadius: 10,
                alignItems: 'center',
                backgroundColor: 'white',
                padding: 20,
              }}
            >
              <Text>修改价格</Text>
              {/* <InputItem maxLength={6} placeholder="请输入价格" onChange={value => this.updateInputPrice(value)} />*/}
              <TextInput
                keyboardType="numeric"
                maxLength={6}
                placeholder="请输入修改后的价格"
                editable={Boolean(true)}
                style={{
                  top: 10,
                  padding: 0,
                  width: 200,
                  borderColor: '#e9e9e9',
                  borderWidth: 1,
                  height: 35,
                  color: 'black',
                  textAlign: 'center',
                  marginLeft: 5,
                }}
                onChangeText={value => this.updateInputPrice(value)}
              />
              <View style={{ flexDirection: 'row', top: 10 }}>
                <Button type="primary" style={{ margin: 20 }} onClick={() => { this.onChangePrice(); }}>确定</Button>
                <Button type="primary" style={{ margin: 20 }} onClick={() => { this.setState({ modalOpen: false }); }}>取消</Button>
              </View>
            </View>
          </KeyboardAvoidingView>

        </View>
      </Modal >);
  }
  /**
   * 关闭弹出层的时候重置state中的购物车促销应用状态数据
   */
  closePromotionPopup(rowData) {
    Popup.hide();
    const { cartAppliedPromoitons } = this.props;
    const { availablePromotions, entryNumber } = rowData;
    if (availablePromotions) {
      for (const promotion of availablePromotions) {
        const { ruleCode, promotionType } = promotion;
        if (promotion.applied === undefined) {
          if (BD.includes(promotionType)) {
            const oldRuleValue = cartAppliedPromoitons[ruleCode];
            if (oldRuleValue && oldRuleValue[entryNumber]) {
              delete oldRuleValue[entryNumber];
            }
          } else {
            delete cartAppliedPromoitons[ruleCode];
          }
        } else if (BD.includes(promotionType)) {
          const { promotionResult } = promotion;
          for (const promoEntry of promotionResult) {
            if (promoEntry.consumedEntries && promoEntry.consumedEntries.length > 0) {
              let adjustedUnitPrice = 0;
              for (const consumedEntry of promoEntry.consumedEntries) {
                adjustedUnitPrice = consumedEntry.adjustedUnitPrice;
              }
              const val = {};
              const { quantity } = rowData;
              val[entryNumber] = adjustedUnitPrice / quantity;// 计算单个产品减免的数额
              cartAppliedPromoitons[ruleCode] = val;
            }
          }
        } else {
          cartAppliedPromoitons[ruleCode] = '';
        }
      }
      this.setState({ cartAppliedPromoitons });
    }
  }

  showEntryPromotions(rowData, userId, cartId, cartType, region) {
    let promotions = [];
    const { cartAppliedPromoitons, promotionMutualExclusives } = this.props;
    const { availablePromotions, entryNumber } = rowData;
    const productPrice = rowData.product.price.value;
    if (availablePromotions && availablePromotions.length > 0) {
      promotions = availablePromotions;
    }
    const cartInfo = {
      userId, cartId, cartType, region, entryNumber, productPrice,
    };
    Popup.show(
      <CartEntryPromotionPopupView
        dispatch={this.props.dispatch}
        promotions={promotions}
        cartInfo={cartInfo}
        promotionMutualExclusives={promotionMutualExclusives}
        cartAppliedPromoitons={cartAppliedPromoitons}
        onConfirm={() => { this.hidePopupWindow(); }}
        onClose={() => { this.closePromotionPopup(rowData); }}
      />,
      {
        animationType: 'slide-up',
        maskClosable: true,
        onMaskClose: () => { this.closePromotionPopup(rowData); },
      },
    );
  }

  showCartPromotion() {
    this.props.dispatch({ type: 'myCart/setShowCartPromotionModal', visible: true });
  }

  showWarranty(rowData, props) {
    const { cartData } = this.props;
    const cartId = cartData.code;
    const userId = cartData.customer.uid;
    const cartType = cartData.cartType;
    const region = cartData.areaCode;
    const paramInfo = { cartId, userId, cartType, region };

    // 第一次点击popup，会动态查询延保商品信息，并且设置updateWarrantyView 为true
    if (rowData.entryNumber !== undefined) {
      const productId = rowData.product.code;
      const quantity = rowData.quantity;
      const totalPrice = rowData.totalPrice.value;
      const productPrice = Math.ceil(totalPrice / quantity);
      const entryNumber = rowData.entryNumber;
      this.props.dispatch({
        type: 'myCart/getWarrantyProducts',
        cartId,
        userId,
        cartType,
        region,
        productId,
        productPrice,
        entryNumber,
      });
      updateWarrantyView = true;
    }

    // 不点击popup，不会动态查询延保商品信息，会更新state中选择的延保信息

    if (props !== undefined) {
      const { extendwarrant, extendwarrantTag, extendwarrantVal } = props;
      Popup.show(<CartWarrantyProductsPopupView
        dispatch={this.props.dispatch}
        paramInfo={paramInfo}
        extendwarrantflag={extendwarrant} // 判断无延保是否选中
        extendwarrantTag={extendwarrantTag} // 延保的type信息
        extendwarrantVal={extendwarrantVal} // 延保的时间具体信息
        close={() => { updateWarrantyView = false; Popup.hide(); }
        }
      />
        , {
          animationType: 'slide-up',
          maskClosable: true,
          onMaskClose: () => { updateWarrantyView = false; Popup.hide(); },
        },
      );
    }
  }

  continueShopping(userId, phoneNumber) {
    const currentShoppingUserData = {
      userId, phoneNumber,
    };
    Util.consoleLog('点击继续购物，去内存中获取正在购物顾客信息');
    Util.consoleLog(currentShoppingUserData);
    storage.setCurrentShoppingUser(currentShoppingUserData);
    Actions.globalSearch();
  }

  renderPromotionViewTxt(rowData) {
    const { availablePromotions } = rowData;
    const selectedPromotionView = [];
    if (availablePromotions && availablePromotions.length > 0) {
      for (const availablePromotion of availablePromotions) {
        const { applied, title } = availablePromotion;
        if (applied) {
          selectedPromotionView.push(title);
        }
      }
    }
    const viewList = [];
    if (selectedPromotionView.length > 0) {
      selectedPromotionView.map((lineTxt, index) => {
        viewList.push(<Text key={index} numberOfLines={1} style={[styles.fontSize14, styles.textColor2, styles.m_right]}>{lineTxt}</Text>);
      });
    } else {
      viewList.push(
        <Text numberOfLines={1} key={0} style={[styles.fontSize14, styles.textColor2, styles.m_right]}>请选择促销</Text>,
      );
    }
    return viewList;
  }

  renderWarrantyViewTxt(rowData) {
    const { entries } = rowData;
    let warranty = '请选择延保';
    if (entries) {
      for (const subEntry of entries) {
        const isWarranty = subEntry.product.productAttribute === undefined;
        if (isWarranty) {
          warranty = subEntry.product.name;
        }
      }
    }
    return warranty;
  }

  handleCheckout(userId, phoneNumber, cartId, channel, areaCode) {
    const currentChannel = (channel === ONLINE) ? b2CChannel : tskChannel;
    Util.consoleLog('跳转到checkout页面存储当前的购物车信息');
    storage.setCurrentCart({
      customerId: userId,
      phoneNumber,
      cartId,
      channel: currentChannel,
      areaCode,
    });
    this.clearTimers();
    Actions.checkout();
  }

  renderCheckOutButton(cartData) {
    // 验证购物车能否结算条件 1.有catEntry 2.至少选择一个entry
    let isCheckout = false;
    if (cartData.entries.length > 0) {
      for (const item of cartData.entries) {
        if (item.selected) {
          isCheckout = true;
          break;
        }
      }
    }
    if (isCheckout) {
      return (
        <TouchableHighlight underlayColor={'rgba(0,0,0,0.1)'} onPress={() => this.handleCheckout(cartData.customer.uid, cartData.customer.phoneNumber, cartData.code, cartData.cartType, cartData.areaCode)} style={[{ flex: 4 }]}>
          <View style={[styles.flex, styles.footRight, styles.center, styles.row1]}>
            <Text style={[styles.flex, styles.footRightText, styles.center, { alignSelf: 'center' }]}>去结算</Text>
          </View>
        </TouchableHighlight>
      );
    }
    return (
      <TouchableHighlight underlayColor={'rgba(0,0,0,0.1)'} style={[styles.btnBg, styles.center, { flex: 4 }]}>
        <View style={[styles.flex, styles.footRight, styles.center, styles.row1]}>
          <Text style={[styles.flex, styles.footRightText, styles.center, { alignSelf: 'center' }]}>去结算</Text>
        </View>
      </TouchableHighlight>);
  }

  renderSelectAllButton(cartType, checked) {
    this.props.dispatch({ type: 'myCart/updateSelectAll', cartType, checked });
  }

  /**
   * 购物车行项目信息显示内容
   * @param {*} rowData
   */
  renderEntryDetails(rowData) {
    const { cartData, cartEntrySelect } = this.props;
    const userId = cartData.customer.uid;
    const cartId = cartData.code;
    const cartType = cartData.cartType;

    return (
      <SwipeAction
        autoClose title="确认"
        right={[{ text: '删除', style: { backgroundColor: '#F4333C', color: 'white' }, onPress: () => { this.deleteCartEntry(userId, cartId, rowData.entryNumber, cartType); } }]}
      >
        <View style={[styles.center, styles.col1, styles.bgFF, { height: 106, paddingHorizontal: 5 }]}>
          <View style={[{ flex: 1 }, styles.center, styles.row1]}>
            <View style={[{ flex: 1 }, styles.center]}>
              <Checkbox checked={cartEntrySelect[rowData.entryNumber]} onChange={(val) => { this.selectCartEntry(userId, cartId, val, rowData.entryNumber, cartType); }} />
            </View>
            <View style={[{ flex: 9 }, styles.p_bottom, styles.center, styles.row1]}>
              <View style={{ flex: 3, height: 100 }}>
                <Image style={[styles.m10, styles.image_thumb]} source={require('./../../../../images/sale_product_01_280x190.png')} />
              </View>
              <View style={[{ flex: 6, height: 100 }]}>
                <View style={[{ flexWrap: 'wrap' }, styles.p_top10]}>
                  <Text numberOfLines={2} style={[styles.fontLarge, styles.textColor, { paddingRight: 15 }]}>{rowData.product ? rowData.product.name : ''}{rowData.product ? rowData.product.name : ''}{rowData.product ? rowData.product.name : ''}</Text></View>
                <View style={[styles.fd_row, styles.p_top10]}>
                  {this.renderSalesAttributeValue(rowData)}
                </View>
                <View style={[styles.contentLR, styles.row1, { height: 30, top: 5 }]}>
                  <View style={[styles.fd_row, styles.center]}>
                    <Text
                      style={[styles.sPrice]}
                      onPress={() => {
                        this.setState({
                          modalOpen: true,
                          entryNumber: rowData.entryNumber,
                          entryOriginedPrice: rowData.oldItemPrice,
                        });
                      }}
                    >¥{rowData.product.price ? rowData.product.price.value : '没有价格'}</Text>
                  </View>
                  <View style={{ width: 100, marginRight: 10 }}>
                    <Stepper
                      readOnly={false}
                      key="1"
                      min={1}
                      max={MAXSELLQUANTITY}
                      defaultValue={1}
                      value={rowData.quantity}
                      onChange={(qty) => { this.updateProductQtyWithDelay(userId, cartId, rowData.entryNumber, qty, cartType); }}
                      onBlur={() => { this.updateProductQty(userId, cartId, rowData.entryNumber, cartType); }}
                      keyboardType="numeric"
                      style={{ paddingVertical: 5 }}
                      inputStyle={Platform.OS === 'android' ? { top: 0, flex: 1, height: 40, alignSelf: 'center', paddingTop: 6 } : {}}
                    />
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </SwipeAction>);
  }

  // 显示销售属性
  renderSalesAttributeValue(rowData) {
    const container = [];
    if (rowData.product && rowData.product.salesAttributeValue) {
      for (const x in rowData.product.salesAttributeValue) {
        const displayTxt = `${x}: ${rowData.product.salesAttributeValue[x]}`;
        const key = `${rowData.product.code}-${x}`;
        container.push(<Text numberOfLines={2} key={key} style={[styles.font_10, styles.textColor2, styles.m_right]}>{displayTxt}</Text>);
      }
    }
    return container;
  }

  // 购物车行项目促销显示内容
  renderCartEntryPromotion(rowData) {
    const { cartData } = this.props;
    const userId = cartData.customer.uid;
    const cartId = cartData.code;
    const cartType = cartData.cartType;
    const region = cartData.areaCode;

    return (
      rowData.availablePromotions && rowData.availablePromotions.length > 0 ?
        <View style={[styles.flex, styles.center, styles.row1, styles.bgFF]}>
          <TouchableHighlight style={styles.flex} underlayColor={'rgba(0,0,0,0)'} onPress={() => { this.showEntryPromotions(rowData, userId, cartId, cartType, region); }} >
            <View style={[styles.flex, styles.contentLR, styles.row1, styles.infoView, styles.b_top, { marginLeft: 10 }]}>
              <View style={[styles.row1, styles.left2]}>
                <Text style={[styles.fontSize14, styles.textColor]}>促销</Text>
              </View>
              <View style={[styles.m_left, styles.row1, styles.left2]}>
                {this.renderPromotionViewTxt(rowData)}
                <Image style={[styles.arrowIcon]} source={require('./../../../../images/productDetallsImgs/icons/rn-chevron-right.png')} />
              </View>
            </View>
          </TouchableHighlight>
        </View> : <View />
    );
  }

  // 购物车行项目积分增值用显示内容
  renderCartEntryJFZZY(rowData) {
  }

  // 购物车行项目延保显示内容
  renderCartEntryWarranty(rowData) {
    return (
      <View style={[styles.flex, styles.center, styles.row1, styles.bgFF]}>
        <TouchableHighlight style={styles.flex} underlayColor={'rgba(0,0,0,0)'} onPress={() => { this.showWarranty(rowData); }} >
          <View style={[styles.flex, styles.contentLR, styles.row1, styles.infoView, styles.b_top, { marginLeft: 10 }]}>
            <View style={[styles.row1, styles.left2]}>
              <Text style={[styles.fontSize14, styles.textColor]}>延保</Text>
            </View>
            <View style={[styles.row1, styles.left2]}>
              <Text numberOfLines={1} style={[styles.fontSize14, styles.textColor2, styles.m_left, { paddingRight: 5 }]}>{this.renderWarrantyViewTxt(rowData)}</Text>
              <Image style={[styles.arrowIcon]} source={require('./../../../../images/productDetallsImgs/icons/rn-chevron-right.png')} />
            </View>
          </View>
        </TouchableHighlight>
      </View>);
  }

  // 购物车行项目运营商商品显示内容
  renderCartEntryYYSProduct(rowData) {
  }

  renderRow(rowData) {
    return (
      <View style={[styles.flex, styles.b_bottom, styles.bgFF, styles.marginT]}>
        {this.renderEntryDetails(rowData)}
        {this.renderCartEntryPromotion(rowData)}
        {this.renderCartEntryJFZZY(rowData)}
        {this.renderGifts(rowData.availablePromotions, rowData)}
        {this.renderCartEntryWarranty(rowData)}
        {this.renderCartEntryYYSProduct(rowData)}
      </View >
    );
  }

  onUpdateGifts(val, entryNumber, code) {
    this.props.dispatch({
      type: 'myCart/addGift',
      entryNumber,
      ruleCode: code,
      gifts: [{ code: val, qty: 1 }],
    });
  }

  showGifts(entryNumber, code, totalPriceLimit) {
    const addGiftCallback = () => {
      Actions.pop();
    };
    const confirmFun = (selection) => {
      this.props.dispatch({ type: 'myCart/addGift', entryNumber, ruleCode: code, gifts: selection, callback: addGiftCallback });
    };

    this.props.dispatch({
      type: 'Search/onChangeHot',
      id: '2',
    });
    Actions.productList({ checkoutGift: true, confirmCallback: confirmFun, totalPriceLimit, totalQtyLimit: 5 });
  }

  renderGiftAction(promotion, entry) {
    if (!promotion.ruleAddFreeProducts || promotion.ruleAddFreeProducts.length === 0) {
      return (null);
    }

    const ruleAddFreeProduct = promotion.ruleAddFreeProducts[0];

    const showList = !!ruleAddFreeProduct.percentage;
    if (showList) {
      const { cartData: data } = this.props;
      return (
        <TouchableHighlight underlayColor={'transparent'} onPress={() => { this.showGifts(entry ? entry.entryNumber : '', promotion.ruleCode, (data.sumPrice * ruleAddFreeProduct.percentage) / 100); }} >
          <View style={styles.row1}>
            <Text numberOfLines={1} style={entry ? [styles.fontSize14, styles.textColor2, styles.m_right] : [styles.fontSize16, styles.textColor2, styles.m_left, { paddingRight: 8 }]}>请选择赠品</Text>
            {iconRight}
          </View>
        </TouchableHighlight>
      );
    }

    const autoAdd = ruleAddFreeProduct.groupOperator === 'CONTAINS_ALL';
    if (autoAdd) {
      return (null);
    }

    const showPicker = ruleAddFreeProduct.groupOperator === 'CONTAINS_ANY';
    if (showPicker) {
      const products = ruleAddFreeProduct.freeProducts.filter((item) => { return item.avaliableAmount > 0; })
        .map((item) => { return { value: item.productCode, label: item.productName }; });
      const values = this.props.gifts.filter((item) => { return item.code === promotion.code; });
      const value = (values.length > 0 && values[0].products && values[0].products.length > 0) ? values[0].products[0].code : '';
      const defaultValue = products[0].value;

      return (
        <Picker extra="请选择赠品" data={products} cols={1} title="请选择赠品" triggerType="onClick" value={[value]} onChange={(val) => { this.onUpdateGifts((val && val[0]) ? val[0] : defaultValue, entry ? entry.entryNumber : '', promotion.ruleCode); }}>
          <GiftPrickerContent textStyle={entry ? [styles.fontSize14, styles.textColor2, styles.m_right] : [styles.fontSize16, styles.textColor2, styles.m_left, { paddingRight: 8 }]} style={styles.row1} iconRight={iconRight} />
        </Picker>
      );
    }

    return (null);
  }

  renderGiftContent(promotion, entry) {
    const { cartData: data } = this.props;
    const entries = data ? data.entries : [];
    const giftEntires = entry ? entry.children : entries;
    if (!giftEntires || giftEntires.length === 0) {
      return (null);
    }

    const giftArray = giftEntires.filter((item) => { return item.promotionCode === promotion.ruleCode; });
    return (
      <View>
        {giftArray.map((item, i) => {
          return (
            <View key={i}>
              <Text numberOfLines={1} style={[styles.fontSize12, styles.textColor1, styles.m_left]}>{`${item.product.name}      x${item.quantity}`}</Text>
            </View>
          );
        })}
      </View>
    );
  }

  renderGifts(availablePromotions, entry) {
    if (!availablePromotions) {
      return (<View />);
    }

    const promotions = availablePromotions.filter((item) => { return (item.promotionType === 'AchieveThresholdGift' || item.promotionType === 'purchaseReturnGift') && (item.applied === true); });
    if (promotions.length === 0) {
      return (<View />);
    }

    if (!entry) {
      return (

        <View style={[styles.left1, styles.flexDir, { height: 55 }]}>
          <View style={[styles.flex, styles.left1, styles.row1, styles.bgFF, styles.b_bottom]}>
            <View style={[styles.flex, styles.contentLR, styles.row1, styles.infoView, { marginLeft: 0 }]}>
              <View style={[styles.row1, styles.left2]}>
                <Text style={[styles.fontSize16, styles.textColor, { paddingLeft: 5 }]}>赠品</Text>
              </View>
              <ScrollView style={{ flex: 1 }}>
                {promotions.map((item, i) => {
                  return (
                    <View key={i} style={{ flexDirection: 'column' }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={[styles.row1, styles.left2]}>
                          <Text numberOfLines={1} style={[styles.fontSize12, styles.textColor1, styles.m_left]}>[{item.title}]</Text>
                        </View>
                        <View style={{ alignItems: 'flex-end' }}>
                          {this.renderGiftAction(item)}
                        </View>
                      </View>
                      <View>
                        {this.renderGiftContent(item)}
                      </View>
                    </View>
                  );
                })}
              </ScrollView>
            </View>
          </View>
        </View>
      );
    }

    return (
      <View style={[styles.flex, styles.center, styles.row1, styles.bgFF, { height: 46 }]}>
        <View style={[styles.flex, styles.contentLR, styles.row1, styles.infoView, styles.b_top, { marginLeft: 10 }]}>
          <View style={[styles.row1, styles.left2]}>
            <Text style={[styles.fontSize14, styles.textColor]}>赠品</Text>
          </View>
          <ScrollView style={{ flex: 1 }}>
            {promotions.map((item, i) => {
              return (
                <View key={i} style={{ flexDirection: 'column' }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={[styles.fontSize12, styles.textColor1, styles.m_left]}>[{item.title}]</Text>
                    <View style={{ alignItems: 'flex-end' }}>
                      {this.renderGiftAction(item, entry)}
                    </View>
                  </View>
                  <View>
                    {this.renderGiftContent(item, entry)}
                  </View>
                </View>
              );
            })}
          </ScrollView>
        </View>
      </View>
    );
  }

  renderContent() {
    const { cartData, cartEntryData, cartSelectedAll } = this.props;
    if (cartData.code) {
      return (
        <View style={{ flex: 1 }}>
          <View style={{ flex: 9, backgroundColor: '#F4F4F4' }} >
            <ScrollView style={{ flex: 1 }}>
              <Flex style={[{ flex: 1 }, styles.header, styles.fd_row, styles.bgFF]}>
                <Flex.Item style={[{ flex: 8 }, styles.paddingV10]}>
                  <View style={[styles.fd_row, styles.left1, styles.m_top5, styles.ph10]}>
                    <View style={[styles.flex, styles.fd_row, styles.left1]}>
                      <View style={[styles.onLineView1, styles.center]}>
                        <Text style={[styles.onLineBtn1]}>{cartData.cartType === 'TSK_ONLINE' ? '线上' : '线下'}</Text>
                      </View>
                      <View style={styles.flex}><Text numberOfLines={1} style={[styles.fontLarge, styles.textColor, { paddingHorizontal: 5 }]}>顾客:{cartData.customer.name} </Text></View>
                    </View>
                    <View style={styles.flex}>
                      <Text numberOfLines={1} style={[styles.fontLarge, styles.textColor, { paddingHorizontal: 5 }]}>电话:{cartData.customer.phoneNumber}</Text>
                    </View>
                  </View>
                  {
                    this.props.isValidMember ? <View style={[styles.m_top5, styles.marginB, styles.ph10, styles.left1, styles.fd_row]}>
                      <Text numberOfLines={1} style={[styles.fontSize14, styles.textColor1, styles.flex]}>五星会员:{cartData.customer.memberId}</Text>
                      <Text numberOfLines={1} style={[styles.fontSize14, styles.textColor1, styles.flex, { marginLeft: 10 }]}>积分:{+cartData.customer.totalAvailablePoint || 0}</Text>
                    </View> : <View />
                  }

                </Flex.Item >
                <Flex.Item style={[styles.mv20, { flex: 1 }]}><Text style={[styles.mh20]} /></Flex.Item>
              </Flex>

              <View style={{ flex: 6 }}>
                <ListView
                  enableEmptySections dataSource={cartEntryData}
                  renderRow={rowData => this.renderRow(rowData)}
                />
              </View>
              <View style={[{ flex: 2 }, styles.center, styles.fd_row, styles.paddingV]}>
                <View style={[{ flex: 5 }, styles.center]}>
                  <Button style={styles.buttonStyle} size="small" onClick={() => { this.continueShopping(cartData.customer.uid, cartData.customer.phoneNumber); }}>
                    <Text style={[styles.fontSize16, styles.textColor1]}>继续购物</Text></Button>
                </View>
                <View style={[{ flex: 5 }, styles.center]}>
                  <Button style={styles.buttonStyle} size="small" onClick={() => { Actions.wishlist({ from: '' }); }}>
                    <Text style={[styles.fontSize16, styles.textColor1]}>我的收藏</Text></Button>
                </View>
              </View>
            </ScrollView>

          </View>
          <CartPromotionPopupView />
          <View style={[styles.bottom, { flexDirection: 'column' }]}>
            <View style={[styles.left1, styles.flexDir, { height: 55 }]}>
              <View style={[styles.flex, styles.left1, styles.row1, styles.bgFF, styles.b_bottom]}>
                <TouchableHighlight style={styles.flex} underlayColor={'rgba(0,0,0,0)'} onPress={() => { this.showCartPromotion(); }}>
                  <View style={[styles.flex, styles.contentLR, styles.row1, styles.infoView, { marginLeft: 0 }]}>
                    <View style={[styles.row1, styles.left2]}>
                      <Text style={[styles.fontSize16, styles.textColor, { paddingLeft: 5 }]}>优惠</Text>
                    </View>
                    <View style={[styles.row1, styles.end2]}>
                      <Text numberOfLines={1} style={[styles.fontSize16, styles.textColor2, styles.m_left, { paddingRight: 8 }]}> {`${cartData.availablePromotions.length}个优惠`}</Text>
                      <Image style={[styles.arrowIcon]} source={require('./../../../../images/productDetallsImgs/icons/rn-chevron-right.png')} />
                    </View>
                  </View>
                </TouchableHighlight>
              </View>
            </View>
            {this.renderGifts(cartData.availablePromotions)}
            <View style={[styles.center, styles.flexDir, { height: 55, marginLeft: 10 }]}>
              <View style={[styles.center, styles.flexDir]}>
                <Checkbox checked={cartSelectedAll} onChange={(checked) => { this.renderSelectAllButton(cartData.cartType, checked.target.checked); }} >
                  <Text style={[styles.checkall, styles.fontLarge, styles.textColor1, styles.fontSize14, { paddingLeft: 5 }]}>全选</Text>
                </Checkbox>
              </View>
              <View style={[styles.center, styles.row1, { flex: 5 }]}>
                <Text style={[styles.textColor1, styles.fontSize14]}>合计 </Text>
                <Text style={[styles.prices, styles.fontSize18]}>¥ {cartData.totalPrice.value} </Text>
              </View>
              {this.renderCheckOutButton(cartData)}
            </View>
          </View>
        </View >);
    }
    return (<View />);
  }

  switchTab(index) {
    this.setState({ active: index });
  }

  getCartInfo(cartType) {
    const { userInfo } = this.props;
    const { userId, phoneNumber } = userInfo;
    Util.consoleLog('切换购物车:', cartType, userId, phoneNumber);
    this.props.dispatch({
      type: 'myCart/switchCartByCartType',
      userId,
      cartType,
      phoneNumber,
    });
  }

  renderTabContext() {
    const { activeTab } = this.props;
    const styleActive = { borderBottomColor: '#0083E0', borderBottomWidth: 2 };
    let onLineStyle = {};
    let offLineStyle = {};
    if (activeTab === 'TSK_ONLINE') {
      onLineStyle = styleActive;
    } else {
      offLineStyle = styleActive;
    }
    return (
      <View>
        <Flex style={styles.flexView}>
          <Flex.Item style={styles.flexItem} onPress={() => { Actions.home({ selectedTab: 'cart' }); }} >
            <TouchableHighlight underlayColor={'transparent'} onPress={() => { Actions.home({ selectedTab: 'cart' }); }}>
              <Image style={styles.imgLeft} source={require('./../../../../images/back_icon.png')} />
            </TouchableHighlight>
          </Flex.Item>
          <Flex.Item style={{ flex: 7 }} >
            <View style={{ flexDirection: 'row' }}>
              <TouchableHighlight underlayColor={'transparent'} onPress={() => this.getCartInfo('TSK_ONLINE')} >
                <View style={[{ height: 44, justifyContent: 'center' }, onLineStyle]}>
                  <Text style={styles.textLine}>线上购物车</Text>
                </View>
              </TouchableHighlight>
              <TouchableHighlight underlayColor={'transparent'} onPress={() => this.getCartInfo('TSK_OFFLINE')} >
                <View style={[{ height: 44, justifyContent: 'center' }, offLineStyle]}>
                  <Text style={styles.textLine}>线下购物车</Text>
                </View>
              </TouchableHighlight>
            </View>
          </Flex.Item>
        </Flex>
      </View>
    );
  }

  render() {
    return (
      <FsRootView isNavBarHidden>
        {this.renderShow()}
        {this.renderTabContext()}
        {this.renderContent()}
      </FsRootView>
    );
  }
}

MyCartView.propTypes = {
  dispatch: PropTypes.func,
  activeTab: PropTypes.string,
  userInfo: PropTypes.object,
  cartData: PropTypes.object,
  cartEntryData: PropTypes.object,
  cartSelectedAll: PropTypes.bool,
  cartEntrySelect: PropTypes.array,
  promotionMutualExclusives: PropTypes.array,
  newPrice: PropTypes.string,
  cartAppliedPromoitons: PropTypes.object,
  userId: PropTypes.string,
  cartId: PropTypes.string,
  cartType: PropTypes.string,
  phoneNumber: PropTypes.string,
  refresh: PropTypes.bool,
  isValidMember: PropTypes.bool,
  gifts: PropTypes.array,
};
export default connect((state) => {
  const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
  // TabView 默认选中
  const activeTab = state.myCart.activeTab;
  // isValidMember 当前用户是否是会员
  const isValidMember = state.myCart.isValidMember;
  // 当前购物车的用户名和手机号
  const userInfo = state.myCart.currentUser;
  /**
   *购物车数据
   */
  const cartData = state.myCart.cartData;
  let cartEntryData = [];
  if (state.myCart.cartData.entries) {
    cartEntryData = ds.cloneWithRows(state.myCart.cartData.entries.filter((item) => { return !item.promotionCode; }));
  } else {
    cartEntryData = ds.cloneWithRows([]);
  }
  // 初始化选中状态
  const cartSelectedAll = state.myCart.cartSelectedAll;
  const cartEntrySelect = state.myCart.cartEntrySelect;

  // 互斥信息
  const promotionMutualExclusives = state.myCart.promotionMutualExclusives;
  const cartAppliedPromoitons = state.myCart.cartAppliedPromoitons;
  // 延保产品信息
  const extendwarrant = state.myCart.extendwarrant; // 默认选中无延保信息
  const extendwarrantTag = state.myCart.extendwarrantTag; // 默认延保不选择
  const extendwarrantVal = state.myCart.extendwarrantVal;// 默认延保年限
  const extendcode = state.myCart.extendcode;// 延保商品id

  // 默认修改价格
  const newPrice = String(state.myCart.newPrice);
  return {
    activeTab,
    userInfo,
    cartData,
    cartEntryData,
    cartSelectedAll,
    cartEntrySelect,
    promotionMutualExclusives,
    extendwarrant,
    extendwarrantTag,
    extendwarrantVal,
    extendcode,
    newPrice,
    cartAppliedPromoitons,
    isValidMember,
    gifts: state.myCart.gifts,
  };
})(MyCartView);
