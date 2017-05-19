import React, { PropTypes, Component } from 'react';
import { connect } from 'dva/mobile';
import { SearchBar, Text, Flex } from 'antd-mobile';
import { Actions } from 'react-native-router-flux';
import { View, Image, ListView, TouchableHighlight, RefreshControl, InteractionManager, Platform } from 'react-native';
import styles from './styles';
import Util from './../../utils/utils';

class CartComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
    };
    this.searchCartByNameOrPhone = this.searchCartByNameOrPhone.bind(this);
  }

  componentWillMount() {
    const { cartPageSize, cartCurrentPage } = this.props;
    const param = {
      cartPageSize,
      cartCurrentPage,
    };
    InteractionManager.runAfterInteractions(() => this.fetchCartsData(param));
  }

  onStopRefresh() {
    this.setState({
      refreshing: false,
    });
  }

  onEndReached() {
    Util.consoleLog(['onEndReached调用']);
    const { cartPageSize, cartCurrentPage, isLoadedAll, isSearchAction } = this.props;
    const param = {
      cartPageSize,
      cartCurrentPage: cartCurrentPage + 1,
    };
    if (isSearchAction) {
      return;
    }
    Util.consoleLog(['isLoadedAll', isLoadedAll]);
    if (isLoadedAll) {
      return;
    }
    this.fetchCartsData(param);
  }

  fetchCartsData(param, cb) {
    this.props.dispatch({ type: 'home/fetchCartsData', param, cb });
  }


  refresh() {
    this.setState({ refreshing: true });
    const param = {
      cartPageSize: 5,
      cartCurrentPage: 0,
    };
    this.fetchCartsData(param, this.onStopRefresh.bind(this));
  }


  searchCartByNameOrPhone(nameOrPhoneNumber) {
    // 如果清空搜索关键字，返回所有购物车数据
    const { cartPageSize, cartCurrentPage } = this.props;
    const param = {
      cartPageSize,
      cartCurrentPage,
    };
    if (nameOrPhoneNumber === '') {
      this.fetchCartsData(param, this.onStopRefresh.bind(this));
      return;
    }
    // 修改正则匹配，匹配汉字、字母混合，或者 匹配纯数字
    const regex = /^([a-zA-Z]{1,10}|[\u4e00-\u9fa5]{2,10}|[0-9]{4,11})$/;
    const flag = regex.test(nameOrPhoneNumber);

    if (flag) {
      this.props.dispatch({
        type: 'home/getCartsByUserId',
        nameOrPhoneNumber,
      });
    }
  }

  toCustomerCart(userId, cartId, cartType, phoneNumber) {
    Actions.mycart({ userId, cartId, cartType, phoneNumber });
  }

  calTotalQuantity(entries) {
    let totalQuantity = 0;
    entries.map((item) => { totalQuantity += item.quantity; return totalQuantity; });
    return totalQuantity;
  }


  renderRow(rowData) {
    return (
      <View style={{ flex: 1 }}>
        <View style={[styles.flex, styles.container, styles.b_bottom]}>
          <View style={[styles.flex, styles.container_header, styles.row1, styles.contentLR]}>
            <View style={[{ flex: 6, marginLeft: 10 }, styles.left1, styles.row1, { marginVertical: 5 }]}>
              <View style={[styles.onLineView1, styles.center, { marginRight: 5 }]}>
                <Text style={[styles.onLineBtn1]}>{rowData.cartType === 'TSK_ONLINE' ? '线上' : '线下'}</Text>
              </View>
              <View style={[styles.m10, styles.left2, { flex: 1, marginLeft: 0, paddingRight: 10 }]}>
                <Text numberOfLines={1} style={[styles.fontLarge]}>{rowData.customer.name} {rowData.customer.phoneNumber}</Text>
              </View>
            </View>
            <View style={[styles.left1, styles.row1, { flex: 4 }]}>
              <Text style={[styles.fontLarge, { paddingRight: 10 }]}>总金额:</Text>
              <Text style={[styles.sPrice, styles.fontLarge, styles.m_left5]}>¥{rowData.totalPrice.value}</Text>
            </View>
          </View>

          <TouchableHighlight underlayColor="#F8F8F8" onPress={() => { this.toCustomerCart(rowData.customer.uid, rowData.code, rowData.cartType, rowData.customer.phoneNumber); }}>
            <View style={[styles.container_body]}>
              <View style={[styles.imageView]}>
                {rowData.entries.filter((item) => { return !item.promotionCode; }).map((data, index) => {
                  if (index < 3) {
                    return (<View key={index} style={[styles.m10]}>
                      <Image style={[styles.image]} source={require('./../../../images/sale_product_01_280x190.png')} />
                    </View>);
                  }
                  return (<View key={index} />);
                })}
              </View>
              <View style={[styles.totalView, styles.center, styles.row1]}>
                <Text style={[styles.m20, styles.fontLarge, { marginHorizontal: 10 }]}>共{this.calTotalQuantity(rowData.entries.filter((item) => { return !item.promotionCode; }))}件</Text>
                <Image style={[styles.m20, styles.arrowIcon, { marginHorizontal: 0 }]} source={require('./../../../images/productDetallsImgs/icons/rn-chevron-right.png')} />
              </View>
            </View>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
  render() {
    if (Platform.OS === 'android' || (this.props.selectedTab && this.props.selectedTab === 'cart')) {
      return (
        <View style={{ flex: 1 }}>
          <Flex style={[{ backgroundColor: '#E0E0E0' }]}>
            <Flex.Item style={{ flex: 1 }}>
              <SearchBar placeholder="输入客户姓名和手机" onChange={(nameOrPhoneNumber) => { this.searchCartByNameOrPhone(nameOrPhoneNumber); }} />
            </Flex.Item >
          </Flex>
          <ListView
            refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.refresh.bind(this)} />}
            enableEmptySections
            style={[styles.container, styles.b_top]}
            dataSource={this.props.dataSource}
            renderRow={rowData => this.renderRow(rowData)}
            onEndReached={() => this.onEndReached()}
            initialListSize={10}
            onEndReachedThreshold={20}
          />
        </View>
      );
    }
    return (<View />);
  }
}

CartComponent.propTypes = {
  dataSource: PropTypes.object,
  dispatch: PropTypes.func,
  cartPageSize: PropTypes.number,
  cartCurrentPage: PropTypes.number,
  isLoadedAll: PropTypes.bool,
  isSearchAction: PropTypes.bool,
  selectedTab: PropTypes.string,
};

export default connect((state) => {
  const { dataSource, cartPageSize, cartCurrentPage, isSearchAction, isLoadedAll } = state.home;
  return { dataSource, cartPageSize, cartCurrentPage, isSearchAction, isLoadedAll };
})(CartComponent);
