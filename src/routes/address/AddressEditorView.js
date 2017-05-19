import React, { PropTypes } from 'react';
import { connect } from 'dva/mobile';
import { View, Text, TouchableHighlight, ScrollView } from 'react-native';
import { Toast, List, InputItem, Popup } from 'antd-mobile';
import FsRootView from './../../components/common/FsRootView';
import DistrictPicker from '../district/DistrictPicker';
import DeliverArea from './../../components/deliverArea/DeliverArea';
import { district } from '../../data';
import { commonButton, paddingLarge, paddingMiddle, fontSizeSmall, marginLarge, fontSizeLarge, fontSizeMiddle, color66 } from './../../themes/fsBaseStyles';
import * as validator from '../../utils/validator';
import Util from './../../utils/utils';
import styles from './styles';

function AddressEditorView({ counties, towns, record, dispatch }) {

  function getCounties(cityCode, callback) {
    if (cityCode) {
      dispatch({
        type: 'district/getCounties',
        cityCode,
        callback,
      });
    }
  }

  function getTowns(countyCode, callback) {
    if (countyCode) {
      dispatch({
        type: 'district/getTowns',
        countyCode,
        callback,
      });
    }
  }

  function onClickAddress() {
    Popup.show(<DeliverArea async={true} savedRegionArr={[record.provinceCode, record.cityCode, record.countyCode, record.townCode]} getCounties={getCounties} getTowns={getTowns} cols={4} availableRegions={district} onChange={val => onChangeRegion(val)} onClose={() => { Popup.hide(); }} />, { maskClosable: true, animationType: 'slide-up', onMaskClose: () => { Popup.hide(); } });
  }

  function onChangeName(value) {
    dispatch({
      type: 'address/setRecordDetails',
      record: { receiver: value },
    });
  }

  function onChangePhone(value) {
    dispatch({
      type: 'address/setRecordDetails',
      record: { phone: value },
    });
  }

  function handlePhoneBlur(value) {
    dispatch({
      type: 'address/setRecordDetails',
      record: { phone: validator.formatPhoneNumber(value) },
    });
  }

  function onChangePhone1(value) {
    dispatch({
      type: 'address/setRecordDetails',
      record: { phone1: value },
    });
  }

  function handlePhone1Blur(value) {
    dispatch({
      type: 'address/setRecordDetails',
      record: { phone1: validator.formatPhoneNumber(value) },
    });
  }

  function onChangeRegion(value) {
    dispatch({
      type: 'address/setRecordDetails',
      record: {
        provinceCode: value[0].value,
        cityCode: value[1].value,
        countyCode: value[2].value,
        townCode: value[3].value },
    });
    Popup.hide();
  }

  function onChangeDetailAddress(value) {
    dispatch({
      type: 'address/setRecordDetails',
      record: { detailAddress: value },
    });
  }

  function saveAddress(entry) {
    if (entry.isDefaultAddress) {
      Toast.fail('不能编辑默认地址');
      return;
    }

    if (!validator.validateNotNull(entry.receiver, '收货人')) {
      return;
    }
    if (!validator.validateNotNull(entry.phone, '联系方式')) {
      return;
    }
    if (!validator.validatePhoneFormat(entry.phone, '联系方式')) {
      return;
    }
    if (entry.phone1 && !validator.validatePhoneFormat(entry.phone1, '备用电话')) {
      return;
    }

    if (!validator.validateNotNull(entry.provinceCode, '所在地区[省]')) {
      return;
    }
    if (!validator.validateNotNull(entry.cityCode, '所在地区[市]')) {
      return;
    }
    if (!validator.validateNotNull(entry.countyCode, '所在地区[县乡]')) {
      return;
    }
    if (!validator.validateNotNull(entry.townCode, '所在地区[城镇街道]')) {
      return;
    }

    if (!validator.validateNotNull(entry.detailAddress, '详细地址')) {
      return;
    }


    if ((Date.now() - this.clickTime) < 500) {
      return;
    }
    this.clickTime = Date.now();

    if (entry.isNew) {
      dispatch({
        type: 'address/create',
        record: entry,
      });
    } else {
      dispatch({
        type: 'address/update',
        record: entry,
      });
    }
  }

  function getAddress() {
    let province = '';
    let city = '';
    let county = '';
    let town = '';
    if (record && record.provinceCode && record.cityCode && record.countyCode && record.townCode && counties && counties.length > 0 && towns && towns.length > 0) {
      const provinceData = Util.getProvinceByCode(record.provinceCode);
      const cityData = Util.getCityByCode(record.provinceCode, record.cityCode);
      const countyData = Util.getCountyByCode(record.countyCode, counties);
      const townData = Util.getTownByCode(record.townCode, towns);
      if (provinceData) {
        province = provinceData.label;
      }
      if (cityData) {
        city = cityData.label;
      }
      if (countyData) {
        county = countyData.label;
      }
      if (townData) {
        town = townData.label;
      }
    }

    const address =  province + '' + city + '' + county + '' + town;
    // console.log('address', province, city, county, town);
    return address;
  }

  return (
    <FsRootView isNavBarHidden={false}>
      <View style={styles.flex}>

        <View style={[styles.top]} >
          <ScrollView>
            <List >
              <InputItem placeholder="请输入姓名" onChange={(value) => { onChangeName(value); }} value={record.receiver}>收货人</InputItem>
              <InputItem type="number" placeholder="请输入联系方式" onChange={(value) => { onChangePhone(value); }} onBlur={(value) => { handlePhoneBlur(value); }} value={record.phone}>联系方式</InputItem>
              <InputItem type="number" placeholder="选择输入备用联系方式" onChange={(value) => { onChangePhone1(value); }} onBlur={(value) => { handlePhone1Blur(value); }} value={record.phone1}>备用电话</InputItem>
              {/*<List.Item>
                所在地区
                <DistrictPicker value={record} onPickerChange={(val) => { onChangeRegion(val); }} />
              </List.Item>*/}
              <List.Item onClick={onClickAddress}>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                  <View style={{ flex: 2, justifyContent: 'center' }}>
                    <Text>所在地区</Text>
                  </View>
                  <View style={{ flex: 5, justifyContent: 'center' }}>
                    <Text>{getAddress()}</Text>
                  </View>
                </View>
              </List.Item>
              <InputItem placeholder="请输入详细街道或门牌号码" onChange={(value) => { onChangeDetailAddress(value); }} value={record.detailAddress}>详细地址</InputItem>
            </List>
          </ScrollView>
        </View>

        <View style={styles.bottom} >
          <TouchableHighlight underlayColor={'rgba(0,0,0,0)'} onPress={() => { saveAddress(record); }}>
            <View>
              <Text style={[styles.comBtn, styles.comBtnText, styles.fontLarge]}>保存</Text>
            </View>
          </TouchableHighlight>
        </View>
      </View>
    </FsRootView>
  );
}

AddressEditorView.propTypes = {
  record: PropTypes.object,
  dispatch: PropTypes.func,
  counties: PropTypes.array,
  towns: PropTypes.array,
};

// const mapStateToProps = ({ address }) => {
//   const { record } = address;
//   console.log('record---------', record);
//   return { record };
// };

// export default connect(mapStateToProps)(AddressEditorView);

const mapStateToProps = (state) => {
  // console.log('record---------', state.address.record);
  return ({
    record: state.address.record,
    counties: state.district.counties,
    towns: state.district.towns,
  });
};
export default connect(mapStateToProps)(AddressEditorView);
