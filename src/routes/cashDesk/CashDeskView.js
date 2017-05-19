import React, { Component, PropTypes } from 'react';
import { Actions } from 'react-native-router-flux';
import { connect } from 'dva/mobile';
import {
  View,
  Text,
  Image,
  InteractionManager,
  TouchableHighlight,
} from 'react-native';
import { Button, List, Radio } from 'antd-mobile';
import moment from 'moment';
import RootView from '../../components/common/RootView';
import FsRootView from './../../components/common/FsRootView';
import styles from './styles';

const RadioItem = Radio.RadioItem;

class CashDeskView extends Component {
  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.props.dispatch({
        type: 'cashDesk/getPromotions',
        modes: this.props.modes,
        totalFee: this.props.totalFee,
      });
    });
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: 'cashDesk/initializeState',
    });
  }

  onChange(value) {
    this.props.dispatch({ type: 'cashDesk/changePaymentChannel', payload: value });
  }

  pay() {
    this.props.dispatch({
      type: 'cashDesk/pay',
      orderCode: this.props.orderCode,
      totalFee: this.props.totalFee,
      paymentChannel: this.props.paymentChannel,
      timestamp: this.props.timestamp,
    });
  }

  render() {
    return (
      <FsRootView isNavBarHidden={false}>
        <View style={styles.flex}>
          <View style={styles.top}>
            <View style={styles.intervalSpace1} />

            <View style={styles.textMargin}>
              <Text style={[styles.font]}>订单金额（含运费）： <Text style={styles.red2}>¥{this.props.totalFee}</Text>
              </Text>
              <Text style={[styles.font]}>订单编号：<Text style={[styles.grey]}>{this.props.orderCode}</Text>
              </Text >
              <Text style={[styles.font]}>下单时间：<Text style={[styles.grey]}>{moment(this.props.timestamp).format('YYYY-MM-DD HH:mm:ss')}</Text>
              </Text>
            </View>

            <View style={styles.intervalSpace1} />
            <List>
              <View style={[styles.payWay, styles.b_bottom]}>
                <Text style={[styles.payWayText]}>选择支付方式</Text>
              </View>
              <View >
                {this.props.modes.map(i => (
                  <RadioItem style={{ height: 60 }} key={i.value} checked={this.props.paymentChannel === i.value} onChange={() => this.onChange(i.value)}>
                    <View style={[styles.payItems, styles.left1, styles.row1]}>
                      <Image style={styles.logo} source={i.imgUrl} />
                      <View style={[styles.left1, styles.col1, styles.p_left, styles.alignLeft]}>
                        <Text style={styles.payTitle}>{`${i.label}    `}</Text>
                        {i.promotionLabel !== undefined ? (<Text style={styles.red1}>{i.promotionLabel}</Text>) : null}
                      </View>
                    </View>
                  </RadioItem>
              ))}
              </View>
            </List>

            <View style={styles.intervalSpace1} />
          </View>

          {/* 底部按钮 */}
          <View style={styles.bottom}>
            <TouchableHighlight underlayColor={'rgba(0,0,0,0.1)'} onPress={() => this.pay()} style={[styles.tStyle]}>
              <View style={styles.footRight}>
                <Text style={styles.footRightText}>确认</Text>
              </View>
            </TouchableHighlight>
            <TouchableHighlight underlayColor={'rgba(0,0,0,0.1)'} onPress={() => Actions.home()} style={[styles.tStyle]}>
              <View style={[styles.footRight, styles.footRight2]} >
                <Text style={styles.footRightText}>返回首页</Text>
              </View>
            </TouchableHighlight>
          </View>
        </View>
      </FsRootView>
    );
  }
}

CashDeskView.propTypes = {
  totalFee: PropTypes.number,
  orderCode: PropTypes.string,
  timestamp: PropTypes.number,
  paymentChannel: PropTypes.string,
  modes: PropTypes.array,
  dispatch: PropTypes.func,
};

const mapStateToProps = ({ cashDesk }) => {
  const { totalFee, orderCode, timestamp, paymentChannel, modes } = cashDesk;
  return { totalFee, orderCode, timestamp, paymentChannel, modes };
};

export default connect(mapStateToProps)(CashDeskView);
