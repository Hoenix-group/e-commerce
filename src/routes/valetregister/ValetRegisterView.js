import React, { PropTypes, Component } from 'react';
import moment from 'moment';
import 'moment/locale/zh-cn';
import { connect } from 'dva/mobile';
import { Text, List, Button, Popup, InputItem, Radio, Toast, DatePicker, Switch, Checkbox, NoticeBar } from 'antd-mobile';
import { ScrollView, View } from 'react-native';
import styles from './styles';
import { commonButton, paddingLarge, paddingMiddle, fontSizeSmall, marginLarge, fontSizeLarge, fontSizeMiddle, color66 } from './../../themes/fsBaseStyles';
import PopupCheckboxView from './../../components/common/PopupCheckboxView';
import * as validator from './../../utils/validator';
import FsRootView from './../../components/common/FsRootView';
import DistrictPicker from '../district/DistrictPicker';
import DeliverArea from './../../components/deliverArea/DeliverArea';
import { district } from '../../data';
import Util from './../../utils/utils';

const defaultDate = moment('1990-01-01', 'YYYY-MM-DD').utcOffset(8);
const maxDate = moment();
const minDate = moment('1900-01-01', 'YYYY-MM-DD').utcOffset(8);

class ValetRegisterView extends Component {
  componentWillUnmount() {
    this.props.dispatch({ type: 'valetRegister/clearRegisterInfoInState' });
    this.clearTimer();
  }

  onChangeSwitch(value) {
    const { dispatch } = this.props;
    dispatch({ type: 'valetRegister/changeSwitch', agreeToBeMember: value });
    if (value) {
      let cityCode = 0;
      let countyCode = 0;
      if (this.props.registerData && this.props.registerData.addressValue && this.props.registerData.addressValue.length > 0) {
        cityCode = this.props.registerData.addressValue[1];
        countyCode = this.props.registerData.addressValue[2];
      }
      this.getCounties(cityCode);
      this.getTowns(countyCode);
    }
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

  onClickAddress = () => {
    Popup.show(<DeliverArea async={true} getCounties={this.getCounties} getTowns={this.getTowns} cols={4} availableRegions={district} onChange={val => this.changeAddress(val)} onClose={() => { Popup.hide(); }} />, { maskClosable: true, animationType: 'slide-up', onMaskClose: () => { Popup.hide(); } });
  }

  onChangeName(name) {
    const { dispatch } = this.props;
    dispatch({ type: 'valetRegister/changeName', userName: name });
  }

  onChangeGender(value, { target }) {
    const { dispatch } = this.props;
    dispatch({ type: 'valetRegister/changeGenderValue', gender: value, checked: target.checked });
  }

  onChangeCode(code) {
    const { dispatch } = this.props;
    dispatch({ type: 'valetRegister/changeCode', verCode: code });
  }

  onChangeArea(area) {
    const { dispatch } = this.props;
    dispatch({ type: 'valetRegister/changeArea', livArea: area });
  }

  onChangePhoneNumber(value) {
    const { dispatch } = this.props;
    dispatch({ type: 'valetRegister/changePhoneNumber', userPn: value });
  }

  onPhoneNumberBlur(value) {
    const { dispatch } = this.props;
    dispatch({ type: 'valetRegister/changePhoneNumber', userPn: validator.formatPhoneNumber(value) });
  }

  getValidatePinCode(userPn) {
    // 格式化手机号码
    const formatUserPhoneNumber = validator.removeSpace(userPn);

    if (!validator.validateNotNull(formatUserPhoneNumber, '手机号', () => Toast.info('请输入手机号码', 1))) {
      return false;
    }

    if (!validator.validatePhoneFormat(formatUserPhoneNumber, '手机号', () => Toast.info('手机号码格式不正确', 1))) {
      return false;
    }
    this.props.dispatch({ type: 'valetRegister/fetchCode', userPn: formatUserPhoneNumber, cb: this.enableCounter.bind(this) });
    return true;
  }

  clearTimer() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  enableCounter() {
    if ((Date.now() - this.clickTime) < 1000) {
      return;
    }
    this.clickTime = Date.now();

    let defaultSeconds = 60;
    this.timer = setInterval(() => {
      defaultSeconds -= 1;
      this.updateSeconds(defaultSeconds);
      if (defaultSeconds <= 0) {
        this.clearTimer();
      }
    }, 1000);
  }

  updateSeconds(val) { const { dispatch } = this.props; dispatch({ type: 'valetRegister/updateSeconds', seconds: val }); }

  changeMold(value, label) {
    Popup.hide();
    const { dispatch } = this.props;
    dispatch({ type: 'valetRegister/changeMoldValue', moldValue: value, moldData: label });
  }

  changeHouseType(value, label) {
    Popup.hide();
    const { dispatch } = this.props;
    dispatch({ type: 'valetRegister/changeHouseTypeValue', houseTypeValue: value, houseTypeData: label });
  }

  showMold(molds, moldValue) {
    Popup.show(<List>
      {molds.map(mold => (
        <Radio.RadioItem key={mold.value} checked={moldValue === mold.value} onChange={() => this.changeMold(mold.value, mold.label)}>
          {mold.label}
        </Radio.RadioItem>
      ))}
    </List>, {
      animationType: 'slide-up',
      maskClosable: true,
      onMaskClose() { Popup.hide(); },
    });
  }

  showHouseType(houseType, houseTypeValue) {
    Popup.show(<List>
      {houseType.map(type => (
        <Radio.RadioItem key={type.value} checked={houseTypeValue === type.value} onChange={() => this.changeHouseType(type.value, type.label)}>
          {type.label}
        </Radio.RadioItem>
      ))}
    </List>, {
      animationType: 'slide-up',
      maskClosable: true,
      onMaskClose() {
        Popup.hide();
      },
    });
  }

  showInterest(interests, interestValue) {
    const { dispatch } = this.props;
    Popup.show(<PopupCheckboxView
      baseitems={interests}
      selectItemValues={interestValue}
      onSelect={(selectedItemValues) => {
        dispatch({ type: 'valetRegister/changeInterestValue', interestValue: selectedItemValues });
      }}
      onComfirm={() => Popup.hide()}
    />, {
      animationType: 'slide-up',
      maskClosable: true,
      onMaskClose() {
        Popup.hide();
      },
    });
  }

  changeBirthDay(val) {
    const { dispatch } = this.props;
    dispatch({ type: 'valetRegister/changeBirthDayValue', birthDayValue: val });
  }

  changeAddress(val) {
    const { dispatch } = this.props;
    dispatch({ type: 'valetRegister/changeAddressValue', addressValue: [val[0].value, val[1].value, val[2].value, val[3].value] });
    Popup.hide();
  }

  changeDetailAddress(val) {
    const { dispatch } = this.props;
    dispatch({ type: 'valetRegister/changeDetailAddressValue', detailAddress: val });
  }

  register(verCode, userPn, userName, agreeToBeMember, birthDayValue, chooseMale, chooseFemale, addressValue, moldValue, houseTypeValue, livArea, isAddToCart, phoneNumber, productInfo, interestValue, detailAddress) {
    if ((Date.now() - this.clickTime) < 1000) {
      return;
    }
    this.clickTime = Date.now();
    // 验证手机号码格式
    const formatUserPhoneNumber = validator.removeSpace(userPn);

    const userInfor = {
      pin: verCode,
      phoneNumber: formatUserPhoneNumber,
      name: userName,
      joinMember: agreeToBeMember,
      birthday: birthDayValue.format('YYYY-MM-DD'),
      gender: chooseMale ? 'MALE' : 'FEMALE',
      province: agreeToBeMember ? addressValue[0] : '',
      city: agreeToBeMember ? addressValue[1] : '',
      county: agreeToBeMember ? addressValue[2] : '',
      townArea: agreeToBeMember ? addressValue[3] : '',
      detailAddress,
      buyDemandType: moldValue,
      houseLayout: houseTypeValue,
      houseSquare: livArea,
      interest: interestValue ? interestValue.join(',') : '',
    };
    const addToCartInfo = {
      isAddToCart,
      productInfo,
      phoneNumber: userPn,
    };

    // 验证用户名非空
    if (userName === '') {
      Toast.info('信息未填写完整,请输入用户名', 1);
      return;
    }

    // 验证性别非空
    if (!chooseFemale && !chooseMale) {
      Toast.info('信息未填写完整，请选择性别', 1);
      return;
    }

    // 验证手机号码非空
    if (userPn === '') {
      Toast.info('请输入手机号码', 1);
      return;
    }

    if (!validator.validatePhoneFormat(formatUserPhoneNumber, '手机号', () => Toast.info('手机号码格式不正确', 1))) {
      return;
    }

    // 如果注册成为五星会员，验证pin码非空
    if (agreeToBeMember && verCode === '') {
      Toast.info('信息未填写完整,请输入验证码', 1);
      return;
    }

    const { dispatch } = this.props;
    dispatch({ type: 'valetRegister/fetchUser', userInfor, addToCartInfo, backScene: this.props.backScene });
  }

  renderButtonCode(seconds, userPn, disableGetVerCode) {
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
        disabled={isDisabled}
        onClick={() => this.getValidatePinCode(userPn)}
        style={{ paddingLeft: 0, paddingRight: 0 }}
      >
        <Text style={{ fontSize: fontSizeSmall, color: commonButton.color }}>获取验证码{seconds !== 60 && seconds !== 0 ? `(${seconds})` : ''}</Text>
      </Button>);
  }

  renderHeader() {
    if (!this.props.fromHome) {
      return (<NoticeBar type="info">该手机号尚未注册,尚未入会,*为必填项目.</NoticeBar>);
    }
    return (null);
  }

  render() {
    const { processStatus, registerData, seconds, isAddToCart, phoneNumber, productInfo, fromHome } = this.props;
    const { disableGetVerCode, disableVerCodeInput } = processStatus;
    const { agreeToBeMember, verCode, birthDayValue,
      addressValue, chooseMale, chooseFemale, livArea,
      molds, moldData, moldValue, houseType, houseTypeData, houseTypeValue,
      interestData, interestValue, interests, detailAddress } = registerData;
    // get pram phoneNumber userName
    let { userPn, userName } = registerData;
    userPn = (!userPn || userPn === '') && (phoneNumber && phoneNumber !== '') ? phoneNumber : userPn;
    userName = (!userName || userName === '') && (this.props.userName && this.props.userName !== '') ? this.props.userName : userName;

    let province = '';
    let city = '';
    let county = '';
    let town = '';
    if (addressValue.length > 0 && this.props.counties.length > 0 && this.props.towns.length > 0) {
      let provinceData = Util.getProvinceByCode(addressValue[0]);
      let cityData = Util.getCityByCode(addressValue[0], addressValue[1]);
      let countyData = Util.getCountyByCode(addressValue[2], this.props.counties);
      let townData = Util.getTownByCode(addressValue[3], this.props.towns);
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
    const address = province + '' + city + '' + county + '' + town;

    return (
      <FsRootView isNavBarHidden={false}>
        {this.renderHeader(fromHome)}
        <List.Item extra={<Switch checked={agreeToBeMember} onChange={value => this.onChangeSwitch(value)} />}>
          <Text style={[{ fontSize: fontSizeLarge, marginLeft: marginLarge }]}>同意注册为五星会员</Text>
        </List.Item>
        <ScrollView>
          <List>
            <View style={styles.viewOutSide}>
              <View style={styles.viewMain}>
                <View style={styles.leftView}>
                  <Text style={styles.leftText}>*姓名</Text>
                  <InputItem
                    style={[styles.leftInput, { borderBottomColor: 'transparent' }]}
                    type="text" value={userName}
                    onChange={name => this.onChangeName(name)}
                  />
                </View>
              </View>
            </View>

            <View style={styles.viewOutSide}>
              <View style={styles.viewMain}>
                <View style={[styles.leftView]}>
                  <Text style={styles.leftText}>*性别</Text>
                  <View style={styles.leftCheckbox}>
                    <Checkbox checked={chooseMale} onChange={item => this.onChangeGender(0, item)}>
                      <Text style={{ paddingLeft: paddingMiddle, fontSize: fontSizeSmall }}>男</Text>
                    </Checkbox>
                    <Checkbox checked={chooseFemale} onChange={item => this.onChangeGender(1, item)} style={{ marginLeft: 10 }}>
                      <Text style={{ paddingLeft: paddingMiddle, fontSize: fontSizeSmall }}>女</Text>
                    </Checkbox>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.viewOutSide}>
              <View style={styles.viewMain}>
                <View style={styles.leftView}>
                  <Text style={styles.leftText}>*手机号</Text>
                  <InputItem
                    type="phone"
                    maxLength={13}
                    value={userPn}
                    style={[styles.leftInput, { borderBottomColor: 'transparent' }]}
                    onChange={value => this.onChangePhoneNumber(value)}
                    onBlur={(value) => { this.onPhoneNumberBlur(value); }}
                  />
                </View>
              </View>
            </View>

            { agreeToBeMember ? (
              <View>
                <View style={styles.viewOutSide}>
                  <View style={styles.viewMain}>
                    <View style={styles.leftView}>
                      <Text style={styles.leftText}>*验证码</Text>
                      <InputItem
                        style={[styles.leftInput, { borderBottomColor: 'transparent' }]}
                        type="number" editable={disableVerCodeInput}
                        maxLength={6}
                        value={verCode} onChange={(code) => { this.onChangeCode(code); }}
                      />
                    </View>
                    <View style={styles.rightView}>
                      {this.renderButtonCode(seconds, userPn, disableGetVerCode)}
                    </View>
                  </View>
                </View>

                <View style={[{ paddingLeft: paddingLarge, paddingRight: paddingLarge }, styles.itemHeight]}>
                  <View style={{ flex: 1, flexDirection: 'row' }}>
                    <View style={{ flex: 1 }}>
                      <DatePicker
                        title="选择日期" mode="date" minDate={minDate} maxDate={maxDate}
                        value={birthDayValue === '' ? defaultDate : birthDayValue} triggerType="onClick" onChange={val => this.changeBirthDay(val)}
                      >
                        <List.Item arrow="horizontal" style={{ paddingLeft: 0 }} ><Text style={[{ fontSize: fontSizeLarge, marginLeft: marginLarge }]}>生日</Text></List.Item>
                      </DatePicker>
                    </View>
                  </View>
                </View>
                <List.Item style={[{ paddingLeft: paddingLarge, paddingRight: paddingLarge }, styles.itemHeight]} onClick={this.onClickAddress}>
                  <View style={{ flex: 1, flexDirection: 'row' }}>
                    <View style={{ flex: 2, justifyContent: 'center' }}>
                      <Text style={[{ fontSize: fontSizeLarge, marginLeft: marginLarge }]}>居住地址</Text>
                    </View>
                    <View style={{ flex: 5, justifyContent: 'center' }}>
                      <Text>{address}</Text>
                    </View>
                  </View>
                </List.Item>
                {/*<View style={[{ paddingLeft: paddingLarge, paddingRight: paddingLarge }, styles.itemHeightAddress]}>
                  <View style={{ flex: 1 }}>
                    <Text style={[{ fontSize: fontSizeLarge, marginLeft: marginLarge }]}>居住地址</Text>
                    <DeliverArea cols={2} availableRegions={district} />
                    <DistrictPicker
                      value={{
                        provinceCode: addressValue[0],
                        cityCode: addressValue[1],
                        countyCode: addressValue[2],
                        townCode: addressValue[3] }}
                      onPickerChange={val => this.changeAddress(val)}
                    />
                  </View>
                </View>*/}
                <List.Item style={[{ paddingLeft: paddingLarge, paddingRight: paddingLarge }, styles.itemHeight]}>
                  <View style={{ flex: 1, flexDirection: 'row' }}>
                    <View style={{ flex: 2, justifyContent: 'center' }}>
                      <Text style={[{ fontSize: fontSizeLarge, marginLeft: marginLarge }]}>详细地址</Text>
                    </View>
                    <View style={{ flex: 5, justifyContent: 'center' }}>
                      <InputItem
                        style={{ borderBottomColor: 'white' }}
                        value={detailAddress} onChange={val => this.changeDetailAddress(val)}
                      />
                    </View>
                  </View>
                </List.Item>
                {/*<View style={[{ paddingLeft: paddingLarge, paddingRight: paddingLarge }]}>
                  <InputItem value={detailAddress} onChange={val => this.changeDetailAddress(val)}>详细地址</InputItem>
                </View>*/}
                <List.Item arrow="horizontal" style={[{ paddingLeft: paddingLarge, paddingRight: paddingLarge }, styles.itemHeight]} onClick={() => this.showMold(molds, moldValue)}>
                  <View style={{ flex: 1 }}>
                    <View style={{ flex: 1, flexDirection: 'row' }} >
                      <View style={{ flex: 2, justifyContent: 'center' }}>
                        <Text style={[{ fontSize: fontSizeLarge, marginLeft: marginLarge }]}>需求类型</Text>
                      </View>
                      <View style={{ flex: 5, alignItems: 'flex-end', justifyContent: 'center' }}>
                        <Text style={{ fontSize: fontSizeMiddle, color: color66 }}>{moldData}</Text>
                      </View>
                    </View>
                  </View>
                </List.Item>
                <List.Item arrow="horizontal" style={[{ paddingLeft: paddingLarge, paddingRight: paddingLarge }, styles.itemHeight]} onClick={() => this.showHouseType(houseType, houseTypeValue)}>
                  <View style={{ flex: 1 }}>
                    <View style={{ flex: 1, flexDirection: 'row' }} >
                      <View style={{ flex: 2, justifyContent: 'center' }}>
                        <Text style={[{ fontSize: fontSizeLarge, marginLeft: marginLarge }]}>居住户型</Text>
                      </View>
                      <View style={{ flex: 5, alignItems: 'flex-end', justifyContent: 'center' }}>
                        <Text style={{ fontSize: fontSizeMiddle, color: color66 }}>{houseTypeData}</Text>
                      </View>
                    </View>
                  </View>
                </List.Item>
                <List.Item style={[{ paddingLeft: paddingLarge, paddingRight: paddingLarge }, styles.itemHeight]}>
                  <View style={{ flex: 1, flexDirection: 'row' }}>
                    <View style={{ flex: 2, justifyContent: 'center' }}>
                      <Text style={[{ fontSize: fontSizeLarge, marginLeft: marginLarge }]}>居住面积</Text>
                    </View>
                    <View style={{ flex: 5, justifyContent: 'center' }}>
                      <InputItem
                        type="number" style={{ borderBottomColor: 'white' }} extra="平米"
                        value={livArea} onChange={area => this.onChangeArea(area)}
                      />
                    </View>
                  </View>
                </List.Item>
                <List.Item arrow="horizontal" style={[{ paddingLeft: paddingLarge, paddingRight: paddingLarge }, styles.itemHeight]} onClick={() => this.showInterest(interests, interestValue)}>
                  <View style={{ flex: 1 }}>
                    <View style={{ flex: 1, flexDirection: 'row' }} >
                      <View style={{ flex: 2, justifyContent: 'center' }}>
                        <Text style={[{ fontSize: fontSizeLarge, marginLeft: marginLarge }]}>兴趣爱好</Text>
                      </View>
                      <View style={{ flex: 5, alignItems: 'flex-end', justifyContent: 'center' }}>
                        <Text style={{ fontSize: fontSizeMiddle, color: color66 }}>{interestData ? interestData.join(',') : ''}</Text>
                      </View>
                    </View>
                  </View>
                </List.Item>
              </View>
            ) : (null)
          }
          </List>
        </ScrollView>
        <Button
          style={{ borderRadius: 0, height: commonButton.height, backgroundColor: commonButton.backgroundColor }}
          type="primary" onClick={() => {
            this.register(verCode, userPn, userName, agreeToBeMember,
              birthDayValue, chooseMale, chooseFemale, addressValue,
              moldValue, houseTypeValue, livArea,
              isAddToCart, phoneNumber, productInfo, interestValue, detailAddress);
          }}
        >
          <Text style={{ color: commonButton.color }}>确定</Text>
        </Button>
      </FsRootView>
    );
  }
}

ValetRegisterView.propTypes = {
  registerData: PropTypes.object,
  processStatus: PropTypes.object,
  seconds: PropTypes.number,
  counties: PropTypes.array,
  towns: PropTypes.array,
  dispatch: PropTypes.func,
  isAddToCart: PropTypes.bool,
  phoneNumber: PropTypes.string,
  productInfo: PropTypes.object,
  fromHome: PropTypes.bool,
  backScene: PropTypes.string,
  userName: PropTypes.string,
};

const mapStateToProps = state => ({
  processStatus: state.valetRegister.processStatus,
  registerData: state.valetRegister.register,
  seconds: state.valetRegister.seconds,
  counties: state.district.counties,
  towns: state.district.towns,
});
export default connect(mapStateToProps)(ValetRegisterView);
