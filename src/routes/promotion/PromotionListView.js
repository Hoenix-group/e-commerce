import React, { Component, PropTypes } from 'react';
import { connect } from 'dva/mobile';
import { Actions } from 'react-native-router-flux';
import { Text, List, Tag, ListView, Picker } from 'antd-mobile';
import { View, InteractionManager, TouchableOpacity, Image, TouchableHighlight } from 'react-native';
import styles from './styles';
import { secondaryButtonViewMiddle, secondaryButtonTextMiddle } from './../../themes/fsBaseStyles';
import RootView from './../../components/common/RootView';
import FsRootView from './../../components/common/FsRootView';
import RegionPrickerContent from './../region/RegionPrickerContent';
import * as dictionaryService from './../../services/dictionaryService';
import { district, channel, promotionType, pos } from '../../data';
import tabs_styles from './tabs_styles';

const Item = List.Item;
const iconRight = (<Image style={{ width: 12, height: 12 }} source={require('./../../../images/productDetallsImgs/icons/rn-chevron-right.png')} />);
let fsDrawerLayout;
class PromotionListView extends Component {
  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.getPromotions(null, this.props.pageSize, 0);
    });
    this.props.dispatch({
      type: 'ProductListTabs/changeType',
      tabsNum: 2,
    });
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: 'promotion/initializeState',
    });
  }

  onEndReached() {
    if (this.props.isFullyLoaded) {
      return;
    }
    this.getPromotions(this.props.filters, this.props.pageSize, this.props.currentPage + 1);
  }

  getPromotions(filters, pageSize, currentPage) {
    this.props.dispatch({
      type: 'promotion/getAll',
      filters,
      pageSize,
      currentPage,
    });
  }

  getCities() {
    const province = district.filter(entry => entry.value === this.props.filters.province);
    return (province && province.length) ? province[0].children : [];
  }

  getPos() {
    const city = pos.filter(entry => entry.value === this.props.filters.city);
    return (city && city.length) ? city[0].children : [];
  }

  getPointOfServiceSummary(scopes) {
    if (!scopes) {
      return '';
    }

    let summary = '';
    const truncationLength = 8;
    for (let i = 0; i < scopes.length; i += 1) {
      const names = scopes[i].pointOfServiceNames;

      if (names) {
        if (summary.length > 0) {
          summary += ',';
        }
        summary += names.join(',');
        if (summary.length > truncationLength) {
          return `${summary.substring(0, truncationLength)}...`;
        }
      }
    }

    return summary;
  }

  viewPromotionDetails(entry) {
    this.props.dispatch({
      type: 'promotion/setPromotionId',
      promotionId: entry.code,
    });

    Actions.promotionDetails();
  }

  updateProvince(val) {
    this.list.scrollTo({ x: 0, y: 0, animated: true }); // 改变过滤条件时，回到list顶部，避免新数据的长度小于原数据，出现屏幕空白的现象
    this.getPromotions({ ...this.props.filters, province: val[0], city: '', pos: '' }, this.props.pageSize, 0);
  }

  updateCity(val, key) {
    this.list.scrollTo({ x: 0, y: 0, animated: true });
    this.getPromotions({ ...this.props.filters, province: val[0], city: val[1], pos: '' }, this.props.pageSize, 0);
    this.props.dispatch({
      type: 'ProductListTabs/changeType',
      tabsNum: key,
    });
  }

  updatePos(val, key) {
    this.list.scrollTo({ x: 0, y: 0, animated: true });
    this.getPromotions({ ...this.props.filters, pos: val[0] }, this.props.pageSize, 0);
    this.props.dispatch({
      type: 'ProductListTabs/changeType',
      tabsNum: key,
    });
  }

  updateChannel(val, key) {
    this.list.scrollTo({ x: 0, y: 0, animated: true });
    this.getPromotions({ ...this.props.filters, channel: val[0] }, this.props.pageSize, 0);
    this.props.dispatch({
      type: 'ProductListTabs/changeType',
      tabsNum: key,
    });
  }

  updateType(val, key) {
    this.list.scrollTo({ x: 0, y: 0, animated: true });
    this.getPromotions({ ...this.props.filters, type: val[0] }, this.props.pageSize, 0);
    this.props.dispatch({
      type: 'ProductListTabs/changeType',
      tabsNum: key,
    });
  }

  renderScope(scope, i) {
    return (
      <View key={i} style={[secondaryButtonViewMiddle, { height: 22, padding: 3, marginHorizontal: 2 }]}>
        <Text style={[secondaryButtonTextMiddle, { fontSize: 14 }]}>{dictionaryService.getChannelLabel(scope.channelCode)}</Text>
      </View>

    );
  }

  getPointOfServiceSummary(scopes) {
    if (!scopes) {
      return '';
    }

    let summary = '';
    for (let i = 0; i < scopes.length; i += 1) {
      const names = scopes[i].pointOfServiceNames;
      if (names) {
        if (summary.length > 0) {
          summary += ',';
        }
        summary += names.join(',');
      }
    }

    return summary;
  }

  renderEntry(entry, index) {
    return (
      <TouchableHighlight underlayColor={'rgba(0,0,0,0)'} onPress={() => { this.viewPromotionDetails(entry); }}>
        <View style={styles.resultList}>
          <View style={[styles.resultListLeft]}>
            <Text style={[styles.font33, styles.fontSizeLarge]} numberOfLines={2} >{entry.name}</Text>
            <Text style={styles.fontGrey} numberOfLines={1}>生效时间：{entry.startTime} 至 {entry.endTime}</Text>
          </View>
          <View style={[styles.resultListRight]}>
            <View style={{ flex: 1 }}>
              <View style={{ paddingRight: 5, alignItems: 'center', justifyContent: 'flex-end', flexDirection: 'row' }}>
                {entry.scopes.map((scope, i) => this.renderScope(scope, i))}
              </View>
              <View>
                <Text numberOfLines={1} style={styles.fontTitle}>{this.getPointOfServiceSummary(entry.scopes)}</Text>
              </View>
            </View>
            {iconRight}
          </View>
        </View>
      </TouchableHighlight>
    );
  }

  tabs() {
    const styleColor = (this.props.tabsNum === 1 ? tabs_styles.tabColor : {});
    const styleColor2 = (this.props.tabsNum === 2 ? tabs_styles.tabColor : {});
    const styleColor3 = (this.props.tabsNum === 3 ? tabs_styles.tabColor : {});
    const styleColor4 = (this.props.tabsNum === 4 ? tabs_styles.tabColor : {});
    const styleColor5 = (this.props.tabsNum === 5 ? tabs_styles.tabColor : {});
    return (
      <View style={[styles.flex]}>
        <View style={[tabs_styles.main, styles.flex]}>
          <View style={[tabs_styles.outsideView, styles.flex]}>
            <View style={[tabs_styles.tabsView, styles.flex]}>
              {/* <Picker
                  extra="市"
                  data={[{ value: '', label: '全部',}, ...district]} cols={1} title="选择省"
                  triggerType="onClick" value={[this.props.filters.province]} onChange={(val) => { this.updateProvince(val); }}
                >
                  <RegionPrickerContent textStyle={[styles.fontSize14, styles.filterColor]}/>
                </Picker>*/}
              <Picker
                extra="区域" data={[{ value: '', label: '全部' }, ...district]} cols={2} title="选择区域" triggerType="onClick"
                value={[this.props.filters.province, this.props.filters.city]} onChange={(val) => { this.updateCity(val, 2); }}
              >
                <RegionPrickerContent textStyle={[styles.flex, styles.fontSizeLarge, styles.filterColor, styleColor2]} defaultExtra="区域" />
              </Picker>
              {/* <Image style={tabs_styles.tabsImgs} source={arrow_temp2} />*/}
            </View>

            <View style={[tabs_styles.tabsView, styles.flex]}>
              <Picker extra="门店" data={[{ value: '', label: '全部' }, ...this.getPos()]} cols={1} title="选择门店" triggerType="onClick" value={[this.props.filters.pos]} onChange={(val) => { this.updatePos(val, 3); }}>
                <RegionPrickerContent textStyle={[styles.flex, styles.fontSizeLarge, styles.filterColor, styleColor3]} defaultExtra="门店" />
              </Picker>
              {/* <Image style={tabs_styles.tabsImgs} source={arrow_temp3} />*/}
            </View>

            <View style={[tabs_styles.tabsView, styles.flex]}>
              <Picker extra="渠道" data={[{ value: '', label: '全部' }, ...channel]} cols={1} title="选择渠道" triggerType="onClick" value={[this.props.filters.channel]} onChange={(val) => { this.updateChannel(val, 4); }}>
                <RegionPrickerContent textStyle={[styles.flex, styles.fontSizeLarge, styles.filterColor, styleColor4]} defaultExtra="渠道" />
              </Picker>
              {/* <Image style={tabs_styles.tabsImgs} source={arrow_temp4} />*/}
            </View>

            <View style={[tabs_styles.tabsView, styles.flex]}>
              <Picker extra="促销类型" data={[{ value: '', label: '全部' }, ...promotionType]} cols={1} title="选择促销类型" triggerType="onClick" value={[this.props.filters.type]} onChange={(val) => { this.updateType(val, 5); }}>
                <RegionPrickerContent textStyle={[styles.flex, styles.fontSizeLarge, styles.filterColor, styleColor5]} defaultExtra="促销类型" />
              </Picker>
              {/* <Image style={tabs_styles.tabsImgs} source={arrow_temp5} />*/}
            </View>

          </View>

        </View>
      </View>
    );
  }

  render() {
    const funcFilter = () => {
      fsDrawerLayout.openDrawer();
    };
    const closeFilter = () => {
      fsDrawerLayout.closeDrawer();
    };

    return (
      <FsRootView isNavBarHidden={false}>
        <View style={{ flex: 1 }}>
          <View style={{ zIndex: 66 }}>
            {this.tabs()}
          </View>
          <ListView
            ref={list => this.list = list}
            enableEmptySections
            dataSource={this.props.dataSource}
            renderRow={rowData => (this.renderEntry(rowData))}
            delayTime={10}
            delayActivityIndicator={<Text>刷新中...</Text>}
            renderFooter={() => <View style={styles.footer}><Text style={[styles.font_12, styles.font_g, { paddingVertical: 10 }]}>
              {this.props.isFullyLoaded ? '我是有底线的' : '上拉加载更多' }
            </Text></View>}
            onEndReached={() => this.onEndReached()}
            initialListSize={10}
            onEndReachedThreshold={20}
            style={styles.listViewStyle}
          />
        </View>
      </FsRootView>
    );
  }
}

PromotionListView.propTypes = {
  filters: PropTypes.object,
  dispatch: PropTypes.func,
  dataSource: PropTypes.object,
  isFullyLoaded: PropTypes.bool,
  pageSize: PropTypes.number,
  currentPage: PropTypes.number,
  tabsNum: PropTypes.number,
};

const mapStateToProps = ({ promotion, ProductListTabs }) => {
  const { filters, dataSource, isFullyLoaded, pageSize, currentPage } = promotion;
  const { tabsNum } = ProductListTabs;
  return { filters, dataSource, isFullyLoaded, pageSize, currentPage, tabsNum };
};

export default connect(mapStateToProps)(PromotionListView);
