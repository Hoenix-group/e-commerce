import React, { Component, PropTypes } from 'react';
import { connect } from 'dva/mobile';
import { Actions } from 'react-native-router-flux';
import { ScrollView, Text, ListView, View, TouchableHighlight} from 'react-native';
import { List, Tabs, SwipeAction, Modal, Checkbox,Button} from 'antd-mobile';
import styles from './styles';

import RootView from '../../components/common/RootView';

const TabPane = Tabs.TabPane;
const Item = List.Item;
const Brief = Item.Brief;
   const rowData = [
      {
        voucherType:'小额现金券',
        voucherNote:'小额现金券的使用说明',
        voucherMoney:'$100',
        voucherDue:'2017年6.1到期',
        voucherCode:'001',
      }, {
        voucherType:'小额现金券',
        voucherNote:'小额现金券的使用说明',
        voucherMoney:'$200',
        voucherDue:'2017年6.1到期',
        voucherCode:'002',
      }, {
        voucherType:'小额现金券',
        voucherNote:'小额现金券的使用说明',
        voucherMoney:'$300',
        voucherDue:'2017年6.1到期',
        voucherCode:'003',
      }, {
        voucherType:'小额现金券',
        voucherNote:'小额现金券的使用说明',
        voucherMoney:'$400',
        voucherDue:'2017年6.1到期',
        voucherCode:'004',
      }, {
        voucherType:'小额现金券',
        voucherNote:'小额现金券的使用说明',
        voucherMoney:'$400',
        voucherDue:'2017年6.1到期',
        voucherCode:'005',
      }
    ];

class VoucherListView extends Component {

  componentWillMount() {
    this.props.dispatch({ type: 'voucher/fetchVoucherList', param: '' });
  }
  constructor(props) {
    super(props);

  }

  _renderRow = (rowData, argument, index) =>{
    //const fontColor = rowData.isReservable ? styles.font_blue : styles.font_grey;
    return (
      
        <View style={[styles.voucherCard, styles.marginLeft30]}>
          <Text style={[styles.font_grey]}>{rowData.vourcherType}</Text>
          <Text style={[styles.font_grey]}>{rowData.status}</Text>
          <View style={{flexDirection:'row',alignItems:'flex-end'}}>
            <View style={{flexGrow:1}}>
              <Text style={[styles.font_16]}>¥ {rowData.voucherValue}</Text>
            </View>
            <View style={{flexGrow:1, alignItems:'flex-end', paddingRight:0.5}}>
              <Text style={[styles.font_grey,styles.font_right]}>{rowData.endTime}到期</Text>
            </View>          
          </View>
        </View>
    );
  }



  render() {
    const {voucherList} = this.props;
    return (
      <RootView>
        <ListView
          enableEmptySections
          dataSource={this.props.voucherList}
          renderRow={this._renderRow}
        />
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <Button style={{ flex: 1 }} onClick={() => { Actions.applyNewVoucher() }}>申请新卡券</Button>
            <Button style={{ flex: 1 }} onClick={() => { Actions.voucherTransfer({voucherList}) }} >转赠卡券</Button>
          </View>
      </RootView>
    );
  }

    /*constructor(props) {
      const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});  
      super(props);
      this.state = {
        dataSource: ds.cloneWithRows(['row1', 'row 2','row 3','row 4','row 5','row 6','row 7','row 8']),
      };
    }
    render() {  
      return (  
        <RootView>
        <ListView  
          dataSource={this.state.dataSource}  
          renderRow={(rowData) =><Text>{rowData}</Text>}  
        />  
        </RootView>
      );  
    }  */
}

VoucherListView.propTypes = {
  dispatch: PropTypes.func,
  voucherList: PropTypes.object,
};

const mapStateToProps = (state) => {
  const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
  const data = ds.cloneWithRows(state.voucher.voucherList);
  return {
    voucherList: data,
  };

};

export default connect(mapStateToProps)(VoucherListView);

