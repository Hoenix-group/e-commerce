import React, { Component } from 'react';
import { connect } from 'dva/mobile';
import { Actions } from 'react-native-router-flux';
import {
  Alert,
  View,
  Text,
  Image,
  TouchableHighlight
} from 'react-native';
import { Flex, Grid, TabBar, WhiteSpace } from 'antd-mobile';
import Styles from './categoryStyle';

const categoryGrid = (props) => {
  const data = props.subCategories;
  const getGridRender = () => {
    if (data) {
      return data.map((el, gridId) => {
        const onClick = (categoryCode) => {
          props.ClickPic(categoryCode);
        }
        return (
          <View key={gridId}>
            <TouchableHighlight underlayColor={'rgba(255,255,255,0.2)'} onPress={() => onClick(el.code)}>
              <View style={gridId%3 == 2 ? Styles.gridStyle1 : Styles.gridStyle2}>
                {/*<Image source={el.image?{url: el.image}:require("./../../assets/image/home/category/computer1.jpg")} style={Styles.prodImage} />*/}
                <Text style={Styles.prodName}>{el.name}</Text>
              </View>
            </TouchableHighlight>
          </View>
        );
      });
    } else {
      return (<View/>);
    }
  }
  return (
    <View>
      <Flex direction="row" wrap="wrap" justify="start">
        {getGridRender()}
      </Flex>
    </View>
  );
}
export default categoryGrid;
