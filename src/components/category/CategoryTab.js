import React, { Component } from 'react';
import { connect } from 'dva/mobile';
import { Actions } from 'react-native-router-flux';
import {
  Alert,
  View,
  Text,
  Image,
  ScrollView,
  TouchableHighlight
} from 'react-native';
import { Flex, Grid, List, ActivityIndicator } from 'antd-mobile';
import FsSearchBar from '../fsSearchBar/FsSearchBar';
import CategoryRight from './CategoryRight';
import Styles from './categoryStyle';

const CategoryTab = (props) => {
  const {loading} = props;
  if (loading) {
    return (
        <ActivityIndicator toast text="正在加载"/>
    );
  }
  const {subCategories, selected} = props;
  const getItem = () => {
    if (subCategories[0]) {
      return subCategories.map((item, id) => {
        let l1CategoryName = item.name;
        // let data = '';
        // item.subLinks.map(info => {
        //   return (data = data.concat(info.name));
        // });
        const onPress = () => {
          props.dispatch({
            type: 'category/selectCategory',
            categoryname: id
          })
        }
        return (
          <TouchableHighlight key={id} underlayColor={'#EBF9F7'} activeOpacity={1} onPress={onPress} style={selected[id] ? Styles.categoryItemActive : Styles.categoryItem}>
            <View>
              <Text style={selected[id] ? Styles.categoryNameActive : Styles.categoryName}>{l1CategoryName}</Text>
            </View>
          </TouchableHighlight>
        )
      });
    } else {
      return <View/>
    }
  }
  const leftSide = (
    <TouchableHighlight underlayColor={'rgba(100,100,100,0)'} onPress={ () => { Actions.barcodeScanner() }}>
      {/*<Image style={{ height: 40, width: 40 }} source={require('./../../../assets/image/searchBar/shaoyshao.png')} />*/}
    </TouchableHighlight>
  );
  const rightSide = (
    //  <Image style={{ height: 40, width: 40 }} source={require('./../../../assets/image/searchBar/message.png')} />
     <View />
  );
  return (
    <Flex style={[Styles.topStyle, {backgroundColor: '#fff'}]}>
      <Flex.Item>
        <Flex direction="row" style={{ borderBottomWidth: 0.5, borderBottomColor: '#E4E3E3'}}>
          <Flex.Item>
            <FsSearchBar showPromptOnFocus action={Actions.searchPrompt} leftSide={leftSide} rightSide={rightSide}/>
          </Flex.Item>
        </Flex>
        <Flex style={{ height: 560 }}>
          <Flex.Item style={{ flex: 1, alignSelf: 'flex-start'}}>
            <ScrollView automaticallyAdjustContentInsets={false} alwaysBounceVertica>
              <View>
                {getItem()}
              </View>
            </ScrollView>
          </Flex.Item>
          <Flex.Item style={{ flex: 3 }}>
            <ScrollView style={{ backgroundColor: "white" }}>
              <CategoryRight {...props} />
            </ScrollView>
          </Flex.Item>
        </Flex>
      </Flex.Item>
    </Flex>
  );
};

export default connect((state) => { return state.category; })(CategoryTab);
