import React, { Component, PropTypes } from 'react';
import { connect } from 'dva/mobile';
import { Actions } from 'react-native-router-flux';
import { Text, List, Button, Toast } from 'antd-mobile';
import { View } from 'react-native';
import moment from 'moment';
import styles from './styles';
import RootView from './../../components/common/RootView';

const AddCustomerToPrestoreResultView = ({ prestoreName, customerName, phoneNumber, prestoreTime, prestorePlan, paymentChannel }) => (
  <RootView>
    <List>
      <List.Item style={{ paddingLeft: 0, height: 50 }}>
        <View style={{ flexDirection: 'row', marginBottom: 8, marginTop: 8, justifyContent: 'flex-start' }}>
          <Text style={[styles.font_18, { marginLeft: 30, color: '#555' }]}>预存名称:</Text>
          <Text style={[styles.font_18]}> { prestoreName }</Text>
        </View>
      </List.Item>
      <List.Item style={{ paddingLeft: 0, height: 50 }}>
        <View style={{ flexDirection: 'row', marginBottom: 8, marginTop: 8, justifyContent: 'flex-start' }}>
          <Text style={[styles.font_18, { marginLeft: 30, color: '#555' }]}>顾客姓名:</Text>
          <Text style={[styles.font_18]}> { customerName }</Text>
        </View>
      </List.Item>
      <List.Item style={{ paddingLeft: 0, height: 50 }}>
        <View style={{ flexDirection: 'row', marginBottom: 8, marginTop: 8, justifyContent: 'flex-start' }}>
          <Text style={[styles.font_18, { marginLeft: 30, color: '#555' }]}>联系方式:</Text>
          <Text style={[styles.font_18]}> { phoneNumber }</Text>
        </View>
      </List.Item>
      <List.Item style={{ paddingLeft: 0, height: 50 }}>
        <View style={{ flexDirection: 'row', marginBottom: 8, marginTop: 8, justifyContent: 'flex-start' }}>
          <Text style={[styles.font_18, { marginLeft: 30, color: '#555' }]}>预存时间:</Text>
          <Text style={[styles.font_18]}> { moment(prestoreTime).utcOffset(8).format('L') }</Text>
        </View>
      </List.Item>
      <List.Item style={{ paddingLeft: 0, height: 50 }}>
        <View style={{ flexDirection: 'row', marginBottom: 8, marginTop: 8, justifyContent: 'flex-start' }}>
          <Text style={[styles.font_18, { marginLeft: 30, color: '#555' }]}>预存方案:</Text>
          <Text style={[styles.font_18]}> { prestorePlan }</Text>
        </View>
      </List.Item>
      <List.Item style={{ paddingLeft: 0, height: 50 }}>
        <View style={{ flexDirection: 'row', marginBottom: 8, marginTop: 8, justifyContent: 'flex-start' }}>
          <Text style={[styles.font_18, { marginLeft: 30, color: '#555' }]}>支付渠道:</Text>
          <Text style={[styles.font_18]}> { paymentChannel }</Text>
        </View>
      </List.Item>
    </List>
    <Button style={{ marginTop: 30, marginLeft: 110, marginRight: 110 }}size="small" type="ghost" onClick={() => Actions.popTo('prestoreList')}>返回活动列表</Button>

  </RootView>
);

AddCustomerToPrestoreResultView.propTypes = {
  // dispatch: PropTypes.func,
  prestoreName: PropTypes.string,
  customerName: PropTypes.string,
  phoneNumber: PropTypes.string,
  prestoreTime: PropTypes.number,
  prestorePlan: PropTypes.string,
  paymentChannel: PropTypes.string,
};

const mapStateToProps = state => ({
  prestoreName: state.prestore.prestoreDetail.name,
  customerName: state.prestore.customerName,
  phoneNumber: state.prestore.phoneNumber,
  prestoreTime: state.prestore.timestamp,
  prestorePlan: state.prestore.prestoreDetail.prestorePlan,
  paymentChannel: state.prestore.paymentChannelLabel,
});

export default connect(mapStateToProps)(AddCustomerToPrestoreResultView);
