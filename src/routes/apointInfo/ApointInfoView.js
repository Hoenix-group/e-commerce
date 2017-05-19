import React, { PropTypes } from 'react';
import { connect } from 'dva/mobile';
import { Text, List, Button, Picker } from 'antd-mobile';
import { View, ScrollView } from 'react-native';
import moment from 'moment';
import styles from './../appointment/styles';
import { secondaryButtonViewMiddle, secondaryButtonTextMiddle, greyButtonViewMiddle, greyButtonTextMiddle, primaryIconView, primaryIconText } from './../../themes/fsBaseStyles';
import RootView from './../../components/common/RootView';

const ActivityInfoView = ({ detailInfo, dispatch }) => (
  <RootView>
    <View style={styles.detailHeader}>
      <View style={styles.detailHeaderLeft}>
        <View style={[primaryIconView, styles.onlineIcon]}>
          <Text style={primaryIconText}>{detailInfo.channels && detailInfo.channels.includes('五星享购WEB') ? '线上' : '线下'}</Text>
        </View>
      </View>
      <View style={styles.detailHeaderRight}>
        <Text style={styles.headerTitle}>{detailInfo.activityName}</Text>
      </View>
    </View>
    <ScrollView>
      <View style={[styles.detailListView, styles.detailListViewFirst]}>
        <View>
          <Text style={styles.detailListTitle}>创建时间:</Text>
        </View>
        <Text style={styles.detailListContent}> {detailInfo.creationTime && moment(detailInfo.creationTime).utcOffset(8).format('lll')}</Text>
      </View>
      <View style={styles.detailListView}>
        <View>
          <Text style={styles.detailListTitle}>顾客姓名:</Text>
        </View>
        <Text style={styles.detailListContent}> {detailInfo.userName}</Text>
      </View>
      <View style={styles.detailListView}>
        <View>
          <Text style={styles.detailListTitle}>联系方式:</Text>
        </View>
        <Text style={styles.detailListContent}> {detailInfo.phone && [detailInfo.phone.slice(0, 3), ' ', detailInfo.phone.slice(3, 7), ' ', detailInfo.phone.slice(7)].join('')}</Text>
      </View>
      <View style={styles.detailListView}>
        <View>
          <Text style={styles.detailListTitle}>预约门店:</Text>
        </View>
        <Text style={styles.detailListContent}> {detailInfo.store && detailInfo.store.displayName}</Text>
      </View>
      {detailInfo.reservationType.code === 'ACTIVITY' ? (
        <View style={styles.detailListView}>
          <View>
            <Text style={styles.detailListTitle}>到店时间:</Text>
          </View>
          <Text style={styles.detailListContent}> {detailInfo.reservationTime && moment(detailInfo.reservationTime).utcOffset(8).format('LL')}</Text>
        </View>) : (<View />)
      }
      <View style={styles.detailListView}>
        <View>
          <Text style={styles.detailListTitle}>预约状态:</Text>
        </View>
        <Text style={styles.detailListContent}> {detailInfo.reservationStatus.name}</Text>
      </View>
      {detailInfo.reservationType.code === 'ACTIVITY' ? (
        <View style={styles.detailListView}>
          <View>
            <Text style={styles.detailListTitle}>活动内容:</Text>
          </View>
          <Text style={styles.detailListContent}> {detailInfo.activityContent}</Text>
        </View>
      ) : (
        <View style={styles.detailListView}>
          <View>
            <Text style={styles.detailListTitle}>活动商品:</Text>
          </View>
          <Text style={styles.detailListContent}>{detailInfo.products && detailInfo.products.map(data => (`${data.code} ${data.name}`)).join('\n')}</Text>
        </View>
      )
      }
    </ScrollView>
    <Picker
      extra="Button"
      data={detailInfo.stateOptsData}
      cols={1}
      title="选择状态"
      triggerType="onClick"
      value={[detailInfo.reservationStatus.code]}
      onChange={val => dispatch({ type: 'myAppointment/updateAppointmentStatus', status: val[0], code: detailInfo.id })}
    >
      <Button type="primary" style={styles.buttonAngle}>更新预约状态</Button>
    </Picker>
  </RootView>
);

ActivityInfoView.propTypes = {
  detailInfo: PropTypes.object,
  dispatch: PropTypes.func,
};

const mapStateToProps = state => ({
  detailInfo: state.myAppointment.appointmentDetail,
});
export default connect(mapStateToProps)(ActivityInfoView);
