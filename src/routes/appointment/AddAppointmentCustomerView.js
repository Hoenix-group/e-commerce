import React, { Component, PropTypes } from 'react';
import { connect } from 'dva/mobile';
import moment from 'moment';
import 'moment/locale/zh-cn';
import { Actions } from 'react-native-router-flux';
import { List, DatePicker, Button, Toast } from 'antd-mobile';
import { ScrollView, Text, View, InteractionManager, TextInput, Image } from 'react-native';
import styles from './styles';
import formStyles from './formStyles';
import { WarningBarText, WarningBarView, WarningBarImage } from './../../themes/fsBaseStyles';
import FsRootView from './../../components/common/FsRootView';
import * as validator from './../../utils/validator';
import Util from './../../utils/utils';
import SmsPinGetterButton from './../../components/common/SmsPinGetterButton';

class AddAppointmentCustomerView extends Component {

  componentDidMount() {
    // const appointmentdetail = this.props.appointmentdetail;
    // if (appointmentdetail === undefined || this.props.appointmentcode !== appointmentdetail.code) {
    //   InteractionManager.runAfterInteractions(() => {
    //     this.props.dispatch({ type: 'addappointmentcustomer/fetchAppointmentDetail', code: this.props.appointmentcode });
    //   });
    // } else {
    //   this.props.dispatch({ type: 'addappointmentcustomer/updateAppointmentDetailData', appointmentdetail });
    // }
    let appointmentDate = this.props.activityStartTime;
    if (!moment(appointmentDate, 'YYYY-MM-DD').isValid()) {
      appointmentDate = new Date();
    }
    InteractionManager.runAfterInteractions(() => {
      this.props.dispatch({ type: 'addappointmentcustomer/setDefaultAppointmentDate', appointmentDate });
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.backUserInfo && (!this.props.backUserInfo || this.props.backUserInfo.phoneNumber !== nextProps.backUserInfo.phoneNumber)) {
      this.props.dispatch({ type: 'addappointmentcustomer/checkBackUserInfo', phoneNumber: Util.formatPhoneNumber(nextProps.backUserInfo.phoneNumber), name: nextProps.backUserInfo.name });
    }
  }

  componentWillUnmount() {
    this.clearTimer();
    this.props.dispatch({ type: 'addappointmentcustomer/resetAppointmentCustomerState' });
  }

  onChangeName(name) {
    this.props.dispatch({ type: 'addappointmentcustomer/setName', name });
  }

  onChangePhonenumber(phonenumber) {
    this.props.dispatch({ type: 'addappointmentcustomer/setPhoneNumber', phonenumber: Util.formatPhoneNumber(phonenumber) });
    const tempPhoneNumber = phonenumber.replace(/\s/g, '');
    if (tempPhoneNumber.length === 11) {
      if (!validator.validatePhoneFormat(phonenumber, '手机号',
      () => {
        Toast.info('手机号码格式不正确', 1);
      })) {
        this.props.dispatch({ type: 'addappointmentcustomer/updatePhoneNumberExistsTag', result: true });
        return;
      }
      this.props.dispatch({ type: 'addappointmentcustomer/checkPhoneNumber', phonenumber: tempPhoneNumber });
    }
  }

  onChangeValidateCode(validateCode) {
    this.props.dispatch({ type: 'addappointmentcustomer/setValidateCode', validateCode });
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
    dispatch({ type: 'addappointmentcustomer/fetchPinCode', phoneNumber: userPn });
    return true;
  }

  clearTimer() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  addCustomer() {
    if (!validator.validatePhoneFormat(this.props.addappointmentcustomer.phonenumber, '手机号',
      () => {
        Toast.info('手机号码格式不正确', 1);
      })) {
      return;
    }
    if (this.props.addappointmentcustomer.name === '') {
      Toast.info('姓名未填写');
      return;
    } else if (this.props.addappointmentcustomer.phonenumber === '') {
      Toast.info('电话号未填写');
      return;
    } else if (!this.props.addappointmentcustomer.appointmentDate.isValid()) {
      Toast.info('预约日期错误');
      return;
    } else if (this.props.addappointmentcustomer.validateCode === '') {
      Toast.info('请输入验证码');
      return;
    }
    this.props.dispatch({
      type: 'addappointmentcustomer/reserveAppointment4Customer',
      code: this.props.appointmentcode,
      name: this.props.addappointmentcustomer.name,
      phonenumber: this.props.addappointmentcustomer.phonenumber,
      appointmentDate: moment(this.props.addappointmentcustomer.appointmentDate).utcOffset(8).format('L'),
    });
  }

  updateSeconds(val) { const { dispatch } = this.props; dispatch({ type: 'addappointmentcustomer/updateSeconds', seconds: val }); }

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
            this.timer = setInterval(() => {
              defaultSeconds -= 1;
              this.updateSeconds(defaultSeconds);
              if (defaultSeconds <= 0) {
                clearInterval(this.timer);
              }
            }, 1000);
          }
        }}
      >
        <Text style={formStyles.buttonSmallText}>{seconds !== 60 && seconds !== 0 ? `(${seconds})` : '获取验证码'}</Text>
      </Button>);
  }

  renderNoticeBar() {
    if (!this.props.addappointmentcustomer.phonenumberExists) {
      return (
        <View style={WarningBarView}>
          <Image style={WarningBarImage} source={require('./../../../images/status/warning@x2.png')} />
          <Text style={WarningBarText}>该手机号尚未注册,将转入注册界面</Text>
        </View>
      );
    }
    return (<View />);
  }

  renderSubmitButton() {
    if (this.props.addappointmentcustomer.phonenumberExists) {
      return (
        <Button type="primary" style={styles.buttonAngle} onClick={() => this.addCustomer()}>预约</Button>
      );
    }
    return (
      <Button
        type="primary"
        style={styles.buttonAngle}
        onClick={() => Actions.valetregister({
          phoneNumber: this.props.addappointmentcustomer.phonenumber,
          backScene: this.props.sceneKey,
          userName: this.props.addappointmentcustomer.name,
        })}
      >注册</Button>
    );
  }

  render() {
    return (
      <FsRootView isNavBarHidden={false} >
        <ScrollView>
          {this.renderNoticeBar()}
          <View style={formStyles.listItem}>
            <View style={formStyles.listLabel}>
              <Text style={formStyles.labelText}>*姓名</Text>
            </View>
            <View style={formStyles.listInput}>
              <TextInput
                underlineColorAndroid="transparent"
                placeholder="请输入姓名"
                style={formStyles.textInput}
                value={this.props.addappointmentcustomer.name}
                onChangeText={name => this.onChangeName(name)}
              />
            </View>
            {/* <View style={formStyles.listInput}>
              <InputItem
                clear
                autoCorrect={false}
                style={formStyles.inputItem}
                type="text"
                placeholder="请输入姓名"
                value={this.props.addappointmentcustomer.name}
                onChange={name => this.onChangeName(name)}
              />
            </View>*/}
          </View>
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
                value={this.props.addappointmentcustomer.phonenumber}
                onChangeText={phonenumber => this.onChangePhonenumber(phonenumber)}
              />
              {/* <InputItem
                clear
                type="phone"
                maxLength={13}
                style={formStyles.textInput}
                value={this.props.addappointmentcustomer.phonenumber}
                placeholder="请输入手机号码"
                onChange={phonenumber => this.onChangePhonenumber(phonenumber)}
              />*/}
            </View>
          </View>

          {this.props.addappointmentcustomer.phonenumberExists ?
            (<View style={formStyles.listItem2}>
              <View style={formStyles.listLabel2}>
                <Text style={formStyles.labelText}>*验证码</Text>
              </View>
              <View style={formStyles.listInputL}>
                <TextInput
                  underlineColorAndroid="transparent"
                  placeholder="请输入验证码"
                  style={formStyles.textInput}
                  keyboardType="numeric"
                  value={this.props.addappointmentcustomer.validateCode}
                  onChangeText={validateCode => this.onChangeValidateCode(validateCode)}
                />
                {/* <InputItem
                  clear
                  type="text"
                  placeholder="请输入验证码"
                  maxLength={6}
                  style={{ borderBottomColor: 'white' }}
                  value={this.props.addappointmentcustomer.validateCode}
                  onChange={validateCode => this.onChangeValidateCode(validateCode)}
                />*/}
              </View>
              <View style={formStyles.listInputR}>
                {/* {this.renderButtonCode(this.props.addappointmentcustomer.seconds, this.props.addappointmentcustomer.phonenumber)}*/}
                <SmsPinGetterButton getValidate={() => this.getValidate(this.props.addappointmentcustomer.phonenumber)} />
              </View>
            </View>) : (<View />)
          }

          {this.props.addappointmentcustomer.phonenumberExists && this.props.reservationType !== 'PRODUCT' ?
            (<View style={{ flex: 1, flexDirection: 'row' }}>
              <View style={{ flex: 1 }}>
                <DatePicker
                  title="到店时间"
                  mode="date"
                  minDate={(this.props.activityStartTime && moment(this.props.activityStartTime).isValid()) ? moment(this.props.activityStartTime, 'YYYY-MM-DD').utcOffset(8) : moment(new Date())}
                  maxDate={(this.props.activityEndTime && moment(this.props.activityEndTime).isValid()) ? moment(this.props.activityEndTime, 'YYYY-MM-DD').utcOffset(8) : moment(new Date(), 'YYYY-MM-DD').add(5, 'years').utcOffset(8)}
                  value={this.props.addappointmentcustomer.appointmentDate}
                  onChange={date => this.props.dispatch({ type: 'addappointmentcustomer/setAppointmentDate', appointmentDate: date })}
                >
                  <List.Item arrow="horizontal" style={formStyles.labelViewO} >
                    <Text style={formStyles.labelTextO}>到店时间</Text>
                  </List.Item>
                </DatePicker>
              </View>
            </View>) : (<View />)
          }
        </ScrollView>
        {this.renderSubmitButton()}
      </FsRootView>
    );
  }
}

AddAppointmentCustomerView.propTypes = {
  dispatch: PropTypes.func,
  // appointmentdetail: PropTypes.object,
  addappointmentcustomer: PropTypes.object,
  appointmentcode: PropTypes.string,
  activityStartTime: PropTypes.string,
  activityEndTime: PropTypes.string,
  sceneKey: PropTypes.string,
  backUserInfo: PropTypes.object,
  reservationType: PropTypes.string,
};

const mapStateToProps = state => ({
  // appointmentdetail: state.addappointmentcustomer.appointmentResultData,
  addappointmentcustomer: state.addappointmentcustomer,
});

export default connect(mapStateToProps)(AddAppointmentCustomerView);
