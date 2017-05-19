import React, { PropTypes, Component } from 'react';
import { View, Text, Image, TouchableHighlight } from 'react-native';
import { connect } from 'dva/mobile';
import { Popover, List, Flex } from 'antd-mobile';
import styles from './styles';

const Item = Popover.Item;
let isDesc = 0;
let isshow = false;
// 更改上拉下拉箭头
let arrow_temp = require('./../../../images/productDetallsImgs/icons/tab_donw_choose.png');
let arrow_temp2 = require('./../../../images/productDetallsImgs/icons/tab_down.png');
let channelstate = '';
let styleState = '';

class tabs extends Component {
  componentWillUnmount() {
    isDesc = 0;
    isshow = false;
    // 更改上拉下拉箭头
    arrow_temp = require('./../../../images/productDetallsImgs/icons/tab_donw_choose.png');
    arrow_temp2 = require('./../../../images/productDetallsImgs/icons/tab_down.png');
    channelstate = '';
    styleState = '';
    this.closeShow();
    this.props.dispatch({
      type: 'ProductListTabs/cleanType',
    });
  }
  getSeller = () => {
    const id = this.props.hotTag;
    const sell = id === '3' ? 'AFTER_SALE' : '';
    return sell;
  }
  getProductAttribute = () => {
    const id = this.props.hotTag;
    let proAttr = '';
    switch (id) {
      case '0':
        proAttr = 'NORMAL';
        break;
      case '1':
        proAttr = 'SPECIALPRICE';
        break;
      case '2':
        proAttr = 'GIFT';
        break;
      case '4':
        proAttr = 'UNDERWRITE';
        break;
      case '5':
        proAttr = 'CUSTOMIZE';
        break;
      case '6':
        proAttr = 'PROJECT';
        break;
      case '7':
        proAttr = 'FSSAMPLE';
        break;
      case '8':
        proAttr = 'SAMPLE';
        break;
      case '9':
        proAttr = 'REPAIR';
        break;
      case '10':
        proAttr = 'SPECIALPRICEREPAIR';
        break;
      case '11':
        proAttr = 'UNDERWRITEREPAIR';
        break;
      case '12':
        proAttr = 'CUSTOMIZEREPAIR';
        break;
      case '13':
        proAttr = 'PROJECTREPAIR';
        break;
      default:
        break;
    }
    return proAttr;
  }
  changechannel = (channelVal) => {
    isshow = false;
    arrow_temp = require('./../../../images/productDetallsImgs/icons/tab_donw_choose.png');
    this.props.dispatch({
      type: 'Search/changeOpen',
      channel: channelVal,
      open: isshow,
    });
    this.props.dispatch({
      type: 'Search/cleanProductList',
    });
    this.props.dispatch({
      type: 'Search/loadMore',
      searchValue: this.props.searchVal,
      currentPage: 0,
      pageSize: 10,
      productAttribute: this.getProductAttribute(),
      seller: this.getSeller(),
      channel: channelVal,
      maxSalesPrice: this.props.maxPrice,
      minSalesPrice: this.props.minPrice,
      attr: this.props.productAttr,
      order: this.props.order,
    });
    channelstate = channelVal;
    this.change(0);
  }
  onSubmit = (minSalesPrice, maxSalesPrice, attr) => {
    const minprice = minSalesPrice ? minSalesPrice : 0;
    const maxprice = maxSalesPrice ? maxSalesPrice : '';
    this.props.dispatch({
      type: 'Search/cleanProductList',
    });
    this.props.dispatch({
      type: 'Search/loadMore',
      searchValue: this.props.searchVal,
      currentPage: 0,
      pageSize: 10,
      productAttribute: this.getProductAttribute(),
      seller: this.getSeller(),
      channel: this.props.channel,
      attr,
      minSalesPrice: minprice,
      maxSalesPrice: maxprice,
      order: this.props.order,
    });
  }
  change = (key) => {
    this.props.dataListScrollTop();
    if (key === 1) {
      arrow_temp2 = require('./../../../images/productDetallsImgs/icons/tab_down.png');
      if (isshow) {
        isshow = false;
        arrow_temp = require('./../../../images/productDetallsImgs/icons/tab_donw_choose.png');
      } else {
        isshow = true;
        arrow_temp = require('./../../../images/productDetallsImgs/icons/tab_up_choose.png');
      }
      this.props.dispatch({
        type: 'Search/changeOpen',
        open: isshow,
      });
    } else if (key === 2) {
      arrow_temp = require('./../../../images/productDetallsImgs/icons/tab_down.png');
      let pordrt = 'salesPrice desc';
      if (isDesc === 0) {
        pordrt = 'salesPrice asc';
        isDesc = 1;
        arrow_temp2 = require('./../../../images/productDetallsImgs/icons/tab_up_choose.png');
      } else {
        pordrt = 'salesPrice desc';
        isDesc = 0;
        arrow_temp2 = require('./../../../images/productDetallsImgs/icons/tab_donw_choose.png');
      }
      if (isshow) {
        isshow = false;
        this.props.dispatch({
          type: 'Search/changeOpen',
          open: isshow,
        });
      }
      this.props.dispatch({
        type: 'Search/cleanProductList',
      });
      this.props.dispatch({
        type: 'Search/loadMore',
        searchValue: this.props.searchVal,
        currentPage: 0,
        pageSize: 10,
        channel: this.props.channel,
        productAttribute: this.getProductAttribute(),
        seller: this.getSeller(),
        order: pordrt,
        maxSalesPrice: this.props.maxPrice,
        minSalesPrice: this.props.minPrice,
        attr: this.props.productAttr,
      });
    } else if (key === 3) {
      arrow_temp = require('./../../../images/productDetallsImgs/icons/tab_down.png');
      arrow_temp2 = require('./../../../images/productDetallsImgs/icons/tab_down.png');
      this.closeShow();
      this.props.funcFilter();
      // const funcFilter =this.props.funcFilter;
      // funcFilter();
      // this.filter.alert();
    }
    this.props.dispatch({
      type: 'ProductListTabs/changeType',
      tabsNum: key,
    });
  }
  
  /**
   * 关闭弹出层
   */
  closeShow = () => {
    isshow = false;
    arrow_temp = require('./../../../images/productDetallsImgs/icons/tab_donw_choose.png');
    this.props.dispatch({
      type: 'Search/changeOpen',
      open: isshow,
    });
    this.change(0);
  }
  render() {
    /* 更改 tab标签页选中状态 */
    if(this.props.tabsNum === 1){
      // styleActive=styles.active1;
      styleActive=styles.active;
    }else{
      styleActive=styles.active2;
      arrow_temp = require('./../../../images/productDetallsImgs/icons/tab_down.png');
    }
    const styleActive2 = (this.props.tabsNum === 2 ? styles.active : {});
    const styleActive3 = (this.props.tabsNum === 3 ? styles.active : {});
    const styleColor = (this.props.tabsNum === 0 || this.props.tabsNum === 1 ? styles.tabColor : {});
    const styleColor2 = (this.props.tabsNum === 2 ? styles.tabColor : {});
    const styleColor3 = (this.props.tabsNum === 3 ? styles.tabColor : {});
    channelstate = this.props.channel;
    let name = '销售渠道';
    if (channelstate === "") {
      name = '全部渠道';
    } else if(channelstate === "ONLINE") {       
      name = '线上渠道';
    }else if(channelstate === "OFFLINE") {
      name = '线下渠道';    
    }
    return(
      <View>
      <View style={[styles.main]}>
        <View style={[styles.row1, styles.tab]}>

          <TouchableHighlight underlayColor={'rgba(0,0,0,0)'} onPress={() => this.change(1)} style={[styles.flex]}>
            <View style={[styles.flex, styles.tagView1, styleActive, styles.row1,{justifyContent: 'center', flexDirection: 'row',alignItems: 'flex-start'}]}>
              <Text numberOfLines={1} style={[styles.tabs, styles.tabFont, styleColor, styles.tabFontDown]}>{name.trim()}</Text>
              {/*<Image style={[styles.tabImg, styles.tabImgDown]} source={arrow_temp} />*/}
            </View>
          </TouchableHighlight>

          <TouchableHighlight underlayColor={'rgba(0,0,0,0)'} onPress={() => this.change(2)} style={[styles.flex]}>
            <View style={[styles.flex, styles.tabView, styleActive2, styles.center, styles.row1]}>
              <Text numberOfLines={1} style={[styles.tabs, styles.tabFont, styleColor2, styles.center]}>价格</Text>
              <Image style={styles.tabImg} source={arrow_temp2} />
            </View>
          </TouchableHighlight>

          <View style={[styles.flex, styles.tabView, styleActive3, styles.center, styles.row1]}>
            <TouchableHighlight underlayColor={'rgba(0,0,0,0)'} onPress={() => this.change(3)} style={[styles.flex]}>
              <Text numberOfLines={1} style={[styles.tabs, styles.tabFont, styleColor3, styles.center]}>筛选</Text>
            </TouchableHighlight>
          </View>
        </View>
        {
          this.props.open ? (
            <TouchableHighlight underlayColor={'rgba(0,0,0,0)'} onPress={() => { this.closeShow(); }}>
              <View style={styles.isopen}>
                <View>
                  <List style={{ backgroundColor: 'pink', borderTopColor: '#fff'}}>
                    <List.Item id="1" onClick={() => { this.changechannel(''); }} style={{borderTopColor: '#fff'}}>
                      <Flex>
                        <Flex.Item style={{ flex: 8 }} onPress={() => { this.changechannel(''); }} >
                          <Text numberOfLines={1} style={[styleState = (channelstate === '' || !channelstate ? styles.tabActive : {}),styles.fontLarge,{paddingLeft:15}]}>全部渠道</Text>
                        </Flex.Item>
                        {
                          channelstate === '' || !channelstate ? (<Flex.Item><Image style={styles.icon} source={require('./../../../images/productDetallsImgs/icons/choose.png')} /></Flex.Item>) : (null)
                        }
                      </Flex>
                    </List.Item>
                    <List.Item id="2" onClick={() => { this.changechannel('ONLINE'); }} >
                      <Flex>
                        <Flex.Item style={{ flex: 8 }} onPress={() => { this.changechannel('ONLINE'); }}>
                          <Text numberOfLines={1} style={[styleState = (channelstate === 'ONLINE' ? styles.tabActive : {}),styles.fontLarge,{paddingLeft:15}]}>线上渠道</Text>
                        </Flex.Item>
                        {
                          channelstate === 'ONLINE' ? (<Flex.Item><Image style={styles.icon} source={require('./../../../images/productDetallsImgs/icons/choose.png')} /></Flex.Item>) : (null)
                        }
                      </Flex>
                    </List.Item>
                    <List.Item onClick={() => { this.changechannel('OFFLINE'); }}>
                      <Flex>
                        <Flex.Item style={{ flex: 8 }} onPress={() => { this.changechannel('OFFLINE'); }}>
                          <Text numberOfLines={1} style={[styleState = (channelstate === 'OFFLINE' ? styles.tabActive : {}),styles.fontLarge,{paddingLeft:15}]}>线下渠道</Text>
                        </Flex.Item>{
                        channelstate === 'OFFLINE' ? (<Flex.Item><Image style={styles.icon} source={require('./../../../images/productDetallsImgs/icons/choose.png')} /></Flex.Item>) : (null)
                      }
                      </Flex>
                    </List.Item>
                  </List>
                </View>
              </View></TouchableHighlight>) : (null)
        }
      </View>
      {/*// <Filter*/}
      {/*//   ref={filter => this.filter = filter}*/}
      {/*//   closeInterval={0}*/}
      {/*//   onClose={data => this.onClose(data)}*/}
      {/*//   onCancel={data => this.onClose(data)}*/}
      {/*//   showCancel={Boolean(true)}*/}
        {/*facets={facets}*/}
        {/*onSubmit={onSubmit}*/}
      {/*/>*/}
    </View>
    );
  }
}
tabs.propTypes = {
  dispatch: PropTypes.func,
  order: PropTypes.string,
  hotTag: PropTypes.string,
  searchVal: PropTypes.string,
  open: PropTypes.bool,
  tabsNum: PropTypes.number,
  facets: PropTypes.array,
  funcFilter: PropTypes.func,
  minPrice: PropTypes.string,
  maxPrice: PropTypes.string,
  productAttr: PropTypes.object,
  channel: PropTypes.string,
};
const mapStateToProps = ({ Search, ProductListTabs }) => {
  const { order, channel, facets, searchVal, hotTag, open, minPrice, maxPrice, productAttr} = Search;
  const { tabsNum } = ProductListTabs;
  return { order, channel, tabsNum, facets, searchVal, hotTag, open, minPrice, maxPrice, productAttr};
};
export default connect(mapStateToProps)(tabs);
