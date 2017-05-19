import React, { Component, PropTypes } from 'react';
import { connect } from 'dva/mobile';
import { Actions } from 'react-native-router-flux';
import { ScrollView, Text, ListView, View, TouchableHighlight,Image, TextInput} from 'react-native';
import { List, Tabs, SwipeAction, Modal, Checkbox,Button, Popup, InputItem,Icon} from 'antd-mobile';
import { commonButton } from './../../themes/fsBaseStyles';
import styles from './styles';
import VoucherPopupView from './VoucherPopupView';
import RootView from '../../components/common/RootView';
import Util from './../../utils/utils';

const TabPane = Tabs.TabPane;
const Item = List.Item;
const Brief = Item.Brief;

class VoucherTransferView extends Component {

  componentWillMount() {
    // let newState = [];
    // this.props.dispatch({ type: 'voucher/setSelectedCheckbox', newState });
  }

  componentWillUnmount(){
    this.props.dispatch({ type: 'voucher/resetSelectedCheckbox' });
  };

  constructor(props) {
    super(props);
    this.onTransferAccountInputChange = this.onTransferAccountInputChange.bind(this);
    this.showPopup2Transfer = this.showPopup2Transfer.bind(this);
  }

  onSelect(voucherCode, { target }) {
    let newState = [];
    if (target.checked) {
      newState = [...this.props.selectedVouchers, voucherCode];
    } else {
      newState = this.props.selectedVouchers.filter(item => item !== voucherCode);
    }
    console.log(newState);
    this.props.dispatch({ type: 'voucher/setSelectedCheckbox', newState });
    console.log(this.props.selectedVouchers);
  }


  onTransferAccountInputChange(value){
    this.props.dispatch({
      type: 'voucher/setVoucherTransferAccount',
      account: value,
    });
  }

  showPopup2Transfer(){
    Popup.show
    (<VoucherPopupView
        dispatch={this.props.dispatch}
        vouchers={this.props.selectedVouchers}
        onComfirm={() => { this.onConfirmTransfer(); }} />, {
      animationType: 'slide-up',
      maskClosable: true,
      onMaskClose() {
        Popup.hide();
      },
    });
  }

  onConfirmTransfer(){
    Util.consoleLog(this.props.selectedVouchers);
    let selected = this.props.selectedVouchers ;
    // this.props.dispatch({ type: 'voucher/transferVouchers', selected});
  }

  _renderRow = (rowData, argument, index) =>{
    //const fontColor = rowData.isReservable ? styles.font_blue : styles.font_grey;
    const {voucherCode} = rowData;
    return (
      <View style={{flexDirection: 'row',alignItems:'center'}}>
        <View style={{flexGrow:0.05, alignItems:'center'}}>
          {/*<Checkbox key={rowData.voucherCode} checked={this.props.selectedVouchers.includes(rowData.voucherCode)}
              onChange={checkboxitem => this.onSelect(rowData.voucherCode, checkboxitem)}/> */}
            <Checkbox key={voucherCode}  onChange={checkboxitem => this.onSelect(voucherCode, checkboxitem)}/> 
        </View>
        <View style={[styles.voucherCard,styles.flexGrow08]}>
          <Text style={[styles.font_grey]}>{rowData.vourcherType}</Text>
          <Text style={[styles.font_grey]}>{rowData.status}</Text>
          <View style={{flexDirection:'row',alignItems:'flex-end'}}>
            <View style={{flexGrow:1}}>
              <Text style={[styles.font_16]}>{rowData.voucherValue}</Text>
            </View>
            <View style={{flexGrow:1, alignItems:'flex-end', paddingRight:0.5}}>
              <Text style={[styles.font_grey,styles.font_right]}>{rowData.endTime}到期</Text>
            </View>          
          </View>
        </View>
      </View>
    );
  }



  render() {
  
    return (
      <RootView>
        <ListView
          dataSource={this.props.voucherList}
          renderRow={this._renderRow}
        />

        <Button
          style={{ borderRadius: 0, height: commonButton.height, backgroundColor: commonButton.backgroundColor }}
          type="primary" onClick={() => { Util.consoleLog(this.props.selectedVouchers);this.showPopup2Transfer();}}
        >
          <Text style={{ color: commonButton.color }}>确定转赠</Text>
        </Button>
      </RootView>
    );
  }
}

VoucherTransferView.propTypes = {
  selectedVouchers: PropTypes.array,
  vouchers: PropTypes.array,
  transferAccount: PropTypes.string,
};

const mapStateToProps = ({voucher}) => {
  const { selectedVouchers, transferAccount } =  voucher;
  // if(!selectedVouchers){
  //   selectedVouchers=[];
  // }
  return { selectedVouchers, transferAccount };
};

export default connect(mapStateToProps)(VoucherTransferView);

