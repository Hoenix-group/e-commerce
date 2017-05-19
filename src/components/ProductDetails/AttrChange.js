import React, { Component, PropTypes } from 'react';
import { Dimensions, View, Text, TouchableHighlight, Image, ScrollView, Platform, KeyboardAvoidingView, keyboardShouldPersistTaps, Keyboard} from 'react-native';
import { Carousel, Button, Popup, Flex, Stepper, Tag, Picker } from 'antd-mobile';
import RsTag from './../Tag/Tag';
import styles from './styles';
let sum = 1;
let extendcode = '';
let extendname = '未选择';
let i = 0; // 延保点击第几个
class AttrChange extends Component {
  constructor(props) {
    super(props);
    // 初始状态
    this.state = {
        keyboardHeight:0
    };
    }
   componentWillMount () {  
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);  
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);  
  }
  componentWillUnmount () {  
    this.keyboardDidShowListener.remove();  
    this.keyboardDidHideListener.remove();  
  }
  _keyboardDidShow = (e) => {
    const height = Platform.OS === 'android' ? (0) : (e.startCoordinates.height);
    this.setState({keyboardHeight:height});
    // alert('显示了');
  }
  _keyboardDidHide = () => {
    this.setState({keyboardHeight: 0});
    // alert('消失了');
  }
  /**
   * 加入购物车
   */
  addToCart(code) {
    if (this.props.product.available) {
      this.props.add(code, this.props, sum, extendcode);
      sum = 1;
    }
  }
  change(selected, code) {
    this.props.changeTag(selected, code, this.props);
   // this.props.projectDetail(productCode, this.props.product.regionCode, this.props.product.channelCode, this.props.product.productAttribute);
  }
  // 通过SPU获取可选与不可选判断
  FSProduct(data) {
    const saleproduct = [];
    const profs = [];
    const pcode = [];
    // for (let i = 0; i < this.props.product.sameLevelFSProducts.entry.length; i++) {
    //   // 拿到数组数据
    //   const keyMsg = this.props.product.sameLevelFSProducts.entry[i].key;
    //   const value = this.props.product.sameLevelFSProducts.entry[i].value;
    //   profs.push(keyMsg);
    //   pcode.push(value);
    // }
    for(const key in this.props.product.sameLevelFSProducts){ 
      profs.push(key);
      pcode.push(this.props.product.sameLevelFSProducts[key]);
    }
    // 获取当前已匹配的组
    // 存放拿到的数据
    const salsAttrs = [];
    const isSelect = [];
    const productAttr = this.props.product && this.props.product.salesAttributeClasses ? this.props.product.salesAttributeClasses : [];
    for (let it = 0; it < productAttr.length; it++) {
      for (let y = 0; y < productAttr[it].salesAttributes.length; y++) {
        const salsAttr = [];
        // 获取当前已选择的
        for (let its = 0; its < productAttr[it].salesAttributes[y].values.length; its++) {
          if (productAttr[it].salesAttributes[y].values[its].isSelected) {
            isSelect.push(productAttr[it].salesAttributes[y].values[its].value);
          }
          salsAttr.push(productAttr[it].salesAttributes[y].values[its].value);
        }
        salsAttrs.push(salsAttr);
      }
    }
    // 通过销售熟悉，获取可匹配项
    for (let z = 0; z < salsAttrs.length; z++) {
      const copy = isSelect.concat();
      for (let ii = 0; ii < salsAttrs[z].length; ii++) {
        let flag = false;
        const objs = {};
        if (salsAttrs[z][ii] === isSelect[z]) {
          objs.isSelected = true;
        } else {
          objs.isSelected = false;
        }
        copy[z] = salsAttrs[z][ii];
        let disables = '';
        for (let m = 0; m < copy.length; m++) {
          if (m === 0) {
            disables += copy[m];
          } else {
            disables = `${disables}_${copy[m]}`;
          }
        }
        for (let n = 0; n < profs.length; n++) {
          if (disables === profs[n]) {
            flag = true;
            objs.code = pcode[n];
          }
        }
        if (flag) {
          objs.disables = true;
        } else {
          objs.disables = false;
        }
        objs.values = salsAttrs[z][ii];
        saleproduct.push(objs);
      }
    }
    let disablesflag = false;
    let puductcodes = '';
    const rsult = {};
    for (let iii = 0; iii < saleproduct.length; iii++) {
      if (data === saleproduct[iii].values) {
        disablesflag = !saleproduct[iii].disables;
        puductcodes = saleproduct[iii].code;
      }
    }
    rsult.disablesflag = disablesflag;
    rsult.puductcodes = puductcodes;
    return rsult;
  }
  productTag(data) {
    const datas = [];
    for (let it = 0; it < data.length; it++) {
      const disables = this.FSProduct(data[it].value);
      datas.push(
        <Flex.Item key={it}>
          <RsTag
          selected={Boolean(data[it].isSelected)} 
          disabled={Boolean(disables.disablesflag)} 
          onChange={(flag) => { this.change(flag, disables.puductcodes); }}
          childrens={data[it].value}
          isUsenumberOfLinesAndNum={0}
          />
        </Flex.Item>,
            );
    }
    return datas;
  }
  changeMum = (val) => {
    const code = this.props.product.stock ? this.props.product.stock > 200 ? 200 : this.props.product.stock : 1;
    if (val !== null &&  val !== undefined && val !== '' && val.length !== 0){
       sum = val && (val !== null || val !== undefined || val !== '' || val.length !== 0) && !isNaN(val) && val <= code  ? val : 1;
      this.props.changeNum(sum, this.props);
    }
  }
    // 获取相应的销售属性
  productAttribute() {
    const data = [];
    const productAttr = this.props.product && this.props.product.salesAttributeClasses && this.props.product.salesAttributeClasses.length > 0 && this.props.product.salesAttributeClasses[0].salesAttributes ? this.props.product.salesAttributeClasses :[];
    for (let it = 0; it < productAttr.length; it++) {
      for (let y = 0; y < productAttr[it].salesAttributes.length; y++) {
        data.push(
          <View key={y} style={[styles.paddL, styles.borderB, { paddingBottom: 15 }]}>
            <View>
              <Text style={[{ height: 40, lineHeight: 35 }, styles.contitle]}>{ productAttr[it].salesAttributes[y].name}</Text>
            </View>
            <View>
              <Flex wrap="wrap">
                { this.productTag(productAttr[it].salesAttributes[y].values) }
              </Flex>
            </View>
          </View>,
        );
      }
    }
    return data;
  }
  productExtendTag(data) {
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
    const code = this.props.product.stock ? this.props.product.stock > 200 ? 200 : this.props.product.stock : 1;
    const maxheight = parseInt(this.state.keyboardHeight, 10);
    const styleH = parseInt(this.state.keyboardHeight, 10) > 0 ? {"maxHeight": (Dimensions.get('window').height / 2) + 20 + maxheight } : {"maxHeight": (Dimensions.get('window').height / 2) + 20};
    const styleHV = parseInt(this.state.keyboardHeight, 10) > 0 ? {"height": maxheight} : {};
    return (
      <View style={[styles.closeList,styleH]} key={1}>
        <View style={[styles.left1, styles.row1, { height: 90 }, styles.borderB, styles.promView]}>
          <View style={{ width: 65, height: 65, paddingTop: 3 }}>
            <Image style={{ width: 60, height: 60 }} source={require('./../../../images/productDetallsImgs/carouselImgs/5844f3a1N233450bb_002.jpg')} />
          </View>
          <View style={[styles.flex, styles.salesPriceView]}>
            <Text style={styles.salesPrice}>¥ {this.props.product.salesPrice}</Text>
            <Text style={styles.stockView}>商品编码: {this.props.product.code}</Text>
            <Text style={[styles.stockView]}>可售库存:
              <Text  style={[styles.stockText,{ marginHorizontal: 3}]}>{this.props.product.stock}</Text>
            </Text>
            {/*<View style={[styles.contentLR, styles.row1, {flex: 1}]}>
              <View>
                <Text style={styles.stockView}>商品编码: {this.props.product.code}</Text>
              </View>
              <View style={[styles.left1, styles.row1, {flex: 1}]}>
                <Text numberOfLines={2} style={[styles.stockView, { marginHorizontal: 3}]}>可售库存:
                  <Text  style={[styles.stockText]}>{this.props.product.stock}</Text>
                </Text>
              </View>
            </View>*/}
          </View>
        </View>
        <ScrollView>
          {this.productAttribute()}
          <View style={[styles.paddL, { paddingTop: 10, paddingBottom: 12 }]}>
            <View style={[styles.contentLR, styles.row1]}>
              <View style={styles.center}><Text style={styles.contitle}>数量</Text></View>
              <View><Stepper
                onChange={this.changeMum}
                readOnly={false}
                key="1"
                max={code}
                min={1}
                defaultValue={1}
                step={1}
                style={{ width: 120}}
                inputStyle={Platform.OS === 'android' ? { top: 0,flex: 1, height: 40, alignSelf: 'center',paddingTop: 6 } : {}}
                value={this.props.cartNum}
                keyboardType="numeric"
              /></View>
            </View>
          </View>
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
                      {this.productExtendTag(this.props.extendwarrantTag)}
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
        <View style={styleHV}/>
        <View>
          <Button disabled={!this.props.product.available} type="primary" onClick={() => { this.addToCart(this.props.product.code); }} style={{ borderRadius: 0 }}>加入购物车</Button>
        </View>
        {/* 关闭按钮 */}
        <TouchableHighlight style={styles.closeIcon} underlayColor={'rgba(0,0,0,0)'} onPress={() => { this.props.close(); }}>
          <Image style={{ width: 12, height: 12 }} source={require('./../../../images/productDetallsImgs/icons/rn-close-s.png')} />
        </TouchableHighlight>
      </View>
    );
  }
}
AttrChange.propTypes = {
  add: PropTypes.func,
  changeTag: PropTypes.func,
  close: PropTypes.func,
  product: PropTypes.object,
  changeNum: PropTypes.func,
  cartNum: PropTypes.number,
};
export default AttrChange;
