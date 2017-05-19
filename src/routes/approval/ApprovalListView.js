import React, { Component, PropTypes } from 'react';
import { connect } from 'dva/mobile';
import { Actions } from 'react-native-router-flux';
import { ScrollView, InteractionManager } from 'react-native';
import { List, Modal } from 'antd-mobile';
import { fontSizeLarge, fontSizeMiddle, fontSizeSmall, fontSizeMin } from './../../themes/fsBaseStyles';

import RootView from '../../components/common/RootView';


const Item = List.Item;
const Brief = Item.Brief;
const alert = Modal.alert;


class ApprovalListView extends Component {

  constructor(props) {
    super(props);
    this.state = {}; // 这里放置会被改变的值 比如获得的信息列表
  }

  componentWillMount() {
    InteractionManager.runAfterInteractions(() => {
      this.props.dispatch({ type: 'approval/fetchApprovalList' });
    });
  }

  onSelectRow(entry) {
    Actions.approvalDetail({
      data: entry,
    });
  }

  renderRow(entry, i) {
    const showText = entry.type + ' ' + entry.value + '元 ' + entry.count + '个';
    return (
      <Item key={i} extra={entry.applyId} align="top" onClick={() => this.onSelectRow(entry)}>
        卡券申请<Brief>{showText}</Brief>
      </Item>);
  }

  render() {
    return (
      <RootView>
        <ScrollView>
          <List>
            {this.props.approvalList.map((entry, i) => this.renderRow(entry, i))}
          </List>
        </ScrollView>
      </RootView>
    );
  }
}

ApprovalListView.propTypes = {
  dispatch: PropTypes.func,
  approvalList: PropTypes.array,
};

const mapStateToProps = ({ approval }) => {
  const { approvalList } = approval;
  return { approvalList };
};

export default connect(mapStateToProps)(ApprovalListView);

