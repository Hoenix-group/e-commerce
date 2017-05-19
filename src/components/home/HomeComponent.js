import React, { Component, PropTypes } from 'react';
import { connect } from 'dva/mobile';
import { Actions } from 'react-native-router-flux';
import { Carousel, Grid, Toast, Modal, InputItem } from 'antd-mobile';
import ToastContainer from 'antd-mobile/lib/toast/ToastContainer';
import {
  Platform,
  ScrollView,
  Image,
  Text,
  View,
  TouchableHighlight,
} from 'react-native';
import FsSearchBar from './../../components/fsSearchBar/FsSearchBar';
import RegionBar from './../../routes/region/RegionBar';
import styles from './../../routes/home/styles';
import * as validator from '../../utils/validator';
import MainScrollView from '../common/MainScrollView';

class HomeComponent extends Component {
  constructor() {
    super();

    this.toView = this.toView.bind(this);
    this.toSearch = this.toSearch.bind(this);
    this.showInputPhoneModal = this.showInputPhoneModal.bind(this);
    this.closeInputPhoneModal = this.closeInputPhoneModal.bind(this);
    this.toConsumptionPointDetail = this.toConsumptionPointDetail.bind(this);
    this.onPhoneInputChange = this.onPhoneInputChange.bind(this);
    this.hideToast = this.hideToast.bind(this);

    this.state = {
      isLoading : false
    };
  }

  get leftSide() {
    return (
      <RegionBar
        level={{ value: 2, type: 'value' }}
        onChange={(val) => { this.updateCurrentRegion(val); }}
        value={this.props.region}
        leftSide={
          <Image style={styles.RegionBarImg} source={require('./../../../images/searchbar/tsk_location@2x.png')} />
        }
        style={styles.flexRow}
        textStyle={styles.RegionBarText}
      />
    );
  }

  get rightSide() {
    return (
      <TouchableHighlight onPress={() => { Actions.notificationList(); }} >
        {/* <Image style={{ justifyContent: 'center', marginLeft: 15, height: 28, width: 20, resizeMode: 'contain' }} source={require('./../../../images/searchbar/msgIcon@2x.png')} />*/}
        <View style={styles.columnJustifyCenter}>
          <Image style={styles.rightSideImg} source={require('./../../../images/searchbar/msgIcon@2x.png')} />
          <Text numberOfLines={1} style={styles.RegionBarText} onPress={() => { Actions.notificationList(); }}>消息</Text>
        </View>
      </TouchableHighlight>
    );
  }

  get loadMainPageMenus() {
    return [
      {
        img: require('./../../../images/homeIcon/tsk_tgiy.png'),
        text: '代客注册',
        function: 'valetregister',
        parm: { fromHome: true },
      },
      {
        img: require('./../../../images/homeIcon/tsk_jczi.png'),
        text: '促销查询',
        function: 'promotionList',
      },
      {
        img: require('./../../../images/homeIcon/tsk_sazi.png'),
        text: '预约查询',
        function: 'appointmentlist',
        parm: { firstLoad: { value: true } },
      },
      {
        img: require('./../../../images/homeIcon/tsk_skzi.png'),
        text: '预存查询',
        function: 'prestoreList',
      },
      // {
      //   img: require('./../../../images/homeIcon/tsk_rczi.png'),
      //   text: '套餐查询',
      //   // function: 'CombinationPackage',
      //   function: 'CombinationPackage',
      // },
      // {
      //   img: require('./../../../images/homeIcon/tsk_uozi.png'),
      //   text: '提成查询',
      //   function: '',
      // },
      // {
      //   img: require('./../../../images/homeIcon/tsk_hczi.png'),
      //   text: '报表查询',
      //   function: '',
      // },
      // {
      //   img: require('./../../../images/homeIcon/tsk_pymg.png'),
      //   text: '我的顾客',
      //   function: 'customerListView',
      // },
      {
        img: require('./../../../images/homeIcon/tsk_pywn.png'),
        text: '我的订单',
        function: 'orderList',
      },
      // {
      //   img: require('./../../../images/homeIcon/tsk_pyzo.png'),
      //   text: '我的卡券',
      //   function: '',
      // },
      {
        img: require('./../../../images/homeIcon/tsk_pysa.png'),
        text: '我的预约',
        function: 'apoint',
      },
      {
        img: require('./../../../images/homeIcon/tsk_pysk.png'),
        text: '我的预存',
        function: 'myPrestoreListView',
      },
      // {
      //   img: require('./../../../images/homeIcon/tsk_skek.png'),
      //   text: '预存转存',
      //   function: '',
      // },
      // {
      //   img: require('./../../../images/homeIcon/tsk_wmpq.png'),
      //   text: '会员积分',
      //   function: this.showInputPhoneModal,
      // },
      // {
      //   img: require('./../../../images/homeIcon/tsk_pyon.png'),
      //   text: '我的收藏',
      //   function: 'wishlist',
      // },
      {
        img: require('./../../../images/homeIcon/tsk_pyon.png'),
        text: '运营商商品',
        function: 'operatorCommodity',
      },
      // {
      //   img: require('./../../../images/homeIcon/tsk_gdhk.png'),
      //   text: '首页管理',
      //   function: 'editor',
      // },
      //二期功能，暂不开放
      // {
      //   img: require('./../../../images/ipad.png'),
      //   text: '我的审批',
      //   function: 'approval',
      // },

    ];
  }

  // 显示查询会员积分的输入手机号码窗口
  showInputPhoneModal() {
    // this.setState({ inputPhoneModalVisible: true });
    this.props.dispatch({
      type: 'ConsumptionPoint/swithQueryPointModal',
    });
  }

  // 关闭查询会员积分的输入手机号码窗口
  closeInputPhoneModal() {
    // this.setState({ inputPhoneModalVisible: false });
    this.props.dispatch({
      type: 'ConsumptionPoint/swithQueryPointModal',
    });
  }

  onPhoneInputChange(v) {
    this.props.dispatch({
      type: 'ConsumptionPoint/setPhoneToQueryPoint',
      phone: v,
    });
  }

  toConsumptionPointDetail() {
    const phone = this.props.phoneToQueryPoint;
    if (!validator.validateNotNull(phone, '手机号码')) {
      return;
    }

    if (!validator.validatePhoneFormat(phone, '手机号码')) {
      return;
    }

    this.props.dispatch({
      type: 'ConsumptionPoint/searchCustomer',
      phone,
    });
  }

  hideToast() {
    this.props.dispatch({
      type: 'ConsumptionPoint/setIsToastVisible',
      isToastVisible: false,
    });
    this.props.dispatch({
      type: 'ConsumptionPoint/swithQueryPointModal',
    });
  }

  toSearch() {
    Actions.globalSearch({});
    // setTimeout(() => {
    //   dispatch({ type: 'Search/wishlist' });
    // }, 500);
  }

  toView(dataItem) {
    // dataItem中的function不是Actions中的scene, 则直接执行
    if (dataItem.function && typeof dataItem.function === 'function') {
      dataItem.function();
      return;
    }
    const action = dataItem.function;
    const callback = Actions[action];
    if (callback === undefined) {
      Toast.info('此功能正在开发，请耐心等待...', 1, null, false);
      return;
    }
    callback(dataItem.parm);
  }

  rightPress() {
    Toast.info('此功能正在开发，请耐心等待...', 1, null, false);
  }

  updateCurrentRegion(val) {
    this.props.dispatch({
      type: 'login/updateCurrentRegion',
      region: {
        default: this.props.region.default,
        current: val,
      },
    });
  }
  render() {
    return (
      <View style={[styles.flex, styles.shadeBg]}>
        <View style={styles.mainBlueBkg}>
          <FsSearchBar
            rightPress={this.rightPress}
            showrightImg={Boolean(true)}
            showText={Boolean(true)}
            placeholder={'输入商品关键字快速搜索'}
            showPromptOnFocus action={this.toSearch}
            leftSide={this.leftSide}
            rightSide={this.rightSide}
          />
        </View>
    <View style={{positon: 'relative', backgroundColor:'red', flex: 10}}>
        <MainScrollView 
            releaseToLoad = {() => { this.setState({isLoading: true}); setTimeout(()=>{this.setState({isLoading: false})}, 2000) }}
            isShowRefreshing={this.state.isLoading}
            scrollDownToLoad={(e) => {  }}>
          <View style={styles.imageContainer}>
            <Carousel autoplay infinite >
              <Image style={styles.image} source={require('./../../../images/sale_product_01_280x190.png')} />
              <Image style={styles.image} source={require('./../../../images/sale_product_02_280x190.png')} />
              <Image style={styles.image} source={require('./../../../images/sale_product_03_280x190.png')} />
              <Image style={styles.image} source={require('./../../../images/sale_product_04_280x190.png')} />
              <Image style={styles.image} source={require('./../../../images/sale_product_05_280x190.png')} />
            </Carousel>
          </View>
          <Grid
            hasLine={false}
            data={this.loadMainPageMenus} columnNum={4} onClick={dataItem => this.toView(dataItem)}
            renderItem={dataItem => (
              <View style={styles.gridView}>
                <Image source={dataItem.img} style={{ marginBottom: 9 }} />
                <Text style={styles.renderText}>{dataItem.text}</Text>
              </View>
            )}
          />
          <View style={styles.recommendedTitle}>
            <Text style={[styles.fontSizeLarge, styles.colorCC]}>为你推荐</Text>
          </View>
          <Grid
            hasLine={false}
            data={this.loadMainPageMenus} columnNum={2} onClick={dataItem => this.toView(dataItem)}
            renderItem={dataItem => (
              <View style={styles.gridView}>
                <Image source={dataItem.img} style={{ marginBottom: 9 }} />
                <Text style={styles.renderText}>{dataItem.text}</Text>
              </View>
            )}
          />

          <View>
            <Modal
              title="会员积分"
              transparent
              maskClosable={false}
              visible={this.props.visibleInputPhoneModal}
              footer={[{ text: '取消', onPress: this.closeInputPhoneModal }, { text: '确定', onPress: this.toConsumptionPointDetail }]}
            >
              <Text style={{ textAlign: 'center' }}>请输入会员手机号码</Text>
              <InputItem type="phone" placeholder="请输入" value={this.props.phoneToQueryPoint} onChange={this.onPhoneInputChange} />
              {/* {
               this.props.isToastVisible ? (
               <ToastContainer
               content="未找到积分信息"
               duration={1000}
               type="info"
               onAnimationEnd={this.hideToast}
               />
               ) : null
               }*/}
            </Modal>
          </View>
        
        </MainScrollView>
     </View>
      </View>
    );
  }
}

HomeComponent.propTypes = {
  dispatch: PropTypes.func,
  region: PropTypes.object,
  phoneToQueryPoint: PropTypes.string,
  visibleInputPhoneModal: PropTypes.bool,
  isToastVisible: PropTypes.bool,
  selectedTab: PropTypes.string,
};

const mapStateToProps = ({ login, ConsumptionPoint }) => {
  const { region } = login;
  const { phoneToQueryPoint, visibleInputPhoneModal, isToastVisible } = ConsumptionPoint;
  return { region, phoneToQueryPoint, visibleInputPhoneModal, isToastVisible: true };
};

export default connect(mapStateToProps)(HomeComponent);

