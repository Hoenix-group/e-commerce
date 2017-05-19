import React from 'react';
import { Text } from 'antd-mobile';
import { View } from 'react-native';
import styles from './../../routes/appointment/styles';

const AppointmentHeaderComponent = () => (
    (<View style={styles.greyHeaderArea}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>活动名称 / 活动日期</Text>
        </View>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={styles.headerTitle}>操作</Text>
        </View>
      </View>)
  );

AppointmentHeaderComponent.propTypes = {
};

export default AppointmentHeaderComponent;
