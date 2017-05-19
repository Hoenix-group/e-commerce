import React, { Component, PropTypes } from 'react';
import { connect } from 'dva/mobile';
import moment from 'moment';
import 'moment/locale/zh-cn';
import { Actions } from 'react-native-router-flux';
import { Button, ListView } from 'antd-mobile';
import { Text, View, RefreshControl } from 'react-native';
import styles from './styles';
import FsRootView from './../../components/common/FsRootView';

class ListAppointedCustomers extends Component {

  componentDidMount() {
    Actions.refresh({
      rightTitle: '关闭',
      onRight: () => (Actions.pop()),
    });
    this.props.dispatch({ type: 'listAppointedCustomers/fetchAppointmentCustoms', code: this.props.appointmentCode, refreshTag: true });
  }

  componentWillUnmount() {
    this.props.dispatch({ type: 'listAppointedCustomers/resetCustomerList' });
  }

  onListReachedBottom() {
    if (this.props.refreshing || this.props.endFlag) {
      return;
    }
    this.props.dispatch({ type: 'listAppointedCustomers/fetchAppointmentCustoms', code: this.props.appointmentCode, currentPage: this.props.currentPage });
  }

  onListViewRefresh() {
    this.props.dispatch({ type: 'listAppointedCustomers/fetchAppointmentCustoms', code: this.props.appointmentCode, refreshTag: true });
  }

  renderRow(rowData, argument, index) {
    // const topborderWidth = Number(index === 0);// borderTopWidth: topborderWidth
    return (
      <View key={index} style={styles.resultList}>
        <View style={styles.resultListLeft}>
          <Text style={[styles.fontTitle, styles.marginBM]}>{rowData.userName}</Text>
          <Text style={styles.fontGrey}>{rowData.phone}</Text>
        </View>
        <View style={[styles.resultListRight, styles.customerListRight]}>
          <Text style={styles.fontMain}>{moment(rowData.reservationTime).utcOffset(8).format('L')}&nbsp;到店</Text>
        </View>
      </View>
    );
  }

// 新的设计中不再需要表头
  /* renderHeader() {
    return (
      <View style={{ flexDirection: 'row', borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#AAA' }}>
        <View style={{ flex: 3, paddingVertical: 8, borderRightWidth: 1, borderColor: '#AAA' }}>
          <Text style={{ textAlign: 'center', fontSize: 13 }}>顾客姓名</Text>
        </View>
        <View style={{ flex: 5, paddingVertical: 8, borderRightWidth: 1, borderColor: '#AAA' }}>
          <Text style={{ textAlign: 'center', fontSize: 13 }}>顾客联系方式</Text>
        </View>
        <View style={{ flex: 5, paddingVertical: 8 }}>
          <Text style={{ textAlign: 'center', fontSize: 13 }}>预约到店时间</Text>
        </View>
      </View>
    );
  }*/

  renderAddCustomerButton(code, isReservable, activityStartTime, activityEndTime) {
    if (isReservable) {
      return (
        <Button type="primary" style={styles.buttonAngle} onClick={() => { Actions.addAppointmentCustomer({ appointmentcode: code, activityStartTime, activityEndTime, reservationType: this.props.reservationType }); }}>添加顾客</Button>
      );
    }
    return (<View />);
  }

  render() {
    return (
      <FsRootView isNavBarHidden={false} style={{ justifyContent: 'space-between' }}>
        <ListView
          refreshControl={<RefreshControl refreshing={this.props.refreshing} onRefresh={() => this.onListViewRefresh()} />}
          enableEmptySections
          dataSource={this.props.appointmentCustomers}
          renderRow={this.renderRow}
          onEndReached={() => this.onListReachedBottom()}
          onEndReachedThreshold={20}
        />
        {this.renderAddCustomerButton(this.props.appointmentCode, this.props.isReservable, this.props.activityStartTime, this.props.activityEndTime)}
      </FsRootView>
    );
  }
}

ListAppointedCustomers.propTypes = {
  appointmentCustomers: PropTypes.object,
  dispatch: PropTypes.func,
  activityStartTime: PropTypes.string,
  activityEndTime: PropTypes.string,
  endFlag: PropTypes.bool,
  appointmentCode: PropTypes.any,
  currentPage: PropTypes.any,
  isReservable: PropTypes.any,
  refreshing: PropTypes.bool,
  reservationType: PropTypes.string,
};

const mapStateToProps = (state) => {
  const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
  const data = ds.cloneWithRows(state.listAppointedCustomers.appointmentCustomers);
  return {
    appointmentCustomers: data,
    appointmentCode: state.appointment.appointmentdetail.code,
    isReservable: state.appointment.appointmentdetail.isReservable,
    activityStartTime: state.appointment.appointmentdetail.activityStartTime,
    activityEndTime: state.appointment.appointmentdetail.activityEndTime,
    currentPage: state.listAppointedCustomers.currentPage,
    endFlag: state.listAppointedCustomers.endFlag,
    refreshing: state.listAppointedCustomers.refreshing,
  };
};

export default connect(mapStateToProps)(ListAppointedCustomers);
