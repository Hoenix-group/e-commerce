import React, { PropTypes, Component } from 'react';
import { View, TouchableHighlight, Image, InteractionManager } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'dva/mobile';
import SearchList from './../../components/Search/SearchList';
import FsSearchBar from './../../components/fsSearchBar/FsSearchBar';
import FsRootView from './../../components/common/FsRootView';
import { shadeBg } from './../../themes/fsBaseStyles';
import styles from './styles';

class SearchView extends Component {
  componentWillMount() {
    InteractionManager.runAfterInteractions(()=>{  
      this.props.dispatch({
        type: 'Search/wishlist',
      });
    }); 
  }
  componentDidMount() {
    InteractionManager.runAfterInteractions(()=>{ 
      this.props.dispatch({
        type: 'Search/gethistory',
      });
    });
  }
  componentWillUnmount() {
    this.props.dispatch({
      type: 'Search/cleanAllState',
      showCancelButton: false,
    });
  }
  onChange = (value) => {
    // searchlog = value;
    let proAttr = '';
    const id = this.props.hotTag;
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
    const sell = id === '3' ? 'AFTER_SALE' : '';
    if (value.trim().length > 0) {
      this.props.dispatch({
        type: 'Search/queryList',
        searchVal: value,
        showCancelButton: true,
        productAttribute: proAttr,
        seller: sell,
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

  onCancel = () => {
    // Util.consoleLog('走走坐坐----');
    Actions.pop();
  }
  onSubmit = (value) => {
    const val = value || this.props.searchVal;
    let proAttr = '';
    const id = this.props.hotTag;
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
    const sell = id === '3' ? 'AFTER_SALE' : '';
    if (val && val.trim().length > 0) {
      Actions.productList({ from: 'globalSearch' });
      // InteractionManager.runAfterInteractions(()=>{
        // this.props.dispatch({
        //   type: 'Search/cleanHistoryList',
        // });
        this.props.dispatch({
          type: 'Search/submit',
          searchValue: val.trim(),
          hotTag: id,
          productAttribute: proAttr,
          seller: sell,
        });
      // });
    }
  }
  toDetail = () => {
    Actions.productList({ from: 'Home' });
  }
  auotInputSearchItem = (value) => {
    this.onSubmit(value);
    // this.toDetail();
  }
  auotWishItem = (sectionID, rCode, channelCode, productAttribute) => {
    Actions.productDetailsView({ from: 'globalSearch' });
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

  onLongPress =() => {
    this.props.dispatch({
      type: 'Search/onLongPress',
      closable: true,
    });
  }
  closeButton = () => {
    this.props.dispatch({
      type: 'Search/onLongPress',
      closable: false,
    });
  }
  onFocus = () => {
    this.props.dispatch({
      type: 'Search/changeButton',
      showCancelButton: true,
    });
  }
  // 删除最近搜索中所有记录
  closeAll = () => {
    this.props.dispatch({
      type: 'Search/closeAll',
    });
  }
    // 删除最近搜索中一条记录
  onClose = (val) => {
    this.props.dispatch({
      type: 'Search/removeHistory',
      searchValue: val,
    });
  }
  onChangeHot = (val) => {
    this.props.dispatch({
      type: 'Search/onChangeHot',
      id: val,
    });
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
  render() {
    return (
      <FsRootView isNavBarHidden>
        <View>
          <View style={{ flexDirection: 'row', backgroundColor: shadeBg }}>
            <TouchableHighlight underlayColor={'transparent'} style={[styles.center]} onPress={() => { this.onCancel(); }}>
              <View style={[{left: 5}, styles.ImgLeft]}>
                <Image style={styles.imgLeft} source={require('./../../../images/back_icon.png')} />
              </View>
            </TouchableHighlight>
            <View style={{ flex: 1 }} >
              {/* <SearchBar placeholder="搜索" onFocus={onFocus} value={searchVal} onCancel={onCancel} showCancelButton={Boolean(showCancelButton)} onChange={onChange} onSubmit={onSubmit} />*/}
              <FsSearchBar placeholder="搜索" clear={this.clear} onFocus={this.onFocus} showCancelButton={Boolean(false)}onCancel={this.onCancel} onChange={this.onChange} onSubmit={this.onSubmit} searchVal ={this.props.searchVal}/>
            </View>
            <View />
          </View>
          <TouchableHighlight underlayColor={'transparent'} onPress={() => { this.closeButton(); }}>
            <View >
              <SearchList closeButton={this.closeButton} hotCountFlag={this.props.hotCount} hotTag={this.props.hotTag} onChangeHot={this.onChangeHot} historyList={this.props.historyList} closeAll={this.closeAll} auotWishItem={this.auotWishItem} Close={this.onClose} searchListVal={this.props.searchListVal} wishlistVal={this.props.wishlistVal} searchVal={this.props.searchVal} onLongPress={this.onLongPress} closable={this.props.closable} tagList={this.props.searchVal} auotInputSearchItem={this.auotInputSearchItem} />
            </View>
          </TouchableHighlight>
        </View>
      </FsRootView>
    );
  }
}
SearchView.propTypes = {
  searchVal: PropTypes.string,
  closable: PropTypes.bool,
  showCancelButton: PropTypes.bool,
  dispatch: PropTypes.func,
  searchListVal: PropTypes.object,
  wishlistVal: PropTypes.array,
  historyList: PropTypes.string,
  hotTag: PropTypes.string,
  hotCount: PropTypes.array,
};
const mapStateToProps = ({ Search }) => {
  const { searchVal, closable, showCancelButton, searchListVal, wishlistVal, historyList, hotTag, hotCount } = Search;
  return { searchVal, closable, showCancelButton, searchListVal, wishlistVal, historyList, hotTag, hotCount };
};
export default connect(mapStateToProps)(SearchView);
