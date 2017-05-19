import React, { Component, PropTypes } from 'react';
import { connect } from 'dva/mobile';
import { Actions } from 'react-native-router-flux';
import { ScrollView } from 'react-native';
import { List, Tabs, SwipeAction, Modal } from 'antd-mobile';

import RootView from '../../components/common/RootView';
import Util from './../../utils/utils';

const TabPane = Tabs.TabPane;
const Item = List.Item;
const Brief = Item.Brief;
const alert = Modal.alert;


class NotificationListView extends Component {

  constructor(props) {
    super(props);
    this.state = {}; // 这里放置会被改变的值 比如获得的信息列表
  }

  componentWillMount() {
    this.props.dispatch({ type: 'notification/fetchNotificationList' });
  }

  onSelectRow(text, entry) {
    Util.consoleLog(this.props.systemList);
    if (text === '系统消息') {
      Actions.systemNotificationDetail({
        data: entry,
      });
    } else {
      Actions.companyNotificationDetail({
        data: entry,
      });
    }
  }

  onPressDeleteBtn(entry) {
    alert('删除', '确定删除么?',
      [
        { text: '取消', onPress: () => {} },
        { text: '确定', onPress: () => this.onDeleteNotification(entry), style: { fontWeight: 'bold' } },
      ]);
  }

  onDeleteNotification(entry) {
    this.props.dispatch({ type: 'notification/removeNotification', messageCode: entry.messageCode });
  }

  renderRow(entry, i, text) {
    return (
      <SwipeAction
        key={i}
        style={{ backgroundColor: 'gray' }}
        autoClose
        right={[
          {
            text: '删除',
            onPress: () => this.onPressDeleteBtn(entry),
            style: { backgroundColor: '#F4333C', color: 'white' },
          },
        ]}
      >
        <Item key={i} extra={entry.messageCode} align="top" onClick={() => this.onSelectRow(text, entry)}>
          {text}<Brief>{entry.message}</Brief>
        </Item>
      </SwipeAction>);
  }

  render() {
    return (
      <RootView>
        <Tabs defaultActiveKey="system" animated={false}>
          <TabPane tab="系统消息" key="system" >
            <ScrollView>
              <List>
                {this.props.systemList.map((entry, i) => this.renderRow(entry, i, '系统消息'))}
              </List>
            </ScrollView>
          </TabPane>
          <TabPane tab="公司消息" key="company" >
            <ScrollView>
              <List>
                {this.props.companyList.map((entry, i) => this.renderRow(entry, i, '公司消息'))}
              </List>
            </ScrollView>
          </TabPane>
        </Tabs>
      </RootView>
    );
  }
}

NotificationListView.propTypes = {
  dispatch: PropTypes.func,
  systemList: PropTypes.array,
  companyList: PropTypes.array,
  //notificationList: PropTypes.object,
};

const mapStateToProps = ({ notification }) => {
  let systemList = [];
  if (notification.systemList) {
    systemList = notification.systemList;
  } else {
    systemList = [];
  }

  let companyList = [];
  if (notification.companyList) {
    companyList = notification.companyList;
  } else {
    companyList = [];
  }

  return { systemList, companyList };
};

export default connect(mapStateToProps)(NotificationListView);

