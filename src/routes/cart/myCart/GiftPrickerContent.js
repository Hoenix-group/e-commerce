import React, { PropTypes } from 'react';
import {
    Text,
    View,
} from 'react-native';

import styles from './styles';

const GiftPrickerContent = ({ onClick, extra, style, textStyle, iconRight }) => (
  <View style={style || styles.positionLabel}>
    <Text numberOfLines={1} style={textStyle} onPress={() => { if (onClick) { onClick(); } }}>{extra || '请选择赠品'}</Text>
    {iconRight}
  </View>);

GiftPrickerContent.propTypes = {
  onClick: PropTypes.func,
  extra: PropTypes.any,
  style: PropTypes.any,
  textStyle: PropTypes.any,
  iconRight: PropTypes.any,
};

export default GiftPrickerContent;
