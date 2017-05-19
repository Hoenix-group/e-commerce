import React, { PropTypes, Component } from 'react';
import { connect } from 'dva/mobile';
import { Actions } from 'react-native-router-flux';
import { Text, List } from 'antd-mobile';
import { View, ListView, InteractionManager, RefreshControl, TouchableOpacity } from 'react-native';
import styles from './../appointment/styles';
import FsRootView from './../../components/common/FsRootView';
import PopupFilter from './../../components/Popup/PopupFilter';
import Util from './../../utils/utils';

class MyPrestoreListView extends Component {

  componentDidMount() {
    // this.props.dispatch({ type: 'myPrestore/fetchPrestoreList', refreshTag: true });
    InteractionManager.runAfterInteractions(() => {
      this.props.dispatch({ type: 'myPrestore/fetchPrestoreList', filterParms: this.props.filterParms, refreshTag: true });
    });
  }

  componentWillUnmount() {
    this.props.dispatch({ type: 'myPrestore/resetPrestoreListState' });
  }

  onFilterItemPress(menuIndex, itemIndex) {
    if (itemIndex < 0) {
      return;
    }
    Util.consoleLog(`filterItems text: ${this.props.filterDatas[menuIndex].filterItems[itemIndex].text} key: ${this.props.filterDatas[menuIndex].filterItems[itemIndex].key}`);
    const filterKey = this.props.filterDatas[menuIndex].filterItems[itemIndex].key;
    this.props.filterParms[menuIndex].value = filterKey;
    this.props.dispatch({ type: 'myPrestore/fetchPrestoreList', filterParms: this.props.filterParms, refreshTag: true });
  }

  onListViewRefresh() {
    this.props.dispatch({ type: 'myPrestore/fetchPrestoreList', filterParms: this.props.filterParms, refreshTag: true });
  }

  onListReachedBottom() {
    if (this.props.refreshing || this.props.endFlag) {
      return;
    }
    this.props.dispatch({ type: 'myPrestore/fetchPrestoreList', currentPage: this.props.currentPage, filterParms: this.props.filterParms });
  }

  renderRow(rowData, argument, index) {
    return (
      <TouchableOpacity key={index} onPress={() => { Actions.myPrestoreDetailView({ orderCode: rowData.orderCode }); }}>
        <View style={styles.resultList}>
          <View style={styles.resultListLeft}>
            <View>
              <Text style={[styles.fontTitle, styles.marginBM]}>{rowData.userName}&nbsp;{rowData.phone}</Text>
            </View>
            <View>
              <Text style={styles.fontGrey}>{rowData.prestorePlan}</Text>
            </View>
          </View>
          <View style={styles.resultListRight}>
            <Text style={styles.fontPrice}>{rowData.preStoreVoucherValue}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <FsRootView >
        <PopupFilter
          filterDataArrays={this.props.filterDatas}
          onItemSelected={(menuIndex, itemIndex) => this.onFilterItemPress(menuIndex, itemIndex)}
        />
        {this.props.listViewDataNumber > 0 ? (
          <ListView
            style={styles.borderT}
            refreshControl={<RefreshControl refreshing={this.props.refreshing} onRefresh={() => this.onListViewRefresh()} />}
            enableEmptySections
            dataSource={this.props.prestoreList}
            renderRow={(rowData, argument, index) => this.renderRow(rowData, argument, index)}
            onEndReached={() => this.onListReachedBottom()}
            onEndReachedThreshold={15}
          />
        ) : (<View />)}
      </FsRootView>
    );
  }
}

MyPrestoreListView.propTypes = {
  dispatch: PropTypes.func,
  prestoreList: PropTypes.object,
  filterDatas: PropTypes.array,
  endFlag: PropTypes.bool,
  currentPage: PropTypes.number,
  refreshing: PropTypes.bool,
  filterParms: PropTypes.array,
  listViewDataNumber: PropTypes.number,
};

const mapStateToProps = (state) => {
  const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
  const data = ds.cloneWithRows(state.myPrestore.prestoreList);
  return {
    prestoreList: data,
    filterDatas: state.myPrestore.filterDatas,
    endFlag: state.myPrestore.endFlag,
    currentPage: state.myPrestore.currentPage,
    refreshing: state.myPrestore.refreshing,
    filterParms: state.myPrestore.filterParms,
    listViewDataNumber: state.myPrestore.prestoreList.length,
  };
};

export default connect(mapStateToProps)(MyPrestoreListView);
