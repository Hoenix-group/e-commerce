import React, { PropTypes, Component } from 'react';
import { View, Text, Image, TouchableHighlight } from 'react-native';
import { connect } from 'dva/mobile';
import { Popover, List, Flex } from 'antd-mobile';
import tabs_styles from './tabs_styles';

const Item = Popover.Item;
let isshow = false;
// 更改上拉下拉箭头
let arrow_temp2 = require('./../../../images/productDetallsImgs/icons/tab_down.png');
let arrow_temp1 = require('./../../../images/productDetallsImgs/icons/tab_down.png');
let arrow_temp3 = require('./../../../images/productDetallsImgs/icons/tab_down.png');
let arrow_temp4 = require('./../../../images/productDetallsImgs/icons/tab_down.png');
let arrow_temp5 = require('./../../../images/productDetallsImgs/icons/tab_down.png');

class tabs extends Component {
  componentWillUnmount() {
    isshow = false;
  }
  change = (key) => {
    if (key === 1) {
      this.arrImg();
      arrow_temp1 = require('./../../../images/productDetallsImgs/icons/tab_donw_choose.png');
    } else if (key === 2) {
      this.arrImg();
      arrow_temp2 = require('./../../../images/productDetallsImgs/icons/tab_donw_choose.png');
    } else if (key === 3) {
      this.arrImg();
      arrow_temp3 = require('./../../../images/productDetallsImgs/icons/tab_donw_choose.png');
    } else if (key === 4) {
      this.arrImg();
      arrow_temp4 = require('./../../../images/productDetallsImgs/icons/tab_donw_choose.png');
    }else if (key === 5) {
      this.arrImg();
      arrow_temp5 = require('./../../../images/productDetallsImgs/icons/tab_donw_choose.png');
    }
    this.props.dispatch({
      type: 'ProductListTabs/changeType',
      tabsNum: key,
    });
  }
  arrImg = () => {
    arrow_temp1 = require('./../../../images/productDetallsImgs/icons/tab_down.png');
    arrow_temp2 = require('./../../../images/productDetallsImgs/icons/tab_down.png');
    arrow_temp3 = require('./../../../images/productDetallsImgs/icons/tab_down.png');
    arrow_temp4 = require('./../../../images/productDetallsImgs/icons/tab_down.png');
    arrow_temp5 = require('./../../../images/productDetallsImgs/icons/tab_down.png');
    this.arrowIsshow(isshow);
  }
  arrowIsshow = (isshow) => {
    if (isshow) {
      isshow = false;
    } else {
      isshow = true;
    }
    this.props.dispatch({
      type: 'Search/changeOpen',
      open: isshow,
    });
  }

  render() {
    const styleColor = (this.props.tabsNum === 1 ? tabs_styles.tabColor : {});
    const styleColor2 = (this.props.tabsNum === 2 ? tabs_styles.tabColor : {});
    const styleColor3 = (this.props.tabsNum === 3 ? tabs_styles.tabColor : {});
    const styleColor4 = (this.props.tabsNum === 4 ? tabs_styles.tabColor : {});
    const styleColor5 = (this.props.tabsNum === 5 ? tabs_styles.tabColor : {});
    return(
      <View>
      <View style={[tabs_styles.main]}>
        <View style={tabs_styles.outsideView}>

          <TouchableHighlight underlayColor={'rgba(0,0,0,0)'} onPress={() => this.change(2)} style={tabs_styles.flex}>
            <View style={[tabs_styles.tabsView]}>
              <Text numberOfLines={1} style={[tabs_styles.tabsText,styleColor2]}>市</Text>
              <Image style={tabs_styles.tabsImgs} source={arrow_temp2} />
            </View>
          </TouchableHighlight>

          <TouchableHighlight underlayColor={'rgba(0,0,0,0)'} onPress={() => this.change(3)} style={tabs_styles.flex}>
            <View style={[tabs_styles.tabsView]}>
              <Text numberOfLines={1} style={[tabs_styles.tabsText,styleColor3]}>门店</Text>
              <Image style={tabs_styles.tabsImgs} source={arrow_temp3} />
            </View>
          </TouchableHighlight>

          <TouchableHighlight underlayColor={'rgba(0,0,0,0)'} onPress={() => this.change(4)} style={tabs_styles.flex}>
            <View style={[tabs_styles.tabsView]}>
              <Text numberOfLines={1} style={[tabs_styles.tabsText,styleColor4]}>渠道</Text>
              <Image style={tabs_styles.tabsImgs} source={arrow_temp4} />
            </View>
          </TouchableHighlight>

          <TouchableHighlight underlayColor={'rgba(0,0,0,0)'} onPress={() => this.change(5)} style={tabs_styles.flex}>
            <View style={[tabs_styles.tabsView]}>
              <Text numberOfLines={1} style={[tabs_styles.tabsText,styleColor5]}>促销类型</Text>
              <Image style={tabs_styles.tabsImgs} source={arrow_temp5} />
            </View>
          </TouchableHighlight>

        </View>

      </View>
    </View>
    );
  }
}
tabs.propTypes = {
  dispatch: PropTypes.func,
  tabsNum: PropTypes.number,
  funcFilter: PropTypes.func,
};
const mapStateToProps = ({ Search, ProductListTabs }) => {
  const { tabsNum } = ProductListTabs;
  return { tabsNum };
};
export default connect(mapStateToProps)(tabs);
