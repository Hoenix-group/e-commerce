import React, { PropTypes, Component } from 'react';
import { Actions } from 'react-native-router-flux';
import { connect } from 'dva/mobile';
import { Text } from 'antd-mobile';
import { View, ListView, TouchableOpacity, RefreshControl, InteractionManager } from 'react-native';
// import AppointmentHeaderComponent from './../../components/appointment/AppointmentHeaderComponent';
import { secondaryButtonViewMiddle, secondaryButtonTextMiddle } from './../../themes/fsBaseStyles';
import styles from './styles';
import FsRootView from './../../components/common/FsRootView';

class AppointmentListView extends Component {

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.props.dispatch({ type: 'appointment/fetchAppointmentsList', refreshTag: true });
    });
  }

  componentWillUnmount() {
    this.props.dispatch({ type: 'appointment/resetAppointmentsList' });
  }

  onAddCustomersPress(code, activityStartTime, activityEndTime, reservationType) {
    Actions.addAppointmentCustomer({ appointmentcode: code, activityStartTime, activityEndTime, reservationType });
  }

  onActivityInfoViewPress(code, isReservable, reservationType) {
    // this.props.dispatch({ type: 'appointment/fetchAppointmentDetail', code, isReservable });
    Actions.appointmentDetail({ propsCode: code, propsIsReservable: isReservable, reservationType });
  }

  onListViewRefresh() {
    this.props.dispatch({ type: 'appointment/fetchAppointmentsList', refreshTag: true });
  }

  onEndReached() {
    if (this.props.appointmentListLength === 0 || this.props.refreshing || this.props.endFlag) {
      return;
    }
    this.props.dispatch({ type: 'appointment/fetchAppointmentsList', currentPage: this.props.currentPage });
  }

  renderTitle(appointment) {
    // onPress={() => this.onActivityInfoViewPress(appointment.code, appointment.isReservable)}
    if (appointment.name.length >= 13) {
      return (<Text numberOfLines={1} style={[styles.fontTitle, styles.marginBM]} >{appointment.name.slice(0, 13)}...</Text>);
    }
    return (<Text numberOfLines={1} style={[styles.fontTitle, styles.marginBM]} >{appointment.name}</Text>);
  }

  renderRow(rowData) {
    return (
      <View style={styles.resultList}>
        <View style={styles.resultListLeft}>
          <TouchableOpacity
            onPress={() => this.onActivityInfoViewPress(rowData.code, rowData.isReservable, rowData.reservationType)}
          >
            {this.renderTitle(rowData)}
            <Text numberOfLines={1} style={styles.fontGrey}>
              {rowData.reservationType === 'PRODUCT' ? `${rowData.startTime} 至 ${rowData.endTime}` : `${rowData.activityStartTime} 至 ${rowData.activityEndTime}`}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.resultListRight}>
          {rowData.isReservable ?
            <View style={secondaryButtonViewMiddle}>
              <Text
                numberOfLines={1}
                style={secondaryButtonTextMiddle}
                onPress={() => {
                  this.onAddCustomersPress(rowData.code, rowData.activityStartTime, rowData.activityEndTime, rowData.reservationType);
                }}
              >预约
          </Text></View> :
            <Text numberOfLines={1} style={styles.fontTitle}>活动中</Text>
          }
        </View>
      </View>
    );
  }

  /* renderHeader() {
    return (
      <View style={styles.greyHeaderArea}>
        <View style={styles.headerLeft}>
          <Text style={{fontSize:fontSizeLarge,color:color33,fontWeight:'600'}}>活动名称 / 活动日期</Text>
        </View>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={{fontSize:fontSizeLarge,color:color33,fontWeight:'600'}}>操作</Text>
        </View>
      </View>
    );
  }*/

  render() {
    return (
      <FsRootView isNavBarHidden={false} >
        <ListView
          refreshControl={<RefreshControl refreshing={this.props.refreshing} onRefresh={() => this.onListViewRefresh()} />}
          enableEmptySections
          dataSource={this.props.appointmentlist}
          renderRow={(rowData, argument, index) => this.renderRow(rowData, argument, index)}
          onEndReached={() => this.onEndReached()}
          onEndReachedThreshold={20}
        />
      </FsRootView>
    );
  }
}

AppointmentListView.propTypes = {
  appointmentlist: PropTypes.object,
  dispatch: PropTypes.func,
  endFlag: PropTypes.bool,
  currentPage: PropTypes.number,
  refreshing: PropTypes.bool,
  appointmentListLength: PropTypes.number,
};


const mapStateToProps = (state) => {
  const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
  const data = ds.cloneWithRows(state.appointment.appointmentlist);
  return {
    appointmentlist: data,
    currentPage: state.appointment.currentPage,
    endFlag: state.appointment.endFlag,
    refreshing: state.appointment.refreshing,
    appointmentListLength: state.appointment.appointmentlist.length,
  };
};

export default connect(mapStateToProps)(AppointmentListView);
