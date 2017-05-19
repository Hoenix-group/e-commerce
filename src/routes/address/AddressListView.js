import React, { Component, PropTypes } from 'react';
import { Actions } from 'react-native-router-flux';
import { connect } from 'dva/mobile';
import { View, Text, Image, ScrollView, TouchableHighlight, InteractionManager } from 'react-native';
import { Toast, List, Modal } from 'antd-mobile';
import FsRootView from './../../components/common/FsRootView';
import styles from './styles';

const Item = List.Item;
const alert = Modal.alert;

class AddressListView extends Component {
  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.props.dispatch({
        type: 'address/getAll',
      });
    });
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: 'address/initializeState',
    });
  }

  getCounties = (cityCode, callback) => {
    if (cityCode) {
      this.props.dispatch({
        type: 'district/getCounties',
        cityCode,
        callback,
      });
    }
  }

  getTowns = (countyCode, callback) => {
    if (countyCode) {
      this.props.dispatch({
        type: 'district/getTowns',
        countyCode,
        callback,
      });
    }
  }

  newAddress() {
    if (this.props.addresses.length > 9) {
      Toast.fail('地址数目超限，请修改或删除已有地址');
      return;
    }

    this.props.dispatch({
      type: 'address/setRecord',
      record: {
        provinceCode: '0',
        cityCode: '0',
        countyCode: '0',
        townCode: '0',
        isNew: true,
      },
    });
    Actions.newAddress();
  }

  editAddress(entry) {
    InteractionManager.runAfterInteractions(() => {
      this.props.dispatch({
        type: 'address/setRecord',
        record: {
          ...entry,
          isNew: false,
        },
      });
      this.getCounties(entry.cityCode);
      this.getTowns(entry.countyCode);
    });
    Actions.editAddress();
  }

  deleteAddress(entry) {
    this.props.dispatch({
      type: 'address/remove',
      code: entry.code,
      addresses: this.props.addresses,
    });
  }

  selectAddress(entry) {
    this.props.dispatch({
      type: 'address/select',
      code: entry.code,
    });
  }

  showWarning(entry) {
    alert('删除', '确定删除么?', [
      { text: '取消', onPress: () => { } },
      { text: '确定', onPress: () => this.deleteAddress(entry), style: { fontWeight: 'bold' } },
    ]);
  }

  renderItem(entry, i) {
    if (entry.isDefaultAddress) {
      return (
       /* <Item key={i} onClick={() => this.selectAddress(entry)} style={{ backgroundColor: entry.code === this.props.selectedId ? '#f9f9f9' : 'white' }}>
          <View style={styles.tagRow}>
            <Text style={[styles.fontSizeLarge, styles.textColor]}>送至：{entry.receiver}{`${entry.phone}`}</Text>
            <View style={[styles.onLineView1, styles.center]}><Text style={[styles.onLineBtn1]}>默认</Text></View>
          </View>
          <Text style={[styles.fontMiddle, styles.font_g]}>{entry.fullAddress}</Text>
        </Item>*/
     <View key={i} style={[{ flex: 9, backgroundColor: entry.code === this.props.selectedId ? '#f9f9f9' : 'white' }, styles.contentLR, styles.row1, styles.p_left15_lr, styles.p_left15_lrv, styles.b_bottom]}>
          <View style={[{ flex: 7 }, styles.left1, styles.row1]} >
            <TouchableHighlight underlayColor={'rgba(0,0,0,0)'} onPress={() => this.selectAddress(entry)}>
              <View style={[{ backgroundColor: entry.code === this.props.selectedId ? '#f9f9f9' : 'white' }]}>
                <View style={styles.tagRow}>
                  <Text style={[styles.fontLarge, styles.textColor, styles.p_left5_lrv]} >送至：{entry.receiver}{`${entry.phone}`}</Text>
                  <View style={[styles.onLineView1, styles.center, styles.p_left5_lrv, { marginLeft: 5 }]}><Text style={[styles.onLineBtn1]}>默认</Text></View>
                </View>
                <Text style={[styles.fontMiddle, styles.font_g]}>{entry.fullAddress}</Text>
              </View>
            </TouchableHighlight>
          </View>
        </View>
      );
    }

    return (
      <View key={i} style={[{ flex: 9, backgroundColor: entry.code === this.props.selectedId ? '#f9f9f9' : 'white' }, styles.contentLR, styles.row1, styles.p_left15_lr, styles.p_left15_lrv, styles.b_bottom]}>
        <View style={[{ flex: 7 }, styles.left1, styles.row1]} >
          <TouchableHighlight underlayColor={'rgba(0,0,0,0)'} onPress={() => this.selectAddress(entry)}>
            <View style={[{ backgroundColor: entry.code === this.props.selectedId ? '#f9f9f9' : 'white' }]}>
              <Text style={[styles.fontLarge, styles.textColor, styles.p_left5_lrv]} >送至：{entry.receiver}{`${entry.phone}`}</Text>
              <Text style={[styles.fontMiddle, styles.font_g]}>{entry.fullAddress}</Text>
            </View>
          </TouchableHighlight>
        </View>
        <View style={[{ flex: 3 }, styles.end1, styles.row1]}>
          <TouchableHighlight underlayColor={'rgba(0,0,0,0)'} onPress={() => this.editAddress(entry)} style={{ alignItems: 'center', height: 48, justifyContent: 'center' }}>
            <Image style={{ width: 20, height: 20 }} source={require('./../../../images/edit.png')} />
          </TouchableHighlight>
          <TouchableHighlight underlayColor={'rgba(0,0,0,0)'} onPress={() => this.showWarning(entry)} style={{ alignItems: 'center', height: 48, justifyContent: 'center' }}>
            <Image style={{ width: 20, height: 20, marginLeft: 5 }} source={require('./../../../images/search/button_delete.png')} />
          </TouchableHighlight>
        </View>
      </View>
    );
  }

  render() {
    return (
      <FsRootView isNavBarHidden={false}>
        <View style={[styles.flex, styles.bg]}>
          <View style={[styles.top, styles.flex]} >
            <ScrollView>
              <View>
                {this.props.addresses.map((entry, i) => this.renderItem(entry, i))}
              </View>
            </ScrollView>
          </View>
          <TouchableHighlight underlayColor={'rgba(0,0,0,0)'} onPress={() => { this.newAddress(); }}>
            <View>
              <Text style={[styles.comBtn, styles.comBtnText, styles.fontLarge]}>新增地址</Text>
            </View>
          </TouchableHighlight>
        </View>
      </FsRootView>
    );
  }
}

AddressListView.propTypes = {
  addresses: PropTypes.array,
  selectedId: PropTypes.string,
  dispatch: PropTypes.func,
};

const mapStateToProps = ({ address }) => {
  const { addresses, selectedId } = address;
  return { addresses, selectedId };
};

export default connect(mapStateToProps)(AddressListView);
