import React, { Component, PropTypes } from 'react';
import { View, ScrollView, Text, ListView, Button } from 'react-native';
import { List, Checkbox, Flex } from 'antd-mobile';
import { Actions } from 'react-native-router-flux';
import { connect } from 'dva/mobile';
import styles from './styles';

const Item = List.Item;

class CustomerCheckListView extends Component {
  constructor() {
    super();

    this.renderCustomerItem = this.renderCustomerItem.bind(this);
    this.renderCustomerList = this.renderCustomerList.bind(this);
    this.confirm = this.confirm.bind(this);
  }

  confirm() {
    const customers = this.props.selectedCustomers;
    this.props.dispatch({
      type: 'CustomerGroup/updateCustomerGroup',
      group: '',
      customers,
    });
    Actions.pop();
  }

  clearSelection() {
    this.props.dispatch({
      type: 'CustomerGroup/unselectAllCustomers',
    });
  }

  onCustomerItemChecked(member) {
    this.props.dispatch({
      type: 'CustomerGroup/updateSelectedCustomers',
      selectedCustomer: member,
    });
  }

  componentWillMount() {
    Actions.refresh({
      rightTitle: '确认',
      onRight: this.confirm,
    });
  }

  componentWillUnmount() {
    this.clearSelection();
  }

  toCustomerDetail(customer) {
    return () => {
      Actions.customerDetail({ from: 'CustomerListView', customer });
    };
  }

  renderCustomerList(customers) {
    const ds = new ListView.DataSource({
      rowHasChanged: (prevRow, nextRow) => (prevRow !== nextRow),
    });
    const dataSource = ds.cloneWithRows(customers);

    return (
      <ListView
        dataSource={dataSource}
        renderRow={this.renderCustomerItem}
      />
    );
  }

  renderCustomerItem(member) {
    return (
      <Item extra={member.phoneNumber} onClick={this.toCustomerDetail(member)}>
        <View style={{ flexDirection: 'row' }}>
          <Checkbox
            onChange={() => this.onCustomerItemChecked(member)}
          />
          <Text style={{ marginLeft: 5, alignSelf: 'center' }}>{member.lastName}{member.firstName}</Text>
        </View>
      </Item>
    );
  }

  render() {
    return (
      <View style={{ flex: 1, marginTop: 64 }}>
        {this.renderCustomerList(this.props.customers)}
      </View>
    );
  }
}

CustomerCheckListView.propTypes = {
  customers: PropTypes.array,
  dispatch: PropTypes.func,
  selectedCustomers: PropTypes.array,
};

function mapStateToProps({ CustomerGroup }) {
  const { customers, selectedCustomers } = CustomerGroup;
  return { customers, selectedCustomers };
}

export default connect(mapStateToProps)(CustomerCheckListView);
