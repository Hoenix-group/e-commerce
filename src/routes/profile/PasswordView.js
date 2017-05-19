import React, { PropTypes } from 'react';
import { connect } from 'dva/mobile';
import {
    View,
    Text,
    ScrollView,
  TouchableHighlight,
} from 'react-native';
import { Button, InputItem, List, Toast } from 'antd-mobile';
import RootView from '../../components/common/RootView';
import FsRootView from '../../components/common/FsRootView';

import styles from './styles';

const PasswordView = ({ oldPassword, newPassword, newPasswordConfirmation, dispatch }) => {
  function changePassword() {
    if (!oldPassword) {
      Toast.fail('请输入旧密码');
      return;
    }

    if (!newPassword) {
      Toast.fail('请输入新密码');
      return;
    }

    if (!newPasswordConfirmation) {
      Toast.fail('请输确认新密码');
      return;
    }

    if (newPassword !== newPasswordConfirmation) {
      Toast.fail('新密码和确认新密码不一致，请重新输入');
      return;
    }

    dispatch({
      type: 'profile/changePassword',
      oldPassword,
      newPassword,
    });
  }

  function setOldPassword(value) {
    dispatch({
      type: 'profile/setOldPassword',
      oldPassword: value,
    });
  }

  function setNewPassword(value) {
    dispatch({
      type: 'profile/setNewPassword',
      newPassword: value,
    });
  }

  function setNewPasswordConfirmation(value) {
    dispatch({
      type: 'profile/setNewPasswordConfirmation',
      newPasswordConfirmation: value,
    });
  }

  return (
    <FsRootView isNavBarHidden={false}>
      <View style={{ flex: 1 }}>
        <View style={styles.top} >
          <ScrollView>
            <List>
              <InputItem clear type="password" placeholder="请输入旧密码" value={oldPassword} onChange={value => setOldPassword(value)}>旧密码</InputItem>
              <InputItem clear type="password" placeholder="请输入新密码" value={newPassword} onChange={value => setNewPassword(value)}>新密码</InputItem>
              <InputItem clear type="password" placeholder="请确认新密码" value={newPasswordConfirmation} onChange={value => setNewPasswordConfirmation(value)}>确认新密码</InputItem>
            </List>
          </ScrollView>
        </View>

        {/* 底部按钮 */}
        <View style={[styles.bottom, { height: 40 }]}>
          <TouchableHighlight underlayColor={'rgba(0,0,0,0.1)'} onPress={() => { changePassword(); }} style={styles.tStyle}>
            <View style={styles.footRight}>
              <Text style={styles.footRightText}>确定</Text>
            </View>
          </TouchableHighlight>
        </View>
      </View>
    </FsRootView>
  );
};

PasswordView.propTypes = {
  oldPassword: PropTypes.string,
  newPassword: PropTypes.string,
  newPasswordConfirmation: PropTypes.string,
  dispatch: PropTypes.func,
};

const mapStateToProps = ({ profile }) => {
  const { oldPassword, newPassword, newPasswordConfirmation } = profile;
  return { oldPassword, newPassword, newPasswordConfirmation };
};

export default connect(mapStateToProps)(PasswordView);
