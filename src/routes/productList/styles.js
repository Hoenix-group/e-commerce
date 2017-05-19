import { Platform, Dimensions } from 'react-native';
import createStyle from './../../themes/baseStyle';
import {
  lineColor, chooseColor, color33, color66, colorCC, mainColor,
  redPrice, fontSizeLarge, fontSizeMiddle, fontSizeMin, fontSizeSmall, tabRadius, shadeBg1, shadeBg, shadeBg2,
  btnView, btnInsideView, btnInsideText, touchStyle,
} from '../../themes/fsBaseStyles';

export default createStyle({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: lineColor,
  },
  flex: {
    flex: 1,
  },
  row1: {
    flexDirection: 'row',
  },
  image: {
    width: 90,
        // 设置高度
    height: 90,
        // 设置图片填充模式
    resizeMode: 'contain',
    marginVertical: 10,
    marginHorizontal: 5,
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
  end1: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  end2: {
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  contentLR: {
    justifyContent: 'space-between',
  },
  producView: {
    // paddingVertical: 8,
    minHeight: 100,
    paddingRight: 15,
  },
  producTitle: {
    color: color33,
    paddingTop: 0,
    fontSize: fontSizeLarge,
    paddingRight: 8,
    height: 38,
  },
  tagStyle: {
    fontSize: fontSizeMin,
    color: color33,
  },
  tagBg: {
    paddingLeft: 4,
    paddingRight: 4,
    paddingTop: 2,
    paddingBottom: 2,
    backgroundColor: shadeBg1,
    borderRadius: tabRadius,
    marginRight: 5,
  },
  proFlex: {
    // paddingLeft: 8,
    paddingRight: 14,
    marginTop: 10,
  },
  price: {
    color: redPrice,
    // paddingLeft: 14,
    paddingRight: 14,
    paddingTop: 6,
    // paddingBottom: 5,
    fontSize: fontSizeLarge,
  },
  sPrice: {
    color: redPrice,
  },
  online: {
    width: 28,
    height: 18,
    fontSize: fontSizeSmall,
    textAlign: 'center',
    color: shadeBg,
    lineHeight: 16,
  },
  onlineBg: {
    width: 35,
    backgroundColor: chooseColor,
    borderRadius: tabRadius,
  },
  numView: {
    position: 'relative',
    zIndex: 1,
    width: 35,
    height: 35,
  },
  empty: {
    // width: Platform.OS === 'android' ? 32 : 40,
    // height: 35,
    // lineHeight: Platform.OS === 'android' ? 22 : 27,
    fontSize: fontSizeMiddle,
    textAlign: 'center',
    color: colorCC,
    alignSelf: 'center',
  },
  notEmpty: {
    // width: Platform.OS === 'android' ? 32 : 40,
    // height: 35,
    // lineHeight: Platform.OS === 'android' ? 22 : 27,
    fontSize: fontSizeMiddle,
    textAlign: 'center',
    color: color66,
    alignSelf: 'center',
  },
  num: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 2,
    width: 14,
    height: 14,
    lineHeight: 10,
    padding: 2,
    backgroundColor: '#199ED8',
    borderWidth: 1,
    borderColor: '#B0E2F6',
    color: '#fff',
    fontSize: fontSizeMin,
    textAlign: 'center',
  },
  textTabs: {
    height: 30,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  textItem: {
    height: 30,
    lineHeight: 24,
    textAlign: 'center',

  },
  textOnclick: {
    borderBottomWidth: 1,
    borderBottomColor: '#108ee9',
    color: '#349EEC',
  },
  contextStyle: {
    margin: 50,
    flex: 1,
  },
  menuContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    height: 400,
    paddingHorizontal: 5,
    paddingVertical: 10,
  },
  triggerStyle: {
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  overlayStyle: {
    left: 90,
    marginTop: 20,
  },
  icon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  cancelBtnImageStyle: {
    position: 'absolute',
    right: 10,
    padding: 8,
    width: 40,
    height: 40,
  },
  active1: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: lineColor,
    borderLeftWidth: 1,
    borderLeftColor: lineColor,
    borderRightWidth: 1,
    borderRightColor: lineColor,
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
    marginTop: 5,
    marginHorizontal: 5,
    height: 34,
    // marginBottom: 0,
    borderRadius: 0,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  active2: {
    // backgroundColor: shadeBg1,
    margin: 5,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  active: {
    // backgroundColor: shadeBg2,
    margin: 5,
    // borderWidth: 1,
    // borderColor: lineColor,
  },
  tabView: {
    // backgroundColor: shadeBg1,
    margin: 5,
    borderRadius: 3,
    height: 28,
  },
  ImgLeft: {
    marginHorizontal: 5,
  },
  imgLeft: {
    width: 13,
    height: 21,
  },
  tab: {
    height: 38,
    // android 和 ios 对zIndex的处理不一样
    zIndex: Platform.OS === 'android' ? 0 : 100,
  },
  tabs: {
    textAlign: 'center',
    fontSize: fontSizeMiddle,
  },
  tabFont: {
    marginVertical: Platform.OS === 'android' ? 4 : 6,
    color: color33,
    // height: 14,
    fontSize: fontSizeLarge,
  },
  // 对于有dropdown的tab font
  tabFontDown: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginTop: Platform.OS === 'android' ? 2 : 4,
  },
  tabImg: {
    width: 12,
    height: 12,
    marginLeft: 10,
  },
  // 对于有dropdown的tab 小箭头
  tabImgDown: {
    marginTop: 7,
  },
  tabColor: {
    color: mainColor,
  },
  tagView: {
    marginHorizontal: 5,
    marginVertical: 5,
    height: 28,
  },
  tagView1: {
    marginLeft: 5,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: 'transparent',
    height: 28,
  },
  btnView: {
    marginHorizontal: 5,
    marginVertical: 5,
  },
  isopen: {
    top: -1,
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
    position: Platform.OS === 'android' ? 'relative' : 'absolute',
    backgroundColor: 'rgba(0,0,0,0.32)',
    zIndex: 9,
  },
  tabTitle: {
    fontSize: 14,
    color: color33,
  },
  WarningText: {
    fontSize: fontSizeMiddle,
    color: color66,
  },
  tabActive: {
    color: mainColor,
  },
  outView: {
    zIndex: 66,
  },
  borderT: {
    borderTopWidth: 1,
    borderTopColor: lineColor,
  },
  tStyle: touchStyle,
  bottom: btnView,
  footRight: btnInsideView,
  footRightText: btnInsideText,
  fontLarge: {
    fontSize: fontSizeLarge,
  },
});
//
