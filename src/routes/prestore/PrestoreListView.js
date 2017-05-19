import React, { Component, PropTypes } from 'react';
import { connect } from 'dva/mobile';
import { Actions } from 'react-native-router-flux';
import { ListView, RefreshControl, InteractionManager } from 'react-native';
import FsRootView from './../../components/common/FsRootView';
import AppointmentRowComponent from './../../components/appointment/AppointmentRowComponent';

class PrestoreListView extends Component {

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.props.dispatch({ type: 'prestore/fetchPrestoresList', refreshTag: true });
    });
  }

  componentWillUnmount() {
    this.props.dispatch({ type: 'prestore/resetPrestoreList' });
  }

  onListViewRefresh() {
    this.props.dispatch({ type: 'prestore/fetchPrestoresList', refreshTag: true });
  }

  onEndReached() {
    if (this.props.prestoreListLength === 0 || this.props.refreshing || this.props.endFlag) {
      return;
    }
    this.props.dispatch({ type: 'prestore/fetchPrestoresList', currentPage: this.props.currentPage });
  }

  render() {
    const rowLabel = '预存';
    return (
      <FsRootView>
        <ListView
          refreshControl={<RefreshControl refreshing={this.props.refreshing} onRefresh={() => this.onListViewRefresh()} />}
          enableEmptySections
          dataSource={this.props.prestore}
          renderRow={rowData => (<AppointmentRowComponent
            rowData={rowData}
            rowLabel={rowLabel}
            onRowpress={code => Actions.prestoreDetail({ code })}
            onButtonpress={code => Actions.addPrestoreCustomer({ code })}
          />)}
          onEndReached={() => this.onEndReached()}
          onEndReachedThreshold={20}
        />
      </FsRootView>
    );
  }
}

PrestoreListView.propTypes = {
  dispatch: PropTypes.func,
  prestore: PropTypes.object,
  currentPage: PropTypes.number,
  endFlag: PropTypes.bool,
  refreshing: PropTypes.bool,
  prestoreListLength: PropTypes.number,
};

const mapStateToProps = (state) => {
  const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
  const data = ds.cloneWithRows(state.prestore.prestoreList);
  return {
    prestore: data,
    currentPage: state.prestore.prestoreListPageState.currentPage,
    endFlag: state.prestore.prestoreListPageState.endFlag,
    refreshing: state.prestore.prestoreListPageState.refreshing,
    prestoreListLength: state.prestore.prestoreList.length,
  };
};

export default connect(mapStateToProps)(PrestoreListView);
