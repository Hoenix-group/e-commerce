import { View, Text, Image, TextInput, InteractionManager, KeyboardAvoidingView } from 'react-native';
import React, { PropTypes, Component } from 'react';
import { connect } from 'dva/mobile';
import { Button, Checkbox, Toast, Accordion } from 'antd-mobile';
import { Actions } from 'react-native-router-flux';
import styles from './styles';
import FsRootView from './../../components/common/FsRootView';

class LoginView extends Component {

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.props.dispatch({
        type: 'login/loadLoginInfo',
      });
    });
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: 'login/initializeState',
    });
  }

  onChangeName(name) {
    this.props.dispatch({ type: 'login/changeUserName', userName: name });
  }

  onChangePwd(pwd) {
    this.props.dispatch({ type: 'login/changePassword', password: pwd });
  }

  onRemember({ target }) {
    this.props.dispatch({ type: 'login/updateRemember', remember: target.checked });
  }

  login() {
    if (!this.props.userName) {
      Toast.fail('请输入账号');
      return;
    }

    if (!this.props.password) {
      Toast.fail('请输入密码');
      return;
    }

    this.props.dispatch({ type: 'login/fetchUser', userName: this.props.userName, password: this.props.password, remember: this.props.remember });
  }

  render() {
    return (
      <FsRootView isNavBarHidden>
        {/*<Icon type="right" size={40} />
        <View style={{ marginTop: 80, marginBottom: 10 }}>
          <Accordion onChange={this.onChange} defaultActiveKey="2">
            <Accordion.Panel key="1" header="标题一">
              <List>
                <List.Item>子内容一</List.Item>
                <List.Item>子内容二</List.Item>
                <List.Item>子内容三</List.Item>
              </List>
            </Accordion.Panel>
            <Accordion.Panel key="2" header="标题二">this is panel content2 or other</Accordion.Panel>
            <Accordion.Panel key="3" header="标题三">
              文本内容文本内容文本内容文本内容文本内容文本内容文本内容文本内容文本内容文本内容文本
            </Accordion.Panel>
          </Accordion>
        </View>*/}
        <View style={styles.loginView}>
          <KeyboardAvoidingView behavior="padding">
            <View style={[styles.logoContainer]}>
              <Image style={[styles.logo_image]} source={require('./../../../images/logo.png')} />
            </View>
            <View style={[styles.usernameContainer]}>
              <View style={[{ flex: 1 }, styles.rowJustifyCenter, styles.borderB]}>
                <Text style={styles.loginText}>工 号</Text>
                <TextInput underlineColorAndroid="transparent" style={[styles.textInput]} placeholder="请输入工号" editable={this.props.inputEditable} value={this.props.userName} onChangeText={name => this.onChangeName(name)} />
              </View>
            </View>
            <View style={[styles.passwordContainer]}>
              <View style={[{ flex: 1 }, styles.rowJustifyCenter, styles.borderB]}>
                <Text style={styles.loginText}>密 码</Text>
                <TextInput underlineColorAndroid="transparent" style={[styles.textInput]} secureTextEntry placeholder="请输入密码" editable={this.props.inputEditable} value={this.props.password} onChangeText={pwd => this.onChangePwd(pwd)} />
              </View>
            </View>
            <View style={[styles.checkboxContainer]}>
              <View style={[styles.flex, styles.rowJustifyLeftCenter]}>
                <Checkbox style={[styles.checkBox]} checked={this.props.remember} onChange={obj => this.onRemember(obj)} />
                <Text style={styles.remPwd}>记住密码</Text>
              </View>
            </View>
            <View style={[styles.buttonContainer]}>
              <View style={{ flex: 1 }}>
                {this.props.disabled === false ?
                  (<Button type="primary" onClick={() => { this.login(); }} disabled={this.props.disabled} style={[styles.btn]} >
                    {this.props.showtext}
                  </Button>) :
                  (<Button type="primary" onClick={() => { this.login(); }} disabled={this.props.disabled} style={[styles.btn, styles.disBtn]} >
                    <Text style={styles.color99}>{this.props.showtext}</Text>
                  </Button>)}

              </View>
            </View>
            <View style={styles.forgetContainer} >
              <View style={styles.forget}>
                <Text style={styles.forgetText} onPress={() => Actions.forgetPassword()}>忘记密码</Text>
              </View>
            </View>

          </KeyboardAvoidingView>
        </View>
        <View style={[styles.versionContainer, styles.pv10]} >
          <Text style={[styles.version]}>{`版本: v0.0.2.3-${__DEV__ ? 'DEV' : 'PRD'}`}</Text>
        </View>
      </FsRootView>
    );
  }
}

LoginView.propTypes = {
  userName: PropTypes.string,
  password: PropTypes.string,
  remember: PropTypes.bool,
  inputEditable: PropTypes.bool,
  disabled: PropTypes.bool,
  showtext: PropTypes.string,
  dispatch: PropTypes.func,
};

const mapStateToProps = state => ({
  userName: state.login.userName,
  password: state.login.password,
  remember: state.login.remember,
  inputEditable: state.login.inputEditable,
  disabled: state.login.disabled,
  showtext: state.login.showtext,
});

export default connect(mapStateToProps)(LoginView);
