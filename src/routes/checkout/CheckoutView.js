import React, { Component, PropTypes } from 'react';
import { connect } from 'dva/mobile';
import { Actions } from 'react-native-router-flux';
import { Text, RefreshControl, Toast, Popup, Checkbox, Flex, Picker, List } from 'antd-mobile';
import { View, Image, ScrollView, TouchableHighlight, TextInput, InteractionManager } from 'react-native';
import styles from './styles';
import FsRootView from './../../components/common/FsRootView';
import AnonymousVoucherView from './AnonymousVoucherView';
import * as validator from '../../utils/validator';
import * as config from '../../utils/configuration';

const iconRight = (<Image style={{ width: 12, height: 12 }} source={require('./../../../images/productDetallsImgs/icons/rn-chevron-right.png')} />);

class CheckoutView extends Component {

  constructor() {
    super();
    this.state = {
      refreshing: false,
    };
  }

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'checkout/retrieveCart', cb: this.onStopRefresh.bind(this) });
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this._onRefresh();
    });
    this.props.dispatch({ type: 'checkout/fetchVouchers' });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.anonymousCode !== this.props.anonymousCode ||
      nextProps.tempCash !== this.props.tempCash ||
      nextProps.anonymousChecked !== this.props.anonymousChecked ||
      nextProps.cashChecked !== this.props.cashChecked) {
      this.showVouchers(nextProps);
    }
    if (nextProps.data && this.props.data && nextProps.data.voucherDiscount !== this.props.data.voucherDiscount) {
      this.showVouchers(nextProps);
    }
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: 'checkout/initializeState',
    });
  }

  onStopRefresh() {
    this.setState({
      refreshing: false,
    });
  }
  onNavigate(order) {
    const { dispatch } = this.props;
    dispatch({
      type: 'cashDesk/setPaymentData',
      orderCode: order.code,
      totalFee: order.value,
      created: order.created,
    });
    Actions.cashDesk();
  }

  // 结算提交订单跳页逻辑，server ready以后用以下代码调试并替换上文的onNavigate方法
  onNavigate_(data) {
    const { dispatch } = this.props;
    const { subOrder, deliveryAddress, created, code, totalPrice: { value } } = data;

    // 将subOrder下的所有家电展开到一个数组中，并切把consignment的code赋值给家电的cCode属性
    const allCons = []; // 存放所有consignments
    const allDis = []; // 存放所有需要配送商品的eId以及是否选择配送时间状态对象的数组
    const allIns = []; // 存放所有需要安装商品的eId以及是否选择安装时间状态对象的数组
    subOrder.map((order) => {
      order.consignments.map((con) => {
        con.isWhiteGoods = false;
        !con.conEntryCode && (con.conEntryCode = 666);

        if (con.sentMode === 'BYVENDOR') {
          allDis.push({ conId: con.code, dated: false });
        }

        con.entries.map((entry) => {
          !con.pName && (con.pName = entry.orderEntry.product.name);
          !con.pCode && (con.pCode = entry.orderEntry.product.code);
          !con.quantity && (con.quantity = entry.quantity);

          if (entry.orderEntry.product.isWhiteGoods) {
            con.isWhiteGoods = true;
            allIns.push({ conId: con.code, dated: false });
          }
        });

        allCons.push(con);
      });
    });

    if (this.canGoDistribution(allDis, allIns)) {
      dispatch({
        type: 'distribution/initDistribution',
        consignments: allCons,
        orderCode: code,
        regionCode: deliveryAddress.cityCode,
        totalFee: value,
        created,
        allDis,
        allIns,
      });
      Actions.distribution();
      return;
    }

    dispatch({
      type: 'cashDesk/setPaymentData',
      orderCode: code,
      totalFee: value,
      created,
    });
    Actions.cashDesk();
  }

  canGoDistribution(dis, ins) {
    return dis.length || ins.length;
  }

  _onRefresh() {
    const { dispatch } = this.props;
    this.setState({ refreshing: true });
    dispatch({ type: 'checkout/retrieveCart', cb: this.onStopRefresh.bind(this) });
    dispatch({ type: 'checkout/fetchVouchers' });
  }

  changeDeliveryMode(entryNumber, deliveryMode) {
    const { dispatch, data } = this.props;
    const deliveryAddress = data ? data.deliveryAddress : null;

    if (!validator.validateNotNull(deliveryAddress, '地址')) {
      return;
    }
    dispatch({ type: 'checkout/updateDeliveryMode', entryNumber, deliveryMode, cb: this._onRefresh.bind(this) });
  }

  renderGiftContent(promotion, entry) {
    const { data } = this.props;
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
              <Text style={entry ? [styles.fontSize12, styles.textColor1, styles.m_left] : [styles.fontSize12, styles.textColor1]}>{`${item.product.name}      x${item.quantity}`}</Text>
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
        <View style={[styles.flex, styles.p_left15_lr, styles.p_right, styles.bgFF, { height: 46 }]} >
          <View style={[styles.flex, styles.contentLR, styles.row1, styles.p_left15_lrv, styles.b_Top]}>
            <Text style={[styles.textColor, styles.fontLarge]}>赠品</Text>
            <View style={[styles.center, styles.row1]}>
              <ScrollView>
                {promotions.map((item, i) => {
                  return (
                    <View key={i} style={{ flexDirection: 'column' }}>
                      <Text numberOfLines={1} style={[styles.fontSize12, styles.textColor1]}>[{item.title}]</Text>
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
      <View style={[{ flex: 1 }, styles.center, styles.row1, { height: 40 }]}>
        <View style={[styles.flex, styles.contentLR, styles.row1, styles.infoView]}>
          <View style={[styles.row1, styles.left2, styles.p_left]}>
            <Text style={[styles.fontSize12, styles.textColor]}>赠品</Text>
            <View style={{ flex: 1 }}>
              <ScrollView>
                {promotions.map((item, i) => {
                  return (
                    <View key={i} style={{ flexDirection: 'column' }}>
                      <Text style={[styles.fontSize12, styles.textColor1, styles.m_left]}>[{item.title}]</Text>
                      <View>
                        {this.renderGiftContent(item, entry)}
                      </View>
                    </View>
                  );
                })}
              </ScrollView>
            </View>
          </View>
        </View>
      </View>
    );
  }

  renderSalesAttributeValue(entry) {
    const container = [];
    if (entry.product && entry.product.salesAttributeValue) {
      for (const x in entry.product.salesAttributeValue) {
        const displayTxt = `${x}: ${entry.product.salesAttributeValue[x]}`;
        const key = `${entry.product.code}-${x}`;
        container.push(<Text key={key} style={[styles.font_10, styles.textColor2, styles.m_right]}>{displayTxt}</Text>);
      }
    }
    return container;
  }

  renderPromotionViewTxt(entry) {
    const { availablePromotions } = entry;
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
        viewList.push(<Text key={index} style={[styles.fontSize12, styles.textColor1]}>{lineTxt}</Text>);
      });
    } else {
      viewList.push(
        <Text numberOfLines={1} key={0} style={[styles.fontSize12, styles.textColor1]}>无促销信息</Text>,
      );
    }
    return viewList;
  }

  renderWarrantyViewTxt(rowData) {
    const { entries } = rowData;
    let warranty = '无延保信息';
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

  renderProduct(aEntries) {
    return aEntries.map((entry, inx) => (
      <View key={inx} style={[styles.flex, styles.bgFF, styles.marginT10, styles.p_bottom10]}>
        <View style={[styles.flex, styles.center, styles.col1, styles.bgFF]}>

          <View style={[{ flex: 2, paddingBottom: 5 }, styles.center, styles.row1]}>
            <View style={[{ padding: 10 }, styles.center, styles.row1]}>
              <Image style={[styles.image_thumb]} source={require('./../../../images/sale_product_01_280x190.png')} />
            </View>
            <View style={[{ flex: 1 }, styles.m_left]}>
              <View style={[{ flexWrap: 'wrap' }, styles.p_top10]}>
                <Text style={[styles.fontLarge, styles.textColor, { paddingRight: 5 }]}>{entry.product ? entry.product.name : ''}</Text>
              </View>
              <View style={[styles.fd_row, styles.p_top10]}>
                {this.renderSalesAttributeValue(entry)}
              </View>
              <View style={[styles.contentLR, styles.row1, { height: 30, top: 5 }]}>
                <View style={[styles.fd_row, styles.center]}>
                  <Text style={[styles.sPrice]}>¥{entry.totalPrice ? entry.totalPrice.value : entry.entryNumber}</Text>
                </View>
                <View style={[styles.fd_row, styles.center, styles.m_right15]}>
                  <Text>{entry.quantity}件</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={[{ flex: 1 }, styles.center, styles.row1]}>
            <TouchableHighlight style={styles.flex} underlayColor={'rgba(0,0,0,0)'} onPress={() => { }} >
              <View style={[styles.flex, styles.contentLR, styles.row1, styles.infoView]}>
                <View style={[styles.row1, styles.left2, styles.p_left]}>
                  <Text style={[styles.fontSize12, styles.textColor]}>促销</Text>
                  <Text style={[styles.fontSize12, styles.textColor1, styles.m_left]}>{this.renderPromotionViewTxt(entry)}</Text>
                </View>
              </View>
            </TouchableHighlight>
          </View>

          {this.renderGifts(entry.availablePromotions, entry)}

          <View style={[{ flex: 1 }, styles.center, styles.row1]}>
            <TouchableHighlight style={styles.flex} underlayColor={'rgba(0,0,0,0)'} onPress={() => { }} >
              <View style={[styles.flex, styles.contentLR, styles.row1, styles.infoView]}>
                <View style={[styles.row1, styles.left2, styles.p_left]}>
                  <Text style={[styles.fontSize12, styles.textColor]}>延保</Text>
                  <Text style={[styles.fontSize12, styles.textColor1, styles.m_left]}>{this.renderWarrantyViewTxt(entry)}</Text>
                </View>
              </View>
            </TouchableHighlight>
          </View>

        </View>

        <View style={[styles.flex, styles.end1, styles.row1, styles.m_right15, { height: 30, marginTop: 3 }]}>
          <Text style={[styles.type, entry.sentMode === 'BYVENDOR' ? styles.typeSelected : {}]} onPress={() => { this.changeDeliveryMode(entry.entryNumber, 'BYVENDOR'); }}>配送</Text>
          <Text style={[styles.type, entry.sentMode === 'BYSELF' ? styles.typeSelected : {}]} onPress={() => { this.changeDeliveryMode(entry.entryNumber, 'BYSELF'); }}>自提</Text>
        </View>
        {
          entry.sentMode === 'BYSELF' ?
            (<View style={[styles.flex, styles.end1, styles.row1]}>
              <Picker
                extra=""
                data={this.props.pickups}
                title="可选仓库" cols={1}
                onChange={v => this.setSelfPickup(v[0], entry.entryNumber)}
              >
                <List.Item arrow="empty" style={styles.selfAddsContainer} onClick={() => this.getPickups(entry.entryNumber)}>
                  <Text style={styles.selfAdds}>{entry.pickupPlaceName || '选择自提仓库'}</Text>
                </List.Item>
              </Picker>
            </View>) : null
        }
      </View>
    ));
  }

  _onSubmit() {
    const { data, pointToUse } = this.props;
    const deliveryAddress = data ? data.deliveryAddress : null;

    if (!validator.validateNotNull(deliveryAddress, '地址')) {
      return;
    }

    if (this.checkSentMode() === 0) {
      Toast.info('未选择配送方式', 1);
      return;
    }

    if (this.checkSentMode() === 1) {
      Toast.info('未选择自提店', 1);
      return;
    }

    this.usePoint(pointToUse);
  }

  checkSentMode() {
    const { entries } = this.props.data;
    for (const i of entries) {
      if (i.promotionCode) { continue; }
      if (!i.sentMode) { return 0; }
      if (i.sentMode === 'BYSELF' && !i.pickupPlace) { return 1; }
    }
    return true;
  }

  configureAddress(deliveryAddress) {
    this.props.dispatch({ type: 'checkout/configureAddress', address: deliveryAddress });
  }

  getPickups(entryNumber) {
    const { dispatch, pickups } = this.props;
    if (!pickups || !pickups.length) {
      dispatch({ type: 'checkout/getSelfPickupAdds', entryNumber });
    }
  }

  /**
   * 设置自提仓库
   */
  setSelfPickup(value, entryNum) {
    this.props.dispatch({ type: 'distribution/setEntryPickupPlaceInCart', entryNum, place: value, cb: this._onRefresh.bind(this) });
  }

  goReceipt(data) {
    this.props.dispatch({
      type: 'receipt/initReceipt',
      receiverName: data.customer.name,
      receiptHeader: data.customer.name,
      id: data && data.invoiceInfo && data.invoiceInfo.id ? data.invoiceInfo.id : '',
      isOnline: data.cartType === 'TSK_ONLINE',
    });

    Actions.receipt();
  }

  changePointToUse(pointToUse) {
    this.props.dispatch({ type: 'checkout/changePointToUse', pointToUse, pointWarning: false });
  }

  usePoint(point) {
    const { data, dispatch } = this.props;
    const { customer: { totalAvailablePoint } } = data;
    if (+point % 100 > 0) {
      Toast.info('积分应为100的整数倍');
      return;
    }

    if (+point && (!totalAvailablePoint || +point > +totalAvailablePoint)) {
      Toast.info('当前可用积分不足');

      let pointToUse = '0';
      if (+totalAvailablePoint) {
        const position = totalAvailablePoint.indexOf('.');
        const end = position === -1 ? totalAvailablePoint.length : position;
        pointToUse = `${totalAvailablePoint.substr(0, end - 2) * 100}`;
      }
      dispatch({ type: 'checkout/changePointToUse', pointToUse, pointWarning: true });

      return;
    }

    if (data && data.totalPrice.value && +point / 100 > +data.totalPrice.value) {
      Toast.info('积分抵消金额不可大于总金额');
      return;
    }

    dispatch({ type: 'checkout/usePoint', point, cb: this.onNavigate.bind(this) });
  }

  initInvoice(data) {
    if (data && data.invoiceInfo && data.invoiceInfo.id) {
      switch (data.invoiceInfo.invoiceType) {
        case 'COMMON':
          return '纸质发票';
        case 'ELECTRONIC':
          return '电子发票';
        default:
          return '不开发票';
      }
    }
    return '不开发票';
  }

  renderAddress(deliveryAddress) {
    if (!deliveryAddress) {
      return (
        <View style={[{ flex: 1 }]}>
          <View style={[styles.m_top5, styles.marginB10, styles.ph10, styles.row1, styles.left1]}>
            <Text style={[styles.fontLarge, styles.textColor1, { paddingVertical: 10 }]}>{deliveryAddress ? '' : '请选择送货地址'}</Text>
          </View>
        </View>
      );
    }
    return (
      <View style={[{ flex: 1 }]}>
        <View style={[styles.fd_row, styles.left1, styles.m_top5, styles.ph10]}>
          <Text numberOfLines={1} style={[styles.fontLarge, styles.textColor, { paddingVertical: 5 }]}>{deliveryAddress.receiver}：{`${deliveryAddress.phone}`}</Text>
          {deliveryAddress.isDefaultAddress ? (
            <View style={[styles.onLineView1, styles.center, { marginLeft: 5 }]}>
              <Text style={[styles.onLineBtn1]}>默认</Text></View>
          ) : (<Text />)}
        </View>
        <View style={[styles.marginB10, styles.ph10, styles.row1, styles.left1]}>
          <Image style={styles.addressIcon} source={require('./../../../images/marker.png')} />
          <Text style={[styles.fontMiddle, styles.textColor1]}>{deliveryAddress.fullAddress}</Text>
        </View>
      </View>
    );
  }
  // 显示卡券popup
  showVouchers(props) {
    const { pv, cv, anonymousCode, anonymousChecked } = props;

    Popup.show(
      <View style={{ height: 300 }}>
        <View style={[styles.popupTitleContainer, styles.b_bottom, styles.row1, styles.center]}>
          <Text style={styles.popupTitle}>选择卡券</Text>
        </View>
        <TouchableHighlight underlayColor={'rgba(0,0,0,0)'} style={styles.closeIcon} onPress={() => { Popup.hide(); }}>
          <Image style={{ width: 12, height: 12, marginTop: 5 }} source={require('./../../../images/productDetallsImgs/icons/rn-close-s.png')} />
        </TouchableHighlight>
        <ScrollView>
          <View style={[styles.kindTitleContainer, styles.b_bottom, styles.row1]}>
            <Text style={[styles.kindTitle, styles.m_left15]}>卡券种类一</Text>
          </View>
          <View style={[{ marginBottom: 5 }, styles.b_bottom]}>
            {
              pv.length ? pv.map(item =>
                <View key={item.voucherCode} style={[styles.checkbox, styles.mv5]}>
                  <Checkbox checked={item.selected} onChange={(e) => { this.useVoucher(e, item); }} style={[{ width: 16, height: 16 }, styles.m_left35]} />
                  <Text style={[styles.textColor]}>{item.name},</Text>
                  <Text style={{ color: 'red' }}>{item.currentValue}</Text>
                  <Text style={[styles.textColor]}>元可用</Text>
                </View>,
              ) : (<Text style={[styles.kindTitle, styles.m_left15]}>当前无可用卡券,请使用其他卡券</Text>)
            }
          </View>

          <View style={[styles.kindTitleContainer, styles.b_bottom, styles.row1]}>
            <Text style={[styles.kindTitle, styles.m_left15]}>余额券</Text>
          </View>
          <View style={[{ marginBottom: 5 }, styles.b_bottom]}>
            {
              cv.length ? cv.map((item, index) =>
                <View key={item.voucherCode} style={[styles.checkbox, styles.mv5]}>
                  <Checkbox onChange={() => { }} style={[{ width: 16, height: 16 }, styles.m_left35]} />
                  <Text style={[styles.textColor]}>小额现金卡券</Text>
                  <Text style={[styles.textColor, { color: 'red' }]}>余额: {item.currentValue}</Text>
                  <Text style={[styles.textColor, { color: 'red' }]}>使用:</Text>
                  <TextInput
                    underlineColorAndroid="transparent"
                    keyboardType="numeric"
                    style={styles.textInput}
                    value={item.valueToUse}
                    onBlur={() => { this.useSmallCash(item); }}
                    onChangeText={(value) => { this.changeTempCash(item, value, index); }}
                  />
                </View>,
              ) : (<Text style={[styles.kindTitle, styles.m_left15]}>当前无可用卡券,请使用其他卡券</Text>)
            }
          </View>

          <View style={[styles.kindTitleContainer, styles.b_bottom, styles.row1]}>
            <Text style={[styles.kindTitle, styles.m_left15]}>匿名卷</Text>
          </View>
          <AnonymousVoucherView
            anonymousCode={anonymousCode}
            anonymousValidate={code => this.anonymousValidate(code)}
            anonymousCodeChange={val => this.anonymousCodeChange(val)}
            anonymousChecked={anonymousChecked}
            anonymousCheckedChange={checked => this.anonymousCheckedChange(checked)}
          />
        </ScrollView>
        <View style={styles.popupConfirm}>
          <TouchableHighlight underlayColor={'rgba(0,0,0,0)'} onPress={() => { Popup.hide(); }} style={styles.btn_b}>
            <Text style={[styles.font_w, styles.font_16, styles.font_wb, { height: 50, textAlign: 'center', marginTop: 13 }]}>确定</Text>
          </TouchableHighlight>
        </View>
      </View>,
      { animationType: 'slide-up', maskClosable: true, onMaskClose: () => { Popup.hide(); } },
    );
  }

  changeTempCash(item, cash, index) {
    const tempCash = item.currentValue >= cash ? cash : item.currentValue.toString();
    this.props.dispatch({ type: 'checkout/changeTempCash', tempCash, index });
  }

  changeCashChecked(cashChecked, index) {
    this.props.dispatch({ type: 'checkout/changeCashChecked', cashChecked, index });
  }

  /**
   * 使用小额现金券和匿名卡券以外的卡券，暂时调用此方法，以后可能会细分
   * @param {*} e 获取属性来切换checkbox的选中状态
   * @param {*} item 所选卡券
   */
  useVoucher(e, item) {
    if (this.availableToUseVoucher(item)) {
      this.props.dispatch({ type: 'checkout/useOrCancelVouchers', code: item.voucherCode, isUse: e.target.checked, value: item.currentValue, cb: this._onRefresh.bind(this) });
    }
  }

  /**
   * 使用小额现金卡券调用此方法
   * @param {*} item 所选卡券对象
   */
  useSmallCash(item) {
    if (this.availableToUseVoucher(item)) {
      this.props.dispatch({ type: 'checkout/useOrCancelVouchers', code: item.voucherCode, isUse: true, value: item.valueToUse, cb: this._onRefresh.bind(this) });
    }
  }

  anonymousCodeChange(anonymousCode) {
    this.props.dispatch({ type: 'checkout/anonymousCodeChange', anonymousCode, anonymousChecked: true });
  }

  anonymousValidate(code) {
    const { dispatch, av } = this.props;
    if (av.length) {
      for (const v of av) {
        if (v.voucherCode === code) {
          dispatch({ type: 'checkout/useOrCancelVouchers', code, isUse: true, value: v.currentValue, cb: this._onRefresh.bind(this) });
          return;
        }
      }
    }
    Toast.info('未找到此匿名卡券');
  }

  anonymousCheckedChange(checked) {
    this.props.dispatch({ type: 'checkout/anonymousCheckedChange', anonymousChecked: checked });
  }

  availableToUseVoucher(item) {
    const { pv } = this.props;
    for (const i of pv) {
      if (i.selected && i.vourcherType === item.vourcherType && !item.isMultiUse) {
        Toast.info('此卡券不支持叠加使用');
        return false;
      }
    }

    return true;
  }

  render() {
    const { data, vouchersAmount, pointToUse, pointWarning, selectedVouchers } = this.props;
    const deliveryAddress = data ? data.deliveryAddress : '';
    const deliveryCost = data ? data.deliveryCost : '';
    const orderDiscounts = data ? data.totalDiscounts : '';
    const entries = data ? data.entries : [];
    const invoiceType = this.initInvoice(data);
    const availablePromotions = data ? data.availablePromotions : [];
    const pointDeduction = data ? data.pointDeduction : '';

    return (
      <FsRootView isNavBarHidden={false}>
        <View style={[{ flex: 1 }, styles.bg]}>
          <View style={{ flex: 1 }}>
            <ScrollView
              refreshControl={<RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh.bind(this)}
              />}
            >

              <Flex style={[{ flex: 1 }, styles.header, styles.fd_row, styles.contentLR, styles.bgFF, styles.b_bottom, styles.p_right15]}>
                <Flex.Item style={{ flex: 8 }}>
                  <TouchableHighlight style={styles.flex} underlayColor={'rgba(0,0,0,0)'} onPress={() => { this.configureAddress({ deliveryAddress }); }} >
                    {/* <View style={[{ flex: 1 }]}>*/}
                    {/* <View style={[styles.fd_row, styles.m_top5, styles.ph10]}>*/}
                    {/* <Text style={[styles.font_14, styles.textColor]}>送至:{} </Text>*/}
                    {/* <Text style={[styles.font_14, styles.textColor, { marginHorizontal: 5 }]}>{}</Text>*/}
                    {/* </View>*/}
                    {/* <View style={[styles.m_top5, styles.marginB10, styles.ph10]}>*/}
                    {/* {this.renderAddress(deliveryAddress)}*/}
                    {/* </View>*/}
                    {/* </View>*/}
                    {this.renderAddress(deliveryAddress)}
                  </TouchableHighlight>
                </Flex.Item >
                {iconRight}
              </Flex>

              {
                this.renderProduct(entries.filter((item) => { return !(item.promotionCode && item.product.productAttribute === config.GIFT); }))
              }

              <TouchableHighlight style={[styles.flex, styles.p_left15_lr, styles.p_right, styles.bgFF, styles.marginT10]} underlayColor={'rgba(0,0,0,0)'} onPress={() => { this.goReceipt(data); }} >
                <View style={[styles.flex, styles.contentLR, styles.row1, styles.p_left15_lrv, styles.b_bottom]}>
                  <Text style={[styles.textColor, styles.fontLarge]}>发票信息</Text>
                  <View style={[styles.center, styles.row1]}>
                    <Text style={[styles.textColor1, styles.fontLarge]}>{invoiceType}</Text>
                    {iconRight}
                  </View>
                </View>
              </TouchableHighlight>

              <TouchableHighlight style={[styles.flex, styles.p_left15_lr, styles.p_right, styles.bgFF]} underlayColor={'rgba(0,0,0,0)'} onPress={() => { }} >
                <View style={[styles.flex, styles.contentLR, styles.row1, styles.p_left15_lrv]}>
                  <Text style={[styles.textColor, styles.fontLarge]}>可用优惠</Text>
                  <View style={[styles.center, styles.row1]}>
                    <Text style={[styles.textColor1, styles.fontLarge]}>选择优惠</Text>
                    {iconRight}
                  </View>
                </View>
              </TouchableHighlight>

              {this.renderGifts(availablePromotions)}

              <TouchableHighlight style={[styles.flex, styles.p_left15_lr, styles.p_right, styles.bgFF]} underlayColor={'rgba(0,0,0,0)'} onPress={() => { this.showVouchers(this.props); }} >
                <View style={[styles.flex, styles.contentLR, styles.row1, styles.p_left15_lrv, styles.b_Top]}>
                  <View style={[styles.center, styles.row1]}>
                    <Text style={[styles.textColor, styles.fontLarge]}>使用卡券</Text>
                    <Text style={[styles.tipsGray, styles.m_left]}>{vouchersAmount}张可用</Text>
                  </View>
                  <View style={[styles.center, styles.row1]}>
                    <Text style={[styles.textColor1, styles.fontLarge]}>{selectedVouchers.length ? selectedVouchers[0] : '未选择'}</Text>
                    {iconRight}
                  </View>
                </View>
              </TouchableHighlight>

              {data !== undefined && data.customer !== undefined && data.customer.isValidMember ?
                <TouchableHighlight style={[styles.flex, styles.p_left15_lr, styles.p_right, styles.bgFF]} underlayColor={'rgba(0,0,0,0)'} >
                  <View style={[styles.flex, styles.contentLR, styles.row1, styles.p_left15_lrv, styles.b_Top]}>
                    <View style={[styles.center, styles.row1]}>
                      <Text style={[styles.textColor, styles.fontLarge]}>使用积分</Text>
                      <TextInput underlineColorAndroid="transparent" keyboardType="numeric" value={pointToUse} onChangeText={value => this.changePointToUse(value)} style={[styles.textInput, styles.m_left, { height: 25, width: 55, padding: 0, paddingLeft: 5 }]} />
                      {
                        pointWarning && (<Text style={[styles.textColor1, styles.fontLarge]} >{pointToUse} 积分可用 </Text>)
                      }
                    </View>
                    <View style={[styles.center, styles.row1, styles.p_right]}>
                      <Text style={[styles.textColor1, styles.fontLarge]}>可抵￥{pointToUse / 100}元</Text>
                    </View>
                  </View>
                </TouchableHighlight> : <View />}

              <View style={[styles.summaryArea, { marginTop: 10 }]}>
                <View style={[styles.flexRow, styles.spaceBetween]}>
                  <Text style={[styles.textColor, styles.fontLarge, styles.mv5]}>商品金额</Text>
                  <Text style={[styles.sPrice, styles.fontLarge, styles.summaryAmount]}>￥ {data ? data.totalPrice.value : '0.00'}</Text>
                </View>
                <View style={[styles.flexRow, styles.spaceBetween]}>
                  <Text style={[styles.textColor, styles.fontLarge, styles.mv5]}>运费</Text>
                  <Text style={[styles.sPrice, styles.fontLarge, styles.summaryAmount]}>+ {deliveryCost ? deliveryCost.formattedValue : '¥ 0.00'}</Text>
                </View>
                <View style={[styles.flexRow, styles.spaceBetween]}>
                  <Text style={[styles.textColor, styles.fontLarge, styles.mv5]}>优惠</Text>
                  <Text style={[styles.sPrice, styles.fontLarge, styles.summaryAmount]}>- {orderDiscounts ? orderDiscounts.formattedValue : '¥ 0.00'}</Text>
                </View>
                {
                  +pointDeduction ? (
                    <View style={[styles.flexRow, styles.spaceBetween]}>
                      <Text style={[styles.textColor, styles.fontLarge, styles.mv5]}>积分抵用</Text>
                      <Text style={[styles.sPrice, styles.fontLarge, styles.summaryAmount]}>- {`¥ ${pointDeduction}`}</Text>
                    </View>
                  ) : null
                }
              </View>
              <View style={{ height: 10 }} />
            </ScrollView>
          </View>

          {/* <View style={styles.bottomArea}>*/}
          {/* <View style={styles.bottomLeft}>*/}
          {/* <Text style={styles.font_18}>实付款:</Text>*/}
          {/* <Text style={[styles.font_18, styles.font_r]}>{data ? data.totalPrice.value : ''}</Text>*/}
          {/* </View>*/}
          {/* <TouchableHighlight onPress={this._onSubmit.bind(this)} style={[styles.btn_b, styles.bottomRight]}>*/}
          {/* <Text style={[styles.font_w, styles.font_18, styles.font_wb]}>提交订单</Text>*/}
          {/* </TouchableHighlight>*/}
          {/* </View>*/}

          <View style={[styles.bottom, styles.bgFF]}>
            <View style={[styles.left1, styles.row1, { flex: 5 }]}>
              <Text style={[styles.font_16, styles.textColor, styles.m_left15]}>实付款:</Text>
              <Text style={styles.prices}>¥{data ? data.totalPrice.value : ''} </Text>
            </View>
            <TouchableHighlight underlayColor={'rgba(0,0,0,0.1)'} onPress={this._onSubmit.bind(this)} style={[{ flex: 2.5 }]}>
              <View style={[styles.flex, styles.footRight, styles.center, styles.row1]}>
                <Text style={[styles.flex, styles.footRightText, styles.center, { alignSelf: 'center' }]}>提交订单</Text>
              </View>
            </TouchableHighlight>
          </View>
        </View>
      </FsRootView>
    );
  }
}

CheckoutView.propTypes = {
  dispatch: PropTypes.func,
  data: PropTypes.object,
  pickups: PropTypes.array,
  pv: PropTypes.array,
  cv: PropTypes.array,
  av: PropTypes.array,
  selectedVouchers: PropTypes.array,
  vouchersAmount: PropTypes.number,
  pointToUse: PropTypes.string,
  pointWarning: PropTypes.bool,
  anonymousCode: PropTypes.string,
  anonymousChecked: PropTypes.bool,
  tempCash: PropTypes.string,
  cashChecked: PropTypes.bool,
};

export default connect(({ checkout }) => ({
  data: checkout.checkoutCartData,
  pickups: checkout.wareHouses,
  pv: checkout.pv,
  cv: checkout.cv,
  av: checkout.av,
  selectedVouchers: checkout.selectedVouchers,
  vouchersAmount: checkout.vouchersAmount,
  pointToUse: checkout.pointToUse,
  pointWarning: checkout.pointWarning,
  anonymousCode: checkout.anonymousCode,
  anonymousChecked: checkout.anonymousChecked,
  tempCash: checkout.tempCash,
  cashChecked: checkout.cashChecked,
}))(CheckoutView);
