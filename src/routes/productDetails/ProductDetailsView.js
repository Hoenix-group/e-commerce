import React, { PropTypes, Component } from 'react';
import { connect } from 'dva/mobile';
import { ScrollView, View, Text, Image, TouchableHighlight, InteractionManager, Platform, Dimensions } from 'react-native';
import { Toast, Popover } from 'antd-mobile';
import { Actions } from 'react-native-router-flux';
import ProductDetails from './../../components/ProductDetails/ProductDetails';
import ProductDescription from './../../components/ProductDetails/ProductDescription';
import styles from './styles.js';
import FsRootView from '../../components/common/FsRootView';
import FsPopover from './../../components/FsPopover/fsPopover';
import Utils from '../../utils/utils';
import { color66, color33, fontSizeMiddle, fontSizeLarge, shadeBg3,columnJustifyCenter } from '../../themes/fsBaseStyles';

const Item = Popover.Item;
let fsPopoverInstance;
class ProductDetailsView extends Component {
  constructor() {
    super();
    this.state = {
      viewHeight: 0,
    }
  }
  componentWillUnmount() {
    this.props.dispatch({
      type: 'Details/cleanProduct',
    });
  }
  /**
   * tab 页面切换
   * @param num1：传入当前页面值
   */
  onChangeTab = (num1) => {
    this.list.scrollTo({ x: 0, y: 0, animated: false});
    this.setState({
        viewHeight: 0,
      })
    this.props.dispatch({
      type: 'Details/changeType',
      typeNum: num1,
    });
  }
  // 上拉切换详情
  onScrollChange = (event) => {
    const num = parseInt(event.nativeEvent.contentSize.height - event.nativeEvent.layoutMeasurement.height, 10);
    if (parseInt(event.nativeEvent.contentOffset.y, 10) >= num  && Platform.OS === 'android') {
      this.setState({
        viewHeight: 101,
      })
    }else {
      this.setState({
        viewHeight: 0,
      })
    }
    if (event.nativeEvent.contentOffset.y > num +100 && this.props.typeNum === 1 && Platform.OS !== 'android') {
      this.onChangeTab(2);
    } else if (parseInt(event.nativeEvent.contentOffset.y, 10) >= num && this.props.typeNum === 1 && Platform.OS === 'android' && this.state.viewHeight > 0) {
      this.onChangeTab(2);
      this.setState({
        viewHeight: 0,
      })
    }
  }
  /**
 * 加入购物车
 */
  addToCart = (pid, status, qty, ecode) => {
    const regionCode = this.props.region && this.props.region.city ? this.props.region : this.props.objRegion;
    const excode = ecode ? ecode : this.props.extendcode; // 存放延保信息编码
    // available用来判断商品是否可用，可用即能加入购物车
    if (this.props.productDeailObj.available) {
      this.props.dispatch({ type: 'Details/addToCart',
        productInfo: {
          pid,
          status,
          qty,
          region: regionCode.city,
          excode,
        },
      });
    }
  }
  /**
   * 修改过地址
   */
  changeaddress = (provincecode, cityCode) => {
    this.props.dispatch({
      type: 'Details/changeAddress',
      recode: { province: provincecode, city: cityCode }
    });
  }
  addToWishlist = (sectionID, rCode, channelCode, productAttribute) => {
    if (this.props.inWishlist) {
      Toast.info('该商品已收藏在收藏夹中！', 1);
      return;
    }
    this.props.dispatch({
      type: 'Details/addTowishList',
      productCode: sectionID,
      regionCode: rCode,
      channel: channelCode,
      product: productAttribute,
    });
  }
  /* 返回上一级 */
  toProductList () {
    this.props.dispatch({
      type: 'Details/cleanProduct',
    });
    Actions.pop();
  }
  /* 修改过弹窗状态 */
  ChangepopupStatetion = (state) => {
    this.props.dispatch({
      type: 'Details/setPopupState',
      popupState: state,
    });
  }
  /**
   * 调用商品详情接口
   */
  projectDetail = (sectionID, rCode, channelCode, productAtt) => {
    // 判断渠道是否为undefined
    const channeldef =  channelCode ? channelCode : this.props.channeldefcode;
    // 判断区域id是否为undefined
    const regindef = rCode ? rCode : this.props.region && this.props.region.city ? this.props.region.city : this.props.objRegion.city;
    // 判断销售属性是否为空
    const productDefAttr = productAtt ? productAtt : this.props.productdefAttribute;
    // 判断当前送至regionCode与店员默认门店regionCode,不一致则将渠道改为线上
    const code = rCode === this.props.objRegion.city ? channeldef : 'ONLINE';
    const flag = rCode !== this.props.objRegion.city ? Boolean(true) : false;
    this.props.dispatch({
      type: 'Details/queryProductDeail',
      productCode: sectionID,
      regionCode: regindef,
      channel: code,
      product: productDefAttr,
      changeflag: flag,
    });
  }
  /* 商品详细查询 */
  reginCode = () =>{
    return this.props.region && this.props.region.city ? this.props.region : this.props.objRegion;
  }
  changeNum = (val) => {
    this.props.dispatch({
      type: 'Details/changeCartNum',
      cartNum: val,
    });
  }
  goHome = () => {
    Actions.home({});
    InteractionManager.runAfterInteractions(()=>{  
    this.props.dispatch({
      type: 'Search/cleanAllState',
      showCancelButton: false,
    });
    this.props.dispatch({
      type: 'Details/cleanProduct',
    });
    });
  }
  changeExtendwarrant = (extend, extendTag, extendVal, extcode, extname) => {
    this.props.dispatch({
      type: 'Details/changeExtendwarrant',
      extendwarrant: extend,
      extendwarrantTag: extendTag,
      extendwarrantVal: extendVal,
      extendcode: extcode,
      extendname: extname,
    });
  }
  render() {
    /* 更改 商品 tab标签页选中状态 */
    const styleActive = (this.props.typeNum === 1 ? styles.active : {});
    const styleActive2 = (this.props.typeNum === 2 ? styles.active : {});
    const styleActiveFont1 = (this.props.typeNum === 1 ? styles.activeFont : {});
    const styleActiveFont2 = (this.props.typeNum === 2 ? styles.activeFont : {});
    /* 更改购物车样式 */
    const cartStyle = this.props.productDeailObj.available ? {} : styles.cartStyle;
    const cartLoseStyle = this.props.productDeailObj.available ? {} : styles.cartLoseStyle;
    const onClickSs = () => {
    const callbackHide = null;
      fsPopoverInstance.hideModal({callbackHide});
      Actions.home()
    }
    const onClickSc = () => {
      const callbackHide = null;
      fsPopoverInstance.hideModal({callbackHide});
      Actions.collect();
    }
    const onClickMT = () => {
      const callbackHide = null;
      fsPopoverInstance.hideModal({callbackHide});
      Actions.myTracks();
    }
    const renderOverlayComponent = () => {
      return [{name: '消息', onClick: onClickSs}, {name: '首页', onClick: onClickSs}, {name: '搜索', onClick: onClickSs}, {name: '我的关注', onClick: onClickSc}, {name: '浏览记录', onClick: onClickMT}].map((item, id) => {
        return (
          (<Item key={id} value="scan" style={[{width: 95, borderBottomWidth: 1, borderColor: '#252525'},columnJustifyCenter]}>
            <Text style={{color: '#fff'}} onPress={item.onClick}>{item.name}</Text>
          </Item>)
        )
      })
    }
    let popover;
    const showPopover = () => {
      // fsPopoverInstance.showModal()
    }
    return (
      <FsRootView isNavBarHidden>
      {
        this.props.productDeailObj ? (
          <View style={{ flex: 1 }}>
            <FsPopover ref={i => { return (fsPopoverInstance = i) }} arrowBoxwidth={10} arrowBoxheight={10} renderContent={renderOverlayComponent()}/>
            <View style={[styles.main, { flex: 14 }]}>
              <View style={[{ position: 'relative', height: 44 }, styles.center, styles.row1, styles.tab]}>
                <TouchableHighlight underlayColor={'transparent'} style={[styles.center]} onPress={() => { this.toProductList(); }}>
                  <View style={[{ left: 5, marginHorizontal: 5 }, styles.center]}>
                    <Image style={styles.imgLeft} source={require('./../../../images/back_icon.png')} />
                  </View>
                </TouchableHighlight>
                <TouchableHighlight underlayColor={'transparent'} style={{ flex: 1 }} onPress={() => { this.toProductList(); }}>
                  <View style={{ flex:3 }} />
                </TouchableHighlight>
                <View style={[styles.flex, styleActive]}>
                  <Text onPress={() => this.onChangeTab(1)} style={[styles.tabs, styles.tabFont, styleActiveFont1]}>商品</Text>
                </View>
                <View style={[styles.flex, styleActive2]}>
                  <Text onPress={() => this.onChangeTab(2)} style={[styles.tabs, styles.tabFont, styleActiveFont2]}>详情</Text>
                </View>
                <View style={{flex: 1,justifyContent: 'flex-end',alignItems: 'flex-end',right: 10}} >
                  <TouchableHighlight underlayColor={'rgba(100,100,100,0)'} onPress={showPopover}>
                    <Image style={{ height: 30, width: 28,resizeMode: 'contain' }} source={require('./../../../images/productDetallsImgs/icons/menu_burger.png')} />
                  </TouchableHighlight>
                </View>
              </View>
              <ScrollView ref={list => this.list = list} scrollEventThrottle={200} onScrollEndDrag={(event)=> {
                
                  this.onScrollChange(event);
                }} style={[{ backgroundColor: '#F4F4F4' }]}>
                {this.props.typeNum === 1 ? (<ProductDetails viewHight={this.state.viewHeight} extendname={this.props.extendname} extendcode={this.props.extendcode} extendwarrant={this.props.extendwarrant} extendwarrantTag={this.props.extendwarrantTag} extendwarrantVal={this.props.extendwarrantVal} changeExtend={this.changeExtendwarrant} changeNum={this.changeNum} cartNum={this.props.cartNum} changeaddress={this.changeaddress} projectDetail={this.projectDetail} popupState={Boolean(this.props.popupState)} onChangepopupState={this.ChangepopupStatetion} inWishlist={this.props.inWishlist} addressMsg={this.reginCode()} addToCart={this.addToCart} product={this.props.productDeailObj} />) : (<ProductDescription />)}
              </ScrollView>
            </View>
            <View style={{ flex: 1}}>
              <View style={[styles.flex,styles.center, styles.fd_row, styles.fd_footer]}>
                <View style={[styles.flex, styles.footLeft, styles.center, styles.row1]}>
                  <TouchableHighlight underlayColor={'transparent'} onPress={() => {this.goHome(); }} style={styles.flex} >
                    <View style={[styles.flex, styles.center, styles.col1]}>
                      <Image style={[styles.icon16, styles.footImg]} source={require('./../../../images/productDetallsImgs/icons/home.png')} />
                      <Text onPress={() => { this.goHome(); }} style={styles.footLeftText}>首页</Text>
                    </View>
                  </TouchableHighlight>
                  <TouchableHighlight underlayColor={'transparent'} onPress={() => { this.addToWishlist(this.props.productDeailObj.code, this.props.productDeailObj.regionCode, this.props.productDeailObj.channelCode, this.props.productDeailObj.productAttribute); }} style={styles.flex}>
                    <View style={[styles.flex, styles.center, styles.col1]}>
                      <Image style={[styles.icon16, styles.footImg]} source={this.props.inWishlist ? require('./../../../images/productDetallsImgs/icons/rn-star.png') : require('./../../../images/productDetallsImgs/icons/rn-star-o.png')} />
                      <Text style={styles.footLeftText}>收藏商品</Text>
                    </View>
                  </TouchableHighlight>
                </View>
                <TouchableHighlight underlayColor={'transparent'} onPress={() => this.addToCart(this.props.productDeailObj.code, this.props.productDeailObj.channelGroup, this.props.cartNum)} style={[styles.flex]}>
                  <View style={[styles.flex, styles.footRight, styles.center, cartStyle, { flexDirection: 'row' }]}>
                    <Text style={[styles.flex, styles.footRightText, cartStyle, cartLoseStyle, styles.center, { alignSelf: 'center' }]}>加入购物车</Text>
                  </View>
                </TouchableHighlight>
              </View>
            </View>
          </View>) : (
            <View style={{ flex: 1 }}>
              <View style={[styles.main]}>
                <View style={[{ position: 'relative', height: 44 }, styles.center, styles.row1, { borderBottomWidth: 0.5, borderBottomColor: shadeBg3 }]}>
                  <View style={[{ left: 5, marginHorizontal: 5 }, styles.center]}>
                    <TouchableHighlight underlayColor={'transparent'} onPress={() => { this.toProductList(); }}>
                      <Image style={styles.imgLeft} source={require('./../../../images/back_icon.png')} />
                    </TouchableHighlight>
                  </View>
                  <View style={[styles.flex, { alignItems: 'center' }]}>
                    <Text style={{ color: color33, fontSize: fontSizeLarge, marginLeft: -10 }}>商品详情</Text>
                  </View>
                </View>
              </View>
              <View style={{ alignItems: 'center', flex: 1, marginTop: 10 }}>
                <Text style={{ color: color66, fontSize: fontSizeMiddle }}>没有商品详情！</Text>
              </View>
            </View>
      )
      }
    </FsRootView>
    );
  }
}
ProductDetailsView.propTypes = {
  typeNum: PropTypes.number,
  dispatch: PropTypes.func,
  productDeailObj: PropTypes.object,
  popupState: PropTypes.bool,
  inWishlist: PropTypes.bool,
  region: PropTypes.object,
  cartNum: PropTypes.number,
  objRegion: PropTypes.object,
  channeldefcode: PropTypes.string,
  productdefAttribute: PropTypes.string,
  defultregion: PropTypes.string,
  extendwarrant: PropTypes.bool,
  extendwarrantTag: PropTypes.array,
  extendwarrantVal: PropTypes.array,
  extendcode: PropTypes.string,
  extendname: PropTypes.string,
};
const mapStateToProps = ({ Details, login }) => {
  const {extendcode, extendname, typeNum, productDeailObj, inWishlist, popupState, region, isChangeChannel, recode, cartNum, channeldefcode, productdefAttribute, defultregion, extendwarrant, extendwarrantTag, extendwarrantVal } = Details;
  const currentRegion = login.region.default;
  const objRegion = {};
  objRegion.province = currentRegion.parent;
  objRegion.city = currentRegion.value;
  return { typeNum, productDeailObj, inWishlist, region, popupState, isChangeChannel, recode, cartNum, objRegion, channeldefcode, productdefAttribute, defultregion, extendwarrant, extendwarrantTag, extendwarrantVal, extendcode, extendname };
};
export default connect(mapStateToProps)(ProductDetailsView);
