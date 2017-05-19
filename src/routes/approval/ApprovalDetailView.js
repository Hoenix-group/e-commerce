import React, { Component, PropTypes } from 'react';
import { connect } from 'dva/mobile';
import { Actions } from 'react-native-router-flux';
import { View, Text, ScrollView } from 'react-native';
import { List, Button } from 'antd-mobile';
import { fontSizeLarge, commonButton } from './../../themes/fsBaseStyles';

import RootView from '../../components/common/RootView';

const Item = List.Item;

class ApprovalDetailView extends Component {

  render() {
    const data = this.props.data;
    return (<RootView>
      <List>
        <Item style={{ height: 45 }}>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontSize: fontSizeLarge }}>卡券审批</Text>
          </View>
        </Item>
      </List>
      <ScrollView>
        <View style={{ marginTop: 10 }} />
        <View style={{ marginTop: 15, flexDirection: 'row' }}><Text style={{ marginLeft: 20 }}>卡券名称:</Text><Text > {data.type}</Text></View>
        <View style={{ marginTop: 15, flexDirection: 'row' }}><Text style={{ marginLeft: 20 }}>卡券数量:</Text><Text > {data.count}</Text></View>
        <View style={{ marginTop: 15, flexDirection: 'row' }}><Text style={{ marginLeft: 20 }}>申请员工:</Text><Text > {data.applicantId}</Text></View>
        <View style={{ marginTop: 15, flexDirection: 'row' }}><Text style={{ marginLeft: 20 }}>申请时间:</Text><Text > {data.applyId}</Text></View>
      </ScrollView>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
        <Button style={{ flex: 1 }} onClick={() => { this.props.dispatch({ type: 'approval/updateApproval', applyId: data.applyId, approve: false }); }}>拒绝</Button>
        <Button style={{ flex: 1, backgroundColor: commonButton.backgroundColor }} onClick={() => { this.props.dispatch({ type: 'approval/updateApproval', applyId: data.applyId, approve: true }); }} >
          <Text style={{ color: commonButton.color }}>批准</Text>
        </Button>
      </View>
    </RootView>
    );
  }
}

ApprovalDetailView.propTypes = {
  data: PropTypes.object,
  dispatch: PropTypes.func,
};

const mapStateToProps = () => ({});

export default connect(mapStateToProps)(ApprovalDetailView);
