import { Dimensions, Platform } from 'react-native';
import createStyle from './../../themes/baseStyle';

import {
  rowJustifyCenter, shadeBg,
  lineColor, color33, color66, color99, chooseColor,
  redPrice, fontSizePrice, fontSizeLarge, fontSizeMiddle, fontSizeSmall, fontSizeMin,
} from '../../themes/fsBaseStyles';

// 内容背景
const bgkWrite = '#ffffff';

export default createStyle({
  container: {
    backgroundColor: '#f3f3f3',
  },
  bgkWrite: {
    backgroundColor: bgkWrite,
  },
  flex: {
    flex: 1,
  },
  row1: {
    flexDirection: 'row',
  },
  col1: {
    flexDirection: 'column',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  left1: {
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  left2: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  contentLR: {
    justifyContent: 'space-between',
  },
  image: {
    width: 130,
    // 设置高度
    height: 130,
    // 设置图片填充模式
    resizeMode: 'contain',
  },
  imgStyle: {
    // 设置宽度
    width: Dimensions.get('window').width,
    // 设置高度
    height: 320,
    // 设置图片填充模式
    resizeMode: 'contain',
    marginTop: 5,
  },
  mHeight: {
    maxHeight: Dimensions.get('window').height / 2,
  },
  onlineView: {
    width: 35,
    height: 18,
    borderRadius: 2,
    backgroundColor: chooseColor,
    marginRight: 2,
  },
  online: {
    color: '#ffffff',
    fontSize: fontSizeSmall,
    textAlign: 'center',
    marginTop: Platform.OS === 'android' ? 0 : 3,
    width: 28,
  },
  onlineViewAndroid: {
    width: 35,
    height: 18,
    flex: 1,
    backgroundColor: chooseColor,
    paddingHorizontal: 10,
  },

  marginVer: {
    marginVertical: 2,
    marginHorizontal: 10,
    height: 40,
    marginBottom: 10,
  },
  proTitle: {
    height: 60,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: lineColor,
  },
  salesPrice: {
    color: redPrice,
    fontSize: fontSizePrice,
    height: 28,
  },
  price: {
    color: redPrice,
    fontSize: fontSizeLarge,
    height: 25,
    lineHeight: 18,
  },
  paddL: {
    paddingLeft: 12,
    paddingRight: 12,
  },
  tStyle: {
    color: color33,
    fontSize: fontSizeLarge,
    lineHeight: 22,
    maxWidth: Platform.OS === 'android' ? (Dimensions.get('window').width - 50) : (Dimensions.get('window').width),
  },
  h35: {
    height: 35,
    paddingTop: 4,

  },
  h30: {
    height: 45,
    paddingTop: 0,
  },
  borderTB: {
    borderBottomWidth: 1,
    borderBottomColor: lineColor,
    borderTopWidth: 1,
    borderTopColor: lineColor,
  },
  borderB: {
    borderBottomWidth: 1,
    borderBottomColor: lineColor,
  },
  borderT: {
    borderTopWidth: 1,
    borderTopColor: lineColor,
  },
  saleNum: {
    fontSize: fontSizeSmall,
    color: color99,
  },
  smallInfo: {
    fontSize: fontSizeMiddle,
    color: color99,
  },
  smallInfo2: {
    color: color33,
    fontSize: fontSizeLarge,
    marginLeft: 10,
  },
  arrowIcon: {
    width: 14,
    height: 14,
    marginRight: 8,
    marginTop: 14,
  },
  arrowUp: {
    width: 14,
    height: 14,
    marginRight: 8,
  },
  circleIcon: {
    marginTop: 0,
    marginRight: 6,
  },
  closeIcon: {
    width: 16,
    height: 16,
    position: 'absolute',
    right: 10,
    top: 15,
  },
  closeList: {
    position: 'relative',
  },
  smallInfo3: {
    marginRight: 16,
    paddingTop: 10,

  },
  infoText: {
    color: '#858585',
    fontSize: fontSizeMin,
  },
  promTitle: {
    textAlign: 'center',
    marginLeft: 6,
    height: 45,
    paddingTop: 16,
    fontSize: fontSizeMiddle,
    color: color66,
  },
  promView: {
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: bgkWrite,
  },
  desView: {
    borderTopColor: lineColor,
    borderTopWidth: 1,
  },
  desInfo: {
    color: color66,
    height: 45,
    paddingTop: 15,
  },
  marTB: {
    marginTop: 8,
    // marginBottom: 8,
  },
  stockView: {
    color: color99,
    fontSize: fontSizeSmall,
  },
  stockText: {
    color: redPrice,
    fontSize: fontSizeSmall,
  },
  salesPriceView: {
    height: 50, paddingTop: 5, paddingLeft: 10,
  },
  salesPriceText: {
    color: redPrice, fontSize: 16, height: 28,
  },
  contitle: {
    color: color33,
  },
  conText: {
    color: color66,
  },
  sPrice: {
    color: redPrice,
  },
  textInputView: {
    padding: 0,
    width: 55,
    borderColor: lineColor,
    borderWidth: 1,
    height: 35,
    color: color33,
    textAlign: 'center',
    marginLeft: 5,
    fontSize: fontSizeMiddle,
  },
  // 上拉加载
  loadMoreView: {
    width: Dimensions.get('window').width,
    height: 55,
    alignSelf: 'center',
    marginTop: 10,
    backgroundColor: shadeBg,
  },
  rowCenter: rowJustifyCenter,
});
