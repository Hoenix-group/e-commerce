import React, { Component, PropTypes } from 'react';
import { connect } from 'dva/mobile';
import 'moment/locale/zh-cn';
import { List, ListView, Toast } from 'antd-mobile';
import { Text, View, Platform, TouchableOpacity } from 'react-native';
import Util from './../../utils/utils';
import FsRootView from './../../components/common/FsRootView';
import styles from './styles';

class SignAppointment extends Component {

  constructor(props) {
    super(props);
    this.state = {
      position: {},
    };
  }

  componentDidMount() {
    const positionOptions = Platform.OS === 'android' ? { enableHighAccuracy: true, timeout: 10000 } : { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 };
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({ position });
        this.props.dispatch({ type: 'signAppointment/initStateData', position });
      },
      (err) => {
        // if (err.code === 3) {
        //   Toast.fail('获取位置失败，请在手机系统中打开高精度定位');
        // } else {
        //   Toast.fail('获取位置信息失败，请确认GPS是否打开');
        // }
        Toast.fail('获取位置信息失败，请确认GPS是否打开');
        Util.consoleLog(err);
      },
      positionOptions,
    );
  }

  componentWillUnmount() {
    this.props.dispatch({ type: 'signAppointment/resetAppointmentLocations' });
  }

  onLocationItemClick(rowData) {
    this.props.dispatch({
      type: 'signAppointment/signin',
      code: this.props.appointmentcode,
      address: rowData,
    });
  }

  onListReachedBottom() {
    if (this.props.endTag) {
      return;
    }
    this.props.dispatch({
      type: 'signAppointment/fetchAppointmentLocations',
      position: this.props.position,
      currentPage: this.props.currentPage,
    });
  }

  renderRow(rowData, argument, index) {
    return (
      <TouchableOpacity onPress={() => this.onLocationItemClick(rowData)}>
        <View key={index} style={styles.resultListOne}>
          <View>
            <Text style={[styles.fontTitle, styles.marginBM]}>{rowData.name}</Text>
          </View>
          <Text style={styles.fontGrey}>{`${rowData.cityname} ${rowData.adname} ${rowData.address}`}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <FsRootView isNavBarHidden={false} >
        <Text style={[styles.fontGrey, styles.paddingM]}>{this.props.appointmentName}</Text>
        <ListView
          enableEmptySections
          dataSource={this.props.locationDatas}
          renderRow={(rowData, argument, index) => this.renderRow(rowData, argument, index)}
          onEndReached={() => this.onListReachedBottom()}
          onEndReachedThreshold={15}
        />
      </FsRootView>
    );
  }
}

SignAppointment.propTypes = {
  locationDatas: PropTypes.object,
  dispatch: PropTypes.func,
  endTag: PropTypes.any,
  position: PropTypes.object,
  currentPage: PropTypes.any,
  appointmentcode: PropTypes.string,
  appointmentName: PropTypes.string,
};

const mapStateToProps = (state) => {
  const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
  const data = ds.cloneWithRows(state.signAppointment.appointmentLocations);
  return {
    locationDatas: data,
    currentPage: state.signAppointment.currentPage,
    endTag: state.signAppointment.endTag,
    position: state.signAppointment.position,
  };
};

export default connect(mapStateToProps)(SignAppointment);
