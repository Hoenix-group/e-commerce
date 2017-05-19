import React, { Component, PropTypes } from 'react';
import { connect } from 'dva/mobile';
import { Actions } from 'react-native-router-flux';
import { Button, ListView } from 'antd-mobile';
import { Text, View, RefreshControl } from 'react-native';
import RootView from './../../components/common/RootView';
import styles from './../appointment/styles';

class ListPrestoreCustomersView extends Component {

  componentDidMount() {
    Actions.refresh({
      rightTitle: '关闭',
      onRight: () => (Actions.pop()),
    });
    this.props.dispatch({ type: 'prestore/fetchCustomerList', ruleCode: this.props.preStorePromotionCode, refreshTag: true });
  }

  componentWillUnmount() {
    this.props.dispatch({ type: 'prestore/resetCustomerList' });
  }

  onListViewRefresh() {
    this.props.dispatch({ type: 'prestore/fetchCustomerList', ruleCode: this.props.preStorePromotionCode, refreshTag: true });
  }

  onEndReached() {
    if (this.props.refreshing || this.props.endFlag) {
      return;
    }
    this.props.dispatch({ type: 'prestore/fetchCustomerList', ruleCode: this.props.preStorePromotionCode, currentPage: this.props.currentPage });
  }

  renderRow(rowData, argument, index) {
    return (
      <View key={index} style={styles.resultListOne}>
        <View>
          <Text style={[styles.fontTitle, styles.marginBM]}>{rowData.userName}</Text>
        </View>
        <View>
          <Text style={styles.fontGrey}>{rowData.phone}</Text>
        </View>
      </View>
    );
  }

  /*renderHeader() {
    return (
      <View style={{ flexDirection: 'row', borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#AAA' }}>
        <View style={{ flex: 3, paddingVertical: 8, borderRightWidth: 1, borderColor: '#AAA' }}>
          <Text style={{ textAlign: 'center', fontSize: 13 }}>顾客姓名</Text>
        </View>
        <View style={{ flex: 5, paddingVertical: 8, borderRightWidth: 1, borderColor: '#AAA' }}>
          <Text style={{ textAlign: 'center', fontSize: 13 }}>顾客联系方式</Text>
        </View>
      </View>
    );
  }*/

  render() {
    return (
      <RootView style={{ justifyContent: 'space-between' }}>
        <ListView
          refreshControl={<RefreshControl refreshing={this.props.refreshing} onRefresh={() => this.onListViewRefresh()} />}
          enableEmptySections
          dataSource={this.props.prestorecustomers}
          renderRow={this.renderRow}
          onEndReached={() => this.onEndReached()}
          onEndReachedThreshold={20}
        />
        {this.props.prestoreable ?
          (<Button style={styles.buttonAngle} type="primary" onClick={() => Actions.addPrestoreCustomer({ code: this.props.preStorePromotionCode })}>添加顾客</Button>) : (<View />)}
      </RootView>
    );
  }
}

ListPrestoreCustomersView.propTypes = {
  prestorecustomers: PropTypes.object,
  dispatch: PropTypes.func,
  preStorePromotionCode: PropTypes.string,
  prestoreable: PropTypes.bool,
  currentPage: PropTypes.number,
  endFlag: PropTypes.bool,
  refreshing: PropTypes.bool,
};

const mapStateToProps = (state) => {
  const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
  const data = ds.cloneWithRows(state.prestore.customerList);
  return {
    prestorecustomers: data,
    preStorePromotionCode: state.prestore.prestoreDetail.preStorePromotionCode,
    prestoreable: state.prestore.prestoreDetail.prestoreable,
    currentPage: state.prestore.customerListPageState.currentPage,
    endFlag: state.prestore.customerListPageState.endFlag,
    refreshing: state.prestore.customerListPageState.refreshing,
  };
};

export default connect(mapStateToProps)(ListPrestoreCustomersView);
