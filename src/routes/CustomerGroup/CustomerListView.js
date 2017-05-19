import React, { Component, PropTypes } from 'react';
import { View, Text, ListView, Button, InteractionManager, RefreshControl } from 'react-native';
import { SearchBar, List } from 'antd-mobile';
import { Actions } from 'react-native-router-flux';
import { connect } from 'dva/mobile';
import styles from './styles';

const Item = List.Item;

class CustomerListView extends Component {
  constructor() {
    super();

    this.renderCustomerItem = this.renderCustomerItem.bind(this);
    this.refreshList = this.refreshList.bind(this);
    this.renderCustomerList = this.renderCustomerList.bind(this);
    this.renderSectionHeader = this.renderSectionHeader.bind(this);
    this.searchCustomer = this.searchCustomer.bind(this);
    this.onCancelSearch = this.onCancelSearch.bind(this);
    this.onSearchKeywordChange = this.onSearchKeywordChange.bind(this);
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.refreshList();
    });
  }

  refreshList() {
    // this.setState({ refreshing: true });
    if (this.props.searchKeyword && this.props.searchKeyword !== '') {
      this.searchCustomer(this.props.searchKeyword);
    } else {
      this.getAllCustomers();
    }
  }

  getAllCustomers() {
    this.props.dispatch({
      type: 'CustomerGroup/getCustomers',
    });
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: 'CustomerGroup/setSearchKeyword',
      searchKeyword: '',
    });
  }

  searchCustomer(v) {
    this.props.dispatch({
      type: 'CustomerGroup/searchCustomer',
      searchKeyword: v,
    });
  }

  onCancelSearch() {
    this.getAllCustomers();
  }

  // 分组人员添加跳转界面
  toCheckGroup() {
    Actions.customerCheckListView({ from: 'CustomerListView' });
  }

  // 人员详情信息页
  toCustomerDetail(customer) {
    return () => {
      Actions.customerDetail({ from: 'CustomerListView', customer });
    };
  }

  renderCustomerList(customers) {
    const ds = new ListView.DataSource({
      rowHasChanged: (prevRow, nextRow) => (prevRow !== nextRow),
      sectionHeaderHasChanged: (prevSec, nextSec) => (prevSec !== nextSec),
    });
    const dataSource = ds.cloneWithRowsAndSections({
      测试1: [],
      有时间参加活动: [],
      未分组: customers,
    });

    return (
      <ListView
        dataSource={dataSource}
        renderRow={this.renderCustomerItem}
        renderSectionHeader={this.renderSectionHeader}
        refreshControl={
          <RefreshControl
            onRefresh={this.refreshList}
            refreshing={this.props.refreshingList}
          />
        }
        enableEmptySections
      />
    );
  }

  renderSectionHeader(sectionData, sectionId) {
    return (
      <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-between', backgroundColor: '#F0F0F0' }}>
        <Text style={[styles.textCenter, { marginLeft: 15 }]}>{sectionId}</Text>
        { sectionId !== '未分组' ?
          <Button title="+" onPress={this.toCheckGroup} /> :
          <Button title="" onPress={() => {}} />
        }
      </View>
    );
  }

  renderCustomerItem(member) {
    return (
      <Item extra={member.phoneNumber} onClick={this.toCustomerDetail(member)}>
        <Text style={{ alignSelf: 'flex-start' }}>{member.lastName}{member.firstName}</Text>
      </Item>
    );
  }

  onSearchKeywordChange(v) {
    if (v === '') {
      this.onCancelSearch();
    } else {
      this.props.dispatch({
        type: 'CustomerGroup/setSearchKeyword',
        searchKeyword: v,
      });
    }
  }

  render() {
    const customers = this.props.customers ? this.props.customers : [];
    return (
      <View style={{ marginTop: 64, flex: 1 }}>
        <SearchBar
          placeholder="输入顾客姓名或手机号"
          value={this.props.searchKeyword}
          onChange={this.onSearchKeywordChange}
          onSubmit={this.searchCustomer}
        />
        {this.renderCustomerList(customers)}
      </View>
    );
  }
}

CustomerListView.propTypes = {
  customers: PropTypes.array,
  refreshingList: PropTypes.bool,
  searchKeyword: PropTypes.string,
  dispatch: PropTypes.func,
};

function mapStateToProps({ CustomerGroup }) {
  const { customers, refreshingList, searchKeyword } = CustomerGroup;
  return { customers, refreshingList, searchKeyword };
}

export default connect(mapStateToProps)(CustomerListView);
