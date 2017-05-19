import React, { PropTypes } from 'react';
import { View, StatusBar, Platform } from 'react-native';

import ActivityIndicatorView from '../../routes/activityIndicator/ActivityIndicatorView';

const FsRootView = (props) => {
  function render() {
    if (props.type === 'home') {
      return (
        <View>
          <StatusBar
            backgroundColor="#0083E0"
            barStyle="light-content"
          />
          {Platform.OS === 'ios' ? <View style={{ height: 20, backgroundColor: '#0083E0' }} /> : null}
        </View>
      );
    }
    let height = 0;
    if (!props.isNavBarHidden) {
      height = Platform.OS === 'ios' ? 65 : 55;
    } else {
      height = Platform.OS === 'ios' ? 20 : 0;
    }
    return (
      <View>
        <StatusBar
          backgroundColor="#0083E0"
          barStyle="default"
        />
        <View style={{ height, backgroundColor: 'transparent' }} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }} >
      {render()}
      {props.children}
      {/* 这个地方我先注释掉了，因为页面会加载出两个loading，有问题我们商量一下 这个与最早的RootView 用哪个？   aizijie注释*/}
      <ActivityIndicatorView />
    </View>
  );
};

FsRootView.propTypes = {
  children: PropTypes.any,
  type: PropTypes.string,
  isNavBarHidden: PropTypes.bool,
};

export default FsRootView;
