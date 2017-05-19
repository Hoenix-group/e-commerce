import React, { Component, PropTypes } from 'react';
import { connect } from 'dva/mobile';
import { Actions } from 'react-native-router-flux';
import { Text, Button, Toast, Checkbox } from 'antd-mobile';
import { ScrollView, View, Image, TextInput } from 'react-native';
import styles from './../appointment/styles';
import formStyles from './../appointment/formStyles';
import { WarningBarText, WarningBarView, WarningBarImage } from './../../themes/fsBaseStyles';
import RootView from './../../components/common/RootView';
import { validatePhoneFormat } from './../../utils/validator';
// import { commonButton, fontSizeSmall } from './../../themes/fsBaseStyles';
import Util from './../../utils/utils';
import SmsPinGetterButton from './../../components/common/SmsPinGetterButton';

// const CheckboxItem = Checkbox.CheckboxItem;

class AddCustomerToPrestoreView extends Component {

  componentDidMount() {
    if (this.props.prestoreDetail.undefinedTag || this.props.code !== this.props.prestoreDetail.preStorePromotionCode) {
      this.props.dispatch({ type: 'prestore/fetchPrestoreDetail', code: this.props.code });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.backUserInfo && (!this.props.backUserInfo || this.props.backUserInfo.phoneNumber !== nextProps.backUserInfo.phoneNumber)) {
      this.props.dispatch({ type: 'prestore/checkBackUserInfo', phoneNumber: Util.formatPhoneNumber(nextProps.backUserInfo.phoneNumber), name: nextProps.backUserInfo.name });
    }
  }

  componentWillUnmount() {
    this.props.dispatch({ type: 'prestore/resetAddViewStateData' });
  }

  onChangePhonenumber(phoneNumber) {
    this.props.dispatch({ type: 'prestore/updatePhoneNumber', phoneNumber: Util.formatPhoneNumber(phoneNumber) });
    const tempPhoneNumber = phoneNumber.replace(/\s/g, '');
    if (tempPhoneNumber.length === 11) {
      if (!validatePhoneFormat(phoneNumber, '手机号',
      () => {
        Toast.info('手机号码格式不正确', 1);
      })) {
        this.props.dispatch({ type: 'prestore/updatePhoneNumberExists', phonenumberExists: true });
        return;
      }
      this.props.dispatch({ type: 'prestore/checkPhoneNumber', phonenumber: tempPhoneNumber });
    }
  }

  onPaymentChannelRadioClicked(paymentChannel, paymentChannelLabel) {
    Util.consoleLog(`paymentChannel: ${paymentChannel}; paymentChannelLabel: ${paymentChannelLabel}`);
    this.props.dispatch({ type: 'prestore/updatePaymentChannel', paymentChannel, paymentChannelLabel });
  }

  getValidate(userPn) {
    const { dispatch } = this.props;
    if (userPn === '') {
      Toast.info('请输入手机号码', 1);
      return false;
    }
    const reg = /^1[3|4|5|8][0-9]\d{8,8}$/; // 验证规则
    const flag = reg.test(userPn.replace(/\s/ig, '')); // true
    if (!flag) {
      Toast.info('手机号码格式不正确', 1);
      return false;
    }
    dispatch({ type: 'prestore/fetchPinCode', phoneNumber: userPn });
    return true;
  }

  quickplaceorder() {
    if (this.props.phoneNumber.length === 0) {
      Toast.info('请输入手机号', 1);
      return;
    }
    if (!validatePhoneFormat(this.props.phoneNumber, '手机号',
      () => {
        Toast.info('手机号码格式不正确', 1);
      })) {
      return;
    } else if (this.props.validateCode === '') {
      Toast.info('请输入验证码');
      return;
    }
    // this.props.dispatch({
    //   type: 'cashDesk/pay',
    //   orderCode: '00005067',
    //   totalFee: '0.01',
    //   paymentChannel: 'ALIPAY-O2O',
    //   timestamp: Date.now(),
    // });
    this.props.dispatch({
      type: 'prestore/quickplaceorder',
      pin: this.props.validateCode,
      phoneNumber: this.props.phoneNumber,
      userId: this.props.userId,
      prestoreId: this.props.prestoreDetail.preStorePromotionCode,
      paymentChannel: this.props.paymentChannel,
      timestamp: Date.now(),
    });
  }

  renderButtonCode(seconds, userPn, disableGetVerCode) {
    let defaultSeconds = 60;
    let isDisabled;
    if (!disableGetVerCode) {
      isDisabled = !!(seconds !== 60 && seconds !== 0);
    } else {
      isDisabled = true;
    }

    return (
      <Button
        type="primary"
        size="small"
        style={formStyles.buttonSmall}
        disabled={isDisabled}
        onClick={() => {
          const result = this.getValidate(userPn);
          if (result) {
            const timer = setInterval(() => {
              defaultSeconds -= 1;
              this.props.dispatch({ type: 'prestore/updateSeconds', seconds: defaultSeconds });
              if (defaultSeconds <= 0) {
                clearInterval(timer);
              }
            }, 1000);
          }
        }}
      >
        <Text style={formStyles.buttonSmallText}>{seconds !== 60 && seconds !== 0 ? `(${seconds})` : '获取验证码'}</Text>
      </Button>);
  }

  renderNoticeBar() {
    if (!this.props.phonenumberExists) {
      return (
        <View style={WarningBarView}>
          <Image style={WarningBarImage} source={require('./../../../images/status/warning@x2.png')} />
          <Text style={WarningBarText}>该手机号尚未注册,点击确定后将转入注册界面</Text>
        </View>
      );
    }
    return (<View />);
  }

  render() {
    return (
      <RootView>
        <ScrollView>
          {this.renderNoticeBar()}
          <View style={formStyles.listItem}>
            <View style={formStyles.listLabel}>
              <Text style={formStyles.labelText}>*手机号码</Text>
            </View>
            <View style={formStyles.listInput}>
              <TextInput
                underlineColorAndroid="transparent"
                placeholder="请输入手机号码"
                style={formStyles.textInput}
                keyboardType="numeric"
                returnKeyType="done"
                maxLength={13}
                value={this.props.phoneNumber}
                onChangeText={phonenumber => this.onChangePhonenumber(phonenumber)}
              />
              {/* <InputItem
                clear
                type="phone"
                maxLength={13}
                style={{ borderBottomColor: 'white' }}
                placeholder="手机号码"
                value={this.props.phoneNumber}
                onChange={phonenumber => this.onChangePhonenumber(phonenumber)}
              />*/}

            </View>
          </View>
          {this.props.phonenumberExists ? (
            <View style={formStyles.listItem2}>
              <View style={formStyles.listLabel2}>
                <Text style={formStyles.labelText}>*验证码</Text>
              </View>
              <View style={formStyles.listInputL}>
                <TextInput
                  underlineColorAndroid="transparent"
                  placeholder="请输入验证码"
                  style={formStyles.textInput}
                  keyboardType="numeric"
                  value={this.props.validateCode}
                  onChangeText={validateCode => this.props.dispatch({ type: 'prestore/updateValidateCode', validateCode })}
                />
              </View>
              {/* <InputItem
                  clear
                  type="text"
                  maxLength={6}
                  style={{ borderBottomColor: 'white' }}
                  placeholder="验证码"
                  value={this.props.validateCode}
                  onChange={validateCode => this.props.dispatch({ type: 'prestore/updateValidateCode', validateCode })}
                />*/}
              <View style={formStyles.listInputR}>
                {/* {this.renderButtonCode(this.props.seconds, this.props.phoneNumber)}*/}
                <SmsPinGetterButton getValidate={() => this.getValidate(this.props.phoneNumber)} />
              </View>
            </View>
          ) : (<View />)}
          { this.props.phonenumberExists ? (
            <View style={formStyles.listItem}>
              <View style={formStyles.listLabel}>
                <Text style={formStyles.labelText}>预存编号</Text>
              </View>
              <View style={formStyles.listText}>
                <Text style={formStyles.textInput}>{this.props.prestoreDetail.fsPreStorePromotionCode}</Text>
              </View>
            </View>
          ) : (<View />)}
          { this.props.phonenumberExists ? (
            <View style={formStyles.listItem}>
              <View style={formStyles.listLabel}>
                <Text style={formStyles.labelText}>预存方案</Text>
              </View>
              <View style={formStyles.listText}>
                <Text style={formStyles.textInput}>{this.props.prestoreDetail.prestorePlan}</Text>
              </View>
            </View>
          ) : (<View />)}
          { this.props.phonenumberExists ? (<View style={formStyles.greyBar} />) : <View />}
          { this.props.phonenumberExists ? (
            <View>
              <Text style={formStyles.listHeader}>选择支付方式</Text>
              {this.props.modes.map(i => (
                <View key={i.value} style={formStyles.checkboxContainer}>
                  <Checkbox checked={this.props.paymentChannel === i.value} onChange={() => this.onPaymentChannelRadioClicked(i.value, i.label)}>
                    <View style={formStyles.checkboxItem}>
                      <View style={formStyles.imgArea}>
                        <Image style={formStyles.logo} source={i.imgUrl} />
                      </View>
                      <View style={formStyles.textArea}>
                        <Text style={formStyles.checkboxLabel}>{`${i.label}`}</Text>
                        { i.promotionLabel ?
                        (<Text style={formStyles.checkboxPro}>{i.promotionLabel}</Text>) : (null)
                        }
                      </View>
                    </View>
                  </Checkbox>
                </View>
              ))}
            </View>
          ) : (<View />)}
        </ScrollView>
        <View>
          <Button
            type="primary"
            style={styles.buttonAngle}
            onClick={() => {
              if (this.props.phonenumberExists) {
                this.quickplaceorder();
              } else {
                Actions.valetregister({
                  phoneNumber: this.props.phoneNumber,
                  backScene: this.props.sceneKey,
                });
              }
            }}
          ><Text>{ this.props.phonenumberExists ? '确定' : '注册' }</Text></Button>
        </View>
      </RootView>
    );
  }
}

AddCustomerToPrestoreView.propTypes = {
  dispatch: PropTypes.func,
  prestoreDetail: PropTypes.object,
  code: PropTypes.string,
  modes: PropTypes.array,
  phoneNumber: PropTypes.string,
  phonenumberExists: PropTypes.bool,
  validateCode: PropTypes.string,
  seconds: PropTypes.number,
  userId: PropTypes.string,
  paymentChannel: PropTypes.string,
  sceneKey: PropTypes.string,
  backUserInfo: PropTypes.object,
};

const mapStateToProps = state => ({
  modes: state.prestore.modes,
  prestoreDetail: state.prestore.prestoreDetail,
  phoneNumber: state.prestore.phoneNumber,
  phonenumberExists: state.prestore.phonenumberExists,
  validateCode: state.prestore.validateCode,
  seconds: state.prestore.seconds,
  userId: state.prestore.userId,
  paymentChannel: state.prestore.paymentChannel,
});

export default connect(mapStateToProps)(AddCustomerToPrestoreView);
