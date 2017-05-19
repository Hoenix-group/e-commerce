import React, { Component, PropTypes } from 'react';
import { View, Text, TouchableHighlight, Image, ScrollView, Platform } from 'react-native';
import { Carousel, Popup, Picker, List } from 'antd-mobile';
import AttrChange from './AttrChange';
import ExtendWarrant from './ExtendWarrant';
import styles from './styles';
import { district } from '../../data';
import DeliverArea from './../deliverArea/DeliverArea';
import Util from './../../utils/utils';

let firstPromotion = '';
let popState = false;
let salesState = false;
let changeBox = '';
let clickTag = false;
let openFlag = false;
class ProductDetails extends Component {
  componentWillMount() {
    const productAttr = this.props.product && this.props.product.salesAttributeClasses && this.props.product.salesAttributeClasses.length > 0 && this.props.product.salesAttributeClasses[0].salesAttributes ? this.props.product.salesAttributeClasses : [];
    const colors = [];
    for (let it = 0; it < productAttr.length; it++) {
      for (let y = 0; y < productAttr[it].salesAttributes.length; y++) {
        // 获取当前已选择的
        for (let its = 0; its < productAttr[it].salesAttributes[y].values.length; its++) {
          if (productAttr[it].salesAttributes[y].values[its].isSelected) {
            colors.push(productAttr[it].salesAttributes[y].values[its].value);
          }
        }
      }
    }
    let haschange = '';
    for (let iii = 0; iii < colors.length; iii++) {
      if (iii === 0) {
        haschange += colors[iii];
      } else {
        haschange = `${haschange} , ${colors[iii]}`;
      }
    }
    if (colors.length <= 0) {
      haschange = '请选择商品型号!';
    }
    changeBox = haschange;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.product && nextProps.product.promotions && nextProps.product.promotions[0] && nextProps.product.promotions[0].description !== null) {
      firstPromotion = nextProps.product.promotions[0].description;
      // onChangepopupState(true);
      popState = true;
    } else {
      firstPromotion = '暂无活动';
      // onChangepopupState(false);
      popState = false;
    }
    if (nextProps.product && nextProps.product.salesAttributeClasses && nextProps.product.salesAttributeClasses.length > 0 && nextProps.product.salesAttributeClasses[0].salesAttributes && nextProps.product.salesAttributeClasses[0].salesAttributes[0].values && nextProps.product.salesAttributeClasses[0].salesAttributes[0].values[0].value !== null) {
      salesState = true;
    } else {
      salesState = false;
    }
    const productAttr = nextProps.product && nextProps.product.salesAttributeClasses && nextProps.product.salesAttributeClasses.length > 0 && nextProps.product.salesAttributeClasses[0].salesAttributes ? nextProps.product.salesAttributeClasses : [];
    const colors = [];
    for (let it = 0; it < productAttr.length; it++) {
      for (let y = 0; y < productAttr[it].salesAttributes.length; y++) {
        // 获取当前已选择的
        for (let its = 0; its < productAttr[it].salesAttributes[y].values.length; its++) {
          if (productAttr[it].salesAttributes[y].values[its].isSelected) {
            colors.push(productAttr[it].salesAttributes[y].values[its].value);
          }
        }
      }
    }
    let haschange = '';
    for (let iii = 0; iii < colors.length; iii++) {
      if (iii === 0) {
        haschange += colors[iii];
      } else {
        haschange = `${haschange} , ${colors[iii]}`;
      }
    }
    if (colors.length <= 0) {
      haschange = '请选择商品型号!';
    }
    changeBox = haschange;
    if (clickTag) {
      this.popupShow(2, nextProps);
    }
    if (nextProps.cartNum !== this.props.cartNum && nextProps.product.name) {
      this.popupShow(2, nextProps);
    }
    if (openFlag) {
      this.popupShow(2, nextProps);
    }
  }
    /**
   * 加入购物车
   */
  add(code, that, sum, co) {
    const excode = co || that.extendcode;
    that.addToCart(code, that.product.channelGroup, sum, excode);
    Popup.hide();
    clickTag = false;
    openFlag = false;
    that.onChangepopupState(false);
  }
  changeNum(val, that) {
    that.changeNum(val);
  }
  changeTag(selected, code, that) {
    const productCode = code || that.product.code;
    clickTag = true;
    that.projectDetail(productCode, that.product.regionCode, that.product.channelCode, that.product.productAttribute);
  }
  onChangeregion(val) {
    if (val && val.length > 0) {
      this.props.changeaddress(val[0], val[1]);
      this.props.projectDetail(this.props.product.code, val[1], this.props.product.channelCode, this.props.product.productAttribute);
    }
    this.onClose();
  }
  /**
     * 商品促销弹出框内容
     * @param num: 关闭涂层
     * @returns {XML}
  */
  // 1、促销
  popup(num) {
    const promotionsInfo = [];
    const promotions = this.props.product.promotions ? this.props.product.promotions : [];
    for (let i = 0; i < promotions.length; i++) {
      promotionsInfo.push(
        <View key={i} style={styles.desView}><Text style={styles.desInfo}>{promotions[i].description}</Text></View>,
            );
    }
    return (
      <View style={[styles.closeList, styles.promView]}>
        <View style={[styles.center, styles.row1]}>
          <Image style={{ width: 14, height: 14 }} source={require('./../../../images/productDetallsImgs/icons/rn-warning-circle-o.png')} />
          <Text style={styles.promTitle}>查看促销</Text>
        </View>
        <ScrollView>
          {promotionsInfo.map(elem => elem)}
        </ScrollView>
        {/* 关闭按钮 */}
        <TouchableHighlight style={styles.closeIcon} underlayColor={'rgba(0,0,0,0)'} onPress={() => { this.onClose('cancel', num); }}>
          <Image style={{ width: 12, height: 12 }} source={require('./../../../images/productDetallsImgs/icons/rn-close-s.png')} />
        </TouchableHighlight>
      </View>
    );
  }
    // 3、延保
  yanbao(num) {
    return (
      <View style={[styles.closeList, styles.promView]}>
        <View style={[styles.center, styles.row1]}>
          <Text style={styles.promTitle}>延保</Text>
        </View>
        <ScrollView />
        {/* 关闭按钮 */}
        <TouchableHighlight style={styles.closeIcon} underlayColor={'rgba(0,0,0,0)'} onPress={() => { this.onClose('cancel', num); }}>
          <Image style={{ width: 12, height: 12 }} source={require('./../../../images/productDetallsImgs/icons/rn-close-s.png')} />
        </TouchableHighlight>
      </View>
    );
  }
    // 4、送至
  sendAddress(num) {
    return (
      <View style={[styles.closeList, styles.promView]}>
        <View style={[styles.center, styles.row1]}>
          <Text style={styles.promTitle}>位置</Text>
        </View>
        <ScrollView />
        {/* 关闭按钮 */}
        <TouchableHighlight style={styles.closeIcon} underlayColor={'rgba(0,0,0,0)'} onPress={() => { this.onClose('cancel', num); }}>
          <Image style={{ width: 12, height: 12 }} source={require('./../../../images/productDetallsImgs/icons/rn-close-s.png')} />
        </TouchableHighlight>
      </View>
    );
  }
    // 5、供应商
  taocan(num) {
    return (
      <View style={[styles.closeList, styles.promView]}>
        <View style={[styles.center, styles.row1]}>
          <Text style={styles.promTitle}>供应商</Text>
        </View>
        <ScrollView />
        {/* 关闭按钮 */}
        <TouchableHighlight style={styles.closeIcon} underlayColor={'rgba(0,0,0,0)'} onPress={() => { this.onClose('cancel', num); }}>
          <Image style={{ width: 12, height: 12 }} source={require('./../../../images/productDetallsImgs/icons/rn-close-s.png')} />
        </TouchableHighlight>
      </View>
    );
  }
  /* 关闭弹出层*/
  onClose() {
    clickTag = false;
    openFlag = false;
    Popup.hide();
  }
  /**
   * 显示弹出层（2）
   * @param num：关闭图层
   * @param chooseNum：弹出框类型
   * @returns {*}
   */
  getPopupContent(num, chooseNum) {
    if (chooseNum === 1) {
      return this.popup(num);
    } else if (chooseNum === 3) {
      return this.yanbao(num);
    } else if (chooseNum === 4) {
      return this.sendAddress(num);
    } else if (chooseNum === 5) {
      return this.taocan(num);
    }
    return {};
  }
  componentWillUnmount() {
    Popup.hide();
  }
  popupShow(chooseNum, NewProduct) {
    if (chooseNum === 2) {
      const products = NewProduct ? NewProduct.product : this.props.product;
      const num = NewProduct ? NewProduct.cartNum : this.props.cartNum;
      const newprops = NewProduct || this.props;
      Popup.show(<AttrChange cartNum={num} changeNum={this.props.changeNum} close={this.onClose} add={this.add} changeTag={this.changeTag} projectDetail={this.props.projectDetail} onChangepopupState={this.props.onChangepopupState} addToCart={this.props.addToCart} product={products} extendwarrantflag={newprops.extendwarrant} add={this.add} extendwarrantTag={newprops.extendwarrantTag} extendwarrantVal={newprops.extendwarrantVal} changeExtends={this.props.changeExtend} />, { maskClosable: true, animationType: 'slide-up', onMaskClose: () => { this.onClose(); } });
    } else if (chooseNum === 3) {
      const newprops = NewProduct || this.props;
      const products = NewProduct ? NewProduct.product : this.props.product;
      Popup.show(<ExtendWarrant cartNum={this.props.cartNum} extendwarrantflag={newprops.extendwarrant} add={this.add} extendwarrantTag={newprops.extendwarrantTag} extendwarrantVal={newprops.extendwarrantVal} onChangepopupState={this.props.onChangepopupState} changeExtends={this.props.changeExtend} close={this.onClose} addToCart={this.props.addToCart} product={products} />, { maskClosable: true, animationType: 'slide-up', onMaskClose: () => { this.onClose(); } });
    } else if (chooseNum === 1) {
      Popup.show(this.getPopupContent(1, chooseNum), { maskClosable: true, animationType: 'slide-up', onMaskClose: () => { this.onClose(); } });
    } else if (chooseNum === 4) {
      Popup.show(<DeliverArea cols={2} availableRegions={district} savedRegionArr={[this.props.addressMsg.province, this.props.addressMsg.city]} onChange={this.onChangeregion.bind(this)} onClose={this.onClose} />, { maskClosable: true, animationType: 'slide-up', onMaskClose: () => { this.onClose(); } });
    }
  }
  onClick1(chooseNum) {
    if (chooseNum === 1) {
      this.popupShow(chooseNum);
    } else if (chooseNum === 2) {
      openFlag = true;
      this.popupShow(chooseNum);
    } else if (chooseNum === 3) {
      openFlag = true;
      this.popupShow(chooseNum);
    } else if (chooseNum === 4) {
      this.popupShow(chooseNum);
    }
  }
  changeExtend(extend, extentTag, extendVal, extendcode, extendname, that) {
    that.changeExtend(extend, extentTag, extendVal, extendcode, extendname);
  }
  render() {
    const province = Util.getProvinceByCode(this.props.addressMsg.province).label;
    const city = Util.getCityByCode(this.props.addressMsg.province, this.props.addressMsg.city).label;

    const line = this.props.product.channelGroup ? (this.props.product.channelGroup === 'ONLINE') ? '线上' : '线下' : '线上';
    const iconLine = this.props.product.channelGroup ? (this.props.product.channelGroup === 'ONLINE')
        ? require('./../../../images/productDetallsImgs/icons/iconOnline.jpg')
        : require('./../../../images/productDetallsImgs/icons/iconLine.jpg')
        : require('./../../../images/productDetallsImgs/icons/iconOnline.jpg');
    return (
      <View style={styles.container}>
        <View style={[{ height: 330 }, styles.bgkWrite]}>
          <Carousel selectedIndex={0} infinite>
            {/* <Image style={styles.imgStyle} source={require('./../../../images/productDetallsImgs/carouselImgs/5844f3a1N233450bb_002.jpg')} />*/}
            <Image style={styles.imgStyle} source={require('./../../../images/productImgs/oppo.jpg')} />
            <Image style={styles.imgStyle} source={require('./../../../images/productDetallsImgs/carouselImgs/5844f3c4N0ff46810.jpg')} />
            <Image style={styles.imgStyle} source={require('./../../../images/productDetallsImgs/carouselImgs/5844f3cbN2277ad4d.jpg')} />
            <Image style={styles.imgStyle} source={require('./../../../images/productDetallsImgs/carouselImgs/5844f3a1N233450bb_002.jpg')} />
            <Image style={styles.imgStyle} source={require('./../../../images/productDetallsImgs/carouselImgs/5844f3c4N0ff46810.jpg')} />
          </Carousel>
        </View>
        <View style={[styles.proTitle, styles.bgkWrite]}>
          {
            Platform.OS === 'android' ? (
              <View style={[styles.paddL, { flex: 1, flexDirection: 'row' }]}>
                <Text numberOfLines={2} style={styles.contitle}>
                  {/* <Text style={[styles.online, styles.onlineViewAndroid,{backgroundColor:'red',width:50}]}>{line}</Text>*/}
                  <Image style={{ width: 38, height: 20 }} source={iconLine} />
                  <Text>{this.props.product.name}</Text>
                </Text>
              </View>
              ) :
              (<View style={styles.paddL}>
                <Text numberOfLines={2} style={[styles.tStyle]}>
                  <View style={[styles.onlineView, { paddingLeft: 2 }]}>
                    <Text style={styles.online}>{line}</Text>
                  </View>
                  <Text>{this.props.product.name}</Text>
                </Text>
              </View>)
          }
        </View>
        <View style={[styles.h35, styles.contentLR, styles.row1, styles.paddL, styles.bgkWrite]}>
          <Text style={[styles.price]}>¥{Util.toDecimal2(this.props.product.salesPrice)}</Text>
          <Text style={[styles.saleNum]}>累计销售: {this.props.product.salesVolume}</Text>
        </View>
        <View>
          <TouchableHighlight underlayColor={'rgba(0,0,0,0)'} onPress={() => { this.onClick1(1); }} style={[styles.marTB, { backgroundColor: '#ffffff' }]}>
            <View style={[styles.h30, styles.borderTB, styles.contentLR, styles.row1]}>
              <View style={[styles.left1, styles.row1, styles.paddL]}>
                <Text style={[styles.smallInfo]}>促销:</Text>
                <Text style={[styles.smallInfo2]}>{firstPromotion}</Text>
              </View>
              <Image style={styles.arrowIcon} source={require('./../../../images/productDetallsImgs/icons/rn-chevron-right.png')} />
            </View>
          </TouchableHighlight>

          <TouchableHighlight underlayColor={'rgba(0,0,0,0)'} onPress={() => { this.onClick1(2); }} style={[styles.marTB]}>
            <View style={[styles.borderB, styles.contentLR, styles.row1, styles.bgkWrite, { minHeight: 30, alignItems: 'center' }]}>
              <View style={[styles.left2, styles.row1, styles.paddL, { paddingVertical: 14 }]}>
                <Text style={[styles.smallInfo]}>已选:</Text>
                <View style={[styles.left1, styles.row1]}>
                  <View style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                    <Text style={[styles.smallInfo2]}>{changeBox}</Text>
                    { this.props.extendname === '无延保' || this.props.extendname === '未选择' ? (null) : (<Text style={[styles.smallInfo2, { paddingTop: 8 }]}>{this.props.extendname}</Text>) }
                  </View>
                </View>
              </View>
              <Image style={[styles.arrowIcon, { marginTop: 0 }]} source={require('./../../../images/productDetallsImgs/icons/rn-chevron-right.png')} />
            </View>
          </TouchableHighlight>

          {/* <TouchableHighlight underlayColor={'rgba(0,0,0,0)'} onPress={() => { this.onClick1(3); }} style={[styles.marTB]}>
            <View style={[styles.h30, styles.borderB, styles.contentLR, styles.row1, styles.bgkWrite]}>
              <View style={[styles.left1, styles.row1, styles.paddL]}>
                <Text style={[styles.smallInfo]}>延保:</Text>
                <Text style={[styles.smallInfo2]}>{this.props.extendname}</Text>
              </View>
              <Image style={styles.arrowIcon} source={require('./../../../images/productDetallsImgs/icons/rn-chevron-right.png')} />
            </View>
          </TouchableHighlight>*/}
          <View style={[styles.marTB]}>
            <Picker extra="请选择地区" data={district} cols={2} title="选择地区" triggerType="onClick" value={[this.props.addressMsg.province, this.props.addressMsg.city]} onChange={(val) => { this.onChangeregion(val); }}>
              <TouchableHighlight ref={(addressPicker) => { this.addressPicker = addressPicker; }} underlayColor={'rgba(0,0,0,0)'} onPress={() => { if (this.addressPicker.props.onClick) { this.addressPicker.props.onClick(); } }}>
                <View style={[styles.h30, styles.borderTB, styles.contentLR, styles.row1, styles.bgkWrite]}>
                  <View style={[styles.left1, styles.row1, styles.paddL]}>
                    <Text style={[styles.smallInfo]}>送至:</Text>
                    <Text numberOfLines={1} style={[styles.smallInfo2]}>{`${province} ${city}`}</Text>
                  </View>
                  <Image style={styles.arrowIcon} source={require('./../../../images/productDetallsImgs/icons/rn-chevron-right.png')} />
                </View>
              </TouchableHighlight>
            </Picker>
          </View>
          {/* <TouchableHighlight underlayColor={'rgba(0,0,0,0)'} onPress={() => { this.onClick1(4); }}>
            <View style={[styles.h30, styles.borderTB, styles.contentLR, styles.row1, styles.bgkWrite, { marginTop: 10 }]}>
              <View style={[styles.left1, styles.row1, styles.paddL]}>
                <Text style={[styles.smallInfo]}>送至:</Text>
                <Text numberOfLines={1} style={[styles.smallInfo2]}>{`${province} ${city}`}</Text>
              </View>
              <Image style={styles.arrowIcon} source={require('./../../../images/productDetallsImgs/icons/rn-chevron-right.png')} />
            </View>
          </TouchableHighlight>*/}
          {/* <Picker extra="请选择地区" data={district} cols={2} title="选择地区" value={[this.props.addressMsg]} onChange={(val) => { this.onChangeregion(val); }}>
            <TouchableHighlight underlayColor={'rgba(0,0,0,0)'} >
              <View style={[styles.h30, styles.contentLR, styles.row1, styles.bgkWrite]}>
                <View style={[styles.left1, styles.row1, styles.paddL]}>
                  <Text style={[styles.smallInfo]}>送至:</Text>
                  <Text style={[styles.smallInfo2]}>{this.props.addressMsg}</Text>
                </View>
                <Image style={styles.arrowIcon} source={require('./../../../images/productDetallsImgs/icons/rn-chevron-right.png')} />
              </View>
            </TouchableHighlight>
            <List.Item arrow="horizontal" wrap>送至:</List.Item>
          </Picker>*/}
          {/* {this.props.product.manufacturer} C店入驻前标注为五星自营*/}
          <TouchableHighlight underlayColor={'rgba(0,0,0,0)'} onPress={() => { this.onClick1(5); }}>
            <View style={[styles.h30, styles.borderTB, styles.contentLR, styles.row1, styles.bgkWrite, { marginTop: 10 }]}>
              <View style={[styles.left1, styles.row1, styles.paddL]}>
                <Text style={[styles.smallInfo]}>供应商:</Text>
                <Text style={[styles.smallInfo2]}>五星自营</Text>
              </View>
              <Image style={styles.arrowIcon} source={require('./../../../images/productDetallsImgs/icons/rn-chevron-right.png')} />
            </View>
          </TouchableHighlight>
          {/* <View style={[styles.borderB, { height: 30 }]}>
                  <View style={[styles.paddL, styles.left1, styles.row1]}>
                  <View style={[styles.smallInfo3, styles.left1, styles.row1]}>
                  <Image style={[styles.arrowIcon, styles.circleIcon]} source={require('./../../../images/productDetallsImgs/icons/rn-check-circle.png')} />
                  <Text style={styles.infoText}>五星配送 & 售后</Text>
                  </View>
                  <View style={[styles.smallInfo3, styles.left1, styles.row1]}>
                  <Image style={[styles.arrowIcon, styles.circleIcon]} source={require('./../../../images/productDetallsImgs/icons/rn-check-circle.png')} />
                  <Text style={styles.infoText}>七天退换货</Text>
                  </View>
                  <View style={[styles.smallInfo3, styles.left1, styles.row1]}>
                  <Image style={[styles.arrowIcon, styles.circleIcon]} source={require('./../../../images/productDetallsImgs/icons/rn-check-circle.png')} />
                  <Text style={styles.infoText}>免费安装</Text>
                  </View>
                  </View>
                  </View>*/}

          {/* 上拉加载 */}
          <TouchableHighlight underlayColor={'rgba(0,0,0,0)'} style={styles.flex} onPress={() => { }}>
            <View style={[styles.loadMoreView, styles.rowCenter]}>
              <Image style={[styles.arrowUp]} source={require('./../../../images/productDetallsImgs/icons/rn-chevron-up.png')} />
              <Text style={[styles.conText]}>上拉查看详细图文</Text>
            </View>
          </TouchableHighlight>
          <View style={{ height: this.props.viewHight }} />
        </View>
      </View>
    );
  }
}
ProductDetails.propTypes = {
  onChangepopupState: PropTypes.func,
  projectDetail: PropTypes.func,
  changeaddress: PropTypes.func,
  addressMsg: PropTypes.object,
  addToCart: PropTypes.func,
  changeNum: PropTypes.func,
  product: PropTypes.object,
  cartNum: PropTypes.number,
  changeExtend: PropTypes.func,
  extendname: PropTypes.string,
  extendcode: PropTypes.string,
  viewHight: PropTypes.number,
};
export default ProductDetails;
