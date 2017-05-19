import React, { PropTypes, Component } from 'react';
import { ScrollView, View, Text, TouchableHighlight, Image } from 'react-native';
import { Flex, List, Tag, Modal } from 'antd-mobile';
import { Actions } from 'react-native-router-flux';
import RsTag from './../Tag/Tag';

import styles from './styles';

const alert = Modal.alert;
const hotCount = [
    { id: 0, text: '普通商品' },
    { id: 1, text: '特价' },
    { id: 2, text: '赠品' },
    { id: 3, text: '售后商品' },
    { id: 4, text: '包销' },
    { id: 5, text: '定制' },
    { id: 6, text: '工程' },
    { id: 7, text: '我方样机' },
    { id: 8, text: '厂方样机' },
    { id: 9, text: '等级' },
    { id: 10, text: '特价等级' },
    { id: 11, text: '包销等级' },
    { id: 12, text: '定制等级' },
    { id: 13, text: '工程等级' },
    ];

class SearchList extends Component {
  // 最近搜索
  historyData = (datarry) => {
    const data = [];
    const searchStorageArr = datarry ? datarry.split('@#$%!') : [];
    searchStorageArr.map((item, it) => {
      data.push(
        <View key={`${it}-${item}`} style={[styles.tagView]}>
            <RsTag
              key={`${it}-${item}`}
              childrens={item}
              onChange={() => { this.props.auotInputSearchItem(item); }}
              onLongPress={this.props.onLongPress}
              onClose={() => { this.props.Close(item); }}
              closable={Boolean(this.props.closable)}
              selected={false}
              isUsenumberOfLinesAndNum={1}
            />
        </View>,
          );
    });
    return data;
  }
  // 收藏商品
  collect = (dataArr) => {
    const data = [];
    let datas;
    if (dataArr.length > 5) {
      datas = dataArr.slice(0, 5);
    } else {
      datas = dataArr;
    }
    datas.map((item, index) => {
      const product = item.product;
      data.push(
        <View key={index} style={[styles.tagView]}>
          <RsTag
            key={index}
            selected={false}
            childrens={product.name}
            isUsenumberOfLinesAndNum={1}
            onChange={() => { this.props.auotWishItem(product.code, product.regionCode, product.channelCode, product.productAttribute); }}
          />
        </View>,
           );
    });
    return data;
  }
  queryList = (datalist) => {
    const data = [];
    datalist.map((item) => {
      data.push(
        <List.Item onClick={() => { this.props.auotInputSearchItem(item.value); }} key={item.value}>{item.value}</List.Item>,
      );
    });
    return data;
  }
  showWarning = () => {
    alert('确定清空最近搜索记录？', '', [
      { text: '取消', onPress: () => { } },
      { text: '确定', onPress: () => this.props.closeAll(), style: { fontWeight: 'bold' } },
    ]);
  }

  toWishList = () => {
    Actions.wishlist({ from: 'globalSearch' });
  }
  render() {
    return (
      <TouchableHighlight underlayColor={'transparent'} onPress={() => {this.props.closeButton(); }}>
        <ScrollView style={[styles.comment]}>
          { this.props.searchListVal && this.props.searchListVal.suggestions ? (
            <List>
              {this.queryList(this.props.searchListVal.suggestions)}
            </List>
          ) : (
            <View>
              {
                this.props.hotTag === 0 || this.props.hotTag === '0' ? (
                  <View>
                    <View style={{ marginTop: 10 }}>
                      <Flex align="start">
                        <Flex.Item flex={8}><Text style={styles.textView}>最近搜索</Text></Flex.Item>
                        <Flex.Item flex={1} onPress={() => {this.showWarning(); }}>
                          <Image style={styles.icon} source={require('./../../../images/search/button_delete.png')} />
                        </Flex.Item>
                      </Flex>
                    </View>
                    <TouchableHighlight
                      onLongPress={() => this.props.onLongPress}
                      onPress = {() => this.props.closeButton}
                      underlayColor={'red'}
                    >
                      <View>
                        {
                          this.props.historyList.length > 0 ? (<Flex align="start" wrap="wrap" onLongPress={() => this.props.onLongPress}>
                          {this.historyData(this.props.historyList)}
                        </Flex>) : (null)
                        }                        
                      </View>
                    </TouchableHighlight>
                    <View style={styles.styleLine} />
                    <View>
                      <Flex align="start">
                        <Flex.Item style={{ flex: 3 }}><Text style={styles.textView}>收藏商品</Text></Flex.Item>
                        <Flex.Item>
                          <Text style={styles.stylePage} numberOfLines={1} onPress={() => { this.toWishList(); }}>我的收藏夹</Text>
                        </Flex.Item>
                      </Flex>
                      {
                        this.props.wishlistVal.length > 0 ? (<Flex align="start" wrap="wrap">
                            {this.collect(this.props.wishlistVal)}
                          </Flex>) : (null)
                      }
                     
                    </View>
                    <View style={styles.styleLine} />
                  </View>
                ) : (null)
            }
              <View>
                <Flex align="start">
                  <Flex.Item><Text style={styles.textView}>热门分类</Text></Flex.Item>
                </Flex>
                <ScrollView horizontal={true}>
                  <Flex justify="start">
                    <View style={[styles.hottag]}>
                      <Flex>
                        <Flex.Item>
                          <TouchableHighlight underlayColor={'rgba(0,0,0,0)'} onPress={() => { this.props.onChangeHot(String(0)); }}>
                            <Image style={styles.hoticon} source={this.props.hotCountFlag[0] ? require('./../../../images/search/search_shortcut_sample.png') : require('./../../../images/search/search_shortcut_sample.png')} />
                          </TouchableHighlight>
                        </Flex.Item>
                      </Flex>
                      <Flex>
                        <Flex.Item>
                          <Text onPress={() => { this.props.onChangeHot(String(0)); }} style={[styles.hotText, this.props.hotCountFlag[0] ? styles.activeText : {}]}>{hotCount[0].text}</Text>
                        </Flex.Item>
                      </Flex>
                    </View>
                    <View style={[styles.hottag]}>
                      <Flex>
                        <Flex.Item>
                          <TouchableHighlight underlayColor={'rgba(0,0,0,0)'} onPress={() => { this.props.onChangeHot(String(1)); }}>
                            <Image style={styles.hoticon} source={this.props.hotCountFlag[1] ? require('./../../../images/search/search_shortcut_product.png') : require('./../../../images/search/search_shortcut_product.png')} />
                          </TouchableHighlight>
                        </Flex.Item>
                      </Flex>
                      <Flex>
                        <Flex.Item>
                          <Text onPress={() => { this.props.onChangeHot(String(1)); }} style={[styles.hotText, this.props.hotCountFlag[1] ? styles.activeText : {}]}>{hotCount[1].text}</Text>
                        </Flex.Item>
                      </Flex>
                    </View>
                    <View style={[styles.hottag]}>
                      <Flex>
                        <Flex.Item>
                          <TouchableHighlight underlayColor={'rgba(0,0,0,0)'} onPress={() => { this.props.onChangeHot(String(2)); }}>
                            <Image style={styles.hoticon} source={this.props.hotCountFlag[2] ? require('./../../../images/search/search_shortcut_aftersale.png') : require('./../../../images/search/search_shortcut_aftersale.png')} />
                          </TouchableHighlight>
                        </Flex.Item>
                      </Flex>
                      <Flex>
                        <Flex.Item>
                          <Text onPress={() => { this.props.onChangeHot(String(2)); }} style={[styles.hotText, this.props.hotCountFlag[2] ? styles.activeText : {}]}>{hotCount[2].text}</Text>
                        </Flex.Item>
                      </Flex>
                    </View>
                    <View style={[styles.hottag]}>
                      <Flex>
                        <Flex.Item>
                          <TouchableHighlight underlayColor={'rgba(0,0,0,0)'} onPress={() => { this.props.onChangeHot(String(3)); }}>
                            <Image style={styles.hoticon} source={this.props.hotCountFlag[3] ? require('./../../../images/search/search_shortcut_gift.png') : require('./../../../images/search/search_shortcut_gift.png')} />
                          </TouchableHighlight>
                        </Flex.Item>
                      </Flex>
                      <Flex>
                        <Flex.Item>
                          <Text onPress={() => { this.props.onChangeHot(String(3)); }} style={[styles.hotText, this.props.hotCountFlag[3] ? styles.activeText : {}]}>{hotCount[3].text}</Text>
                        </Flex.Item>
                      </Flex>
                    </View>
                    <View style={[styles.hottag]}>
                      <Flex>
                        <Flex.Item>
                          <TouchableHighlight underlayColor={'rgba(0,0,0,0)'} onPress={() => { this.props.onChangeHot(String(4)); }}>
                            <Image style={styles.hoticon} source={this.props.hotCountFlag[4] ? require('./../../../images/search/search_shortcut_gift.png') : require('./../../../images/search/search_shortcut_gift.png')} />
                          </TouchableHighlight>
                        </Flex.Item>
                      </Flex>
                      <Flex>
                        <Flex.Item>
                          <Text onPress={() => { this.props.onChangeHot(String(4)); }} style={[styles.hotText, this.props.hotCountFlag[4] ? styles.activeText : {}]}>{hotCount[4].text}</Text>
                        </Flex.Item>
                      </Flex>
                    </View>
                    <View style={[styles.hottag]}>
                      <Flex>
                        <Flex.Item>
                          <TouchableHighlight underlayColor={'rgba(0,0,0,0)'} onPress={() => { this.props.onChangeHot(String(5)); }}>
                            <Image style={styles.hoticon} source={this.props.hotCountFlag[5] ? require('./../../../images/search/search_shortcut_gift.png') : require('./../../../images/search/search_shortcut_gift.png')} />
                          </TouchableHighlight>
                        </Flex.Item>
                      </Flex>
                      <Flex>
                        <Flex.Item>
                          <Text onPress={() => { this.props.onChangeHot(String(5)); }} style={[styles.hotText, this.props.hotCountFlag[5] ? styles.activeText : {}]}>{hotCount[5].text}</Text>
                        </Flex.Item>
                      </Flex>
                    </View>
                    <View style={[styles.hottag]}>
                      <Flex>
                        <Flex.Item>
                          <TouchableHighlight underlayColor={'rgba(0,0,0,0)'} onPress={() => { this.props.onChangeHot(String(6)); }}>
                            <Image style={styles.hoticon} source={this.props.hotCountFlag[6] ? require('./../../../images/search/search_shortcut_gift.png') : require('./../../../images/search/search_shortcut_gift.png')} />
                          </TouchableHighlight>
                        </Flex.Item>
                      </Flex>
                      <Flex>
                        <Flex.Item>
                          <Text onPress={() => { this.props.onChangeHot(String(6)); }} style={[styles.hotText, this.props.hotCountFlag[6] ? styles.activeText : {}]}>{hotCount[6].text}</Text>
                        </Flex.Item>
                      </Flex>
                    </View>
                    <View style={[styles.hottag]}>
                      <Flex>
                        <Flex.Item>
                          <TouchableHighlight underlayColor={'rgba(0,0,0,0)'} onPress={() => { this.props.onChangeHot(String(7)); }}>
                            <Image style={styles.hoticon} source={this.props.hotCountFlag[7] ? require('./../../../images/search/search_shortcut_gift.png') : require('./../../../images/search/search_shortcut_gift.png')} />
                          </TouchableHighlight>
                        </Flex.Item>
                      </Flex>
                      <Flex>
                        <Flex.Item>
                          <Text onPress={() => { this.props.onChangeHot(String(7)); }} style={[styles.hotText, this.props.hotCountFlag[7] ? styles.activeText : {}]}>{hotCount[7].text}</Text>
                        </Flex.Item>
                      </Flex>
                    </View>
                    <View style={[styles.hottag]}>
                      <Flex>
                        <Flex.Item>
                          <TouchableHighlight underlayColor={'rgba(0,0,0,0)'} onPress={() => { this.props.onChangeHot(String(8)); }}>
                            <Image style={styles.hoticon} source={this.props.hotCountFlag[8] ? require('./../../../images/search/search_shortcut_gift.png') : require('./../../../images/search/search_shortcut_gift.png')} />
                          </TouchableHighlight>
                        </Flex.Item>
                      </Flex>
                      <Flex>
                        <Flex.Item>
                          <Text onPress={() => { this.props.onChangeHot(String(8)); }} style={[styles.hotText, this.props.hotCountFlag[8] ? styles.activeText : {}]}>{hotCount[8].text}</Text>
                        </Flex.Item>
                      </Flex>
                    </View>
                    <View style={[styles.hottag]}>
                      <Flex>
                        <Flex.Item>
                          <TouchableHighlight underlayColor={'rgba(0,0,0,0)'} onPress={() => { this.props.onChangeHot(String(9)); }}>
                            <Image style={styles.hoticon} source={this.props.hotCountFlag[9] ? require('./../../../images/search/search_shortcut_gift.png') : require('./../../../images/search/search_shortcut_gift.png')} />
                          </TouchableHighlight>
                        </Flex.Item>
                      </Flex>
                      <Flex>
                        <Flex.Item>
                          <Text onPress={() => { this.props.onChangeHot(String(9)); }} style={[styles.hotText, this.props.hotCountFlag[9] ? styles.activeText : {}]}>{hotCount[9].text}</Text>
                        </Flex.Item>
                      </Flex>
                    </View>
                    <View style={[styles.hottag]}>
                      <Flex>
                        <Flex.Item>
                          <TouchableHighlight underlayColor={'rgba(0,0,0,0)'} onPress={() => { this.props.onChangeHot(String(10)); }}>
                            <Image style={styles.hoticon} source={this.props.hotCountFlag[10] ? require('./../../../images/search/search_shortcut_gift.png') : require('./../../../images/search/search_shortcut_gift.png')} />
                          </TouchableHighlight>
                        </Flex.Item>
                      </Flex>
                      <Flex>
                        <Flex.Item>
                          <Text onPress={() => { this.props.onChangeHot(String(10)); }} style={[styles.hotText, this.props.hotCountFlag[10] ? styles.activeText : {}]}>{hotCount[10].text}</Text>
                        </Flex.Item>
                      </Flex>
                    </View>
                    <View style={[styles.hottag]}>
                      <Flex>
                        <Flex.Item>
                          <TouchableHighlight underlayColor={'rgba(0,0,0,0)'} onPress={() => { this.props.onChangeHot(String(11)); }}>
                            <Image style={styles.hoticon} source={this.props.hotCountFlag[11] ? require('./../../../images/search/search_shortcut_gift.png') : require('./../../../images/search/search_shortcut_gift.png')} />
                          </TouchableHighlight>
                        </Flex.Item>
                      </Flex>
                      <Flex>
                        <Flex.Item>
                          <Text onPress={() => { this.props.onChangeHot(String(11)); }} style={[styles.hotText, this.props.hotCountFlag[11] ? styles.activeText : {}]}>{hotCount[11].text}</Text>
                        </Flex.Item>
                      </Flex>
                    </View>
                    <View style={[styles.hottag]}>
                      <Flex>
                        <Flex.Item>
                          <TouchableHighlight underlayColor={'rgba(0,0,0,0)'} onPress={() => { this.props.onChangeHot(String(12)); }}>
                            <Image style={styles.hoticon} source={this.props.hotCountFlag[12] ? require('./../../../images/search/search_shortcut_gift.png') : require('./../../../images/search/search_shortcut_gift.png')} />
                          </TouchableHighlight>
                        </Flex.Item>
                      </Flex>
                      <Flex>
                        <Flex.Item>
                          <Text onPress={() => { this.props.onChangeHot(String(12)); }} style={[styles.hotText, this.props.hotCountFlag[12] ? styles.activeText : {}]}>{hotCount[12].text}</Text>
                        </Flex.Item>
                      </Flex>
                    </View>
                    <View style={[styles.hottag]}>
                      <Flex>
                        <Flex.Item>
                          <TouchableHighlight underlayColor={'rgba(0,0,0,0)'} onPress={() => { this.props.onChangeHot(String(13)); }}>
                            <Image style={styles.hoticon} source={this.props.hotCountFlag[13] ? require('./../../../images/search/search_shortcut_gift.png') : require('./../../../images/search/search_shortcut_gift.png')} />
                          </TouchableHighlight>
                        </Flex.Item>
                      </Flex>
                      <Flex>
                        <Flex.Item>
                          <Text onPress={() => { this.props.onChangeHot(String(13)); }} style={[styles.hotText, this.props.hotCountFlag[13] ? styles.activeText : {}]}>{hotCount[13].text}</Text>
                        </Flex.Item>
                      </Flex>
                    </View>
                  </Flex>
                </ScrollView>
              </View>
            </View>
          )
          }
        </ScrollView>
      </TouchableHighlight>
    );
  }
}
SearchList.propTypes = {
  auotInputSearchItem: PropTypes.func,
  closable: PropTypes.bool,
  onLongPress: PropTypes.func,
  Close: PropTypes.func,
  closeAll: PropTypes.func,
  searchListVal: PropTypes.object,
  wishlistVal: PropTypes.array,
  historyList: PropTypes.string,
  auotWishItem: PropTypes.func,
  onChangeHot: PropTypes.func,
  closeButton: PropTypes.func,
  hotTag: PropTypes.string,
  hotCountFlag: PropTypes.array,
};
export default SearchList;
