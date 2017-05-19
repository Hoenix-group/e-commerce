import React, { PropTypes } from 'react';
import { Actions } from 'react-native-router-flux';
import {
    Text,
    View,
    TouchableHighlight,
} from 'react-native';

import styles from './styles';

const RegionBar = ({ onChange, value, style, leftSide, textStyle, level }) => {
  function chooseRegion() {
    Actions.regionList({ onChange, value, level });
  }

  return (
    <TouchableHighlight underlayColor={'transparent'} style={[styles.center]} onPress={() => { chooseRegion(); }}>
      <View style={styles.positionLabel}>
        {leftSide}
        <Text numberOfLines={1} style={textStyle} onPress={() => { chooseRegion(); }}>{(value && value.current) ? value.current.label : '区域'}</Text>
      </View></TouchableHighlight>);
};

RegionBar.propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.any,
  style: PropTypes.any,
  leftSide: PropTypes.any,
  textStyle: PropTypes.any,
  level: PropTypes.object,
};

export default RegionBar;
