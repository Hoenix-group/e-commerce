import React, { PropTypes } from 'react';
import { View, Platform } from 'react-native';

import ActivityIndicatorView from '../../routes/activityIndicator/ActivityIndicatorView';

import styles from './styles';

const RootView = (props) => {
  const isNavBarHidden = !!props.isNavBarHidden;
  let outerStyle = {};
  if (Platform.OS === 'android') {
    if (!isNavBarHidden) {
      outerStyle = { marginTop: 55 };
    }
  } else if (!isNavBarHidden) {
    outerStyle = { marginTop: 65 };
  } else {
    outerStyle = { marginTop: 20 };
  }
  return (
    <View style={[styles.rootView, props.style, outerStyle]} >
      {props.children}
      <ActivityIndicatorView />
    </View>
  );
};

RootView.propTypes = {
  isNavBarHidden: PropTypes.bool,
  style: View.propTypes.style,
  // children: PropTypes.function,
};

export default RootView;
