import React, { PropTypes } from 'react';
import { Text } from 'antd-mobile';
import { View, TouchableOpacity } from 'react-native';
import moment from 'moment';
import styles from './../../routes/appointment/styles';
import { secondaryButtonViewMiddle, secondaryButtonTextMiddle } from './../../themes/fsBaseStyles';

const AppointmentRowComponent = ({ rowData, rowLabel, onRowpress, onButtonpress }) => (
    (<View style={styles.resultList}>
      <TouchableOpacity style={styles.resultListLeft} onPress={() => onRowpress(rowData.prestoreRuleCode)}>
        <View>
          <View>
            <Text style={[styles.fontTitle, styles.marginBM]}>
              { rowData.name.length >= 12 ? `${rowData.name.slice(0, 12)}...` : rowData.name }
            </Text>
          </View>
          <View>
            <Text style={[styles.fontGrey]}>{
              rowData.prestoreable ?
              `${moment(Number(rowData.startTime)).utcOffset(8).format('L')} 至 ${moment(Number(rowData.endTime)).utcOffset(8).format('L')}` :
              `${moment(Number(rowData.voucherStartTime)).utcOffset(8).format('L')} 至 ${moment(Number(rowData.voucherEndTime)).utcOffset(8).format('L')}`}</Text>
          </View>
          <Text style={[styles.fontGrey]}>
            {/*由于预存规则本身已经有5个字符，preStoreVoucherName很容易显示不下，所以处理成折行显示*/}
            { rowData.preStoreValue ?
              `预存${rowData.preStoreValue}元 返${rowData.preStoreVoucherName} ${rowData.preStoreVoucherValue}元`
              : ''}
          </Text>
        </View>
      </TouchableOpacity>
      <View style={styles.resultListRight}>
        { rowData.prestoreable ? (<View style={secondaryButtonViewMiddle}><Text style={secondaryButtonTextMiddle} onPress={() => onButtonpress(rowData.prestoreRuleCode)}>{rowLabel}</Text></View>) : (<Text style={styles.fontTitle}>活动中</Text>) }
      </View>
    </View>)
  );

AppointmentRowComponent.propTypes = {
  rowData: PropTypes.object,
  rowLabel: PropTypes.string,
  onRowpress: PropTypes.func,
  onButtonpress: PropTypes.func,
};

export default AppointmentRowComponent;
