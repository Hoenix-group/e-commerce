import React, { Component, PropTypes } from 'react';
import { Checkbox, Button, Popup } from 'antd-mobile';
import { View, Text, TextInput, TouchableHighlight, ScrollView, Image, Platform, KeyboardAvoidingView, keyboardShouldPersistTaps, Keyboard } from 'react-native';
import * as config from '../../../utils/configuration';
import Util from './../../../utils/utils';
import styles from './../../../components/ProductDetails/styles';

const B = config.B_DISCOUNT;
const D = config.D_DISCOUNT;
const BD = [B, D];

class CartEntryPromotionPopupView extends Component {
  constructor(props) {
    super(props);
    this.promotions = this.props.promotions; // 这个是当前显示在popup的折扣信息
    this.cartInfo = this.props.cartInfo;
    this.promotionMutualExclusives = this.props.promotionMutualExclusives; // 这个是从前面传来的
    this.state = {
      promotionMutualExclusives: this.props.promotionMutualExclusives,
      cartAppliedPromoitons: this.props.cartAppliedPromoitons,
      keyboardHeight: 0
    };
  }

  componentWillMount() {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  _keyboardDidShow = (e) => {
    const height = Platform.OS === 'android' ? (0) : (e.startCoordinates.height);
    this.setState({ keyboardHeight: height });
  }

  _keyboardDidHide = () => {
    this.setState({ keyboardHeight: 0 });
  }

  onConfirm() {
    // 把这个popup里面的promo和exclusive都发到model里
    this.props.dispatch({ type: 'myCart/updatePromoAndExcFromPopup', promo: this.state.cartAppliedPromoitons, exclu: this.state.promotionMutualExclusives });
    this.props.onConfirm();
    const { userId, cartId, cartType, region } = this.cartInfo;
    this.props.dispatch({ type: 'myCart/applyPromotion', userId, cartId, cartType, region, checked: true });
  }

  onSelect(promotionType, ruleCode, checked, promotionMutualExclusives) {
    Util.consoleLog('选择促销', promotionType, ruleCode, checked, promotionMutualExclusives);
    const cartAppliedPromoitons = this.state.cartAppliedPromoitons;
    const entryAppliedExclusives = this.state.promotionMutualExclusives;
    const { entryNumber } = this.cartInfo;
    if (!checked) {
      if (BD.includes(promotionType)) {
        const oldRuleValue = cartAppliedPromoitons[ruleCode];
        delete oldRuleValue[entryNumber];
        let isEmptyObject = true;
        for (const key in oldRuleValue) {
          isEmptyObject = false;
          break;
        }
        if (isEmptyObject) {
          delete cartAppliedPromoitons[ruleCode];
        }
      } else {
        delete cartAppliedPromoitons[ruleCode];
      }
      // 从this.state.promotionMutualExclusives中删除
      if (promotionMutualExclusives && promotionMutualExclusives.length > 0) {
        promotionMutualExclusives.map((item) => { entryAppliedExclusives.splice(entryAppliedExclusives.indexOf(item), 1); });
      }
    } else {
      if (BD.includes(promotionType)) {
        let oldRuleValue = cartAppliedPromoitons[ruleCode];
        if (!oldRuleValue) {
          oldRuleValue = {};
          oldRuleValue[entryNumber] = '';
        }
        cartAppliedPromoitons[ruleCode] = oldRuleValue;
      } else {
        cartAppliedPromoitons[ruleCode] = '';
      }
      // 添加到本地互斥
      if (promotionMutualExclusives && promotionMutualExclusives.length > 0) {
        entryAppliedExclusives.push(...promotionMutualExclusives);
      }
    }
    Util.consoleLog('选择促销结果', cartAppliedPromoitons);
    this.setState({
      cartAppliedPromoitons,
      promotionMutualExclusives: entryAppliedExclusives,
    });
  }

  /**
     * 获取上一次输入的值
     */
  getLastInputValue(item) {
    const { entryNumber } = this.cartInfo;
    const { ruleCode } = item;
    const cartAppliedPromoitons = this.state.cartAppliedPromoitons;
    if (cartAppliedPromoitons) {
      const promotion = cartAppliedPromoitons[ruleCode];
      if (promotion) {
        const lastInput = promotion[entryNumber];
        if (lastInput === undefined) {
          return '';
        }
        return String(lastInput);
      }
    }
    return '';
  }

  /**
    *  不管后台促销配置是百分比还是具体金额，前台输入的并且传给后台的都是具体金额
    *  根据输入框是否有值然后决定是否自动勾选checkbox
    */
  inputBDDiscountValue(item, ruleValue) {
    const { ruleCode, promotionMutualExclusives } = item;
    const { entryNumber } = this.cartInfo;
    Util.consoleLog('更改BD折扣前的参数和输入值', 'entryNumber', entryNumber, 'ruleCode', ruleCode, 'ruleValue', ruleValue);
    const cartAppliedPromoitons = this.state.cartAppliedPromoitons;
    const entryAppliedExclusives = this.state.promotionMutualExclusives;
    const oldRuleValue = cartAppliedPromoitons[ruleCode];
    if (cartAppliedPromoitons) {
      // 判断当前输入的数值是否为空
      if (ruleValue && ruleValue !== '') {
        // 如果输入的值不为空
        if (oldRuleValue && oldRuleValue instanceof Object && oldRuleValue !== '') {
          // 如果已经存在，则更新
          oldRuleValue[entryNumber] = ruleValue;
        } else {
          // 如果不存在，则创建
          const newRuleValue = {};
          newRuleValue[entryNumber] = ruleValue;
          cartAppliedPromoitons[ruleCode] = newRuleValue;
        }
        // 添加到本地互斥
        if (promotionMutualExclusives && promotionMutualExclusives.length > 0) {
          entryAppliedExclusives.push(...promotionMutualExclusives);
        }
      } else {
        // 如果输入的值为空 判断state中是否有旧值
        if (oldRuleValue && oldRuleValue instanceof Object && oldRuleValue !== '') {
          // 如果state中已经存在，则删除，按照entryNumber删除
          delete oldRuleValue[entryNumber];
          // 如果所有entry上的BD折扣都没有输入，则删除state中的这个促销
          let isEmptyObject = true;
          for (const key in oldRuleValue) {
            isEmptyObject = false;
            break;
          }
          if (isEmptyObject) {
            delete cartAppliedPromoitons[ruleCode];
          }
          // 从this.state.promotionMutualExclusives中删除
          if (promotionMutualExclusives && promotionMutualExclusives.length > 0) {
            promotionMutualExclusives.map((v) => { entryAppliedExclusives.splice(entryAppliedExclusives.indexOf(v), 1); });
          }
        }
      }
    }
    this.setState({
      cartAppliedPromoitons, promotionMutualExclusives: entryAppliedExclusives,
    });
    Util.consoleLog('更改BD折扣后的结果', cartAppliedPromoitons);
  }

  /**
   * 根据BD折扣输入框是否有值来判断当前checkbox是否勾选
   */
  isAutoSelected(item) {
    const cartAppliedPromoitons = this.state.cartAppliedPromoitons;
    const { entryNumber } = this.cartInfo;
    const { ruleCode, promotionType } = item;
    let isAutoSelected = false;
    const oldRuleValue = cartAppliedPromoitons[ruleCode];
    //区分BD折扣和其他折扣
    if (BD.includes(promotionType)) {
      if (cartAppliedPromoitons) {
        if (oldRuleValue && oldRuleValue instanceof Object && oldRuleValue !== '') {
          if (oldRuleValue[entryNumber] && oldRuleValue[entryNumber] !== '') {
            isAutoSelected = true;
          }
        }
      }
    } else {
      if (cartAppliedPromoitons !== undefined && cartAppliedPromoitons[ruleCode] !== undefined) {
        isAutoSelected = true;
      }
    }
    return isAutoSelected;
  }

  /**
     * 判断B D折扣是否可以输入
     * 这里只判断互斥，只有互斥的情况是无法选择
     */
  isEditable(item) {
    const isMutex = this.state.promotionMutualExclusives.includes(item.code);
    if (isMutex) {
      return false;
    }
    return true;
  }


  /**
   * 判断是否超出阀值
   */
  isOverThreshold(item, inputValue) {
    const bdDiscounts = item.bdDiscounts;
    const { productPrice } = this.cartInfo;
    if (bdDiscounts && bdDiscounts.length > 0) {
      if (bdDiscounts[0] && bdDiscounts[0].bdDiscountActions && bdDiscounts[0].bdDiscountActions.length > 0) {
        const { absolute, value } = bdDiscounts[0].bdDiscountActions[0];
        // absolute true  数字， false 百分比
        if (absolute) {
          if (inputValue > value) {
            return true;
          }
        } else {
          // 先把金额换算成百分比然后比较是否超出可用阀值
          const inputPercent = Math.ceil((inputValue * 100) / productPrice);
          if (inputPercent > value) {
            return true;
          }
        }
      }
    }
    return false;
  }


  /**
   * 折扣超出阀值button逻辑
   */
  renderOverThresholdButton(item) {
    const cartAppliedPromoitons = this.state.cartAppliedPromoitons;
    const { entryNumber } = this.cartInfo;
    const { ruleCode } = item;
    if (cartAppliedPromoitons) {
      const oldRuleValue = cartAppliedPromoitons[ruleCode];
      if (oldRuleValue) {
        const value = oldRuleValue[entryNumber];
        const isOverThreshold = this.isOverThreshold(item, value);
        if (isOverThreshold) {
          return '超出力度,需申请！';
        }
      }
    }
    return '';
  }


  /**
   * B2 D 折扣跟其他促销多了输入框，需要输入值
   */
  renderDifPromotionContext(item) {
    if (BD.includes(item.promotionType)) {
      return (
        <View style={[styles.flex,styles.row1, styles.left1]}>
          <Text style={[styles.contitle,{ paddingLeft: 10}]}>:立减¥</Text>
          <TextInput
            keyboardType='numeric'
            maxLength={6}
            editable={this.isEditable(item)}
            defaultValue={this.getLastInputValue(item)}
            style={[styles.textInputView]}
            onChangeText={(value) => { this.inputBDDiscountValue(item, value); }}
          />
          {/*<Text style={[styles.conText,{ paddingLeft: 2}]}>60%</Text>*/}
          <Text style={[styles.conText,{ paddingLeft: 2}]}> </Text>
          <Text style={[styles.sPrice, { paddingLeft: 5, width:125 }]}>{this.renderOverThresholdButton(item)}</Text>
        </View>
      );
    }
    return (null);
  }

  render() {
    const maxheight = parseInt(this.state.keyboardHeight, 10);
    //const styleH = parseInt(this.state.keyboardHeight, 10) > 0 ? { "maxHeight": (Dimensions.get('window').height / 2) + 20 + maxheight } : { "maxHeight": (Dimensions.get('window').height / 2) + 20 };
    const styleHV = parseInt(this.state.keyboardHeight, 10) > 0 ? { "height": maxheight } : {};
    return (
      <View>
        <View style={[styles.closeList, styles.promView]} >
          <View style={[styles.center, styles.row1]}>
            <Text style={styles.promTitle}>选择促销</Text>
          </View>
        </View>
        <ScrollView>
          {this.promotions.map((item, i) => {
            return (
              <View key={i} style={[{flex:1, paddingHorizontal: 10 }]}>
                <View style={[{ flex:1,paddingVertical: 10 }, styles.row1, styles.left1, styles.borderT]}>
                  <View style={[{paddingHorizontal: 5,width:90}, styles.row1, styles.left1,]}>
                    <Checkbox
                      disabled={this.state.promotionMutualExclusives.includes(item.code)}
                      defaultChecked={!!item.applied}
                      checked={this.isAutoSelected(item)}
                      onChange={(checked) => { this.onSelect(item.promotionType, item.ruleCode, checked.target.checked, item.promotionMutualExclusives); }}
                    >
                      <Text style={[{ paddingLeft: 5}, styles.contitle]}>{item.title}</Text>
                    </Checkbox>
                  </View>
                  <View style={[styles.flex,styles.row1, styles.left1]}>
                    {this.renderDifPromotionContext(item)}
                  </View>
                </View>
              </View>
            );
          },
          )}
        </ScrollView>
        {/* 关闭按钮 */}
        <TouchableHighlight style={styles.closeIcon} underlayColor={'rgba(0,0,0,0)'} onPress={() => { this.props.onClose(); }}>
          <Image style={{ width: 12, height: 12 }} source={require('./../../../../images/productDetallsImgs/icons/rn-close-s.png')} />
        </TouchableHighlight>
        <Button style={{ borderRadius: 0 }} type="primary" onClick={() => this.onConfirm()}>确定</Button>
        <View style={styleHV} />
      </View >
    );
  }
}
CartEntryPromotionPopupView.propTypes = {
  promotions: PropTypes.array,
  promotionMutualExclusives: PropTypes.array,
  cartInfo: PropTypes.object,
  onConfirm: PropTypes.func,
  dispatch: PropTypes.func,
  cartAppliedPromoitons: PropTypes.object,
};

export default CartEntryPromotionPopupView;
