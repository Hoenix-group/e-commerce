import React, { Component, PropTypes } from 'react';
import { connect } from 'dva/mobile';
import { Actions } from 'react-native-router-flux';
import { Text, Toast, Popup, Checkbox, Flex } from 'antd-mobile';
import { View, Image, ScrollView, TouchableHighlight, TextInput, InteractionManager, ListView, RefreshControl } from 'react-native';
import FsSearchBar from './../../components/fsSearchBar/FsSearchBar';
import styles from './combination_Style';
import FsRootView from './../../components/common/FsRootView';
import { shadeBg } from './../../themes/fsBaseStyles';
import Util from '../../utils/utils';

const iconRight = (<Image style={{ width: 12, height: 12 }} source={require('./../../../images/productDetallsImgs/icons/rn-chevron-right.png')} />);

let selectProduct;
class CombinationPackageView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showButton: false,
      selectProduct: '',
      refreshing: false,
      searchVal: '',
    };
  }
  componentDidMount() {
    const param = {
      productName: this.state.searchVal,
      currentPage: this.props.currentPage,
      pageSize: this.props.pageSize,
    }
    InteractionManager.runAfterInteractions(() => {
      this.fetchCartsData(param);
    });
  }
  componentWillUnmount() {
    this.setState({
      showButton: false,
    });
    this.props.dispatch({
      type: 'combined/cleanCombinedList',
    })
  }
  /**
   * 加入购物车
   * 参数
   * promotionCode:组合产品所在的促销ID
   * productId:组合产品所有的product code集合 以数组形式传递[p1,p2,p3]
   * status:渠道 01 线上  03 线下
   * region:区域Id精确到城市一级  比如南京 32000000000000 region去当前切换的region
   */
  addToCart(promotionCode, productIds, status) {
    console.log(promotionCode, productIds, status);
    const productInfo = { promotionCode, productIds, status, isPackageProduct: true };
    Actions.valet({ productInfo });
  }

  onCancel = () => {
    // Util.consoleLog('走走坐坐----');
    Actions.pop();
  }
  onChange = (val) => {
    console.log(val);
    this.setState({
      searchVal: val.trim(),
    });
  }
  onSubmit = () => {
    this.props.dispatch({
      type: 'combined/cleanCombinedList',
    })
    this.setState({
      selectProduct: '',
    })
    const param = {
      productName: this.state.searchVal,
      currentPage: 0,
      pageSize: this.props.pageSize,
      isSearch: true,
    };
    console.log('------>', param);
    this.fetchCartsData(param);
  }
  onFocus = () => {
    this.setState({
      showButton: true,
    });
  }
  // onEndReached = () => {
  //   Util.consoleLog('进来就走了啊。。。。------------------', this.props.isEnd);
  //   Util.consoleLog('数据--------', this.props.isLoading);
  //   if (!this.props.isEnd) {
  //     this.props.dispatch({
  //       type: 'combined/getcombinedData',
  //       productName: this.props.productname,
  //       currentPage: this.props.currentPage + 1,
  //       pageSize: this.props.pageSize,
  //     });
  //   } else {
  //     Util.consoleLog('没有更多数据了！！！！！');
  //   }
  // }
  onStopRefresh = () => {
    this.setState({
      refreshing: false,
    });
  }

  onEndReached = () => {
    Util.consoleLog('onEndReached调用');
    const param = {
      currentPage: this.props.currentPage + 1,
      pageSize: this.props.pageSize,
      productName: this.state.searchVal,
    };
    if (this.props.isEnd) {
      return;
    }
    Util.consoleLog(['this.props.isEnd', this.props.isEnd]);
    if (this.props.isSearch) {
      return;
    }
    this.fetchCartsData(param);
  }

  fetchCartsData = (param, cb) => {
    this.props.dispatch({ type: 'combined/getcombinedData', param, cb });
  }


  refresh = () => {
    this.setState({ refreshing: true });
    const param = {
      currentPage: 0,
      pageSize: 10,
      productName: this.state.searchVal,
    };
    Util.consoleLog(['onEndReached调用这里']);
    this.fetchCartsData(param, this.onStopRefresh);
  }

  showDetail = (selected, rowID) => {
    if (selected === this.state.selectProduct) {
      this.setState({
        selectProduct: '',
      });
      selectProduct = '';
    } else {
      this.setState({
        selectProduct: selected,
      });
      selectProduct = selected;
    }
    this.props.dispatch({ type: 'combined/showDetail', selectProduct, rowID });
  }
  renderTag(data) {
    const datas = [];
    // data.map((item, index) =>{
    //   datas.push(<Text key = {index} style={styles.tagText}>{item}</Text>)
    // });
    return datas;
  }
  //加载商品详细信息
  renderDetail = (data) => {
    const datas = [];
    data.map((item, index) => {
      const items = JSON.parse(item);
      const description = items.product.name ? items.product.name.replace('[', '').replace(']', '') : "";
      const saleprice = items.salePrice ? items.salePrice.replace('[', '').replace(']', '') : "";
      datas.push(
        <View key={index} style={{ flex: 1 }}>
          {/*商品信息 (可以公用)*/}
          <View style={styles.proMainView}>
            {/* 图片 */}
            <View style={styles.imgView}>
              <Image style={styles.img} source={require('./../../../images/sale_product_01_280x190.png')} />
            </View>
            {/* 右侧-商品信息 */}
            <View style={styles.proView}>
              <View style={styles.proTitleView}>
                <Text numberOfLines={2} style={styles.proTitleText}>{description}</Text>
              </View>
              <View style={styles.tagView}>
                {this.renderTag(items.product.salesattributes)}
              </View>
              <View style={styles.priceMainView}>
                <View style={styles.priceView}>
                  <Text style={[styles.priceText]}>¥{saleprice}</Text>
                </View>
                {/*<View style={styles.numView}>
                  <Text style={styles.numText}>2件</Text>
                </View>*/}
              </View>
            </View>
          </View>
          {/* 商品信息  end */}
        </View>,
      );
    });
    return datas;
  }
  renderRow = (_rowData, sectionID, rowID) => {
    const productCode = [];
    const productURL = []; // 获取图片url
    const productdata = _rowData.productsInfo;
    productdata.map((item) => {
      const items = JSON.parse(item);
      const code = items.product.code ? items.product.code.replace('[', '').replace(']', '') : "";
      // const code = items.product.logo.URL ? items.product.code.replace('[', '').replace(']', '') : "";
      productCode.push(code);
    });
    console.log(_rowData)
    const name = _rowData.channelgroup === 'ONLINE' ? '线上' : '线下';
    return (
      this.state.selectProduct === _rowData.code ? (
        <View key={rowID} style={{ flex: 1 }}>
          {/** 全家团圆套餐 start */}
          <View style={styles.viewOutSide}>
            {/* 左侧-标题 */}
            <View style={styles.titleView1}>
              <View style={styles.leftCenter}>
                <View style={[styles.onlineBg, styles.center,styles.mr5]}>
                  <Text style={styles.online}>{name}</Text>
                </View>
                <Text style={styles.titleText}>{_rowData.promotionName}</Text>
              </View>
              <TouchableHighlight style={{}} underlayColor={'rgba(0,0,0,0)'} onPress={() => { this.showDetail(_rowData.code, rowID); }} >
                <Image style={styles.imgIcon} source={this.state.selectProduct === _rowData.code ? (require('./../../../images/productDetallsImgs/icons/rn-chevron-up.png')) : (require('./../../../images/productDetallsImgs/icons/rn-chevron-down.png'))} />
              </TouchableHighlight>
            </View>
            {this.renderDetail(_rowData.productsInfo)}
            {/** 套餐价、结算 start */}
            {/* 套餐价、结算 start */}
            <View style={styles.comMainView}>
              {/* 左侧 */}
              <View style={styles.comLeftView}>
                <Text style={styles.comLeftText}>套餐价：¥{_rowData.promotionPrice}    优惠：</Text>
                <Text style={styles.priceText1}>¥{_rowData.priceBenefit}</Text>
              </View>
              {/* 右侧 */}
              <TouchableHighlight style={{}} underlayColor={'rgba(0,0,0,0)'} onPress={() => { this.addToCart(_rowData.promotionCode, productCode, _rowData.channel); }} >
                <View style={styles.btnRightView}>
                  <Text style={styles.btnRightText}>去结算</Text>
                </View>
              </TouchableHighlight>
            </View>
            {/** 套餐价、结算 end */}
          </View>
          {/* 全家团圆套餐 end */}
          <View style={styles.intervalSpace} />
          {/** 全家团圆套餐 end */}
        </View>
      ) : (
          <View key={rowID} style={{ flex: 1 }}>

            {/** 合家欢乐套餐 start */}
            <View style={styles.viewOutSide}>
              {/* 左侧-标题 */}
              <View style={styles.titleView1}>
                <View style={styles.leftCenter}>
                  <View style={[styles.onlineBg, styles.center,styles.mr5]}>
                    <Text style={styles.online}>{name}</Text>
                  </View>
                  <Text style={styles.titleText}>{_rowData.promotionName}</Text>
                </View>
                <TouchableHighlight style={{}} underlayColor={'rgba(0,0,0,0)'} onPress={() => { this.showDetail(_rowData.code, rowID); }} >
                  <Image style={styles.imgIcon} source={this.state.selectProduct === _rowData.code ? (require('./../../../images/productDetallsImgs/icons/rn-chevron-up.png')) : (require('./../../../images/productDetallsImgs/icons/rn-chevron-down.png'))} />
                </TouchableHighlight>
              </View>

              {/* 商品信息 (可以公用)*/}
              {/* 图片 */}
              <View style={styles.imgView1}>
                <Image style={styles.img} source={require('./../../../images/sale_product_01_280x190.png')} />
                <Image style={styles.img} source={require('./../../../images/sale_product_01_280x190.png')} />
                <Image style={styles.img} source={require('./../../../images/sale_product_01_280x190.png')} />
                <Image style={styles.img} source={require('./../../../images/sale_product_01_280x190.png')} />
              </View>
              {/* 商品信息  end */}

              {/* 套餐价、结算 start */}
              <View style={styles.comMainView}>
                {/* 左侧 */}
                <View style={styles.comLeftView}>
                  <Text style={styles.comLeftText}>套餐价：¥{_rowData.promotionPrice}    优惠：</Text>
                  <Text style={styles.priceText1}>¥{_rowData.priceBenefit}</Text>
                </View>
                {/* 右侧 */}
                <TouchableHighlight style={{}} underlayColor={'rgba(0,0,0,0)'} onPress={() => { this.addToCart(_rowData.promotionCode, productCode, _rowData.channel); }} >
                  <View style={styles.btnRightView}>
                    <Text style={styles.btnRightText}>去结算</Text>
                  </View>
                </TouchableHighlight>
              </View>
              {/* 套餐价、结算 end */}
            </View>
            {/** 合家欢乐套餐 end */}
            <View style={styles.intervalSpace} />
          </View>))
  }
  render() {
    return (
      <FsRootView isNavBarHidden={true}>
        <View style={[styles.flex, styles.mainBg]}>
          <View style={[styles.top]} >
            <View style={{ flexDirection: 'row', backgroundColor: shadeBg }}>
              <TouchableHighlight underlayColor={'transparent'} style={[styles.center]} onPress={() => { this.onCancel(); }}>
                <View style={[{ left: 5 }, styles.ImgLeft]}>
                  <Image style={styles.imgLeft} source={require('./../../../images/back_icon.png')} />
                </View>
              </TouchableHighlight>
              <View style={{ flex: 1 }} >
                {/*<SearchBar placeholder="搜索" onFocus={onFocus} value={searchVal} onCancel={onCancel} showCancelButton={Boolean(showCancelButton)} onChange={onChange} onSubmit={onSubmit} />*/}
                <FsSearchBar placeholder="搜索" showPromptOnFocus action={this.onFocus} showCancelButton={Boolean(this.state.showButton)} onCancel={this.onCancel} searchVal={this.state.searchVal} onChange={this.onChange} onSubmit={this.onSubmit} />
              </View>
              <View />
            </View>
            {/*<ListView
                dataSource={this.props.ds}
                renderFooter={() => <Text style={{ padding: 10, textAlign: 'center' }}>
                  {this.props.isEnd ? '没有更多' : '加载中...'}
                </Text>}
                renderRow={this.renderRow}
                enableEmptySections
                onEndReached={this.onEndReached}
                initialListSize={5}
                onEndReachedThreshold={20}
              />*/}
            <ListView
              renderFooter={() => <Text style={{ padding: 10, textAlign: 'center' }}>
                {this.props.isEnd ? '没有更多' : '加载中...'}
              </Text>}
              refreshControl={<RefreshControl title="数据加载中" refreshing={this.state.refreshing} onRefresh={this.refresh} />}
              enableEmptySections
              dataSource={this.props.ds}
              renderRow={this.renderRow}
              onEndReached={this.onEndReached}
              initialListSize={5}
              onEndReachedThreshold={20}
            />
          </View>
        </View>
      </FsRootView>
    );
  }
}
CombinationPackageView.propTypes = {
  dispatch: PropTypes.func,
  currentPage: PropTypes.number,
  pageSize: PropTypes.number,
  ds: PropTypes.object,
  isLoading: PropTypes.bool,
  isEnd: PropTypes.bool,
  isSearch: PropTypes.bool,
};

export default connect((state) => {
  const isLoading = state.combined.isLoading;
  const currentPage = state.combined.currentPage;
  const pageSize = state.combined.pageSize;
  const ds = state.combined.ds;
  const isEnd = state.combined.isEnd;
  const isSearch = state.combined.isSearch;
  return {
    ds,
    isLoading,
    currentPage,
    pageSize,
    isEnd,
    isSearch,
  };
})(CombinationPackageView);

