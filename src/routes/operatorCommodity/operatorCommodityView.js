import React, { Component, PropTypes } from 'react';
import { connect } from 'dva/mobile';
import { View, Text, TouchableHighlight, Image, Platform, InteractionManager, Dimensions, ScrollView, TextInput } from 'react-native';
import { ListView, SearchBar, List, Flex, Stepper, Checkbox, Toast } from 'antd-mobile';
import { Actions } from 'react-native-router-flux';
import styles from './../productList/styles';
import FsSearchBar from './../../components/fsSearchBar/FsSearchBar';
import FsRootView from './../../components/common/FsRootView';
import { shadeBg, WarningBarText, WarningBarView, WarningBarImage } from './../../themes/fsBaseStyles';
import Util from './../../utils/utils';

class operatorCommodityView extends Component {

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
  }
  componentWillUnmount() {

  }

  toDetail(sectionID, rCode, channelCode, productAttribute) {
    Actions.productDetailsView({ from: 'operatorCommodity' });
    InteractionManager.runAfterInteractions(()=>{
      this.props.dispatch({
        type: 'Details/queryProductDeail',
        productCode: sectionID,
        regionCode: rCode,
        channel: channelCode,
        product: productAttribute,
        wishflag: true,
      });
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

  onEndReached = () => {

  }


  renderRow = (_rowData, sectionID, rowID) => {
    return (
      <View key={rowID}>
      <TouchableHighlight underlayColor={'transparent'} style={[{ padding: 0, backgroundColor: 'white' }]}
                          onPress={ () => {this.toDetail(_rowData.code, _rowData.regionCode, _rowData.channelCode, _rowData.productAttribute);}} >
        <View>
          <View style={[{ flexDirection: 'row'},styles.flex,styles.end1]}>
            <Image style={styles.image} source={require('./../../../images/productImgs/oppo.jpg')} />
            <View style={[styles.producView, { flex: 2 }]}>
              <Text numberOfLines={2} key={rowID} style={styles.producTitle}>{_rowData.name}</Text>
              <View style={[styles.proFlex, styles.left1, styles.row1]}>
                <View style={[ styles.row1]}>
                  <Text style={[styles.tagStyle, styles.tagBg, styles.ImgLeft]}>哑光金</Text>
                  <Text style={[styles.tagStyle, styles.tagBg, styles.ImgLeft]}>32G</Text>
                  <Text style={[styles.tagStyle, styles.tagBg, styles.ImgLeft]}>SAMPLE</Text>
                  <Text style={[styles.tagStyle, styles.tagBg, styles.ImgLeft]}>双卡双待</Text>
                </View>
              </View>
              <View style={[{height:35},styles.contentLR,styles.row1,styles.container]}>
                <View style={{flex:2.5}}>
                  <Text style={styles.price}>¥{_rowData.salesPrice}</Text>
                </View>
                <View style={[{flex:4},styles.end1,styles.row1]}>
                  <View style={[styles.numView, styles.center]}>
                    <View style={[styles.onlineBg, styles.center]}>
                      <Text style={styles.online}>线上</Text>
                    </View>
                  </View>
                  <View style={[styles.row1,{height: 35}]}>
                    <Text key={rowID} style={styles.notEmpty}>有货</Text>
                  </View>
                </View>

              </View>
            </View>
          </View>
        </View>

      </TouchableHighlight>
    </View>);
  }

  render(){

    return (
      <View style={{ height: Dimensions.get('window').height }}>
        <FsRootView isNavBarHidden>
          <View style={{ flexDirection: 'row', backgroundColor: shadeBg }}>
            <TouchableHighlight underlayColor={'transparent'} style={[styles.center]} onPress={ () => { Actions.pop();} }>
              <View style={[styles.ImgLeft, { left: 5 }]}>
                <Image style={styles.imgLeft} source={require('./../../../images/back_icon.png')} />
              </View>
            </TouchableHighlight>
            <View style={{ flex: 1 }} >
              <FsSearchBar  placeholder="搜索" showPromptOnFocus />
            </View>
            <View />
          </View>
          <View style={[{flex: 1}, styles.borderT]}>
            <ListView dataSource={this.props.ds} renderFooter={() =>
              <Text style={{ padding: 10, textAlign: 'center' }}>
                {this.props.isEnd ? '没有更多' : '加载中...'}
              </Text>}
              renderRow={this.renderRow}
              enableEmptySections
              onEndReached={this.onEndReached}
              initialListSize={10}
              onEndReachedThreshold={20}
            />
          </View>
        </FsRootView>
      </View>
    );
  }
}

operatorCommodityView.propTypes = {
  searchValue: PropTypes.string,
  dispatch: PropTypes.func,
  currentPage: PropTypes.number,
  pageSize: PropTypes.number,
  ds: PropTypes.object,
  isLoading: PropTypes.bool,
  isEnd: PropTypes.bool,
  hotTag: PropTypes.string,
  firstload: PropTypes.number,
};
export default connect((state) => {
  const isLoading = state.Search.isLoading;
  const searchValue = state.Search.searchVal;
  const currentPage = state.Search.currentPage;
  const pageSize = state.Search.pageSize;
  const ds = state.Search.ds;
  const isEnd = state.Search.isEnd;
  const hotTag = state.Search.hotTag;
  const firstload = state.Search.firstload;

  return {
    ds,
    isLoading,
    searchValue,
    currentPage,
    pageSize,
    isEnd,
    hotTag,
    firstload,
  };
})(operatorCommodityView);
