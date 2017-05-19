/**
 * Created by F162228 on 2017/1/18.
 */
import React from 'react';
import { View, Image, Dimensions } from 'react-native';

import styles from './desStyles';
/**
 * 商品详情描述页
 * @param dispatch
 * @constructor
 */
const ProductDescription = () => {
  /**
   * 根据比例 动态设置图片高度
   * @param imgWidth : 图片宽度
   * @param imgHeight ：图片高度
   * @returns {number} ：设置图片页面中高度
   */
  function setImgHeight(imgWidth, imgHeight) {
    const winWidth = Dimensions.get('window').width;
    const setHeight = Math.ceil((winWidth * imgHeight) / imgWidth);
    return setHeight;
  }
  return (
    <View style={[styles.center, styles.column1]}>
      <Image style={[styles.image, { height: setImgHeight(620, 799) }]} source={require('./../../../images/productDetallsImgs/proDesImgs/1.jpg')} />
      <Image style={[styles.image, { height: setImgHeight(620, 1537) }]} source={require('./../../../images/productDetallsImgs/proDesImgs/2.jpg')} />
      <Image style={[styles.image, { height: setImgHeight(620, 1082) }]} source={require('./../../../images/productDetallsImgs/proDesImgs/3.jpg')} />
      <Image style={[styles.image, { height: setImgHeight(620, 1613) }]} source={require('./../../../images/productDetallsImgs/proDesImgs/4.jpg')} />
      <Image style={[styles.image, { height: setImgHeight(620, 1290) }]} source={require('./../../../images/productDetallsImgs/proDesImgs/5.jpg')} />
      <Image style={[styles.image, { height: setImgHeight(620, 1027) }]} source={require('./../../../images/productDetallsImgs/proDesImgs/6.jpg')} />
    </View>
  );
};
export default ProductDescription;
