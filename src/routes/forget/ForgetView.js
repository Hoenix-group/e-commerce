import React, { PropTypes } from 'react';
import { connect } from 'dva/mobile';
import { View, Text } from 'react-native';
import { Button, InputItem, Toast } from 'antd-mobile';
import styles from './styles';
import RootView from './../../components/common/RootView';
import * as validator from './../../utils/validator';

const ForgetView = ({ dispatch, employeeNumber, employeePhone, pinCode, newPassword, againPassword, seconds }) => {
  function updateEmployeeId(val) {
    dispatch({
      type: 'forget/changeNumber',
      employeeNumber: val,
    });
  }
  function updateEmployeePhoneNumber(val) {
    dispatch({ type: 'forget/changePhone', employeePhone: val });
  }

  function updatepinCode(val) {
    dispatch({ type: 'forget/changeCode', code: val });
  }

  function updateNewPwd(val) { dispatch({ type: 'forget/changeNewPassword', newPassword: val }); }

  function updateNewPwdAgain(val) { dispatch({ type: 'forget/changeAgainPassword', againPassword: val }); }

  function updateSeconds(val) { dispatch({ type: 'forget/updateSeconds', seconds: val }); }

  function enableCounter() {
    let defaultSeconds = 60;
    const timer = setInterval(() => {
      defaultSeconds -= 1;
      updateSeconds(defaultSeconds);
      if (defaultSeconds === 0) {
        clearInterval(timer);
      }
    }, 1000);
  }

  function getValidatePinCode() {
    // 格式化手机号码
    const formatUserPhoneNumber = validator.removeSpace(employeePhone);

    // 验证员工号是否输入
    if (!validator.validateNotNull(employeeNumber, '员工号',
      () => {
        Toast.info('请输入员工号', 1);
      })) {
      return false;
    }

    if (!validator.validateNotNull(formatUserPhoneNumber, '手机号',
      () => {
        Toast.info('请输入手机号码', 1);
      })) {
      return false;
    }

    if (!validator.validatePhoneFormat(formatUserPhoneNumber, '手机号',
      () => {
        Toast.info('手机号码格式不正确', 1);
      })) {
      return false;
    }

    dispatch({ type: 'forget/fetchGetCode', employeePhone: formatUserPhoneNumber, employeeNumber, cb: enableCounter.bind(this) });
    return true;
  }

  function renderButtonCode() {
    return (
      <Button
        style={[styles.btn_b, styles.btn_o, styles.center]}
        disabled={!!(seconds !== 60 && seconds !== 0)}
        onClick={() => {
          getValidatePinCode();
        }}
      >
        <Text style={[styles.font_14, styles.text_c]}>获取验证码{seconds !== 60 && seconds !== 0 ? `(${seconds})` : ''}</Text>
      </Button>);
  }

  function submitUpdate() {
    // 格式化手机号码
    const formatUserPhoneNumber = validator.removeSpace(employeePhone);

    // 验证员工号是否输入
    if (!validator.validateNotNull(employeeNumber, '员工号',
      () => {
        Toast.info('请输入员工号', 1);
      })) {
      return false;
    }

    if (!validator.validateNotNull(formatUserPhoneNumber, '手机号',
      () => {
        Toast.info('请输入手机号码', 1);
      })) {
      return false;
    }

    if (!validator.validatePhoneFormat(formatUserPhoneNumber, '手机号',
      () => {
        Toast.info('手机号码格式不正确', 1);
      })) {
      return false;
    }

    // 验证PIN码是否输入
    if (!validator.validateNotNull(pinCode, '验证码', () => {
      Toast.info('请输入验证码', 1);
    })) {
      return false;
    }

    if (!validator.validateNotNull(newPassword, '密码',
      () => {
        Toast.info('请输入密码', 1);
      })) {
      return false;
    }


    if (!validator.validateNotNull(againPassword, '密码',
      () => {
        Toast.info('请再次输入密码', 1);
      })) {
      return false;
    }


    // 验证两次输入的密码是否一致
    if (newPassword !== againPassword) {
      Toast.info('两次密码输入不一致');
      return false;
    }

    const updateInfo = { employeeNumber, pinCode, newPassword };
    dispatch({ type: 'forget/fetchUpdate', updateInfo });
    return true;
  }

  function callManagerNotice() {
    Toast.info('请登录PS系统，修改个人联系方式中的手机号码。如无法登录PS系统，请联系本门店/分部人事人员处理');
  }

  function renderButtonNext() {
    return (<Button type="primary" style={[styles.m20]} onClick={() => { submitUpdate(); }}><Text style={[styles.font_w, styles.font_18]}>提交修改</Text></Button>);
  }

  return (
    <RootView style={{ flex: 1 }}>
      <View style={{ flex: 0.5 }} />
      <View style={[{ flex: 1 }, styles.p_right20]}>
        <InputItem placeholder="请输入员工号" value={employeeNumber} onChange={(val) => { updateEmployeeId(val); }} />
      </View>
      <View style={[{ flex: 1, flexDirection: 'row' }, styles.p_right20]}>
        <View style={{ flex: 5.5 }}>
          <InputItem type="phone" placeholder="请输入手机号码" value={employeePhone} onChange={(val) => { updateEmployeePhoneNumber(val); }} />
        </View>
        <View style={{ flex: 0.5 }} />
        <View style={{ flex: 4 }}>
          {renderButtonCode()}
        </View>
      </View>
      <View style={[{ flex: 1 }, styles.p_right20]}>
        <InputItem type="number" placeholder="请输入短信验证码" value={pinCode} onChange={(val) => { updatepinCode(val); }} />
      </View>
      <View style={[{ flex: 1 }, styles.p_right20]}>
        <InputItem type="password" placeholder="请输入新密码" value={newPassword} onChange={(val) => { updateNewPwd(val); }} />
      </View>
      <View style={[{ flex: 1 }, styles.p_right20]}>
        <InputItem type="password" placeholder="请再次确认新密码" value={againPassword} onChange={(val) => { updateNewPwdAgain(val); }} />
      </View>
      <View style={{ flex: 1.5, flexDirection: 'column' }}>
        {renderButtonNext()}
      </View>
      <View style={[{ flex: 0.5 }, styles.p_right20]}>
        <Text style={[styles.font_q]} onPress={callManagerNotice} > 仍有问题 ? 请联系管理员</Text>
      </View>
      <View style={[{ flex: 2.5 }, styles.p_right20]} />
    </RootView>
  );
};
ForgetView.propTypes = {
  dispatch: PropTypes.func,
  employeeNumber: PropTypes.string,
  employeePhone: PropTypes.string,
  pinCode: PropTypes.string,
  newPassword: PropTypes.string,
  againPassword: PropTypes.string,
  seconds: PropTypes.number,
};
const mapStateToProps = state => ({
  employeeNumber: state.forget.employeeNumber,
  employeePhone: state.forget.employeePhone,
  pinCode: state.forget.code,
  newPassword: state.forget.newPassword,
  againPassword: state.forget.againPassword,
  seconds: state.forget.seconds,
});
export default connect(mapStateToProps)(ForgetView);
