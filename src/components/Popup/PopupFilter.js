import React, { Component, PropTypes } from 'react';
import { connect } from 'dva/mobile';
import { List } from 'antd-mobile';
import { ScrollView, Text, View, Dimensions, TouchableWithoutFeedback, TouchableHighlight, Platform, Image } from 'react-native';
import tabStyles from './../../routes/productList/styles';
import Util from './../../utils/utils';

class PopupFilter extends Component {

  componentDidMount() {
    Util.consoleLog('PopupFilter componentDidMount');
    this.props.dispatch({ type: 'popupFilter/initButtonStates', filterDataArrays: this.props.filterDataArrays });
    this.arrowUp = require('./../../../images/productDetallsImgs/icons/tab_up.png');
    this.arrowUpChoose = require('./../../../images/productDetallsImgs/icons/tab_up_choose.png');
    this.arrowDownChoose = require('./../../../images/productDetallsImgs/icons/tab_donw_choose.png');
    this.arrowDown = require('./../../../images/productDetallsImgs/icons/tab_down.png');
    this.itemChoose = require('./../../../images/productDetallsImgs/icons/choose.png');
  }

  onMaskPress() {
    this.props.dispatch({ type: 'popupFilter/closeFilterMenu' });
  }

  onItemClicked(menuIndex, itemIndex, text) {
    this.props.dispatch({ type: 'popupFilter/changeFilterItemState', menuIndex, itemIndex, menuDisplayText: text });
    this.props.onItemSelected(menuIndex, itemIndex);
  }

  onButtonClicked(menuIndex) {
    const menuChanged = menuIndex === this.props.filterMenuIndex;
    // if (!menuChanged && this.props.menuStateArray[menuIndex].itemSelectedIndex > -1) {
    //   // change filter
    //   this.props.dispatch({ type: 'popupFilter/changeFilterMenuState', index: menuIndex, visiable: false });
    //   this.props.onItemSelected(menuIndex, this.props.menuStateArray[menuIndex].itemSelectedIndex);
    //   return;
    // }
    if (this.props.filterDataArrays[menuIndex].isSort) {
      // sort button clicked
      this.props.dispatch({ type: 'popupFilter/changeFilterMenuState', index: menuIndex, visiable: false, changeArrow: menuChanged && this.props.filterDataArrays[menuIndex].arrowChange });
      this.props.onItemSelected(menuIndex, this.props.menuStateArray[menuIndex].itemSelectedIndex);
    } else {
      // filter button clicked
      const visiable = (menuChanged || !this.props.maskVisiable) ? !this.props.maskVisiable : this.props.maskVisiable;
      this.props.dispatch({ type: 'popupFilter/changeFilterMenuState', index: menuIndex, visiable });
    }
  }

  onButtonLayout(event) {
    Util.consoleLog('filter button layout: ', event.nativeEvent.layout);
    this.props.dispatch({ type: 'popupFilter/initMaskParams', layout: event.nativeEvent.layout, winSize: Dimensions.get('window') });
  }

  renderMask() {
    if (!this.props.maskVisiable) {
      return (<View />);
    }
    const layout = this.props.maskLayout;
    const filterMenuIndex = this.props.filterMenuIndex;
    const filterItems = this.props.filterDataArrays[filterMenuIndex].filterItems;
    const itemSelectedItem = this.props.menuStateArray[filterMenuIndex].itemSelectedIndex;
    return (
      <View style={[tabStyles.isopen, { marginTop: 38 }]}>
        <View>
          <ScrollView style={{ backgroundColor: 'rgba(255,255,255,1)', maxHeight: Dimensions.get('window').height / 3 }}>
            <List>
              {filterItems.map((data, index) => (
                <List.Item key={index}>
                  <TouchableHighlight style={{ flex: 1, justifyContent: 'center' }} underlayColor={'rgba(0,0,0,0)'} onPress={() => this.onItemClicked(filterMenuIndex, index, data.text)} >
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Text style={index === itemSelectedItem ? { color: '#349EEC' } : {}}>{data.text}</Text>
                      {index === itemSelectedItem ? (<Image style={{ width: 12, height: 12, marginLeft: 10 }} source={this.itemChoose} />) : (<View />)}
                    </View>
                  </TouchableHighlight>
                </List.Item>
              ))}
            </List>
          </ScrollView>
        </View>
        <TouchableWithoutFeedback onPress={() => this.onMaskPress()}>
          <View style={{ width: layout.width, height: layout.height, backgroundColor: 'rgba(52,52,52,0.5)', backfaceVisibility: 'hidden' }} />
        </TouchableWithoutFeedback>
      </View>
    );
  }

  render() {
    return (
      <View style={{ zIndex: 99 }}>
        <View style={[tabStyles.center, tabStyles.row1, tabStyles.tab]} onLayout={event => this.onButtonLayout(event)}>
          {this.props.filterDataArrays.map((data, index) => (
            <TouchableHighlight underlayColor={'rgba(0,0,0,0)'} key={index} onPress={() => this.onButtonClicked(index)} style={tabStyles.flex}>
              <View
                style={[
                  tabStyles.flex,
                  tabStyles.tagView1,
                  tabStyles.row1,
                  { justifyContent: 'center', flexDirection: 'row', alignItems: 'flex-start' },
                  (index === this.props.filterMenuIndex && this.props.filterDataArrays[index].isSort) ?
                    tabStyles.active :
                    ((index === this.props.filterMenuIndex && this.props.maskVisiable) ? tabStyles.active1 : tabStyles.active2),
                ]}
              >
                <Text
                  style={[
                    tabStyles.tabs,
                    tabStyles.tabFont,
                    tabStyles.tabFontDown,
                    (this.props.filterDataArrays[index].isSort && index === this.props.filterMenuIndex) ?
                      tabStyles.tabColor :
                      (index === this.props.filterMenuIndex && this.props.maskVisiable) ? tabStyles.tabColor : {},
                  ]}
                >
                  {this.props.menuStateArray[index] && this.props.menuStateArray[index].displayText}
                </Text>
                <Image
                  style={[tabStyles.tabImg, tabStyles.tabImgDown]}
                  /* source={(index ===2 & index === this.props.filterMenuIndex) ? this.arrowDownChoose : ( index === this.props.filterMenuIndex & this.props.maskVisiable) ? this.arrowUp : this.arrowDown}*/
                  /* 当mask激活或者当前按钮为排序时 箭头显示为激活状态*/
                  source={index === this.props.filterMenuIndex && (this.props.filterDataArrays[index].isSort || this.props.maskVisiable) ?
                    (this.props.menuStateArray[index].arrowDown ? this.arrowDownChoose : this.arrowUpChoose) :
                    (this.props.menuStateArray[index] && this.props.menuStateArray[index].arrowDown ? this.arrowDown : this.arrowUp)
                  }
                />
              </View>
            </TouchableHighlight>
          ))}
        </View>
        {this.renderMask()}
      </View>
    );
  }
}

PopupFilter.propTypes = {
  dispatch: PropTypes.func,
  filterMenuIndex: PropTypes.number,
  maskVisiable: PropTypes.bool,
  maskLayout: PropTypes.object,
  // filterDatas: PropTypes.array,
  onItemSelected: PropTypes.func,
  filterDataArrays: PropTypes.array,
  menuStateArray: PropTypes.array,
};

const mapStateToProps = state => ({
  filterMenuIndex: state.popupFilter.filterMenuIndex,
  maskVisiable: state.popupFilter.maskVisiable,
  maskLayout: state.popupFilter.maskLayout,
  menuStateArray: state.popupFilter.menuStateArray,
  // filterDatas: state.popupFilter.filterDatas,
});

export default connect(mapStateToProps)(PopupFilter);
