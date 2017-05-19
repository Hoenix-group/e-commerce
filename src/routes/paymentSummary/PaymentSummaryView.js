import React from 'react';
import { Actions } from 'react-native-router-flux';
import {
    View,
    Image,
    Text,
} from 'react-native';
import { Button } from 'antd-mobile';
import RootView from '../../components/common/RootView';
import FsRootView from './../../components/common/FsRootView';

import styles from './styles';

function PaymentSummaryView() {
  return (
    <FsRootView isNavBarHidden={false}>
      <View style={styles.flex}>
        <View style={styles.top}>
          <Image style={styles.image} source={require('./../../../images/payment/pay_checked.png')} />
          <Text style={[styles.font, { marginTop: 15, paddingVertical: 10 }]}>支付成功!</Text>
          <Text style={styles.font}>您可以在’我的订单‘查询订单详情。</Text>
        </View>

        <View style={styles.middle} />

        <View style={styles.bottom}>
          <View style={styles.bottomLine}>
            <View style={styles.bottomItem}>
              <Button size="small" style={[styles.button]} onClick={() => Actions.home()}>
                <Text style={styles.fontSize12}>返回首页</Text>
              </Button>
            </View>
            <View style={styles.bottomItem}>
              <Button size="small" style={[styles.button]} onClick={() => Actions.orderList()}>
                <Text style={styles.fontSize12}>我的订单</Text>
              </Button>
            </View>
          </View>
          <View style={styles.bottomLine}>
            <View style={styles.bottomItem}>
              <Text style={[styles.text]}>继续选购商品</Text>
            </View>
            <View style={styles.bottomItem}>
              <Text style={[styles.text]}>查看订单及物流详情</Text>
            </View>
          </View>

        </View>
      </View>
    </FsRootView>
  );
}

export default PaymentSummaryView;
