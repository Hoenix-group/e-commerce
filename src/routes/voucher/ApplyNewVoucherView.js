import React, { Component, PropTypes } from 'react';
import { connect } from 'dva/mobile';
import { Actions } from 'react-native-router-flux';
import { ScrollView, Text, ListView, View, TouchableHighlight} from 'react-native';
import { List, Tabs, SwipeAction, Modal, Checkbox, InputItem, Picker,Button} from 'antd-mobile';
import { commonButton } from './../../themes/fsBaseStyles';
import styles from './styles';

import { district } from '../../data';

import RootView from '../../components/common/RootView';

const TabPane = Tabs.TabPane;
const Item = List.Item;
const Brief = Item.Brief;
const alert = Modal.alert;

class ApplyNewVoucherView extends Component {

  constructor(props) {
    super(props);
    this.onVoucherCountInputChange = this.onVoucherCountInputChange.bind(this);
  }

  componentWillMount() {
    this.props.dispatch({ type: 'voucher/fetchAvaliableVouchers', param: '' });
  }

  onVoucherCountInputChange(v) {
    this.props.dispatch({
      type: 'voucher/setVoucherApplyCount',
      count: v,
    });
  }

  updateApplyVoucherType(v) {
    this.props.dispatch({
      type: 'voucher/updateApplyVoucherType',
      typeCode: v,
    });

    this.props.dispatch({
      type: 'voucher/updateAvaliableoucherAmount',
      voucherType: v,
    });
  }

  updateApplyVoucherAmount(v) {
    this.props.dispatch({
      type: 'voucher/updateAvpplyVoucherAmount',
      voucherAmount: v,
    });
  }

  onShowWarning() {
    alert('', '您申请的卡券数量超过额度，请重新申请；如需申请超额数量，请联系您的上级主管人员。',
      [
        { text: '确定', onPress: () => {} }
      ]);
  }

  onClickSubmit() {
    // 点击了提交申请按钮
    // 有两种结果 ：1.超过可申请数量，失败    2. 成功提交申请
    // 那我们先来判断成功与否
    const inputCount = this.props.voucherApplyCount;
    // const voucherTypeRel = this.props.avaliableVoucherTypeRel;
    const voucherAmountRel = this.props.avaliableVoucherAmountRel;
    const chosenAmountAmount = this.props.applyVoucherAmount[0];
    const limitCount = voucherAmountRel[chosenAmountAmount].count;

    if (parseInt(limitCount) < parseInt(inputCount)) {
      this.onShowWarning(true);
    } else {
      this.onSubmit();
    }
  }

  onSubmit() {
    const TypeCode = this.props.applyVoucherType[0];
    const Type = this.props.avaliableVoucherTypeRel[TypeCode].type;
    const Code = this.props.applyVoucherAmount[0];
    const Value = this.props.avaliableVoucherAmountRel[Code].label;
    const newVoucher = {
      typeCode: TypeCode,
      type: Type,
      code: Code,
      value: Value,
      count: this.props.voucherApplyCount,
    };
    this.props.dispatch({
      type: 'voucher/createApply',
      newVoucher,
    });
  }

  componentWillUnmount() {
    this.props.dispatch({ type: 'voucher/resetSelectedCheckbox' });
  }

  render() {
    const avaliables = this.props.avaliableVouchers;
    return (
      <RootView>
        <ScrollView >
          <List>
            <Picker data={this.props.avaliableVouchers} cols={1} value={this.props.applyVoucherType} triggerType="onClick"
              onChange={(val) => { this.updateApplyVoucherType(val); }}>
              <List.Item arrow="horizontal" wrap>卡券类型</List.Item>
            </Picker>
            <Picker data={this.props.avaliableVoucherAmounts} cols={1} value={this.props.applyVoucherAmount} triggerType="onClick"
              onChange={(val) => { this.updateApplyVoucherAmount(val); }}>
              <List.Item arrow="horizontal" wrap>卡券金额</List.Item>
            </Picker>
            <InputItem type="number" placeholder="请输入" value={this.props.voucherApplyCount} onChange={this.onVoucherCountInputChange} >卡券数量</InputItem>        
          </List>
        </ScrollView >
        
        <Button
          style={{ borderRadius: 0, height: commonButton.height, backgroundColor: commonButton.backgroundColor }}
          type="primary" onClick={() => { this.onClickSubmit(); }}>
          <Text style={{ color: commonButton.color }}>提交申请</Text>
        </Button>
        
      </RootView>
    );
  }
}

ApplyNewVoucherView.propTypes = {
  //vouchers: PropTypes.array,
  dispatch: PropTypes.func,
  voucherApplyCount: PropTypes.string,
  avaliableVouchers: PropTypes.array,
  applyVoucherType: PropTypes.array,
  avaliableVoucherAmounts: PropTypes.array,
  applyVoucherAmount: PropTypes.array,
  avaliableVoucherTypeRel: PropTypes.object,
  avaliableVoucherAmountRel: PropTypes.object,
};

const mapStateToProps = ({ voucher }) => {
  const { voucherApplyCount, avaliableVouchers, applyVoucherType,
    avaliableVoucherAmounts, applyVoucherAmount, avaliableVoucherTypeRel,
    avaliableVoucherAmountRel } = voucher;
  return { voucherApplyCount,
    avaliableVouchers,
    applyVoucherType,
    avaliableVoucherAmounts,
    applyVoucherAmount,
    avaliableVoucherTypeRel,
    avaliableVoucherAmountRel,
  };
};

export default connect(mapStateToProps)(ApplyNewVoucherView);

