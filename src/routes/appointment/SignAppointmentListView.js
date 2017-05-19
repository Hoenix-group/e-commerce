import React, { Component, PropTypes } from 'react';
import { connect } from 'dva/mobile';
import moment from 'moment';
import { List, ListView } from 'antd-mobile';
import { Text, View, InteractionManager } from 'react-native';
import FsRootView from './../../components/common/FsRootView';
import styles from './styles';

class SignAppointmentListView extends Component {
  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.searchSigninLog(this.props.pageSize, 0);
    });
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: 'appointmentDetail/initializeState',
    });
  }

  onEndReached() {
    if (this.props.isFullyLoaded) {
      return;
    }
    this.searchSigninLog(this.props.pageSize, this.props.currentPage + 1);
  }

  searchSigninLog(pageSize, currentPage) {
    this.props.dispatch({
      type: 'appointmentDetail/searchSigninLog',
      code: this.props.appointmentcode,
      pageSize,
      currentPage,
    });
  }

  renderRow(rowData, argument, index) {
    return (
      <View style={styles.resultListOne} key={index} >
        <View>
          <Text style={[styles.fontTitle, styles.marginBM]} >{rowData.address.name}</Text>
        </View>
        <View>
          <Text style={styles.fontGrey}>{rowData.date ? moment(rowData.date).format('YYYY-MM-DD HH:mm') : ''}&nbsp;签到成功</Text>
        </View>
      </View>
    );
  }

  render() {
    return (
      <FsRootView>
        <Text style={[styles.fontGrey, styles.paddingM]}>{this.props.appointmentName}</Text>
        {/*<ListView
          enableEmptySections
          delayTime={10}
          dataSource={this.props.dataSource}
          renderRow={(rowData, argument, index) => this.renderRow(rowData, argument, index)}
          renderFooter={() => <View style={styles.footer}><Text style={[styles.font_12, styles.font_g]}>
            {this.props.isFullyLoaded ? '我是有底线的' : '上拉加载更多' }
          </Text></View>}
          onEndReached={() => this.onEndReached()}
          initialListSize={10}
          onEndReachedThreshold={20}
        />*/}
        {/*去掉了render footer*/}
        <ListView
          enableEmptySections
          delayTime={10}
          dataSource={this.props.dataSource}
          renderRow={(rowData, argument, index) => this.renderRow(rowData, argument, index)}
          onEndReached={() => this.onEndReached()}
          initialListSize={10}
          onEndReachedThreshold={20}
        />
      </FsRootView>
    );
  }
}

SignAppointmentListView.propTypes = {
  pageSize: PropTypes.number,
  currentPage: PropTypes.number,
  appointmentcode: PropTypes.string,
  appointmentName: PropTypes.string,
  isFullyLoaded: PropTypes.bool,
  dispatch: PropTypes.func,
  dataSource: PropTypes.object,
};

const mapStateToProps = (state) => {
  const { pageSize, currentPage, isFullyLoaded, dataSource } = state.appointmentDetail;
  return {
    pageSize, currentPage, isFullyLoaded, dataSource };
};

export default connect(mapStateToProps)(SignAppointmentListView);
