import { View, ScrollView, Text, Image, TouchableHighlight } from 'react-native';
import React, { Component, PropTypes } from 'react';
import { connect } from 'dva/mobile';
import { Actions } from 'react-native-router-flux';
import { List, Toast } from 'antd-mobile';
import 'moment/locale/zh-cn';
import styles from './styles';
import RootView from './../../components/common/RootView';

class DistributionView extends Component {

  getDeliveryAndInstallDates(entryNumber, productCode, regionCode, number, dateType, conCode) {
    // dateType 9: 送货 18：安装 28:维修
    this.props.dispatch({ type: 'dateList/init', entryNumber, productCode, regionCode, number, dateType, conCode });
    Actions.dateList();
  }

  goCashDesk() {
    // 验证是否全部家电都选择了配送/安装时间
    const { allDis, allIns, orderCode, totalFee, created } = this.props.data;
    for (let dIdx = 0; dIdx < allDis.length; dIdx++) {
      if (!allDis[dIdx].dated) {
        Toast.info('请为所有商品选择配送时间');
        return;
      }
    }

    for (let iIdx = 0; iIdx < allIns.length; iIdx++) {
      if (!allIns[iIdx].dated) {
        Toast.info('请为所有商品选择安装时间');
        return;
      }
    }

    this.props.dispatch({
      type: 'cashDesk/setPaymentData',
      orderCode,
      totalFee,
      created,
    });
    Actions.cashDesk();
  }

  render() {
    const { consignments, regionCode } = this.props.data;
    return (
      <RootView isNavBarHidden={false} style={styles.containerWithNav}>
        <View style={[styles.containerWithNav]}>
          <ScrollView>
            {
              consignments.map(con => (
                <List key={con.code}>
                  <List.Item>
                    <Text style={[styles.font_18, styles.deviceName]}>{con.pName}</Text>
                    <Image source={require('./../../../images/sale_product_01_280x190.png')} style={[styles.image]} />
                  </List.Item>

                  <Text style={[styles.type]}>{con.sentMode === 'BYVENDOR' ? '配送' : '自提'}</Text>
                  {
                    con.sentMode === 'BYVENDOR' ? (
                      <View>
                        <List.Item extra={ con.disDate || '未选择' } arrow="horizontal" onClick={() => { this.getDeliveryAndInstallDates(con.conEntryCode, con.pCode, regionCode, con.quantity, 9, con.code); }}>
                          <Text style={[styles.font_18, styles.mv10]}>配送日期</Text>
                        </List.Item>
                        <List.Item extra={ con.disTime || '未选择' } arrow="horizontal" onClick={() => { this.getDeliveryAndInstallDates(con.conEntryCode, con.pCode, regionCode, con.quantity, 9, con.code); }}>
                          <Text style={[styles.font_18, styles.mv10]}>配送时间</Text>
                        </List.Item>
                      </View>
                    ) : null
                  }
                  {
                    con.isWhiteGoods ? (
                      <View>
                        <List.Item extra={con.insDate || '未选择'} arrow="horizontal" onClick={() => { this.getDeliveryAndInstallDates(con.conEntryCode, con.pCode, regionCode, con.quantity, 18, con.code); }}>
                          <Text style={[styles.font_18, styles.mv10]}>安装日期</Text>
                        </List.Item>
                        <List.Item extra={con.insTime || '未选择'} arrow="horizontal" onClick={() => { this.getDeliveryAndInstallDates(con.conEntryCode, con.pCode, regionCode, con.quantity, 18, con.code); }}>
                          <Text style={[styles.font_18, styles.mv10]}>安装时间</Text>
                        </List.Item>
                      </View>
                    ) : null
                  }
                </List>
              ))
            }
          </ScrollView>
        </View>

        <View style={styles.bottomArea}>
          <TouchableHighlight onPress={() => { this.goCashDesk(); }} style={[styles.btn_b, styles.button]}>
            <Text style={[styles.font_w, styles.font_18, styles.font_wb]}>去支付</Text>
          </TouchableHighlight>
        </View>
      </RootView>
    );
  }
}

DistributionView.propTypes = {
  data: PropTypes.object,
  dispatch: PropTypes.func,
};

export default connect(({ distribution }) => ({
  data: distribution,
}))(DistributionView);
