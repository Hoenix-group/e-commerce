import React, { PropTypes, Component } from 'react';
import { connect } from 'dva/mobile';
import { View, Text, Image, TouchableHighlight, Platform, InteractionManager } from 'react-native';
import { ListView, SwipeAction } from 'antd-mobile';
import { Actions } from 'react-native-router-flux';
import styles from './styles';
import FsRootView from './../../components/common/FsRootView';
import { color66, fontSizeMiddle } from './../../themes/fsBaseStyles';
import Util from './../../utils/utils';

class WishlistView extends Component {
  componentWillMount() {
    InteractionManager.runAfterInteractions(()=>{
      this.props.dispatch({
        type: 'Search/wishlist',
      });
    });
  }
  toDetail(sectionID, rCode, channelCode, productAttribute) {
    Actions.productDetailsView({ from: 'wishlist' });
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
  deleteWish(sectionID, rCode, channelCode, productAttribute) {
    this.props.dispatch({
      type: 'Details/removeTowishList',
      productCode: sectionID,
      regionCode: rCode,
      channel: channelCode,
      product: productAttribute,
    });
  }
  renderRow = (rowData, sectionID, rowID) => {
    const numIcon = [];
    const pruState = [];
    const _rowData = rowData.product;
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

    return (
      <View style={{marginTop: 0}}>
        <SwipeAction
          style={{ backgroundColor: 'white' }}
          autoClose={Boolean(true)}
          title="确认"
          right={[{ text: '删除', style: { backgroundColor: '#F4333C', color: 'white' }, onPress: () => this.deleteWish(_rowData.code, _rowData.regionCode,  _rowData.channelCode, _rowData.productAttribute) }]}
        >
         <TouchableHighlight
        underlayColor={'#d9d9d9'}
        style={[{ padding: 0, backgroundColor: 'white' }]}
        onPress={ () => {this.toDetail(_rowData.code, _rowData.regionCode, _rowData.channelCode, _rowData.productAttribute);} }
      >
           <View>
             <View style={[{ flexDirection: 'row' }]}>
               <Image style={styles.image} source={require('./../../../images/productDetallsImgs/carouselImgs/5844f3a1N233450bb_002.jpg')} />
               <View style={[styles.producView, { flex: 2 }]}>
                 <Text numberOfLines={2} key={rowID} style={styles.producTitle}>{_rowData.name}</Text>
                 <View style={[styles.proFlex, styles.left1, styles.row1]}>
                   <View style={styles.tagBg}>
                     <Text style={styles.tagStyle}>{_rowData.productAttribute}</Text>
                   </View>
                   {/*{productAttrs.map(elem => elem)}*/}
                 </View>
                 <View style={[{height:35},styles.contentLR,styles.row1]}>
                   <View style={{flex:7}}>
                     <Text style={styles.price}>¥{_rowData.salesPrice}</Text>
                   </View>
                   <View style={[{flex:3},styles.center,styles.row1]}>
                     <View style={[styles.numView, styles.center]}>
                       <View style={[styles.onlineBg, styles.center]}>
                         <Text style={styles.online}>{_rowData.channelGroup === 'ONLINE' ? '线上' : '线下'}</Text>
                       </View>
                       {/*{numIcon.map(elem => elem)}*/}
                     </View>
                     {pruState.map(elem => elem)}
                   </View>
                 </View>
               </View>
             </View>
           </View>

      </TouchableHighlight>
        </SwipeAction>
      </View>
      );
  }
  render(){
    return (
      <FsRootView isNavBarHidden={false}>
        {
        this.props.data.length === 0 ? (
          <View style={{ alignItems: 'center', flex: 1, marginTop: 10 }}>
            <Text style={{ color: color66, fontSize: fontSizeMiddle,  }}>收藏夹为空！</Text>
          </View>
      ) : (
        <ListView
          dataSource={this.props.wishlistData}
          renderRow={this.renderRow}
          enableEmptySections
        />)
        }
      </FsRootView>
    );
  }
}
WishlistView.propTypes = {
  dispatch: PropTypes.func,
  ds: PropTypes.object,
  wishlistData: PropTypes.object,
  data: PropTypes.array,
};
export default connect((state) => {
  const ds = state.Search.ds;
  const wishlistData = ds.cloneWithRows(state.Search.wishlistVal);
  const data = state.Search.wishlistVal;
  Util.consoleLog('sousu------------------------ ', data);
  return {
    ds,
    wishlistData,
    data,
  };
})(WishlistView);
