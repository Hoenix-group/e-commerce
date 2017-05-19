import { Platform } from 'react-native';
import createStyle from './../../themes/baseStyle';
import {
  lineColor, chooseColor, color33, color66, colorCC,fontSizeSmall,shadeBg1,
  redPrice, fontSizeLarge, fontSizeMiddle, fontSizeMin, tabRadius,
} from '../../themes/fsBaseStyles';

export default createStyle({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: '#E6E6E6',
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
    margin: 5,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  left1: {
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  producView: {
    paddingTop: 5,
    // backgroundColor:'pink',
    minHeight: 75,
    borderBottomColor: lineColor,
    borderBottomWidth: 1,
  },
  producTitle: {
    color: color33,
    paddingTop: 0,
    fontSize: fontSizeLarge,
    // paddingLeft: 8,
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
  online: {
    width: 28,
    height: 18,
    fontSize: fontSizeSmall,
    textAlign: 'center',
    color: '#ffffff',
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
    width: Platform.OS === 'android' ? 32 : 40,
    height: 30,
    lineHeight: Platform.OS === 'android' ? 23 : 25,
    fontSize: fontSizeMiddle,
    textAlign: 'left',
    color: colorCC,
  },
  notEmpty: {
    width: Platform.OS === 'android' ? 32 : 40,
    height: 30,
    lineHeight: Platform.OS === 'android' ? 23 : 25,
    fontSize: fontSizeMiddle,
    textAlign: 'left',
    color: color66,
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
  active: {
    borderBottomWidth: 1,
    borderColor: '#108DE9',
  },
  ImgLeft: {
    marginHorizontal: 5,
  },
  imgLeft: {
    width: 14,
    height: 14,
  },
  tab: {
    borderBottomWidth: 1,
    borderBottomColor: lineColor,
  },
  tabs: {
    textAlign: 'center',
    fontSize: 14,
  },
  tabFont: {
    paddingTop: 8,
    paddingBottom: 8,
    color: color66,
  },
  tabColor: {
    color: '#349EEC',
  },

  tagView: {
    marginHorizontal: 5,
    marginVertical: 5,
    height: 30,
  },
  btnView: {
    marginHorizontal: 5,
    marginVertical: 5,
  },
});
