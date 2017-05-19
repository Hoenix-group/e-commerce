import React, { PropTypes, Component } from 'react';
import { connect } from 'dva/mobile';
import { Actions } from 'react-native-router-flux';
import { Text } from 'antd-mobile';
import { View, ListView, TouchableOpacity, InteractionManager, RefreshControl } from 'react-native';
import moment from 'moment';
import styles from './styles';
import PopupFilter from './../../components/Popup/PopupFilter';
// import RootView from './../../components/common/RootView';
import FsRootView from './../../components/common/FsRootView';
import Util from './../../utils/utils';

class MyAppointmentListView extends Component {

  componentDidMount() {
    this.props.dispatch({ type: 'myAppointment/initStateData' });
    InteractionManager.runAfterInteractions(() => {
      this.props.dispatch({ type: 'myAppointment/fetchAppointmentListData', filterSelectedParms: this.props.filterSelectedParms, refreshTag: true });
    });
  }

  componentWillUnmount() {
    this.props.dispatch({ type: 'myAppointment/resetAppointmentList' });
  }

  onFilterButtonPress(index) {
    this.props.dispatch({ type: 'myAppointment/changeFilterMenuState' }, index);
  }

  onFilterItemPress(menuIndex, itemIndex) {
    if (itemIndex < 0) {
      return;
    }
    Util.consoleLog(`filterItems text: ${this.props.filterDatas[menuIndex].filterItems[itemIndex].text} key: ${this.props.filterDatas[menuIndex].filterItems[itemIndex].key}`);
    const filterKey = this.props.filterDatas[menuIndex].filterItems[itemIndex].key;
    this.props.filterSelectedParms[menuIndex].value = filterKey;
    // switch (menuIndex) {
    //   case 0:
    //     this.props.dispatch({ type: 'myAppointment/fetchAppointmentListData', storeName: filterKey, refreshTag: true });
    //     break;
    //   case 1:
    //     this.props.dispatch({ type: 'myAppointment/fetchAppointmentListData', status: filterKey, refreshTag: true });
    //     break;
    //   case 2:
    //     this.props.dispatch({ type: 'myAppointment/fetchAppointmentListData', sort: filterKey, refreshTag: true });
    //     break;
    //   default:
    //     Util.consoleLog();
    // }
    this.props.dispatch({ type: 'myAppointment/fetchAppointmentListData', filterSelectedParms: this.props.filterSelectedParms, refreshTag: true });
  }

  onListViewRefresh() {
    this.props.dispatch({ type: 'myAppointment/fetchAppointmentListData', filterSelectedParms: this.props.filterSelectedParms, refreshTag: true });
  }

  onEndReached() {
    if (this.props.listViewDataNumber === 0 || this.props.refreshing || this.props.endFlag) {
      return;
    }
    this.props.dispatch({ type: 'myAppointment/fetchAppointmentListData', currentPage: this.props.currentPage, filterSelectedParms: this.props.filterSelectedParms });
  }

  onListItemClicked(code, data) {
    this.props.dispatch({ type: 'myAppointment/fetchAppointmentDetailData', code });
    Actions.apointInfo({ data });
  }

  getToTime(rowData) {
    const startTickCount = rowData.activityStartTime ? rowData.activityStartTime : rowData.reservationTimeStart;
    const endTickCount = rowData.activityEndTime ? rowData.activityEndTime : rowData.reservationTimeEnd;
    const startDateStr = moment(startTickCount).format('MMMDo');
    const endDateStr = moment(endTickCount).format('MMMDo');
    return `${startDateStr}至${endDateStr}`;
  }

  /* renderRow(rowData, argument, index) {
    return (
      <List.Item key={index} onClick={() => { this.onListItemClicked(rowData.id, rowData); }}>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <View style={{ flex: 0.9, flexDirection: 'column' }}>
            <View style={{ flex: 0.5, flexDirection: 'row' }}>
              <Text style={[styles.font_18]}>{rowData.userName}</Text>
              <Text style={[styles.font_18, { marginLeft: 15 }]}>{rowData.phone}</Text>
            </View>
            <View style={{ flex: 0.5, flexDirection: 'row' }}>
              <Text lineBreakMode="tail" numberOfLines={1}>{`${rowData.activityName}  ${this.getToTime(rowData.activityStartTime, rowData.activityEndTime)}`}</Text>
            </View>
          </View>
        </View>
      </List.Item>
    );
  }*/
  renderActivity(appointment) {
    // onPress={() => this.onActivityInfoViewPress(appointment.code, appointment.isReservable)}
    if (appointment.activityName.length >= 10) {
      return (<Text style={styles.fontGrey}>{'${appointment.activityName.slice(0, 10)}... ${this.getToTime(appointment.activityStartTime, appointment.activityEndTime)}'}</Text>);
    }
    return (<Text style={styles.fontGrey}>{`${appointment.activityName}  ${this.getToTime(appointment.activityStartTime, appointment.activityEndTime)}`}</Text>);
  }

  renderRow(rowData) {
    return (
      <TouchableOpacity onPress={() => { this.onListItemClicked(rowData.id, rowData); }}>
        <View style={styles.resultListOne}>
          <View>
            <Text style={[styles.fontTitle, styles.marginBM]} >{rowData.userName}&nbsp;{rowData.phone}</Text>
          </View>
          <View>
            {/*{this.renderActivity(rowData)}*/}
            <Text style={styles.fontGrey}>{ rowData.activityName.length >= 10 ? `${rowData.activityName.slice(0, 10)}...` : rowData.activityName }{`${this.getToTime(rowData)}`}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <FsRootView isNavBarHidden={false} >
        <PopupFilter
          filterDataArrays={this.props.filterDatas}
          onItemSelected={(menuIndex, itemIndex) => this.onFilterItemPress(menuIndex, itemIndex)}
        />
        <ListView
          style={styles.borderT}
          refreshControl={<RefreshControl refreshing={this.props.refreshing} onRefresh={() => this.onListViewRefresh()} />}
          enableEmptySections
          dataSource={this.props.appoinmentList}
          renderRow={(rowData, argument, index) => this.renderRow(rowData, argument, index)}
          onEndReached={() => this.onEndReached()}
          onEndReachedThreshold={20}
        />
      </FsRootView>
    );
  }
}

MyAppointmentListView.propTypes = {
  // acData: PropTypes.object,
  dispatch: PropTypes.func,
  currentPage: PropTypes.number,
  appoinmentList: PropTypes.object,
  filterDatas: PropTypes.array,
  endFlag: PropTypes.bool,
  refreshing: PropTypes.bool,
  filterSelectedParms: PropTypes.array,
  listViewDataNumber: PropTypes.number,
};

const mapStateToProps = (state) => {
  const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
  const data = ds.cloneWithRows(state.myAppointment.acData.aclist);
  return {
    appoinmentList: data,
    acData: state.myAppointment.acData,
    currentPage: state.myAppointment.currentPage,
    filterDatas: state.myAppointment.filterDatas,
    endFlag: state.myAppointment.endFlag,
    refreshing: state.myAppointment.refreshing,
    filterSelectedParms: state.myAppointment.filterSelectedParms,
    listViewDataNumber: state.myAppointment.acData.aclist.length,
  };
};

export default connect(mapStateToProps)(MyAppointmentListView);
