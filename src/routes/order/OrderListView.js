import React, { Component, PropTypes } from 'react';
import { connect } from 'dva/mobile';
import {
    Text,
    View,
    Image,
    TouchableHighlight,
    InteractionManager,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Button, SearchBar, ListView } from 'antd-mobile';
import FsRootView from '../../components/common/FsRootView';
import { filterStatus, getStatusLabel, SHOW_LOGISTICS_STATUS, SHOW_CANCEL_STATUS, SHOW_BUYAGAIN_STATUS } from '../../services/orderService';

import styles from './styles';

class OrderListView extends Component {
  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.searchOrder(null, this.props.pageSize, 0);
    });
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: 'order/initializeState',
    });
  }

  onEndReached() {
    if (this.props.isFullyLoaded) {
      return;
    }
    this.searchOrder(this.props.input, this.props.pageSize, this.props.currentPage + 1);
  }

  onSearch(value) {
    this.searchOrder(value, this.props.pageSize, 0);
  }

  searchOrder(value, pageSize, currentPage) {
    this.props.dispatch({
      type: 'order/getOrders',
      input: value,
      pageSize,
      currentPage,
    });
  }

  cancelOrder(entry) {
    this.props.dispatch({
      type: 'order/cancel',
      code: entry.code,
    });
  }

  buyAgain(entry) {
    this.props.dispatch({
      type: 'order/buyAgain',
      order: entry,
    });
  }

  viewLogistics(entry) {
    this.props.dispatch({
      type: 'order/getLogistics',
      order: entry,
    });
  }

  viewOrderDetails(entry) {
    this.props.dispatch({
      type: 'order/setOrderId',
      code: entry.code,
      uid: entry.user.uid,
    });

    Actions.orderDetails();
  }

  countQuantity(entries) {
    if (!entries) {
      return 0;
    }

    let count = 0;
    for (let i = 0; i < entries.length; i += 1) {
      const entry = entries[i];
      count += Number(entry.quantity);
    }

    return count;
  }

  renderEntryImage(entries) {
    if (!entries) {
      return (null);
    }

    return entries.map((entry, i) => {
      if (entry.product && entry.product.images && i < 4) {
        return (<Image key={i} style={styles.image} source={entry.product.images[0].url} />);
      }
      return (<Image key={i} style={styles.image} source={require('./../../../images/sale_product_01_280x190.png')} />);
    });
  }

  renderItem(entry, i) {
    const showLogistics = filterStatus(SHOW_LOGISTICS_STATUS, entry.status);
    const showCancel = filterStatus(SHOW_CANCEL_STATUS, entry.status);
    const showBuyAgain = filterStatus(SHOW_BUYAGAIN_STATUS, entry.status);
    return (
      <View style={styles.bgF}>
        <TouchableHighlight underlayColor={'transparent'} onPress={() => this.viewOrderDetails(entry)}>
          <View key={i} style={[styles.p_left15_lr, styles.p_left15_lrv]}>

            <View style={[styles.contentLR, styles.row1, styles.b_bottom, styles.p_bottom10]}>
              <View style={[styles.left1, styles.row1]}>
                <Text style={[styles.textColor1, styles.fontLarge]}>订单号：</Text>
                <Text style={[styles.textColor, styles.fontLarge]}>{entry.code}</Text>
              </View>
              <View style={[styles.center, styles.row1]}>
                {
                  getStatusLabel(entry.status) === '已支付' ?
                    <Text style={[styles.textColor, styles.fontLarge, styles.sPrice]}>{getStatusLabel(entry.status)}</Text> :
                    <Text style={[styles.textColor, styles.fontLarge, styles.statusColor]}>{getStatusLabel(entry.status)}</Text>
                }
              </View>
            </View>

            <View style={[styles.left1, styles.row1, styles.images, styles.b_bottom]}>
              {this.renderEntryImage(entry.entries)}
            </View>

            <View style={[styles.contentLR, styles.row1, styles.p_top10]}>
              <View style={[styles.left1, styles.row1]}>
                <Text style={[styles.textColor, styles.fontLarge]}>共{this.countQuantity(entry.entries)}件</Text>
                <Text style={[styles.textColor, styles.fontLarge, styles.p_left]}>合计：</Text>
                <Text style={[styles.textColor, styles.fontLarge, styles.sPrice]}>{entry.totalPrice ? entry.totalPrice.formattedValue : ''}</Text>
              </View>
              <View style={[styles.center, styles.row1]}>
                {showLogistics ? (
                  <Button size="small" style={[styles.button]} onClick={() => { this.viewLogistics(entry); }}>
                    <Text style={[styles.font_12, styles.textColor1]}>查看物流</Text>
                  </Button>
               ) : (null)}
                {showCancel ? (
                  <Button size="small" style={[styles.button, styles.blueBtnBor, { marginLeft: 2 }]} onClick={() => { this.cancelOrder(entry); }}>
                    <Text style={[styles.font_12, styles.textColor1, styles.blueBtnText]}>取消订单</Text>
                  </Button>
               ) : (null)}
                {showBuyAgain ? (
                  <Button size="small" style={[styles.button, styles.blueBtnBor, { marginLeft: 2 }]} onClick={() => { this.buyAgain(entry); }}>
                    <Text style={[styles.font_12, styles.textColor1, styles.blueBtnText]}>再次购买</Text>
                  </Button>
               ) : (null)}
              </View>
            </View>
          </View>
        </TouchableHighlight>
        <View style={styles.intervalSpace1} />
      </View>
    );
  }

  render() {
    return (
      <FsRootView isNavBarHidden>
        <View style={styles.navSearchBar}>
          <View style={styles.navImageView}>
            <TouchableHighlight underlayColor={'transparent'} onPress={() => { Actions.pop(); }}>
              <Image style={{ width: 13, height: 21 }} source={require('./../../../images/back_icon.png')} />
            </TouchableHighlight>
          </View>
          <View style={styles.fillView}>
            <SearchBar placeholder="输入商品名称，订单号" onSubmit={val => this.onSearch(val)} />
          </View>
        </View>

        <ListView
          enableEmptySections
          dataSource={this.props.dataSource}
          renderRow={rowData => (this.renderItem(rowData))}
          delayTime={10}
          delayActivityIndicator={<Text>刷新中...</Text>}
          renderFooter={() => <View style={styles.footer}><Text style={[styles.font_12, styles.font_g]}>
            {this.props.isFullyLoaded ? '我是有底线的' : '上拉加载更多' }
          </Text></View>}
          onEndReached={() => this.onEndReached()}
          initialListSize={10}
          onEndReachedThreshold={20}
          style={{ backgroundColor: '#F4F4F4' }}
        />
      </FsRootView>
    );
  }
}

OrderListView.propTypes = {
  input: PropTypes.string,
  pageSize: PropTypes.number,
  currentPage: PropTypes.number,
  dispatch: PropTypes.func,
  dataSource: PropTypes.object,
  isFullyLoaded: PropTypes.bool,
};

const mapStateToProps = ({ order }) => {
  const { input, pageSize, currentPage, dataSource, isFullyLoaded } = order;
  return { input, pageSize, currentPage, dataSource, isFullyLoaded };
};

export default connect(mapStateToProps)(OrderListView);
