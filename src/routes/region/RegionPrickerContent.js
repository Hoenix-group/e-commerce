import React, { PropTypes } from 'react';
import {
    Text,
    View,
} from 'react-native';

import styles from './styles';
const extra_temp = '';
const RegionPrickerContent = ({ onClick, extra, defaultExtra, style, leftSide, textStyle }) => {
  function showExtra() {
    if (!extra) {
      return defaultExtra;
    }

    const values = extra.split(',');
    for (let i = values.length - 1; i >= 0; i -= 1) {
      const value = values[i];
      if (value && value !== '全部') {
        return value;
      }
    }

    return defaultExtra;
  }

  return (
    <View style={[style || styles.positionLabel1]}>
      {leftSide}
      <Text numberOfLines={1} style={textStyle} onPress={() => { if (onClick) { onClick(); } }}>{showExtra()}</Text>
    </View>
  );
};
RegionPrickerContent.propTypes = {
  onClick: PropTypes.func,
  extra: PropTypes.any,
  defaultExtra: PropTypes.any,
  style: PropTypes.any,
  leftSide: PropTypes.any,
  textStyle: PropTypes.any,
};

export default RegionPrickerContent;
