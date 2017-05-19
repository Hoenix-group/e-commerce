import React, { Component, PropTypes } from 'react';
import { Actions } from 'react-native-router-flux';
import styles1 from './styles';
import styles2 from './filterStyles';
import RsTag from './../Tag/Tag';
import { Grid,Flex } from 'antd-mobile';
import {
  View, Text, StyleSheet,
  TouchableHighlight, Animated,
  Platform, Dimensions, Image,TextInput,ScrollView,TouchableOpacity
} from "react-native"
import Utils from '../../utils/utils';

const WINDOW = Dimensions.get('window');
var closeTimeoutId = null;
let selectBrand;
const dataCount = Array.from(new Array(9)).map((index, i) => ({
  id: i,
  text: `变频空调变频空调${i}`,
}));

export default class Filter extends Component {
  static propTypes = {
  }
  static defaultProps =  {
    closeInterval: 4000,
  }
  constructor(props) {
    super(props)
    this.state = {
      animationValue: new Animated.Value(0),
      duration: 450,
      isOpen: false,
      topValue: 0,
      changeval: {},
      minPrice: '',
      maxPrice: '',
      selectBrand: '',
    }
  }

  // tab点击后选择
  onClick(val,name, key) {
    const changeVal = this.state.changeval;
    const changeKeyValue =  changeVal.hasOwnProperty(key) ? changeVal[''+key+''] : [];
    const obj = {};
    if (val) {
        changeKeyValue.push(name);
    } else {
      for (let it = 0; it < changeKeyValue.length; it++) {
        if (changeKeyValue[it] === name) {
          changeKeyValue.splice(it, 1);
          break;
        }
      }
    }
    obj[''+key+''] = changeKeyValue;
    channVal = Object.assign({}, changeVal, obj);
    this.setState({
      changeval: channVal,
    });
  }
  onChangeMinText(text) {
    this.setState({
      minPrice: text,
    });
  }
  onChangeMaxText(text) {
    this.setState({
      maxPrice: text,
    });
  }

  /**
   * 确定
   */
  submit() {
    // Util.consoleLog(this.state.minPrice, this.state.maxPrice, this.state.changeval);
    console.log(this.state.changeval);
    this.props.onSubmit(this.state.minPrice, this.state.maxPrice, this.state.changeval);
    this.props.closeFilter();
    this.onCloseAll();
  }

  /**
   * 重置
   */
  onCloseAll() {
    this.setState({
      changeval: {},
      minPrice: '',
      maxPrice: '',
      selectBrand: '',
    });
  }

  readMore = (selected, rowID) => {
    const array = this.state.selectBrand ?  this.state.selectBrand.split(',') : [];
     if (array.indexOf(selected) > -1) {
       for (let it = 0; it < array.length; it++) {
        if (array[it] === selected) {
          array.splice(it, 1);
          break;
        }
      }
     
     }else {
       array.push(selected);
     }
     this.setState({
       selectBrand: array.join(','),
     })
    // if (selected === this.state.selectBrand) {
    //   this.setState({
    //     selectBrand: '',
    //   });
    //   selectBrand = '';
    // } else {
    //   this.setState({
    //     selectBrand: selected,
    //   });
    //   selectBrand = selected;
    // }
    // this.props.dispatch({ type: 'combined/showDetail', selectBrand, rowID });
  }
  // 品牌
  brand(dataArr, key) {
    const data = [];
    dataArr.map((item, index) => {
      const name = item.displayName || item.name;
      const namecode = item.name || item.displayName;
      const changeVal = this.state.changeval;
      let selected = false;
      const changeKeyValue =  changeVal.hasOwnProperty(key) ? changeVal[''+key+''] : [];
      if (changeKeyValue.length > 0) {
        if (changeKeyValue.indexOf(name) !== -1 ){
          selected = true;
        }
      }
      //默认展示两个标签
      if(index < 2 ){
        data.push(
          <View key={index} style={[styles2.tagView]}>
            <RsTag
              key={index}
              childrens={name}
              selected={Boolean(selected)}
              onChange={(val) => { this.onClick(val, namecode, key) }}
            />
          </View>,
        );
      }
    });
    return data;
  }
  //显示所有品牌
  brandAll(dataArr, key) {
    const data = [];
    dataArr.map((item, index) => {
      const name = item.displayName || item.name;
      const namecode = item.name || item.displayName;
      const changeVal = this.state.changeval;
      let selected = false;
      const changeKeyValue =  changeVal.hasOwnProperty(key) ? changeVal[''+key+''] : [];
      if (changeKeyValue.length > 0) {
        if (changeKeyValue.indexOf(name) !== -1 ){
          selected = true;
        }
      }
      data.push(
        <View key={index} style={[styles2.tagView]}>
          <RsTag
            key={index}
            childrens={name}
            selected={Boolean(selected)}
            onChange={(val) => { this.onClick(val, namecode, key) }}
          />
        </View>,
      );
    });
    return data;
  }
// 获取筛选数据
  screen() {
    const fects = this.props.facets || [];
    const datas = [];
    const displayNameArr = this.state.selectBrand ? this.state.selectBrand.split(',') : [];
    for(let it=0; it< fects.length; it++) {
      if(displayNameArr.indexOf(fects[it].displayName.trim()) > -1){
        datas.push(
          <View key={it} style={[styles2.borderT]}>
            <TouchableHighlight style={{}} underlayColor={'rgba(0,0,0,0)'} onPress={() => { this.readMore(fects[it].displayName.trim()); }} >
              <View style={[styles2.contentBT, styles2.row1,styles2.padd]}>
                <View><Text style={styles2.filterTitle}>{fects[it].displayName}</Text></View>
                  {/*<Image style={styles2.arrowIcon} source={require('./../../../images/productDetallsImgs/icons/rn-chevron-down.png')} />*/}
                <Image style={styles2.arrowIcon} source={displayNameArr.indexOf(fects[it].displayName.trim()) > -1 ? (require('./../../../images/productDetallsImgs/icons/rn-chevron-up.png')) : (require('./../../../images/productDetallsImgs/icons/rn-chevron-down.png'))} />
              </View>
            </TouchableHighlight>
            <Flex align="start" wrap="wrap">
              {this.brandAll(fects[it].values, fects[it].name)}
            </Flex>
          </View>
        );
      }else{
        datas.push(
          <View key={it} style={[styles2.borderT]}>
            <TouchableHighlight style={{}} underlayColor={'rgba(0,0,0,0)'} onPress={() => { this.readMore(fects[it].displayName.trim()); }} >
              <View style={[styles2.contentBT, styles2.row1,styles2.padd]}>
                <View><Text style={styles2.filterTitle}>{fects[it].displayName}</Text></View>
                  {/*<Image style={styles2.arrowIcon} source={require('./../../../images/productDetallsImgs/icons/rn-chevron-down.png')} />*/}
                  <Image style={styles2.arrowIcon} source={displayNameArr.indexOf(fects[it].displayName.trim()) > -1 ? (require('./../../../images/productDetallsImgs/icons/rn-chevron-up.png')) : (require('./../../../images/productDetallsImgs/icons/rn-chevron-down.png'))} />
              </View>
            </TouchableHighlight>
            <Flex align="start" wrap="wrap">
              {this.brand(fects[it].values, fects[it].name)}
            </Flex>
          </View>
        );
      }

    }
    return datas;
  }

  render() {
    return (
     <View style={{flex:1}}>

       <View style={{flex:9.4,paddingTop:(Platform.OS === 'ios' ? 15 : 0)}}>
         <ScrollView automaticallyAdjustContentInsets={false} style={styles2.paddLR}>
           <Text style={[styles2.priceTitle,styles2.paddLR1]}>价格区间</Text>
           <View style={[styles2.center, styles2.row1,styles2.inputView]}>
             <TextInput keyboardType="numeric" underlineColorAndroid="transparent" style={[styles2.flex,styles2.inputStyle]} placeholder={'最低价'} placeholderTextColor='#D5D5D5' clearButtonMode={'while-editing'} onChangeText={this.onChangeMinText.bind(this)} value={this.state.minPrice}/>
             <View style={{ height: Platform.OS === 'android' ? 40 : 35}}>
               <View style={{width:8,height:2,backgroundColor:'#A0A0A0',marginHorizontal :11,marginVertical :19}}/>
             </View>
             <TextInput keyboardType="numeric" underlineColorAndroid="transparent" style={[styles2.flex,styles2.inputStyle]} placeholder={'最高价'} placeholderTextColor='#D5D5D5' value={this.state.maxPrice}  onChangeText={this.onChangeMaxText.bind(this)} clearButtonMode={'while-editing'} />
           </View>
           {this.screen()}
         </ScrollView>
       </View>

       <View style={[styles2.btnBom,styles2.center,styles2.row1]}>
         <TouchableHighlight underlayColor={'rgba(0,0,0,0)'} onPress={() => { this.onCloseAll(); }} style={{flex: 1}}>
           <View style={styles2.flex}>
             <Text style={styles2.btnResetTest}>重置</Text>
           </View>
         </TouchableHighlight>
         <TouchableHighlight underlayColor={'rgba(0,0,0,0)'} onPress={() => { this.submit(); }} style={{flex: 1}}>
           <View style={styles2.btnSureView}>
             <Text style={styles2.btnSureTest}>确定</Text>
           </View>
         </TouchableHighlight>
       </View>

     </View>

    )
  }
} 