import React, { Component } from 'react';
import { connect } from 'dva/mobile';
import { Actions } from 'react-native-router-flux';
import { View, Text, Image} from 'react-native';
import { WhiteSpace, SearchBar, Flex, Grid, Carousel, TabBar } from 'antd-mobile';
import CategoryGrid from './CategoryGrid';
import Styles  from './categoryStyle';

 const CategoryRight = (props) => {
  //每次触发图片分类touch的时候触发sence切换并且加载相应的数据
  const genClickPic = (categoryCode) => {
    // Actions.productList1();
    // props.dispatch({
    //   type: 'productList1/fetchProducts',
    //   params: {
    //     query: '小米',
    //     pageSize: 10,
    //     currentPage: 0
    //   }
    // });
    if (categoryCode) {
      props.dispatch({ type: 'productList1/searchByCategory', categoryCode, searchType: 'category' });
      console.debug('search by category: %s', categoryCode);
    } else {
      props.dispatch({ type: 'productList1/searchByCategory', categoryCode: 'PC003001', searchType: 'category' });
      console.debug('search by default category: %s', 'PC003001');
    }
  }
  const advertisement = (
    <View>
      {/*<Image style={[Styles.marginSM, Styles.adImage]} source={require('./../../assets/image/productDetails/phone2.jpg')}/>*/}
    </View>
  )
  const SectionArea = () => {
    if (props.dataList) {
      return props.dataList.map((item, id) => {
        return (
          <View style={Styles.bgSeparator} key={id} >
            <Flex direction="column">
              <Flex direction="row" style={Styles.itemTitle}>
                <Flex.Item style={{alignItems: 'flex-start'}}><Text style={[Styles.fontMD, Styles.contentBlack]}>{item.name}</Text></Flex.Item>
                <Flex.Item style={{alignItems: 'flex-end'}}><Text style={{fontSize: 12, marginRight: 10}}>{item.rankingList}</Text></Flex.Item>
              </Flex>
              <Flex>
                <Flex.Item style={[Styles.marginSM, Styles.bgWhite, Styles.productArea]}>
                  <CategoryGrid {...item} ClickPic={genClickPic}/>
                </Flex.Item>
              </Flex>
            </Flex>
          </View>
        );
      });
    } else {
      return (<View />)
    }
  }
  return (
    <View style={Styles.bgSeparator}>
      {advertisement}
      {SectionArea()}
    </View>
  );
}
export default CategoryRight;
