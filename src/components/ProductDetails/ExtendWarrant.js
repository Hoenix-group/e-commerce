import React, { Component, PropTypes } from 'react';
import { View, TouchableHighlight, Image, ScrollView, Text } from 'react-native';
import { Button, Flex, Tag } from 'antd-mobile';
import RsTag from './../Tag/Tag';
import styles from './styles';

let extendcode = '';
let extendname = '未选择';
let i = 0; // 延保点击第几个
class ExtendWarrant extends Component {
  /**
   * 加入购物车
   */
  addToCart() {
    if (this.props.product.available) {
      this.props.add(this.props.product.code, this.props, this.props.cartNum, extendcode);
    }
  }
  productTag(data) {
    const datas = [];
    for (let it = 0; it < data.length; it++) {
      datas.push(
        <View key={it} style={[styles.marginVer]}>
          <RsTag
            selected={Boolean(data[it].select)}
            onChange={(tag) => { this.changeparent(tag, data[it].name); }}
            childrens={data[it].name}
            isWidth={0}
            isUsenumberOfLinesAndNum={1}
          />
        </View>,
        );
    }
    return datas;
  }
  productValTag(data) {
    const datas = [];
    for (let it = 0; it < data[i].length; it++) {
      if (data[i][it].duration) {
        const mounthData = (parseInt(data[i][it].duration, 10) * 12).toString() + '个月';
        datas.push(
          <View key={it} style={[styles.marginVer]}>
            <RsTag
              selected={Boolean(data[i][it].select)}
              onChange={(tag) => { this.changechild(tag, data[i][it].code); }}
              childrens={mounthData}
              isWidth={mounthData.length || 0}
              isUsenumberOfLinesAndNum={0}
            />
          </View>,
          );
      }  
    }
    return datas;
  }
  changeattr() {
    const datas = this.props.extendwarrantTag;
    for (let it = 0; it < datas.length; it++) {
      datas[it].select = false;
    }
    const data = this.props.extendwarrantVal;
    for (let its = 0; its < data.length; its++) {
      data[its].select = false;
    }
    extendcode = '';
    extendname = '未选择';
    this.props.changeExtends(true, datas, data, extendcode, extendname, this.props);
  }
  changeparent(tag, name) {
    const datas = this.props.extendwarrantTag;
    for (let it = 0; it < datas.length; it++) {
      datas[it].select = false;
      if (datas[it].name === name) {
        datas[it].select = true;
        i = it;
      }
    }
    const data = this.props.extendwarrantVal;
    for (let its = 0; its < data[i].length; its++) {
      data[i][its].select = false;
      if (data[i][0].code) {
        data[i][0].select = true;
        extendcode = data[i][0].code;
        extendname = data[i][0].name;
      }
    }
    this.props.changeExtends(false, datas, data, extendcode, extendname, this.props);
  }
  changechild(tag, code) {
    const datas = this.props.extendwarrantVal;
    for (let it = 0; it < datas[i].length; it++) {
      datas[i][it].select = false;
      if (datas[i][it].code === code) {
        datas[i][it].select = true;
        extendcode = datas[i][it].code;
        extendname = datas[i][it].name;
      }
    }
    this.props.changeExtends(false, this.props.extendwarrantTag, datas, extendcode, extendname, this.props);
  }
  render() {
    return (
      <View style={[styles.closeList]} key={1}>
        <View style={[styles.closeList, styles.borderB, styles.promView]} >
          <View style={[styles.center, styles.row1]}>
            <Text style={styles.promTitle}>选择延保</Text>
          </View>
        </View>
        <ScrollView>
          <View style={[styles.paddL, styles.borderB]}>
            <Flex wrap="wrap" style={{ marginVertical: 8 }} >
              <Flex.Item style={styles.marginVer}>
                <RsTag selected={Boolean(this.props.extendwarrantflag)} isUsenumberOfLinesAndNum={1} isWidth={0} onChange={(tag) => { this.changeattr(tag); }} childrens={'无延保'}/>
              </Flex.Item>
            </Flex>
          </View>
          {
              this.props.extendwarrantTag && this.props.extendwarrantTag.length > 0 ? (
                <View>
                  <View style={[styles.paddL, styles.borderB, { flex: 1, flexDirection: 'row' }]}>
                    <Text style={[{ alignSelf: 'center', marginVertical: 10 }, styles.contitle]}>延保信息</Text>
                  </View>
                  <View style={[styles.paddL, styles.borderB]}>
                    <Flex align="start" wrap="wrap" style={{ marginVertical: 10 }} >
                      {this.productTag(this.props.extendwarrantTag)}
                    </Flex>
                  </View>
                  {!this.props.extendwarrantflag ? (
                    <View>
                      <View style={[styles.paddL, styles.borderB, {flex: 1, flexDirection: 'row' }]}>
                        <Text style={[{ alignSelf: 'center', marginVertical: 10 }, styles.contitle]}>延保年限</Text>
                      </View>
                      <View style={[styles.paddL, styles.borderB]}>
                        <Flex align="start" wrap="wrap" style={{ marginTop: 2,marginBottom: 2 }} >
                          {this.productValTag(this.props.extendwarrantVal)}
                        </Flex>
                      </View>
                    </View>
                  ) : (null)
                }
                </View>
            ) : (null)
          }
        </ScrollView>
        <View>
          <Button disabled={!this.props.product.available} type="primary" onClick={() => { this.addToCart(); }} style={{ borderRadius: 0 }}>加入购物车</Button>
        </View>
        {/* 关闭按钮 */}
        <TouchableHighlight style={styles.closeIcon} underlayColor={'rgba(0,0,0,0)'} onPress={() => { this.props.close(); }}>
          <Image style={{ width: 12, height: 12 }} source={require('./../../../images/productDetallsImgs/icons/rn-close-s.png')} />
        </TouchableHighlight>
      </View>
    );
  }
}
ExtendWarrant.propTypes = {
  add: PropTypes.func,
  close: PropTypes.func,
  product: PropTypes.object,
  changeExtends: PropTypes.func,
  extendwarrantflag: PropTypes.bool,
  extendwarrantTag: PropTypes.array,
  extendwarrantVal: PropTypes.array,
  cartNum: PropTypes.number,
};
export default ExtendWarrant;
