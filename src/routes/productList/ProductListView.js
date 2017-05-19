import React, { Component, PropTypes } from 'react';
import { connect } from 'dva/mobile';
import { ListView, View, Text, TouchableHighlight, Image, Platform, InteractionManager, Dimensions, ScrollView, TextInput, BackAndroid } from 'react-native';
import { SearchBar, List, Flex, Stepper, Checkbox, Toast } from 'antd-mobile';
import { Actions } from 'react-native-router-flux';
import Tabs from './tabs';
import styles from './styles';
import FsSearchBar from './../../components/fsSearchBar/FsSearchBar';
import FsRootView from './../../components/common/FsRootView';
import { shadeBg, WarningBarText, WarningBarView, WarningBarImage } from './../../themes/fsBaseStyles';
import FsDrawerLayout from './fsDrawerLayout';
import Filter from './filter';
import Util from './../../utils/utils';

let fsDrawerLayout;
let dataListScroll;
const funcFilter = () => {
  fsDrawerLayout.openDrawer();
};
const closeFilter = () => {
  fsDrawerLayout.closeDrawer();
};
const scrollTop = () => {
  if (Platform.OS === 'android') {
    dataListScroll.scrollTo({ x: 0, y: 0 }); // 改变过滤条件时，回到list顶部，避免新数据的长度小于原数据，出现屏幕空白的现象
  }
}

class ProductListView extends Component {
  constructor() {
    super();
    this.state={
      showSearch: true,
    }
    
  }
  componentWillMount() {
    InteractionManager.runAfterInteractions(()=>{
      this.props.dispatch({
        type: 'Search/cleanProductList',
      });
      this.props.dispatch({
        type: 'Search/loadMore',
        searchValue: this.props.searchValue,
        currentPage: this.props.currentPage,
        pageSize: this.props.pageSize,
        productAttribute: this.getProductAttribute(),
        seller: this.getSeller(),
        channel: this.props.channel,
      });
      this.props.dispatch({
        type: 'Search/chageFirst',
        firstload: 1
      });
      this.props.dispatch({
        type: 'Search/saveHistory',
        searchValue: this.props.searchValue,
        hotTag: this.props.hotTag,
      });
    })
    // BackAndroid.addEventListener('hardwareBackPress', this.onBackAndroid);
  }
  componentWillUnmount() {
    this.props.dispatch({
      type: 'Search/cleanProductList',
      channel: true,
    });
    // BackAndroid.removeEventListener('hardwareBackPress', this.onBackAndroid);
  }
  getSeller = () => {
    const id = this.props.hotTag;
    const sell = id === '3' ? 'AFTER_SALE' : '';
    return sell;
  }

  // onBackAndroid = () => {
  //   this.backHandler();
  //   return true;
  // }

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

  onEndReached = () => {
    Util.consoleLog('进来就走了啊。。。。------------------', this.props.channel);
    if (this.props.isEnd) {
      return;
    }
    this.props.dispatch({
      type: 'Search/loadMore',
      searchValue: this.props.searchValue,
      currentPage: this.props.currentPage + 1,
      pageSize: this.props.pageSize,
      productAttribute: this.getProductAttribute(),
      seller: this.getSeller(),
      channel: this.props.channel,
      order: this.props.order,
      attr: this.props.productAttr,
      minSalesPrice: this.props.minPrice,
      maxSalesPrice: this.props.maxPrice,
    });
  }


  toDetail = (sectionID, rCode, channelCode, productAttribute) => {
    Actions.productDetailsView({ from: 'productList' });
    InteractionManager.runAfterInteractions(()=>{
      this.props.dispatch({
        type: 'Details/queryProductDeail',
        productCode: sectionID,
        regionCode: rCode,
        channel: channelCode,
        product: productAttribute,
      });
    });
  }

  backHandler = () => {
    // this.props.dispatch({
    //   type: 'Search/cleanProductList',
    //   channel: true,
    // });
    // this.props.dispatch({
    //   type: 'Search/gethistory',
    // });
    // Actions.pop({popNum: 2});
    Actions.pop();
  }
  // 回车键监听
  productData = (value) => {
    const val = value  ? value : this.props.searchValue;
    if (val && val.trim().length > 0) {
      this.props.dispatch({
        type: 'Search/cleanProductList',
      });
      this.props.dispatch({
        type: 'Search/loadMore',
        searchValue: val.trim(),
        currentPage: 0,
        pageSize: 10,
        productAttribute: this.getProductAttribute(),
        seller: this.getSeller(),
        channel: this.props.channel,
      });
      this.props.dispatch({
        type: 'Search/saveHistory',
        searchValue: this.props.searchValue,
        hotTag: this.props.hotTag,
      });
    }
  }
  onChange = (value) =>  {
    if (value.trim().length > 0) {
      this.props.dispatch({
        type: 'Search/queryList',
        searchVal: value,
        showCancelButton: true,
        productAttribute: this.getProductAttribute(),
        seller: this.getSeller(),
        channel: this.props.channel,
      });
    } else {
      this.props.dispatch({
        type: 'Search/changeVal',
        showCancelButton: true,
        searchVal: '',
      });
      this.props.dispatch({
        type: 'Search/cleanSearchList',
        showCancelButton: true,
      });
    }
  }
  clear = () => {
    this.props.dispatch({
      type: 'Search/changeVal',
      showCancelButton: true,
      searchVal: '',
    });
    this.props.dispatch({
      type: 'Search/cleanSearchList',
      showCancelButton: true,
    });
  }
  // 关闭列表显示
  onCancel =() => {
    this.props.dispatch({
      type: 'Search/changeButton',
      showCancelButton: false,
    });
  }
  queryList = (datalist) => {
    const data = [];
    datalist.map((item) => {
      data.push(
        <List.Item onClick={() => { this.productData(item.value); }} key={item.value}>{item.value}</List.Item>,
      );
    });
    return data;
  }
  onFocus = () => {
    this.props.dispatch({
      type: 'Search/queryList',
      searchVal: this.props.searchValue.trim(),
      showCancelButton: true,
      productAttribute: this.getProductAttribute(),
      seller: this.getSeller(),
      channel: this.props.channel,
    });
  }
  getAttributeValues = (data) => {
    // const data = [
    //             "哑光金",
    //             "3G64G"
    //         ];
    const datas = [];
    if (data) {
      data.map((items, index) => {
        datas.push(<Text key={index} style={[styles.tagStyle, styles.tagBg, styles.ImgLeft]}>{items}</Text>);
      }
      );
    }
    return datas;
  }

  getGiftDS(){
    const {ds, targetGift, productListVal} = this.props;
    if(!ds){
      return ds;
    }

    let newDs = ds;
    if(ds && targetGift && productListVal.length > 0){
      const array = productListVal.map((item)=>{
        if(item.code === targetGift){
          return {...item};
        }
        return item;
    });
      newDs = ds.cloneWithRows(array);
    }

    return newDs;
  }

  renderChecked(code, channelCode){
    if(!this.props.giftSelection){
      return false;
    }

    const array =  this.props.giftSelection.filter((item) => { return (item.code === code) && (item.channelCode === channelCode); });
    if(array.length > 0){
      return true;
    }

    return false;
  }

  renderQty(code, channelCode){
    if(!this.props.giftSelection){
      return 1;
    }

    const array =  this.props.giftSelection.filter((item) => { return (item.code === code) && (item.channelCode === channelCode); });
    if(array.length > 0){
      return array[0].qty;
    }

    return 1;
  }

  selectGift(event, code, price, channelCode) {
    const checked = event.target.checked;
    const { dispatch, giftTotalPrice, giftTotalQty, totalPriceLimit, totalQtyLimit } = this.props;
    if(checked && ((giftTotalQty + 1) > totalQtyLimit || (giftTotalPrice + price) > totalPriceLimit )){
      return;
    }

    dispatch({ type: 'myCart/changeGiftSelection', code, isSelect: checked, price, channelCode });
  }

  updateGiftQty(code, qty, price, channelCode) {
    if(!qty){
      return;
    }
    
    const { dispatch, giftTotalPrice, giftTotalQty, totalPriceLimit, totalQtyLimit } = this.props;
    dispatch({ type: 'myCart/changeGiftQty', code, qty, price, totalQtyLimit, totalPriceLimit, channelCode });
  }

  confirmGift() {
    const {giftSelection, confirmCallback } = this.props;
    if(!giftSelection || giftSelection.length === 0) {
      Toast.info('请选择赠品');
      return;
    }
    if(confirmCallback){
      confirmCallback(giftSelection);
    }
  }

  renderRow = (_rowData, sectionID, rowID) => {

    const numIcon = [];
    const pruState = [];

    if (_rowData.stock <= 0) {
      pruState.push(<Text key={rowID} style={styles.empty}>无货</Text>);
    } else if (_rowData.stock > 0 && _rowData.stock < 10) {
      pruState.push(<Text key={rowID} style={styles.notEmpty}>有货</Text>);
      numIcon.push(<Text key={sectionID} style={styles.num}>{_rowData.stock}</Text>);
    } else if (_rowData.stock >= 10 && _rowData.stock < 100) {
      pruState.push(<Text key={rowID} style={styles.notEmpty}>有货</Text>);
      numIcon.push(<Text key={sectionID} style={[styles.num, { width: 22 }]}>{_rowData.stock}</Text>);
    } else if (_rowData.stock >= 100) {
      pruState.push(<Text key={rowID} style={styles.notEmpty}>有货</Text>);
      numIcon.push(<Text key={sectionID} style={[styles.num, { width: 26 }]}>99+</Text>);
    }
    return (<View key={rowID} style={styles.flex}>
      <TouchableHighlight
        underlayColor={'transparent'}
        style={[{ flex:1,padding: 0, backgroundColor: 'white' }]}
        onPress={ () => {this.props.checkoutGift ? (null) : this.toDetail(_rowData.code, _rowData.regionCode, _rowData.channelCode, _rowData.productAttribute);} }
      >
        <View style={styles.flex}>
          <View style={[{ flexDirection: 'row'},styles.flex,styles.end1]}>
            {this.props.checkoutGift ? 
            (<Checkbox onChange={(event) => this.selectGift(event, _rowData.code, _rowData.salesPrice, _rowData.channelCode)} checked={this.renderChecked(_rowData.code, _rowData.channelCode)}>
            </Checkbox>)
            :(null)}
            <Image style={styles.image} source={require('./../../../images/productDetallsImgs/carouselImgs/5844f3a1N233450bb_002.jpg')} />
            <View style={[styles.producView, { flex: 2 }]}>
              <Text numberOfLines={2} key={rowID} style={styles.producTitle}>{_rowData.name}</Text>
              <View style={[styles.proFlex, styles.left1, styles.row1]}>
                <View style={[ styles.row1]}>
                  {/*<Text style={styles.tagStyle}>{_rowData.salesAttributeValues}</Text>*/}
                  <Text style={styles.tagStyle}></Text>
                  {this.getAttributeValues(_rowData.salesAttributeValues)}
                </View>
                {/*{productAttrs.map(elem => elem)}*/}
              </View>
              <View style={[{height:35},styles.contentLR,styles.row1,styles.container]}>
                <View style={{flex:2.5}}>
                  <Text style={styles.price}>¥{Util.toDecimal2(_rowData.salesPrice)}</Text>
                </View>
                <View style={[{flex:4},styles.end1,styles.row1]}>
                  <View style={[styles.numView, styles.center]}>
                    <View style={[styles.onlineBg, styles.center]}>
                      <Text style={styles.online}>{_rowData.channelGroup === 'ONLINE' ? '线上' : '线下'}</Text>
                    </View>
                    {/*{numIcon.map(elem => elem)}*/}
                  </View>
                  <View style={[styles.row1,{height: 35}]}>
                    {pruState.map(elem => elem)}
                  </View>
                </View>
                {this.props.checkoutGift ?
                ( <View style={{flex:3.5,marginLeft:5}}>
                  <Stepper
                    readOnly={false}
                    max={5}
                    min={1}
                    defaultValue={this.renderQty(_rowData.code, _rowData.channelCode)}
                    value={this.renderQty(_rowData.code, _rowData.channelCode)}
                    onChange={(qty) => { this.updateGiftQty(_rowData.code, qty, _rowData.salesPrice, _rowData.channelCode); }}
                    keyboardType="numeric"
                    inputStyle={Platform.OS === 'android' ? { top: 0, flex: 1, height: 40, alignSelf: 'center', paddingTop: 6 } : {}}
                  />
                </View>)
                  :(null)}

              </View>
            </View>
          </View>
        </View>

      </TouchableHighlight>
    </View>);
  }

  onSubmit = (minSalesPrice, maxSalesPrice, attr) => {
    const minprice = minSalesPrice ? minSalesPrice : this.props.minPrice;
    const maxprice = maxSalesPrice ? maxSalesPrice : this.props.maxPrice;
    const att = !attr ? this.props.productAttr : attr;
    this.props.dispatch({
      type: 'Search/cleanProductList',
    });
    this.props.dispatch({
      type: 'Search/defMsg',
      attr: att,
      minSalesPrice: minprice,
      maxSalesPrice: maxprice,
    });
    this.props.dispatch({
      type: 'Search/loadMore',
      searchValue: this.props.searchValue,
      currentPage: 0,
      pageSize: 10,
      productAttribute: this.getProductAttribute(),
      seller: this.getSeller(),
      channel: this.props.channel,
      attr: att,
      minSalesPrice: minprice,
      maxSalesPrice: maxprice,
      order: this.props.order,
    });
  }
  onScrollChange = (event) => {
    if (this.props.checkoutGift) {

    }else {
      if(this.state.showSearch && event.nativeEvent.contentOffset.y > Dimensions.get('window').height / 2 + 10) {
        this.setState({
          showSearch: false,
        })
      }else if (!this.state.showSearch && event.nativeEvent.contentOffset.y <= 0) {
        this.setState({
          showSearch: true,
        })
      }
    }
    
  }
  /**
   * 抽屉
   */
  render(){
    // FsDrawerLayout 参数
    const renderFun = (

    <View style={{ height: Dimensions.get('window').height }}>
      <FsRootView isNavBarHidden>
        {this.state.showSearch ? (<View style={{ flexDirection: 'row', backgroundColor: shadeBg }}>
        <TouchableHighlight underlayColor={'transparent'} style={[styles.center]} onPress={ () => {this.backHandler();} }>
          <View style={[styles.ImgLeft, { left: 5 }]}>
            <Image style={styles.imgLeft} source={require('./../../../images/back_icon.png')} />
          </View>
        </TouchableHighlight>
        <View style={{ flex: 1 }} >
          <FsSearchBar  placeholder="搜索" clear={this.clear} onFocus={this.onFocus} showCancelButton={Boolean(true)} onCancel={this.onCancel} onChange={ this.onChange} onSubmit={this.productData} searchVal ={this.props.searchValue}/>
        </View>
      <View />
      </View>) : (null)}
      
      { this.props.searchListVal && this.props.searchListVal.suggestions ? (
          <List>
            {this.queryList(this.props.searchListVal.suggestions)}
          </List>
        ) : (
          <View style={{flex: 1}}>
            <View style={styles.outView}>
              <Tabs funcFilter={funcFilter} dataListScrollTop={scrollTop} />
            </View>

          {this.props.checkoutGift ? (
            <View style={[WarningBarView,styles.row1,styles.left2]}>
              <Image style={[WarningBarImage,{marginHorizontal:2}]} source={require('./../../../images/status/warning@x2.png')} />
              <Text style={[styles.WarningText]}>本次可选择赠品最高价值：</Text>
              <Text style={[styles.sPrice]}>{`¥${this.props.totalPriceLimit.toFixed(2)}`}</Text>
              <Text style={[styles.WarningText,{paddingLeft:2}]}>已选：</Text>
              <Text style={[styles.sPrice]}>{`¥${this.props.giftTotalPrice.toFixed(2)}`}</Text>
            </View>
              ) : (null)}

            <View style={[{flex: 1}, styles.borderT]}>
              <ListView
                ref={list => dataListScroll = list}
                dataSource={this.props.checkoutGift ? this.getGiftDS() : this.props.ds}
                renderFooter={() => <Text style={{ marginBottom: Platform.OS === 'android' ? 10 : 0, paddingBottom: Platform.OS === 'android' ? 20 : 0, padding: Platform.OS === 'android' ? 0 : 10, textAlign: 'center' }}>
                  {this.props.isEnd ? '没有更多' : '加载中...'}
                </Text>}
                renderRow={this.renderRow}
                enableEmptySections
                onEndReached={this.onEndReached}
                onScroll={(event)=> {
                  this.onScrollChange(event);
                }}
                initialListSize={10}
                onEndReachedThreshold={20}
              />
            </View>
            {this.props.checkoutGift ? 
            (<View style={[styles.bottom,{height:50}]}>
              <TouchableHighlight underlayColor={'transparent'} onPress={() => this.confirmGift()} style={styles.tStyle}>
              <View style={styles.footRight}>
                <Text style={styles.footRightText}>确定</Text>
              </View>
            </TouchableHighlight>
            </View>) : (null)}
          </View>
        )}
      </FsRootView>
    </View>
    );
    // FsDrawerLayout 参数
    const navigationView = (
      <View style={{ height: Dimensions.get('window').height-(Platform.OS === 'ios' ? 0 : 24) }}>
       <Filter facets={ this.props.facets } closeFilter={closeFilter}  onSubmit={ this.onSubmit } />
      </View>
    );
    return (
      <FsDrawerLayout
        renderFun={renderFun}
        navigationView={navigationView}
        ref={i => (fsDrawerLayout = i)}
      />
    );
  }
}

ProductListView.propTypes = {
  searchValue: PropTypes.string,
  dispatch: PropTypes.func,
  currentPage: PropTypes.number,
  pageSize: PropTypes.number,
  ds: PropTypes.object,
  isLoading: PropTypes.bool,
  isEnd: PropTypes.bool,
  showCancelButton: PropTypes.bool,
  hotTag: PropTypes.string,
  channel: PropTypes.string,
  searchListVal: PropTypes.object,
  facets: PropTypes.array,
  firstload: PropTypes.number,
  order: PropTypes.string,
  maxPrice: PropTypes.string,
  minPrice: PropTypes.string,
  productAttr: PropTypes.object,
  giftSelection: PropTypes.array, 
  giftTotalPrice: PropTypes.number,
  giftTotalQty: PropTypes.number,
  targetGift: PropTypes.string,
  productListVal: PropTypes.array, 
};
export default connect((state) => {
  const isLoading = state.Search.isLoading;
  const searchValue = state.Search.searchVal;
  const currentPage = state.Search.currentPage;
  const pageSize = state.Search.pageSize;
  const ds = state.Search.ds;
  const isEnd = state.Search.isEnd;
  const hotTag = state.Search.hotTag;
  const channel = state.Search.channel;
  const searchListVal = state.Search.searchListVal;
  const showCancelButton = state.Search.showCancelButton;
  const facets = state.Search.facets;
  const firstload = state.Search.firstload;
  const order = state.Search.order;
  const maxPrice = state.Search.maxPrice;
  const minPrice = state.Search.minPrice;
  const productAttr = state.Search.productAttr;
  const productListVal = state.Search.productListVal;
  const { giftSelection, giftTotalPrice, giftTotalQty, targetGift } = state.myCart;

  return {
    ds,
    isLoading,
    searchValue,
    currentPage,
    pageSize,
    isEnd,
    hotTag,
    channel,
    searchListVal,
    showCancelButton,
    facets,
    firstload,
    order,
    minPrice,
    maxPrice,
    productAttr,
    productListVal,
    giftSelection, giftTotalPrice, giftTotalQty, targetGift
  };
})(ProductListView);
