import React, { Component, PropTypes } from 'react';
import { Button, InputItem, List, Flex, WhiteSpace} from 'antd-mobile';
import { View, Text, Image, TextInput, TouchableHighlight } from 'react-native';
import { commonButton } from './../../themes/fsBaseStyles';
import styles from './styles';
import Util from './../../utils/utils';

export default class VoucherPopupView extends Component {
  constructor(props) {
    super(props);
    this.vouchers = this.props.vouchers;
    //this.confirm = this.props.onComfirm;
    this.state = {
      transferAccount: '',
      checkState: 0, //状态0 表示还没有进行检验 此时应该显示 点击验证 button
                    // 状态1 表示已经验证通过  此时显示 验证通过 text 以及 勾勾
                    // 状态2 表示已经验证没有通过  此时显示 验证不通过 text

    };
  }

  onComfirm() {
    this.props.onComfirm();
    Util.consoleLog(this.state.transferAccount);
  }

  validateTransferAccount() {
    //this.props.dispatch({ type: 'voucher/setSelectedCheckbox', newState });
    if (this.state.transferAccount === '8888') {
      this.setState({ checkState: 1 });
    } else if (this.state.transferAccount === '') {
      this.setState({ checkState: 0 });
    } else {
      this.setState({ checkState: 2 });
    }
    Util.consoleLog(this.state.checkState);
  }

  renderStatusText() {
    // 看状态
    if (this.state.checkState === 0) {
      return (<TouchableHighlight onPress={() => { this.validateTransferAccount(); }}>
        <Text style={{ color: '#0083e0' }}>点击验证</Text>
      </TouchableHighlight>);
    } else if (this.state.checkState === 1) {
      return (<Text style={{ color: '#0083e0' }}>验证通过</Text>);
    } else if (this.state.checkState === 2) {
      return (<Text style={{ color: '#F23030' }}>验证不通过</Text>);
    }
    return null;
  }

  renderComplicateLine() {
    return (
      <Flex direction="row" justify="center" style={{ height: 50, paddingVertical: 8 }}>
        <Flex.Item justify="end" style={{ flex: 0.2, left: 20 }}>
          { this.state.checkState === 1 ?
                (<Image style={{ resizeMode: 'contain', height: 20, width: 20 }} source={require('./../../../images/productDetallsImgs/icons/choose.png')} />)
                : (null) }
        </Flex.Item>
        <Flex.Item >
        <TextInput
          style={{ borderColor: '#E0E0E0', borderWidth: 0.5, height: 32 }}
          onBlur={() => { this.validateTransferAccount(); }}
          onChangeText={(newState) => { this.setState({ transferAccount: newState }); }}
          value={this.state.transferAccount}
          
        />
        </Flex.Item>
        <Flex.Item style={{ flex: 0.45, left: 5 }}>
          {this.renderStatusText()}
        </Flex.Item>
      </Flex>);
  }

  renderComplicateLine2() {
    return (
      <View style={{ flexDirection: 'row', height: 40, paddingVertical: 8 }}>
        <View style={{ flexGrow: 0.2 }}>
          { this.state.checkState === 1 ?
                (<Image style={{ resizeMode: 'contain', height: 20, width: 20}} source={require('./../../../images/productDetallsImgs/icons/choose.png')} />)
                : (<View style={{ paddingVertical: 10 }} />)}
        </View>
        <InputItem
          style={{ flexGrow: 0.6, borderColor: '#E0E0E0', borderWidth: 0.5 }}
          onBlur={() => { this.validateTransferAccount(); }}
          onChange={(newState) => { this.setState({ transferAccount: newState }); }}
          value={this.state.transferAccount}
        />
        <View style={{ flexGrow: 0.2, alignItems: 'center', justifyContent: 'center' }}>
          {this.renderStatusText()}
        </View>
      </View>);
  }

  render() {
    return (
      <View >
        <View
          style={{ borderBottomWidth: 1,
            borderBottomColor: '#E0E0E0',
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 8 }}
        >
          <Text>请输入被转赠员工的工号或顾客的手机号</Text>
        </View>
        {this.renderComplicateLine()}
        <Button
          style={{ borderRadius: 0, height: commonButton.height, backgroundColor: commonButton.backgroundColor }}
          type="primary" onClick={() => {
            this.onComfirm();
          }}
        >
          <Text style={{ color: commonButton.color }}>确定转赠</Text>
        </Button>
      </View>
    );
  }
}
VoucherPopupView.propTypes = {
 // transferAccount: PropTypes.func,
  onComfirm: PropTypes.func,
  dispatch: PropTypes.func,
};
