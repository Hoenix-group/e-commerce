import React, { Component, PropTypes } from 'react';
import { connect } from 'dva/mobile';
import { Text } from 'antd-mobile';
import { View, ScrollView, InteractionManager } from 'react-native';
import styles from './../appointment/styles';
import RootView from './../../components/common/RootView';
import { primaryIconView, primaryIconText } from './../../themes/fsBaseStyles';
import * as dictionaryService from './../../services/dictionaryService';

class MyPrestoreDetailView extends Component {

  componentDidMount() {
    this.props.dispatch({ type: 'myPrestore/fetchPrestoreDetail', code: this.props.orderCode });
  }

  componentWillReceiveProps() {
    InteractionManager.runAfterInteractions(() => {
      if (this.props.orderCode !== this.props.prestoreDetail.orderCode) {
        this.props.dispatch({ type: 'myPrestore/fetchPrestoreDetail', code: this.props.orderCode });
      }
    });
  }

  componentWillUnmount() {
    this.props.dispatch({ type: 'myPrestore/resetPrestoreDetail' });
  }

  renderLabel() {
    if (!this.props.prestoreDetail.channelsList) {
      return (<View />);
    }
    const labels = dictionaryService.classifyChannelLabel(this.props.prestoreDetail.channelsList);
    return (labels.map((item, i) =>
      <View key={i} style={[primaryIconView, styles.onlineIcon]}>
        <Text style={primaryIconText}>{item}</Text>
      </View>));
  }

  render() {
    return (
      <RootView>
        <View style={styles.detailHeader}>
          <View style={styles.detailHeaderLeft}>
            {this.renderLabel()}
          </View>
          <View style={styles.detailHeaderRight}>
            <Text style={styles.headerTitle}>{this.props.prestoreDetail.prestoreName}</Text>
          </View>
        </View>
        <ScrollView>
          <View style={[styles.detailListView, styles.detailListViewFirst]}>
            <View>
              <Text style={styles.detailListTitle}>创建时间:</Text>
            </View>
            <Text style={styles.detailListContent}>{this.props.prestoreDetail.prestoreTime}</Text>
          </View>
          <View style={styles.detailListView}>
            <View>
              <Text style={styles.detailListTitle}>预存名称:</Text>
            </View>
            <Text style={styles.detailListContent}>{this.props.prestoreDetail.prestoreName}</Text>
          </View>
          <View style={styles.detailListView}>
            <View>
              <Text style={styles.detailListTitle}>预存描述:</Text>
            </View>
            <Text style={styles.detailListContent}>{this.props.prestoreDetail.prestoreDescription}</Text>
          </View>
          <View style={styles.detailListView}>
            <View>
              <Text style={styles.detailListTitle}>券有效期:</Text>
            </View>
            <Text style={styles.detailListContent}>{this.props.prestoreDetail.voucherExpiryDate}</Text>
          </View>
          <View style={styles.detailListView}>
            <View>
              <Text style={styles.detailListTitle}>应用渠道:</Text>
            </View>
            <Text style={styles.detailListContent}>{this.props.prestoreDetail.channels}</Text>
          </View>
          <View style={styles.detailListView}>
            <View>
              <Text style={styles.detailListTitle}>区域门店:</Text>
            </View>
            <Text style={styles.detailListContent}>{this.props.prestoreDetail.stores}</Text>
          </View>
          <View style={styles.detailListView}>
            <View>
              <Text style={styles.detailListTitle}>预存方案:</Text>
            </View>
            <Text style={styles.detailListContent}>{this.props.prestoreDetail.prestorePlan}</Text>
          </View>
        </ScrollView>
      </RootView>
    );
  }
}

MyPrestoreDetailView.propTypes = {
  prestoreDetail: PropTypes.object,
  dispatch: PropTypes.func,
  orderCode: PropTypes.string,
};

const mapStateToProps = state => ({
  prestoreDetail: state.myPrestore.prestoreDetail,
});
export default connect(mapStateToProps)(MyPrestoreDetailView);
