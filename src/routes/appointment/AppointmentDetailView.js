import React, { Component, PropTypes } from 'react';
import { connect } from 'dva/mobile';
import { Actions } from 'react-native-router-flux';
import { List, Toast, Popup, Popover, Button } from 'antd-mobile';
import { View, Text, ScrollView, InteractionManager, TouchableHighlight, Image } from 'react-native';
import styles from './styles';
import {
  secondaryButtonViewMiddle, secondaryButtonTextMiddle, greyButtonViewMiddle,
  greyButtonTextMiddle, primaryIconView, primaryIconText,
  rowJustifyCenter, rowJustifyRight, columnJustifyCenter,
} from './../../themes/fsBaseStyles';
import FsPopover from './../../components/FsPopover/fsPopover';
import FsRootView from './../../components/common/FsRootView';
import Util from './../../utils/utils';
import * as dictionaryService from './../../services/dictionaryService';

const Item = Popover.Item;
let fsPopoverInstance;
class AppointmentDetailView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      operations: [
        { action: 'addAppointmentCustomer', menuname: '添加顾客' },
        { action: 'listAppointedCustomers', menuname: '顾客清单' },
        { action: 'signAppointment', menuname: '签到' },
        { action: 'signAppointmentList', menuname: '签到明细' },
      ],
    };
  }

  componentDidMount() {
    Util.consoleLog('AppointmentDetailView DidMount');
    InteractionManager.runAfterInteractions(() => {
      this.props.dispatch({ type: 'appointment/fetchAppointmentDetail', code: this.props.propsCode, isReservable: this.props.propsIsReservable });
    });
  }

  componentWillReceiveProps(nextProps) {
    Util.consoleLog(`this.props.code: ${this.props.code} ; nextProps.propsCode: ${nextProps.propsCode} `);
    if (nextProps.code && this.props.code && nextProps.propsCode !== this.props.code) {
      this.props.dispatch({ type: 'appointment/resetAppointmentDetailData' });
      InteractionManager.runAfterInteractions(() => {
        this.props.dispatch({ type: 'appointment/fetchAppointmentDetail', code: this.props.propsCode, isReservable: this.props.propsIsReservable });
      });
    }
    // InteractionManager.runAfterInteractions(() => {
    //   if (this.props.propsCode !== this.props.code) {
    //     this.props.dispatch({ type: 'appointment/fetchAppointmentDetail', code: this.props.propsCode, isReservable: this.props.propsIsReservable });
    //   }
    // });
  }

  componentWillUnmount() {
    Util.consoleLog('AppointmentDetailView WillUnmount');
    this.props.dispatch({ type: 'appointment/resetAppointmentDetailData' });
    // InteractionManager.runAfterInteractions(() => {
    //   this.props.dispatch({ type: 'appointment/resetAppointmentDetailData' });
    // });
  }

  showOperations(e) {
    e.preventDefault(); // 修复 Android 上点击穿透
    const showOperations = this.state.operations.filter((op) => {
      if (!this.props.isReservable) {
        return op.action !== 'addAppointmentCustomer';
      }
      return true;
    });
    Util.consoleLog('showOperations: ', showOperations);
    Popup.show(<List>
      {showOperations.map((op, index) => (
        <List.Item
          key={index}
          onClick={() => {
            Util.consoleLog('click menu..', op.menuname);
            const callback = Actions[op.action];
            if (callback === undefined) {
              Toast.info('此功能正在开发，请耐心等待...');
              return;
            }
            Popup.hide();
            const parms = { appointmentcode: this.props.code };
            if (op.action === 'addAppointmentCustomer') {
              parms.activityStartTime = this.props.activityStartTime;
              parms.activityEndTime = this.props.activityEndTime;
            }
            callback(parms);
          }}
        >
          {op.menuname}
        </List.Item>
      ))}
    </List>, {
      animationType: 'slide-up',
      maskClosable: true,
    },
      (buttonIndex) => {
        if (buttonIndex === showOperations.length - 1) { // 取消按钮
          return;
        }
        const callback = Actions[showOperations[buttonIndex].action];
        if (callback === undefined) {
          Toast.info('此功能正在开发，请耐心等待...');
          return;
        }
        const parms = { appointmentcode: this.props.code, appointmentName: this.props.activityName };
        if (showOperations[buttonIndex].action === 'addAppointmentCustomer') {
          parms.activityStartTime = this.props.activityStartTime;
          parms.activityEndTime = this.props.activityEndTime;
        }
        callback(parms);
      });
  }

  getDisplayStore(data) {
    const countryStr = data.isWholeCountry ? '全国 ' : '';
    const provinceStr = data.provinceNames ? data.provinceNames.join(' ') : '';
    const cityStr = data.cityNames ? data.cityNames.join(' ') : '';
    const storeStr = data.pointOfServiceNames ? data.pointOfServiceNames.join(' ') : '';
    return `${countryStr}${provinceStr}${cityStr}${storeStr}`;
  }

  renderLabel() {
    if (!this.props.channels) {
      return (<View />);
    }
    const labels = dictionaryService.classifyChannelLabel(this.props.channels);
    return (labels.map((item, i) =>
      <View key={i} style={[primaryIconView, styles.onlineIcon]}>
        <Text style={primaryIconText}>{item}</Text>
      </View>));
  }

  render() {
    /**
     * Popover
     */
    const showPopover = () => {
      fsPopoverInstance.showModal();
    };

    // const onClickSs = () => {
    //   const callbackHide = null;
    //   fsPopoverInstance.hideModal({ callbackHide });
    //   Actions.home();
    // };
    // const onClickSc = () => {
    //   const callbackHide = null;
    //   fsPopoverInstance.hideModal({ callbackHide });
    //   Actions.collect();
    // };
    // const onClickMT = () => {
    //   const callbackHide = null;
    //   fsPopoverInstance.hideModal({ callbackHide });
    //   Actions.myTracks();
    // };
    const renderOverlayComponent = () => {
      const optArray = [];
      optArray.push({
        name: '顾客清单',
        onClick: () => {
          fsPopoverInstance.hideModal({ callbackHide: undefined });
          Actions.listAppointedCustomers({ appointmentcode: this.props.code, isReservable: this.props.isReservable, reservationType: this.props.reservationType });
        },
      });
      optArray.push({
        name: '签到',
        onClick: () => {
          fsPopoverInstance.hideModal({ callbackHide: undefined });
          Actions.signAppointment({ appointmentcode: this.props.code, appointmentName: this.props.activityName });
        },
      });
      if (this.props.isReservable) {
        optArray.push({
          name: '签到明细',
          onClick: () => {
            fsPopoverInstance.hideModal({ callbackHide: undefined });
            Actions.signAppointmentList({ appointmentcode: this.props.code, appointmentName: this.props.activityName });
          },
        });
      }
      return optArray.map((item, id) => {
        return (
          (<Item key={id} onPress={item.onClick} value="scan" style={[styles.itemView, columnJustifyCenter]}>
            <Text style={styles.itemText}>{item.name}</Text>
          </Item>)
        );
      });
    };
    return (
      <FsRootView isNavBarHidden>
        <View style={{ flex: 1 }}>
          <FsPopover ref={(i) => { return (fsPopoverInstance = i); }} arrowBoxwidth={10} arrowBoxheight={10} renderContent={renderOverlayComponent()} />
          <View style={[{ flexDirection: 'column', flex: 1 }]}>
            <View style={[styles.outsideView, rowJustifyCenter]}>
              <TouchableHighlight underlayColor={'transparent'} style={rowJustifyCenter} onPress={() => { Actions.pop(); }}>
                <View style={[styles.imgView, rowJustifyCenter]}>
                  <Image style={styles.LeftImg} source={require('./../../../images/back_icon.png')} />
                </View>
              </TouchableHighlight>
              <TouchableHighlight underlayColor={'transparent'} style={{ flex: 1 }} onPress={() => { }}>
                <View style={{ flex: 3 }} />
              </TouchableHighlight>
              <View style={{ flex: 1 }}>
                <Text onPress={() => {}} style={styles.headerText}>活动详情</Text>
              </View>
              <View style={[{ flex: 1.2, right: 10 }, rowJustifyRight]} >
                <TouchableHighlight underlayColor={'rgba(100,100,100,0)'} onPress={showPopover}>
                  <Image style={{ height: 30, width: 28, resizeMode: 'contain' }} source={require('./../../../images/productDetallsImgs/icons/menu_burger.png')} />
                </TouchableHighlight>
              </View>
            </View>
            <View style={styles.detailHeader}>
              <View style={styles.detailHeaderLeft}>
                {this.renderLabel()}
              </View>
              <View style={styles.detailHeaderRight}>
                <Text style={styles.headerTitle}>
                  {this.props.activityName && this.props.activityName.length > 25 ? `${this.props.activityName.slice(0, 25)}...` : this.props.activityName}
                </Text>
              </View>
            </View>
            <ScrollView>
              <View style={[styles.detailListView, styles.detailListViewFirst]}>
                <View>
                  <Text style={styles.detailListTitle}>预约名称:</Text>
                </View>
                <Text style={styles.detailListContent} numberOfLines={2}>{this.props.activityName}</Text>
              </View>
              <View style={styles.detailListView}>
                <View>
                  <Text style={styles.detailListTitle}>预约时间:</Text>
                </View>
                <Text style={styles.detailListContent}>{this.props.startTime && this.props.endTime && `${this.props.startTime} 至 ${this.props.endTime}`}</Text>
              </View>
              {/* <View style={styles.detailListView}>
               <View>
               <Text style={styles.detailListTitle}>应用渠道:</Text>
               </View>
               <Text style={styles.detailListContent} >{this.props.channels && this.props.channels.join()}</Text>
               </View>*/}
              {this.props.scopes ? this.props.scopes.map((data, index) => (
                <View key={index}>
                  <View style={styles.detailListView}>
                    <View>
                      <Text style={styles.detailListTitle}>应用渠道:</Text>
                    </View>
                    <Text style={styles.detailListContent} >{data.channelName}</Text>
                  </View>
                  <View style={styles.detailListView}>
                    <View>
                      <Text style={styles.detailListTitle}>区域门店:</Text>
                    </View>
                    <Text style={styles.detailListContent} >{this.getDisplayStore(data)}</Text>
                  </View>
                </View>
              )) : (
                <View>
                  <View style={styles.detailListView}>
                    <View>
                      <Text style={styles.detailListTitle}>应用渠道:</Text>
                    </View>
                    <Text style={styles.detailListContent} />
                  </View>
                  <View style={styles.detailListView}>
                    <View>
                      <Text style={styles.detailListTitle}>区域门店:</Text>
                    </View>
                    <Text style={styles.detailListContent} />
                  </View>
                </View>
              )}
              {this.props.reservationType === 'PRODUCT' ? (<View />) :
                (<View style={styles.detailListView}>
                  <View>
                    <Text style={styles.detailListTitle}>活动时间:</Text>
                  </View>
                  <Text style={styles.detailListContent}>{this.props.activityStartTime && this.props.activityEndTime && `${this.props.activityStartTime} 至 ${this.props.activityEndTime}`}</Text>
                </View>)
              }
              {this.props.reservationType === 'PRODUCT' ? (null) :
                (<View style={styles.detailListView}>
                  <View>
                    <Text style={styles.detailListTitle}>活动内容:</Text>
                  </View>
                  <Text style={styles.detailListContent} lineBreakMode="tail" numberOfLines={5}>
                    {this.props.activityContent ? this.props.activityContent.replace(/\n/g, '') : ''}
                  </Text>
                </View>)
              }
              { this.props.reservationType === 'PRODUCT' ?
                (<View style={styles.detailListView}>
                  <View>
                    <Text style={styles.detailListTitle}>活动商品:</Text>
                  </View>
                  <Text style={styles.detailListContent} >
                    {this.props.products && this.props.products.map(data => (`${data.code} ${data.name}`)).join('\n')}
                  </Text>
                </View>) : (null)
              }
            </ScrollView>
          </View>

        </View>
        {/* <View style={styles.buttonArea}>
          <View style={[greyButtonViewMiddle, styles.buttonWidth]}>
            <Text style={greyButtonTextMiddle} onPress={() => Actions.signAppointmentList({ appointmentcode: this.props.code, appointmentName: this.props.activityName })}>签到明细</Text>
          </View>
          <View style={[greyButtonViewMiddle, styles.buttonWidth]}>
            <Text style={greyButtonTextMiddle} onPress={() => Actions.listAppointedCustomers({ appointmentcode: this.props.code, isReservable: this.props.isReservable })}>顾客清单</Text>
          </View>
          {
            this.props.isReservable ? (
              <View style={[greyButtonViewMiddle, styles.buttonWidth]}>
                <Text style={greyButtonTextMiddle} onPress={() => Actions.signAppointment({ appointmentcode: this.props.code, appointmentName: this.props.activityName })}>签到</Text>
              </View>
            ) : (null)
          }
          { this.props.isReservable ?
            (
              <View style={[secondaryButtonViewMiddle, styles.buttonWidth]}>
                <Text
                  style={secondaryButtonTextMiddle}
                  onPress={() => Actions.addAppointmentCustomer({
                    appointmentcode: this.props.code,
                    activityStartTime: this.props.activityStartTime,
                    activityEndTime: this.props.activityEndTime,
                  })}
                >添加顾客</Text>
              </View>
            ) : (null)}
        </View>*/}
        { this.props.isReservable ?
          (
            <Button
              type="primary"
              style={styles.buttonAngle}
              onClick={() => Actions.addAppointmentCustomer({
                appointmentcode: this.props.code,
                activityStartTime: this.props.activityStartTime,
                activityEndTime: this.props.activityEndTime,
                reservationType: this.props.reservationType,
              })}
            ><Text>添加顾客</Text></Button>
          ) : (null)}
        {/* <Button type="primary" onClick={e => this.showOperations(e)}>操作</Button>*/}
      </FsRootView>
    );
  }
}

AppointmentDetailView.propTypes = {
  code: PropTypes.string,
  channels: PropTypes.array,
  activityContent: PropTypes.string,
  activityName: PropTypes.string,
  startTime: PropTypes.string,
  endTime: PropTypes.string,
  activityStartTime: PropTypes.string,
  activityEndTime: PropTypes.string,
  products: PropTypes.array,
  isReservable: PropTypes.bool,
  dispatch: PropTypes.func,
  propsCode: PropTypes.string,
  propsIsReservable: PropTypes.bool,
  reservationType: PropTypes.string,
  scopes: PropTypes.array,
};

const mapStateToProps = ({ appointment: { appointmentdetail } }) => appointmentdetail;

export default connect(mapStateToProps)(AppointmentDetailView);
