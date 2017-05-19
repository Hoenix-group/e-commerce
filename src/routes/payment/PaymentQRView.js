import React, { Component, PropTypes } from 'react';
import { Actions } from 'react-native-router-flux';
import { connect } from 'dva/mobile';
import {
    View,
    Image,
    Text,
    InteractionManager,
    TouchableHighlight,
} from 'react-native';
import { Button } from 'antd-mobile';
import RootView from '../../components/common/RootView';
import FsRootView from './../../components/common/FsRootView';
import styles from './styles';

class PaymentQRView extends Component {
  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      console.debug('PaymentQRView-componentDidMount');
      let timesRun = 2;
      this.timer = setInterval(
      () => {
        this.checkStatus();

        timesRun -= 1;
        if (timesRun === 0) {
          this.clearTimer();
        }
      },
      5000,
    );

      this.updateQRtimer = setInterval(
      () => {
        this.props.dispatch({
          type: 'cashDesk/pay',
          orderCode: this.props.orderCode,
          paymentChannel: this.props.payChannelTypeNo,
          refresh: true,
        });
      },
      60 * 1000,
    );
    });
  }

  componentWillUnmount() {
    console.debug('PaymentQRView-componentWillUnmount');
    this.clearTimer();
    this.clearUpdateQRTimer();
    this.props.dispatch({
      type: 'paymentQR/initializeState',
    });
  }

  clearTimer() {
    if (this.timer) {
      console.debug('PaymentQRView-Clearing timer: ', this.timer);
      clearInterval(this.timer);
    }
  }

  clearUpdateQRTimer() {
    if (this.updateQRtimer) {
      console.debug('PaymentQRView-Clearing Update QR timer: ', this.updateQRtimer);
      clearInterval(this.updateQRtimer);
    }
  }

  checkStatus(showMessage) {
    this.props.dispatch({ type: 'paymentQR/payStatus', orderCode: this.props.orderCode, payChannelTypeNo: this.props.payChannelTypeNo, gwTradeNo: this.props.gwTradeNo, showMessage, resultPage: this.props.resultPage });
  }

  render() {
    return (
      <FsRootView isNavBarHidden={false}>
        <View style={styles.flex}>
          <View style={styles.top}>
            <Image style={styles.qrImage} source={{ uri: this.props.address }} />
          </View>

          {/* 底部按钮 */}
          <View style={styles.bottom}>
            <TouchableHighlight underlayColor={'rgba(0,0,0,0.1)'} onPress={() => this.checkStatus(true)} style={styles.tStyle}>
              <View style={styles.footRight}>
                <Text style={styles.footRightText}>查看支付结果</Text>
              </View>
            </TouchableHighlight>
            <TouchableHighlight underlayColor={'rgba(0,0,0,0.1)'} onPress={() => Actions.home()} style={styles.tStyle}>
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

PaymentQRView.propTypes = {
  address: PropTypes.string,
  orderCode: PropTypes.string,
  payChannelTypeNo: PropTypes.string,
  gwTradeNo: PropTypes.string,
  dispatch: PropTypes.func,
  resultPage: PropTypes.string,
};

const mapStateToProps = ({ paymentQR }) => {
  const { address, orderCode, payChannelTypeNo, gwTradeNo } = paymentQR;
  return { address, orderCode, payChannelTypeNo, gwTradeNo };
};

export default connect(mapStateToProps)(PaymentQRView);
