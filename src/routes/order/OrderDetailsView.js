import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import { connect } from 'dva/mobile';
import {
  View,
  Text,
  ScrollView,
  Image,
  InteractionManager,
} from 'react-native';
import { Flex } from 'antd-mobile';
import FsRootView from './../../components/common/FsRootView';
import { filterStatus, getStatusLabel, SHOW_LOGISTICS_STATUS, SHOW_INVOICE_STATUS, SHOW_BUYAGAIN_STATUS } from '../../services/orderService';
import { secondaryButtonViewMiddle, secondaryButtonTextMiddle, greyButtonViewMiddle, greyButtonTextMiddle } from './../../themes/fsBaseStyles';

import styles from './styles';


class OrderDetailsView extends Component {
  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.props.dispatch({
        type: 'order/getOrder',
        code: this.props.orderId,
      });
    });
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: 'order/setOrder',
      order: {},
    });
  }

  downloadInvoice(entry) {
    this.props.dispatch({
      type: 'order/downloadInvoice',
      order: entry,
    });
  }

  buyAgain(entry) {
    this.props.dispatch({
      type: 'order/buyAgain',
      order: entry,
    });
  }

  viewLogistics(entry) {
    this.props.dispatch({
      type: 'order/getLogistics',
      order: entry,
    });
  }

  renderFeatures(classifications) {
    if (!classifications) {
      return (null);
    }

    return (
      <View style={[styles.fd_row, styles.p_top10]}>
        {classifications.map(entry => (
          <Text style={[styles.font_10, styles.textColor2, styles.m_right]}>{entry.name}</Text>
        ))}
      </View>
    );
  }

  renderOrderGroupEntries(groups) {
    if (!groups) {
      return (null);
    }

    return groups.map((group, i) => (
      <View key={i}>
        {this.renderOrderEntries(group.entries)}
      </View>
    ));
  }

  renderOrderEntries(entries) {
    if (!entries) {
      return (null);
    }

    return entries.map((entry, i) => (

      <View key={i} style={[{ flex: 1, marginTop: 10 }, styles.center, styles.row1, styles.bgFF]}>
        <View style={{ flex: 2 }}>
          <Image style={[styles.m10, styles.image_thumb]} source={entry.product.images ? entry.product.images[0].url : require('./../../../images/sale_product_01_280x190.png')} />
        </View>
        <View style={[{ flex: 6 }, styles.m_left]}>
          <View style={[{ flexWrap: 'wrap' }, styles.p_top10]}>
            <Text style={[styles.fontLarge, styles.textColor]}>
              {entry.product.name}
            </Text>
          </View>
          {this.renderFeatures(entry.product.classifications)}
          <View style={[styles.contentLR, styles.row1, { height: 30, top: 5 }]}>
            <View style={[styles.fd_row, styles.center]}>
              <Text style={[styles.sPrice, styles.fontLarge]}>
                {entry.totalPrice ? `¥ ${entry.totalPrice.value}` : ''}
              </Text>
            </View>
            <View style={[styles.fd_row, styles.center, styles.m_right15]}>
              <Text style={styles.fontLarge}>
                {entry.quantity}件
              </Text>
            </View>
          </View>
        </View>
      </View>
    ));
  }

  renderButtons(entry) {
    const showLogistics = filterStatus(SHOW_LOGISTICS_STATUS, entry.status);
    const showInvoice = filterStatus(SHOW_INVOICE_STATUS, entry.status);
    const showBuyAgain = filterStatus(SHOW_BUYAGAIN_STATUS, entry.status);

    if (!showLogistics && !showInvoice && !showBuyAgain) {
      return (null);
    }

    return (
      <View style={[styles.buttonArea, styles.bgFF]}>
        {showInvoice ? (
          <View style={[greyButtonViewMiddle, styles.buttonWidth]}>
            <Text style={greyButtonTextMiddle} onPress={() => { this.downloadInvoice(entry); }}>下载发票</Text>
          </View>
          ) : (null)}
        {showLogistics ? (
          <View style={[greyButtonViewMiddle, styles.buttonWidth]}>
            <Text style={greyButtonTextMiddle} onPress={() => { this.viewLogistics(entry); }}>查看物流</Text>
          </View>
          ) : (null)}
        {showBuyAgain ? (
          <View style={[secondaryButtonViewMiddle, styles.buttonWidth]}>
            <Text style={secondaryButtonTextMiddle} onPress={() => { this.buyAgain(entry); }}>再次购买</Text>
          </View>
          ) : (null)}
      </View>
    );
  }

  renderPoint() {
    const { record } = this.props;
    if (!record) {
      return '';
    }

    let point = 0;
    if (record.basicPoint) {
      point += record.basicPoint;
    }

    if (record.promotionPoint) {
      point += record.promotionPoint;
    }

    return `${point}`;
  }

  renderPayment() {
    if (!this.props.record.paymentList) {
      return '';
    }
    const list = this.props.record.paymentList.filter((item) => { return item.type === 'ACTUAL'; });
    const paytype = [];
    list.forEach((item) => { if (item.payType) { paytype.push(item.payType.name); } });

    return paytype.join(',');
  }

  renderInvoice() {
    if (!this.props.record.invoiceInfo) {
      return '';
    }

    const invoice = this.props.record.invoiceInfo;

    if (invoice.invoiceType === 'COMMON') {
      return '纸质发票';
    }

    if (invoice.invoiceType === 'ELECTRONIC') {
      return '电子发票';
    }

    if (invoice.invoiceType === 'VAT') {
      return '增值税发票';
    }

    return '';
  }

  renderPointCost() {
    if (!this.props.record.paymentList) {
      return '';
    }

    const point = this.props.record.paymentList.filter((item) => { return item.type === 'POINT'; });
    if (point.length > 0) {
      return `-¥${point[0].point / 100}`;
    }

    return '';
  }

  renderPromotion(promotions) {
    if (!promotions) {
      return (null);
    }

    return promotions.map((entry, i) => {
      let value = 0;
      entry.consumedEntries.forEach((item) => { value += item.quantity * item.adjustedUnitPrice; });
      return (
        <View key={i} style={[{ flex: 1 }, styles.center, styles.row1]}>
          <View style={[styles.row1, { height: 30, top: 5 }]}>
            <View style={[styles.fd_row, styles.center]}>
              <Text numberOfLines={1} style={[styles.textColor, styles.fontLarge, styles.mv5, { width: 200 }]}>{entry.promotion.code}</Text>
            </View>
            <View style={[styles.fd_row, styles.center, styles.m_right15]}>
              <Text numberOfLines={1} style={[styles.sPrice]}>{`        -¥${value}`}</Text>
            </View>
          </View>
        </View>
      );
    });
  }

  renderPromotions() {
    const { appliedProductPromotions, appliedOrderPromotions } = this.props.record;

    return (
      <View>
        {this.renderPromotion(appliedProductPromotions)}
        {this.renderPromotion(appliedOrderPromotions)}
      </View>
    );
  }

  render() {
    return (
      <FsRootView isNavBarHidden={false}>
        <View style={[styles.flex, styles.bg]}>
          <ScrollView>
            <Flex style={[styles.flex, styles.fd_row, styles.contentLR, styles.bgFF, styles.b_bottom, styles.p_right15, styles.p_left15_lrv]}>
              <View style={[{ flex: 8 }, styles.fd_row, styles.ph10]}>
                <Text style={[styles.fontLarge, styles.textColor]}>
                  订单号:{this.props.record.code}
                </Text>
              </View>
              <View style={{ flex: 2 }}>
                {
                  getStatusLabel(this.props.record.status) === '已支付' ?
                    <Text style={[styles.statusColor, styles.text_Right, styles.fontLarge, styles.sPrice]}>{getStatusLabel(this.props.record.status)}</Text> :
                    <Text style={[styles.statusColor, styles.text_Right, styles.fontLarge, styles.statusColor]}>{getStatusLabel(this.props.record.status)}</Text>
                }
              </View>
            </Flex>

            {this.renderOrderEntries(this.props.record.entries)}

            <View style={[styles.flex, styles.m_Ver, styles.bgFF, styles.p_left5_lrv]}>
              <View style={[styles.flex, styles.contentLR, styles.row1, styles.p_left5_lrv, styles.p_left15_lr]}>
                <View style={{ flex: 3 }}>
                  <Text style={[styles.textColor1, styles.fontLarge]}>支付方式</Text>
                </View>
                <View style={{ flex: 7 }}>
                  <Text style={[styles.textColor, styles.fontLarge, styles.text_Right]}>
                    {this.renderPayment()}
                  </Text>
                </View>
              </View>

              <View style={[styles.flex, styles.contentLR, styles.row1, styles.p_left5_lrv, styles.p_left15_lr]}>
                <View style={{ flex: 3 }}>
                  <Text style={[styles.textColor1, styles.fontLarge]}>物流历史</Text>
                </View>
                <View style={{ flex: 7 }}>
                  <Text style={[styles.textColor, styles.fontLarge, styles.text_Right]}>{this.props.record.deliveryStatusDisplay}</Text>
                </View>
              </View>

              <View style={[styles.flex, styles.contentLR, styles.row1, styles.p_left5_lrv, styles.p_left15_lr]}>
                <View style={{ flex: 3 }}>
                  <Text style={[styles.textColor1, styles.fontLarge]}>发票信息</Text>
                </View>
                <View style={{ flex: 7 }}>
                  <Text style={[styles.textColor, styles.fontLarge, styles.text_Right]}>{this.renderInvoice()}</Text>
                </View>
              </View>
            </View>

            <View style={[styles.flex, styles.summaryArea]}>
              <View style={[styles.flex, styles.b_bottom, styles.p_left10_lrv]}>
                <View style={[styles.flexRow, styles.spaceBetween]}>
                  <View style={{ flex: 2.5 }}>
                    <Text style={[styles.textColor1, styles.fontLarge, styles.mv5]}>下单时间</Text>
                  </View>
                  <View style={{ flex: 7.5 }}>
                    <Text style={[styles.sPrice, styles.fontLarge, styles.summaryAmount, styles.textColor]}>
                      {this.props.record.created ? moment(this.props.record.created).format('YYYY-MM-DD HH:mm:ss') : ''}
                    </Text>
                  </View>
                </View>
                <View style={[styles.flexRow, styles.spaceBetween]}>
                  <View style={{ flex: 2.5 }}>
                    <Text style={[styles.textColor1, styles.fontLarge, styles.mv5]}>商品金额</Text>
                  </View>
                  <View style={{ flex: 7.5 }}>
                    <Text style={[styles.textColor, styles.fontLarge, styles.summaryAmount]}>
                      {this.props.record.subTotal ? this.props.record.subTotal.formattedValue : ''}
                    </Text>
                  </View>
                </View>
                <View style={[styles.flexRow, styles.spaceBetween]}>
                  <View style={{ flex: 2.5 }}>
                    <Text style={[styles.textColor1, styles.fontLarge, styles.mv5]}>运费</Text>
                  </View>
                  <View style={{ flex: 7.5 }}>
                    <Text style={[styles.textColor, styles.fontLarge, styles.summaryAmount]}>
                      {this.props.record.deliveryCost ? `+${this.props.record.deliveryCost.formattedValue}` : '¥ 0.00'}
                    </Text>
                  </View>
                </View>
                <View style={[styles.flexRow, styles.spaceBetween]}>
                  <View style={{ flex: 2.5 }}>
                    <Text style={[styles.textColor1, styles.fontLarge, styles.mv5]}>优惠</Text>
                  </View>
                  <View style={{ flex: 7.5 }}>
                    <Text style={[styles.textColor, styles.fontLarge, styles.summaryAmount]}>
                      {this.props.record.totalDiscounts ? `-${this.props.record.totalDiscounts.formattedValue}` : '¥ 0.00'}
                    </Text>
                  </View>
                </View>
                <View style={[styles.flexRow, styles.spaceBetween]}>
                  <View style={{ flex: 2.5 }}>
                    <Text style={[styles.textColor1, styles.fontLarge, styles.mv5]}>积分抵扣</Text>
                  </View>
                  <View style={{ flex: 7.5 }}>
                    <Text style={[styles.textColor, styles.fontLarge, styles.summaryAmount]}>
                      {this.renderPointCost()}
                    </Text>
                  </View>
                </View>
                <View style={[styles.flexRow, styles.spaceBetween]}>
                  <View style={{ flex: 2.5 }}>
                    <Text style={[styles.textColor1, styles.fontLarge, styles.mv5]}>获得积分</Text>
                  </View>
                  <View style={{ flex: 7.5 }}>
                    <Text style={[styles.textColor, styles.fontLarge, styles.summaryAmount]}>{this.renderPoint()}</Text>
                  </View>
                </View>
                <View style={[styles.flexRow, styles.spaceBetween]}>
                  <View style={{ flex: 2.5 }}>
                    <Text style={[styles.textColor1, styles.fontLarge, styles.mv5, styles.fontw]}>促销明细</Text>
                  </View>
                  <View style={{ flex: 7.5 }}>
                    {this.renderPromotions()}
                  </View>
                </View>
              </View>
            </View>

            <View style={[styles.flexRow, styles.end1, styles.p_left10_lrv, styles.bgFF]}>
              <Text style={[styles.textColor, styles.fontLarge, styles.mv5]}>合计：</Text>
              <Text style={[styles.sPrice, styles.fontLarge, styles.summaryAmount, styles.p_right15]}>
                {this.props.record.totalPrice ? this.props.record.totalPrice.formattedValue : ''}
              </Text>
            </View>
          </ScrollView>
          {this.renderButtons(this.props.record)}
        </View>
      </FsRootView>
    );
  }
}

OrderDetailsView.propTypes = {
  record: PropTypes.object,
  orderId: PropTypes.string,
  dispatch: PropTypes.func,
};

const mapStateToProps = ({ order }) => {
  const { order: record, orderId } = order;
  return { record, orderId };
};

export default connect(mapStateToProps)(OrderDetailsView);
