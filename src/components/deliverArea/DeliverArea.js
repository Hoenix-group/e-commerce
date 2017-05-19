import React, { Component, PropTypes } from 'react';
import {Actions} from 'react-native-router-flux';
import { View, Text, TouchableHighlight, ScrollView, Platform, Image } from 'react-native';
import { Popup } from 'antd-mobile';
import Styles from './deliverAreaStyle';
import Util from './../../utils/utils';

/**
 * 目前这货只支持最多四级联动，可以少，不可以多(RH)
 */
class DeliverArea extends Component {
  constructor(props) {
    super(props);
    this.state = {
      savedRegionNameArr: ['', '', '', ''],
      cols: 0,
      savedRegionArr: ['0', '0', '0', '0'],
      tabitem: 0,
      availableRegions1: [],
      title1: '',
      availableRegions2: [],
      title2: '',
      availableRegions3: [],
      title3: '',
      availableRegions4: [],
    };
  }
  componentWillMount() {
    const col = this.props.cols ? this.props.cols : 4;

    let tabindex = 0;

    let regions2 = [];
    let regions3 = [];
    let regions4 = [];

    let tit1 = '';
    let tit2 = '';
    let tit3 = '';

    let arr = ['0', '0', '0', '0'];
    if (this.props.savedRegionArr) {
      arr = this.props.savedRegionArr;
    }
    if (arr[0] !== '0' && col > 1) {
      this.props.availableRegions.map((item, index) => {
        if (item.value === arr[0]) {
          if (item.children && item.children.length > 0) {
            regions2 = item.children;
            tit1 = item.label;
            tabindex = 1;
            item.selected = true;

            regions2.map((item2, index2) => {
              if (item2.value === arr[1]) {
                item2.selected = true;
              } else {
                item2.selected = false;
              }
            });
          }
        }
      });

      if (arr[1] !== '0' && regions2.length > 0 && col > 2) {
        regions2.map((item, index) => {
          if (item.value === arr[1]) {
            if (item.children && item.children.length > 0) {
              regions3 = item.children;
              tit2 = item.label;
              tabindex = 2;
              item.selected = true;

              regions3.map((item3, index3) => {
                if (item3.value === arr[2]) {
                  item3.selected = true;
                } else {
                  item3.selected = false;
                }
              });
            }
          }
        });

        if (arr[2] !== '0' && regions3.length > 0 && col > 3) {
          regions3.map((item, index) => {
            if (item.value === arr[2]) {
              if (item.children && item.children.length > 0) {
                regions4 = item.children;
                tit3 = item.label;
                tabindex = 3;
                item.selected = true;

                regions4.map((item4, index4) => {
                  if (item4.value === arr[3]) {
                    item4.selected = true;
                  } else {
                    item4.selected = false;
                  }
                });
              }
            }
          });
        }
      }
    }
    
    this.setState({
      cols: this.props.cols ? this.props.cols : 4,
      savedRegionArr: this.props.savedRegionArr ? this.props.savedRegionArr : [0, 0, 0, 0],
      tabitem: tabindex,
      availableRegions1: this.props.availableRegions,
      title1: tit1,
      availableRegions2: regions2,
      title2: tit2,
      availableRegions3: regions3,
      title3: tit3,
      availableRegions4: regions4,
    });
  }
  componentWillUnmount() {
    this.state = {
      cols: 0,
      savedRegionArr: ['0', '0', '0', '0'],
      tabitem: 0,
      availableRegions1: [],
      title1: '',
      availableRegions2: [],
      title2: '',
      availableRegions3: [],
      title3: '',
      availableRegions4: [],
    };
  }
  onTabClick1 = () => {
    this.cleanSelectedState(this.state.availableRegions2);
    this.cleanSelectedState(this.state.availableRegions3);
    this.cleanSelectedState(this.state.availableRegions4);
    let arr = [this.state.savedRegionArr[0], '0', '0', '0'];
    this.setState({
      savedRegionArr: arr,
      tabitem: 0,
      availableRegions2: [],
      availableRegions3: [],
      availableRegions4: [],
    })
  }
  onTabClick2 = () => {
    this.cleanSelectedState(this.state.availableRegions3);
    this.cleanSelectedState(this.state.availableRegions4);
    let arr = [this.state.savedRegionArr[0], this.state.savedRegionArr[1], '0', '0'];
    this.setState({
      savedRegionArr: arr,
      tabitem: 1,
      availableRegions3: [],
      availableRegions4: [],
    })
  }
  onTabClick3 = () => {
    this.cleanSelectedState(this.state.availableRegions4);
    let arr = [this.state.savedRegionArr[0], this.state.savedRegionArr[1], this.state.savedRegionArr[2], '0'];
    this.setState({
      savedRegionArr: arr,
      tabitem: 2,
      availableRegions4: [],
    });
  }
  cleanSelectedState = (arr) => {
    arr.forEach((item => {
      if (item.selected === true) {
        item.selected = false;
      }
    }));
  }
  saveAddressToParent = () => {
    let value = [];
    const regionArr = this.state.savedRegionArr;
    const nameArr = this.state.savedRegionNameArr;
    for (let idx = 0; idx < this.state.cols; idx++) {
      value.push({'label': nameArr[idx], 'value': regionArr[idx]});
    }
    // console.log(value);
    // alert(value);
    if (this.props.onChange) {
      this.props.onChange(value);
    }
  }
  addressItem = (selectTab, availableRegions, item, index) => {
    if (item.selected === true) {
      return (
        <TouchableHighlight key={index} underlayColor="#fff" style={Styles.addressItem} onPress={() => { selectTab(availableRegions, item, index) }}><Text numberOfLines={1} style={[Styles.tabtext,{flex:1,color: '#0083e0',textAlign:'left',paddingVertical:15}]}>{item.label}</Text></TouchableHighlight>
      );
    } else {
      return (
        <TouchableHighlight key={index} underlayColor="#fff" style={Styles.addressItem} onPress={() => { selectTab(availableRegions, item, index) }}><Text numberOfLines={1} style={[Styles.tabtext,{flex:1,textAlign:'left',paddingVertical:15}]}>{item.label}</Text></TouchableHighlight>
      );
    }
  }
  selectTab1 = (availableRegions1, item, index) => {
    let arr = this.state.savedRegionArr;
    arr[0] = availableRegions1[index].value;

    let arr1 = this.state.savedRegionNameArr;
    arr1[0] = availableRegions1[index].label;

    if (item.children && item.children.length > 0 && this.state.cols !== 1) {
      this.resetScrollView();
      availableRegions1.map((info, idx) => (info.selected = false));
      availableRegions1[index].selected = true;
      this.setState({
        savedRegionNameArr: arr1,
        savedRegionArr: arr,
        availableRegions2: item.children,
        availableRegions1,
        title1: availableRegions1[index].label,
        tabitem: 1,
      });
    } else {
      this.saveAddressToParent();
    }
  }
  selectTab2 = (availableRegions2, item, index) => {
    let arr = this.state.savedRegionArr;
    arr[1] = availableRegions2[index].value;

    let arr1 = this.state.savedRegionNameArr;
    arr1[1] = availableRegions2[index].label;

    if (this.props.async) {
      const callback = (counties) => {
        this.resetScrollView();
        availableRegions2.map((info, idx) => (info.selected = false));
        availableRegions2[index].selected = true;
        this.setState({
          savedRegionNameArr: arr1,
          savedRegionArr: arr,
          availableRegions3: counties,
          availableRegions2,
          title2: availableRegions2[index].label,
          tabitem: 2,
        });
      };
      this.props.getCounties(availableRegions2[index].value, callback);
    } else {
      if (item.children && item.children.length > 0 && this.state.cols !== 2) {
        this.resetScrollView();
        availableRegions2.map((info, idx) => (info.selected = false));
        availableRegions2[index].selected = true;
        this.setState({
          savedRegionNameArr: arr1,
          savedRegionArr: arr,
          availableRegions3: item.children,
          availableRegions2,
          title2: availableRegions2[index].label,
          tabitem: 2,
        });
      } else {
        this.saveAddressToParent();
      }
    }
  }
  selectTab3 = (availableRegions3, item, index) => {
    let arr = this.state.savedRegionArr;
    arr[2] = availableRegions3[index].value;

    let arr1 = this.state.savedRegionNameArr;
    arr1[2] = availableRegions3[index].label;

    if (this.props.async) {
      const callback = (towns) => {
        this.resetScrollView();
        availableRegions3.map((info, idx) => (info.selected = false));
        availableRegions3[index].selected = true;
        this.setState({
          savedRegionNameArr: arr1,
          savedRegionArr: arr,
          availableRegions4: towns,
          availableRegions3,
          title3: availableRegions3[index].label,
          tabitem: 3,
        })
      };
      this.props.getTowns(availableRegions3[index].value, callback);
    } else {
      if (item.children && item.children.length > 0 && this.state.cols !== 3) {
        this.resetScrollView();
        availableRegions3.map((info, idx) => (info.selected = false));
        availableRegions3[index].selected = true;
        this.setState({
          savedRegionNameArr: arr1,
          savedRegionArr: arr,
          availableRegions4: item.children,
          availableRegions3,
          title3: availableRegions3[index].label,
          tabitem: 3,
        })
      } else {
        this.saveAddressToParent();
      }
    }
  }
  selectTab4 = (availableRegions4, item, index) => {
    let arr = this.state.savedRegionArr;
    arr[3] = availableRegions4[index].value;

    let arr1 = this.state.savedRegionNameArr;
    arr1[3] = availableRegions4[index].label;

    this.saveAddressToParent();
  }
  resetScrollView = () => {
    if (this.list) {
      if (Platform.OS === 'android') {
        this.list.scrollTo({ x: 0, y: 0, animated: false});
      }
    }
  }
  TabRender = (item = 0) => {
    const {availableRegions1, availableRegions2, availableRegions3, availableRegions4} = this.state;
    let TabRenderItem;
    if (item === 0) {
      TabRenderItem = availableRegions1.map((item, index) => (this.addressItem(this.selectTab1, availableRegions1, item, index)));
    } else if (item === 1) {
      TabRenderItem = availableRegions2.map((item, index) => (this.addressItem(this.selectTab2, availableRegions2, item, index)));
    } else if (item === 2) {
      TabRenderItem = availableRegions3.map((item, index) => (this.addressItem(this.selectTab3, availableRegions3, item, index)));
    } else {
      TabRenderItem = availableRegions4.map((item, index) => (this.addressItem(this.selectTab4, availableRegions4, item, index)));
    }
    return TabRenderItem;
  }
  render() {
    const vHeight = Util.size.height / 2 + 20;
    const {tabitem, availableRegions1, title1, availableRegions2, title2, availableRegions3, title3, availableRegions4} = this.state;
    return (
      <View style={[{height: vHeight, paddingHorizontal:10}]}>
        <View style={Styles.areaTitle}>
          <Text style={Styles.areaText}>所在地区</Text>
        </View>
        <View style={[Styles.tabtitle,Styles.leftCenter]}>
          {availableRegions2[0] ? <TouchableHighlight key={1} underlayColor="#fff" onPress={this.onTabClick1} style={[tabitem === 0 ? {borderBottomWidth: 1, borderColor: '#0083e0'} : null, Styles.tabStyle]}><Text style={[Styles.tabtext,Styles.color33]}>{title1}</Text></TouchableHighlight> : null}
          {availableRegions3[0] ? <TouchableHighlight key={2} underlayColor="#fff" onPress={this.onTabClick2} style={[tabitem === 1 ? {borderBottomWidth: 1, borderColor: '#0083e0'} : null, Styles.tabStyle]}><Text style={Styles.tabtext}>{title2}</Text></TouchableHighlight> : null}
          {availableRegions4[0] ? <TouchableHighlight key={3} underlayColor="#fff" onPress={this.onTabClick3} style={[tabitem === 2 ? {borderBottomWidth: 1, borderColor: '#0083e0'} : null, Styles.tabStyle]}><Text style={Styles.tabtext}>{title3}</Text></TouchableHighlight> : null}
          <TouchableHighlight key={4} underlayColor="#fff" style={Styles.tabStyleActive}><Text style={[{color: '#0083e0'}, Styles.tabtext]}>请选择</Text></TouchableHighlight>
        </View>
        <View style={{flex: 1}}>
          <ScrollView ref={list => this.list = list}>
            {this.TabRender(tabitem)}
          </ScrollView>
        </View>
        <TouchableHighlight style={Styles.closeIcon} underlayColor={'rgba(0,0,0,0)'} onPress={() => { this.props.onClose(); }}>
          <Image style={{ width: 12, height: 12 }} source={require('./../../../images/productDetallsImgs/icons/rn-close-s.png')} />
        </TouchableHighlight>
      </View>
    )
  }
}
export default DeliverArea;
