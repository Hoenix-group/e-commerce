import React, { PropTypes } from 'react';
import { connect } from 'dva/mobile';
import moment from 'moment';
import 'moment/locale/zh-cn';
import { Actions } from 'react-native-router-flux';
import { List, Button } from 'antd-mobile';
import { Text, View } from 'react-native';
import styles from './styles';
import FsRootView from './../../components/common/FsRootView';

const AddAppointmentCustomerResultView = ({ appointmentResultData }) => (
  <FsRootView isNavBarHidden={false} >
        <View style={styles.resultListOneFlex}>
          <View style={styles.resultListOneLeft}>
            <Text style={[styles.fontTitle]} >预约活动:</Text>
          </View>
          <View style={styles.detailHeaderRight}>
            <Text style={[styles.fontTitle]} >{ appointmentResultData.activityName }</Text>
          </View>
        </View>
        <View style={styles.resultListOneFlex}>
          <View style={styles.resultListOneLeft}>
            <Text style={[styles.fontTitle]} >顾客姓名:</Text>
          </View>
          <View style={styles.resultListOneRight}>
            <Text style={[styles.fontTitle]} >{ appointmentResultData.userName }</Text>
          </View>
        </View>
        <View style={styles.resultListOneFlex}>
          <View style={styles.resultListOneLeft}>
            <Text style={[styles.fontTitle]} >联系方式:</Text>
          </View>
          <View style={styles.resultListOneRight}>
            <Text style={[styles.fontTitle]} >{ appointmentResultData.phone }</Text>
          </View>
        </View>
        <View style={styles.resultListOneFlex}>
          <View style={styles.resultListOneLeft}>
            <Text style={[styles.fontTitle]} >预约时间:</Text>
          </View>
          <View style={styles.resultListOneRight}>
            <Text style={[styles.fontTitle]} >{ moment(appointmentResultData.creationTime).utcOffset(8).format('L') }</Text>
          </View>
        </View>
        <View style={styles.resultListOneFlex}>
          <View style={styles.resultListOneLeft}>
            <Text style={[styles.fontTitle]} >预约卖场:</Text>
          </View>
          <View style={styles.resultListOneRight}>
            <Text style={[styles.fontTitle]} >{ appointmentResultData.store ? appointmentResultData.store.displayName : '' }</Text>
          </View>
        </View>
      {appointmentResultData.reservationType.code === 'ACTIVITY' ? (
        
          <View style={styles.resultListOneFlex}>
            <View style={styles.resultListOneLeft}>
              <Text style={[styles.fontTitle]} >到店时间:</Text>
            </View>
            <View style={styles.resultListOneRight}>
              <Text style={[styles.fontTitle]} >{ moment(appointmentResultData.reservationTime).utcOffset(8).format('L') }</Text>
            </View>
        </View>
) : (<View />)
      }
    <Button style={{ marginTop: 30, marginLeft: 110, marginRight: 110 }}size="small" type="ghost" onClick={() => Actions.popTo('appointmentlist')}>返回活动列表</Button>
  </FsRootView>
);


AddAppointmentCustomerResultView.propTypes = {
  appointmentResultData: PropTypes.object,
};

const mapStateToProps = state => ({
  appointmentResultData: state.addappointmentcustomer.appointmentResultData,
});

export default connect(mapStateToProps)(AddAppointmentCustomerResultView);
