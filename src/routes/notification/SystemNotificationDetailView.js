import React, { Component, PropTypes } from 'react';
import { connect } from 'dva/mobile';
import { Actions } from 'react-native-router-flux';
import { View, Image, Text, TouchableHighlight } from 'react-native';
import { List, Modal } from 'antd-mobile';
import styles from './styles';

import RootView from '../../components/common/RootView';

const Item = List.Item;
const alert = Modal.alert;

class SystemNotificationDetailView extends Component {

  onDeleteNotification(entry) {
    this.props.dispatch({ type: 'notification/removeNotification', messageCode: entry.messageCode });
    Actions.pop();
  }

  onPressDeleteBtn(entry) {
    alert('删除', '确定删除么?',
      [
        { text: '取消', onPress: () => {} },
        { text: '确定', onPress: () => this.onDeleteNotification(entry), style: { fontWeight: 'bold' } },
      ]);
  }

  render() {
    const data = this.props.data;
    return (<RootView>
      <List>
        <Item>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <View style={{ justifyContent: 'center' }}>
              <TouchableHighlight onPress={() => { this.onPressDeleteBtn(data); }} >
                <Image source={require('./../../../images/notification/delete_button.png')} />
              </TouchableHighlight>
            </View>
            <View style={{ flex: 0.7, justifyContent: 'center' }}>
              <Text >系统消息</Text>
            </View>
            <View style={{ justifyContent: 'center' }}>
              <Text style={{ color: '#AAA' }}>{data.creater}</Text>
            </View>
          </View>
        </Item>
      </List>
      <View style={{ marginTop: 10 }} />
      <View style={{ marginTop: 15, flexDirection: 'row' }}><Text style={[styles.font_18, { marginLeft: 20 }]}>折扣申请类型:</Text><Text style={[styles.font_18]}> {data.messageCode}</Text></View>
      <View style={{ marginTop: 15, flexDirection: 'row' }}><Text style={[styles.font_18, { marginLeft: 20 }]}>商品名称:</Text><Text style={[styles.font_18]}> {data.startTime}</Text></View>
      <View style={{ marginTop: 15, flexDirection: 'row' }}><Text style={[styles.font_18, { marginLeft: 20 }]}>价格总计:</Text><Text style={[styles.font_18]}> {data.endTime}</Text></View>
      <View style={{ marginTop: 15, flexDirection: 'row' }}><Text style={[styles.font_18, { marginLeft: 20 }]}>顾客:</Text><Text style={[styles.font_18]}> {data.receiver}</Text></View>
      <View style={{ marginTop: 15, flexDirection: 'row' }}><Text style={[styles.font_18, { marginLeft: 20 }]}>申请时间:</Text><Text style={[styles.font_18]}> {data.options}</Text></View>
      <View style={{ marginTop: 15, flexDirection: 'row' }}><Text style={[styles.font_18, { marginLeft: 20 }]}>一线审批结果:</Text><Text style={[styles.font_18]}> {data.status}</Text></View>
      <View style={{ marginTop: 15, flexDirection: 'row' }}><Text style={[styles.font_18, { marginLeft: 20 }]}>二线审批结果:</Text><Text style={[styles.font_18]}> {data.status}</Text></View>
    </RootView>
    );
  }
}

SystemNotificationDetailView.propTypes = {
  data: PropTypes.object,
  dispatch: PropTypes.func,
};

const mapStateToProps = () => ({});

export default connect(mapStateToProps)(SystemNotificationDetailView);
