import React, { Component, PropTypes } from 'react';
import { connect } from 'dva/mobile';
import { Text, Button, InputItem, Toast } from 'antd-mobile';

import { View } from 'react-native';
import * as validator from './../../utils/validator';
import FsRootView from './../../components/common/FsRootView';
import { marginLarge, commonButton, fontSizeMiddle, fontSizeSmall, color99 } from './../../themes/fsBaseStyles';

class ValetView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      phoneNumber: '',
    };
  }
  onChangePhone(phone) {
    this.setState({ phoneNumber: phone });
  }
  onPhoneBlur(phone) {
    this.setState({ phoneNumber: validator.formatPhoneNumber(phone) });
  }

  next(phoneNumber) {
    this.dismiss();
    // 验证当前用户是否已经注册成会员
    const { dispatch, productInfo } = this.props;

    // 格式化手机号码
    const formatUserPhoneNumber = validator.removeSpace(phoneNumber);

    if (!validator.validateNotNull(formatUserPhoneNumber, '手机号', () => Toast.info('请输入手机号码', 1))) {
      return false;
    }

    if (!validator.validatePhoneFormat(formatUserPhoneNumber, '手机号', () => Toast.info('手机号码格式不正确', 1))) {
      return false;
    }

    dispatch({ type: 'valet/fetchUser', productInfo, phoneNumber: formatUserPhoneNumber });
    return true;
  }

  dismiss() {
    const dismissKeyboard = require('dismissKeyboard');
    dismissKeyboard();
  }

  renderButtonNext(phoneNumber) {
    return (
      <Button style={{ marginLeft: marginLarge, marginRight: marginLarge, height: commonButton.height, backgroundColor: commonButton.backgroundColor }} type="primary" onClick={() => this.next(phoneNumber)}>
        <Text style={{ color: commonButton.color, fontSize: fontSizeMiddle }}>下一步</Text>
      </Button>
    );
  }

  render() {
    return (
      <FsRootView isNavBarHidden={false}>
        <View style={{ flex: 1, marginTop: marginLarge }} >
          <InputItem type="number" maxLength={13} placeholder="请输入顾客的手机号码" value={this.state.phoneNumber} onChange={phone => this.onChangePhone(phone)} onBlur={(phone) => { this.onPhoneBlur(phone); }} />
          <View style={{ alignItems: 'center', marginTop: marginLarge, marginBottom: marginLarge }}>
            <Text style={{ color: color99, fontSize: fontSizeSmall }}>如手机号码尚未注册,将转入注册页面.</Text>
          </View>
          {this.renderButtonNext(this.state.phoneNumber)}
        </View>
      </FsRootView>);
  }
}

ValetView.propTypes = {
  dispatch: PropTypes.func,
  productInfo: PropTypes.object,
};
const mapStateToProps = () => ({});
export default connect(mapStateToProps)(ValetView);
