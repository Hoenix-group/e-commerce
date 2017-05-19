import React, { Component, PropTypes } from 'react';
import { connect } from 'dva/mobile';
import { ScrollView, Text, View } from 'react-native';
import { List } from 'antd-mobile';
import RootView from './../../components/common/RootView';
import styles from './styles';

class DateListView extends Component {
  componentWillMount() {
    const { productCode, regionCode, number, dateType } = this.props.data;
    this.props.dispatch({ type: 'dateList/getDeliveryAndInstallDates', productCode, regionCode, number, dateType });
  }

  selectDate(date, time) {
    const { dispatch } = this.props;
    // dateType 9: 送货 18：安装 28:维修
    const { entryNumber, conCode, dateType } = this.props.data;
    if (dateType === 9) {
      dispatch({
        type: 'dateList/changeEntryDistributionTime',
        entryNumber,
        conCode,
        distributionDate: date,
        distributionTime: time,
      });
    } else if (dateType === 18) {
      dispatch({
        type: 'dateList/changeEntryInstallTime',
        entryNumber,
        conCode,
        installDate: date,
        installTime: time,
      });
    } else {
      // 维修接口暂无
    }
  }

/**
 * 暂时没有数据，页面样式需有数据后调整。
 * @param {*} item -> 可选配送/安装日期对象
 * @param {*} i -> key值
 */
  renderItem(item, i) {
    return (
      <Text
       key={i}
       style={ styles.dateItem }
       onPress={() => { this.selectDate(item.date, item.name); }}
       >{ item.date } - { item.name }</Text>
    );
  }

  render() {
    const { availableDates } = this.props.data;
    return (
      <RootView>
        <View>
          <ScrollView>
            <List>
              {availableDates.map((item, i) => this.renderItem(item, i))}
            </List>
          </ScrollView>
        </View>
      </RootView>
    );
  }
}

DateListView.propTypes = {
  data: PropTypes.object,
  dispatch: PropTypes.func,
};

export default connect(({ dateList }) => ({
  data: dateList,
}))(DateListView);
