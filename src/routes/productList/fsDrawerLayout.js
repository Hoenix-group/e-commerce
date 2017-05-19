import { Platform, Dimensions } from 'react-native';
import DrawerLayout from 'react-native-drawer-layout';
import React, { Component } from 'react';
import { connect } from 'dva/mobile';
import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
} from 'react-native';
import { Flex } from 'antd-mobile';
export default class FsDrawerLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      drawerLockMode: 'unlocked',
    };
  }
  openDrawer() {
    this.drawer.openDrawer();
  }
  closeDrawer() {
    this.drawer.closeDrawer();
  }
  render() {
    const {
      drawerLockMode,
    } = this.state;
    const dWidth = Dimensions.get('window').width - 50;
    return (
      <DrawerLayout
        drawerPosition={DrawerLayout.positions.Right}
        drawerBackgroundColor="#fff"
        drawerWidth={dWidth}
        drawerLockMode={drawerLockMode}
        onDrawerClose={null}
        ref={drawer => (this.drawer = drawer)}
        renderNavigationView={() => this.props.navigationView}
      >
        <View>
          {this.props.renderFun}
        </View>
      </DrawerLayout>
    );
  }
}

