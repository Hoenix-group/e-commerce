import React, { Component, PropTypes } from 'react';
import { connect } from 'dva/mobile';
import { Actions } from 'react-native-router-flux';
import { View, Image, Text, TouchableHighlight } from 'react-native';
import { List, Modal } from 'antd-mobile';
import styles from './styles';

import RootView from '../../components/common/RootView';

const Item = List.Item;
const alert = Modal.alert;

class CompanyNotificationDetailView extends Component {

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
              <Text >公司消息</Text>
            </View>
            <View style={{ justifyContent: 'center' }}>
              <Text style={{ color: '#AAA' }}>{data.creater}</Text>
            </View>
          </View>
        </Item>
      </List>
      <View style={{ marginTop: 10 }} />
      <View style={{ marginTop: 15, flexDirection: 'row' }}><Text style={[styles.font_18, { marginLeft: 20 }]}>活动名称:</Text><Text style={[styles.font_18]}> {data.receiver}</Text></View>
      <View style={{ marginTop: 15, flexDirection: 'row' }}><Text style={[styles.font_18, { marginLeft: 20 }]}>活动开始时间:</Text><Text style={[styles.font_18]}> {data.messageCode}</Text></View>
      <View style={{ marginTop: 15, flexDirection: 'row' }}><Text style={[styles.font_18, { marginLeft: 20 }]}>活动结束时间:</Text><Text style={[styles.font_18]}> {data.messageType}</Text></View>
      <View style={{ marginTop: 15, flexDirection: 'row' }}><Text style={[styles.font_18, { marginLeft: 20 }]}>其他:</Text><Text style={[styles.font_18]}> {data.message}</Text></View>
    </RootView>
    );
  }
}

CompanyNotificationDetailView.propTypes = {
  data: PropTypes.object,
  dispatch: PropTypes.func,
};

const mapStateToProps = () => ({});

export default connect(mapStateToProps)(CompanyNotificationDetailView);
