import React, { PropTypes, Component } from 'react';
import { connect } from 'dva/mobile';
import { Actions } from 'react-native-router-flux';
import { List, Button, Popover } from 'antd-mobile';
import { View, Text, ScrollView, TouchableOpacity, InteractionManager, TouchableHighlight, Image } from 'react-native';
import styles from './../appointment/styles';
import {
  secondaryButtonViewMiddle, secondaryButtonTextMiddle, greyButtonViewMiddle,
  greyButtonTextMiddle, primaryIconView, primaryIconText,
  rowJustifyCenter, rowJustifyRight, columnJustifyCenter,
} from './../../themes/fsBaseStyles';
import RootView from './../../components/common/RootView';
import FsPopover from './../../components/FsPopover/fsPopover';
import FsRootView from './../../components/common/FsRootView';


const Item = Popover.Item;
let fsPopoverInstance;
class PrestoreDetailView extends Component {

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.props.dispatch({ type: 'prestore/fetchPrestoreDetail', code: this.props.code });
    });
  }

  componentWillReceiveProps() {
    InteractionManager.runAfterInteractions(() => {
      if (this.props.code !== this.props.prestoredetail.preStorePromotionCode) {
        this.props.dispatch({ type: 'prestore/fetchPrestoreDetail', code: this.props.code });
      }
    });
  }

  componentWillUnmount() {
    this.props.dispatch({ type: 'prestore/resetPrestoreDetail' });
  }

  onChangePhoneNumber(phoneNumber) {
    this.props.dispatch({ type: 'prestore/setPhoneNumber', phoneNumber });
  }

  render() {
    /**
     * Popover
     */
    const showPopover = () => {
      fsPopoverInstance.showModal();
    };

    const onClickCustomerList = () => {
      const callbackHide = null;
      fsPopoverInstance.hideModal({ callbackHide });
      Actions.prestorecustomerlist();
    };
    const onClickSc = () => {
      const callbackHide = null;
      fsPopoverInstance.hideModal({ callbackHide });
      Actions.collect();
    };
    const onClickMT = () => {
      const callbackHide = null;
      fsPopoverInstance.hideModal({ callbackHide });
      Actions.myTracks();
    };
    const renderOverlayComponent = () => {
      return [{ name: '顾客清单', onClick: onClickCustomerList }].map((item, id) => {
        return (
          (<Item key={id} onPress={item.onClick} value="scan" style={[styles.itemView, columnJustifyCenter]}>
            <Text style={styles.itemText}>{item.name}</Text>
          </Item>)
        );
      });
    };
    const activityName = this.props.prestoredetail.name;
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
                <Text onPress={() => {}} style={styles.headerText}>预存详情</Text>
              </View>
              <View style={[{ flex: 1.2, right: 10 }, rowJustifyRight]} >
                <TouchableHighlight underlayColor={'rgba(100,100,100,0)'} onPress={showPopover}>
                  <Image style={{ height: 30, width: 28, resizeMode: 'contain' }} source={require('./../../../images/productDetallsImgs/icons/menu_burger.png')} />
                </TouchableHighlight>
              </View>
            </View>
            <View style={[styles.detailHeader, { backgroundColor: '#ffffff' }]}>
              <View style={styles.detailHeaderLeft}>
                <View style={[primaryIconView, styles.onlineIcon]}>
                  <Text style={primaryIconText}>{this.props.prestoredetail.channel && this.props.prestoredetail.channel.includes('五星享购') ? '线上' : '线下'}</Text>
                </View>
              </View>
              <View style={styles.detailHeaderRight}>
                <Text style={styles.headerTitle}>
                  {activityName && activityName.length >= 25 ? `${activityName.slice(0, 25)}...` : activityName}
                </Text>
              </View>
            </View>
            <ScrollView style={{ backgroundColor: '#ffffff' }}>
              <View style={[styles.detailListView, styles.detailListViewFirst]}>
                <View>
                  <Text style={styles.detailListTitle}>预存名称:</Text>
                </View>
                <Text style={styles.detailListContent}>{this.props.prestoredetail.name}</Text>
              </View>
              <View style={styles.detailListView}>
                <View>
                  <Text style={styles.detailListTitle}>预存描述:</Text>
                </View>
                <Text style={styles.detailListContent}>{this.props.prestoredetail.prestoreContent}</Text>
              </View>
              <View style={styles.detailListView}>
                <View>
                  <Text style={styles.detailListTitle}>预存时间:</Text>
                </View>
                <Text style={styles.detailListContent}>
                  {this.props.prestoredetail.startTime && this.props.prestoredetail.endTime && `${this.props.prestoredetail.startTime}至${this.props.prestoredetail.endTime}`}
                </Text>
              </View>
              {this.props.prestoredetail.channel.map((channel, index) => (
                <View key={index}>
                  <View style={styles.detailListView}>
                    <View>
                      <Text style={styles.detailListTitle}>应用渠道:</Text>
                    </View>
                    <Text style={styles.detailListContent}>{channel}</Text>
                  </View>
                  <View style={styles.detailListView}>
                    <View>
                      <Text style={styles.detailListTitle}>区域门店:</Text>
                    </View>
                    <Text style={styles.detailListContent}>{this.props.prestoredetail.storeDetail[index]}</Text>
                  </View>
                </View>))}
              <View style={styles.detailListView}>
                <View>
                  <Text style={styles.detailListTitle}>预存方案:</Text>
                </View>
                <Text lineBreakMode="tail" numberOfLines={5} style={styles.detailListContent} >
                  {this.props.prestoredetail.prestorePlan}
                </Text>
              </View>
            </ScrollView>
          </View>
          {/* <View style={styles.buttonArea}>
            <TouchableOpacity onPress={() => Actions.prestorecustomerlist()}>
              <View style={[greyButtonViewMiddle, styles.buttonWidth]}>
                <Text style={greyButtonTextMiddle}>顾客清单</Text>
              </View>
            </TouchableOpacity>
            { this.props.prestoredetail.prestoreable ? (
              <TouchableOpacity onPress={() => Actions.addPrestoreCustomer({ code: this.props.prestoredetail.preStorePromotionCode })}>
                <View style={[secondaryButtonViewMiddle, styles.buttonWidth]}>
                  <Text style={secondaryButtonTextMiddle}>添加顾客</Text>
                </View>
              </TouchableOpacity>) : (null)}
          </View>*/}
          { this.props.prestoredetail.prestoreable ? (
            <Button
              type="primary"
              style={styles.buttonAngle}
              onClick={() => Actions.addPrestoreCustomer({ code: this.props.prestoredetail.preStorePromotionCode })}
            ><Text>添加顾客</Text></Button>
            ) : (null)}
        </View>
      </FsRootView>
    );
  }
}

PrestoreDetailView.propTypes = {
  prestoredetail: PropTypes.object,
  dispatch: PropTypes.func,
  code: PropTypes.string,
};

const mapStateToProps = (state) => {
  return {
    prestoredetail: state.prestore.prestoreDetail,
  };
  // appointmentdetail: state.appointment.appointmentdetail,
};

export default connect(mapStateToProps)(PrestoreDetailView);
