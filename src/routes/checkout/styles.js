import { Platform, Dimensions } from 'react-native';
import createStyle from './../../themes/baseStyle';
import {
  lineColor,
  color33, shadeBg2,
  cartBarHeight,
  redPrice, btnColor,
  fontSizePrice,
  fontSizeLarge,
  fontSizeMiddle,
  fontSizeSmall,
  invalidColor, mainColor,
  onlineIconText,
  onlineIconView, shadeBg1,
  color66, shadeBg, color99,
  borderTop, borderBottom,
  rowTouchStyle, rowView, rowLeftText,
  rowRightView, rowRightText, rightArrowIcon,
  touchStyle,
} from '../../themes/fsBaseStyles';
export default createStyle({
  /**
   * 公用部分
   * start
   */
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
  end1: {
    justifyContent: 'flex-end',
  },
  contentLR: {
    justifyContent: 'space-between',
  },
  bg: {
    backgroundColor: shadeBg1,
  },
  b_Top: borderTop,
  b_bottom: borderBottom,
  marginT10: {
    marginTop: 10,
  },
  marginB: {
    marginBottom: 5,
  },
  marginB10: {
    marginBottom: 10,
  },
  p_bottom: {
    paddingBottom: 5,
  },
  mv5: {
    marginVertical: 5,
  },
  mv10: {
    marginVertical: 10,
  },
  m_right: {
    marginRight: 5,
  },
  m_right10: {
    marginRight: 10,
  },
  m_right15: {
    marginRight: 15,
  },
  m_left: {
    marginLeft: 10,
  },
  m_left15: {
    marginLeft: 15,
  },
  m_left30: {
    marginLeft: 30,
  },
  m_left35: {
    marginLeft: 35,
  },
  p_left: {
    paddingLeft: 10,
  },
  p_right: {
    paddingRight: 10,
  },
  p_right15: {
    paddingRight: 15,
  },
  p_bottom10: {
    paddingBottom: 10,
  },
  // 左右
  p_left15_lr: {
    paddingHorizontal: 15,
  },
  // 上下
  p_left15_lrv: {
    paddingVertical: 15,
  },
  font_16: {
    fontSize: fontSizeLarge,
  },
  textColor: {
    color: color33,
  },
  textColor1: {
    color: color66,
  },
  textColor2: {
    color: color99,
  },
  /** * end ***/

  containerWithNav: {
    flex: 1,
  },
  rootView: {
    flex: 10,
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  /* 配送方式样式开始 */
  type: {
    width: 80,
    color: 'gray',
    borderWidth: 1,
    borderColor: 'gray',
    fontSize: fontSizeMiddle,
    textAlign: 'center',
    // marginTop: Platform.OS === 'android' ? 0 : 3,
    paddingVertical: 4,
    marginRight: 5,
    alignSelf: 'center',
  },

  typeSelected: {
    color: '#108EE9',
    borderColor: '#108EE9',
  },
  /* 配送方式样式结束 */
  selfAddsContainer: {
    width: 95,
    height: 37,
    marginTop: 0,
    marginRight: 20,
    borderBottomWidth: 0,
    borderColor: 'transparent',
  },
  selfAdds: {
    width: 80,
    marginRight: 20,
    fontSize: fontSizeSmall,
    borderStyle: 'dashed',
    color: '#108EE9',
    borderWidth: 1,
    borderColor: '#108EE9',
    paddingVertical: 5,
    textAlign: 'center',
  },
  popupTitleContainer: {
    alignItems: 'center',
    height: 50,
    width: Dimensions.get('window').width,
    borderBottomWidth: 1,
    borderBottomColor: lineColor,
  },
  popupTitle: {
    fontSize: fontSizeLarge,
    color: color66,
  },
  closeIcon: {
    width: 30,
    height: 30,
    position: 'absolute',
    right: 3,
    top: 9,
  },
  kindTitleContainer: {
    width: Dimensions.get('window').width,
    paddingVertical: 10,
  },
  kindTitle: {
    marginLeft: 5,
    color: color33,
    fontSize: fontSizeLarge,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  checkboxContainer: {
    marginTop: 10,
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: Dimensions.get('window').width,
    borderBottomWidth: 1,
    borderBottomColor: lineColor,
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInput: {
    padding: 8,
    marginLeft: 5,
    borderWidth: 1,
    borderColor: lineColor,
    width: 100,
    height: 30,
    backgroundColor: shadeBg,
    fontSize: fontSizeMiddle,
  },
  popupConfirm: {
    height: 40,
    bottom: 0,
  },
  adds: {
    width: Dimensions.get('window').width,
    height: 36,
    paddingTop: 6,
    fontSize: fontSizeLarge,
    textAlign: 'center',
    color: '#108EE9',
    borderWidth: 1.5,
    borderColor: '#108EE9',
    marginBottom: 5,
  },
  bottomArea: {
    flex: 1,
    flexDirection: 'row',
    bottom: 0,
    height: 40,
  },
  bottomLeft: {
    flex: 3,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: shadeBg,
    justifyContent: 'center',
  },
  bottomRight: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addressIcon: {
    width: 20 / 1.5,
    height: 30 / 1.5,
    marginRight: 5,
  },

  productItem: {
    minHeight: 130,
  },
  tipsGray: {
    borderRadius: 4,
    height: 20,
    backgroundColor: shadeBg1,
    paddingHorizontal: 5,
    paddingVertical: 2,
    color: color66,
    fontSize: fontSizeMiddle,
  },
  summaryArea: {
    backgroundColor: shadeBg,
    paddingLeft: 17,
    paddingVertical: 10,
  },
  summaryAmount: {
    paddingRight: 17,
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  /**
   *
   */
  infoView: {
    marginHorizontal: 10,
    paddingVertical: 12,
    marginLeft: 40,
    borderTopWidth: 1,
    borderTopColor: lineColor,
  },
  image_80_80: {
    width: 80,
    height: 80,
  },

  warranty: {
    borderWidth: 1,
    borderColor: '#005AB5',
  },

  warrantyItem: {
    padding: 2,
    color: '#005AB5',
  },

  bottom: {
    borderTopWidth: 1,
    borderTopColor: lineColor,
    flexDirection: 'row',
    height: cartBarHeight,
  },
  textRadius: {
    borderRadius: 5,
  },
  flexDir: {
    flexDirection: 'row',
    flex: 2,
  },
  prices: {
    color: redPrice,
    fontSize: fontSizePrice,
  },
  checkallsmall: {
    fontSize: fontSizeLarge,
    color: color66,
    marginLeft: 2,
  },
  saleText: {
    fontSize: fontSizeLarge,
    color: color99,
    marginLeft: 2,
  },
  imgLeft: {
    width: 13,
    height: 21,
  },
  flexItem: {
    flex: 2,
    left: 5,
    marginHorizontal: 5,
  },
  textLine: {
    paddingHorizontal: 10, color: color33, fontSize: fontSizeLarge,
  },
  flexView: {
    height: 44, borderBottomWidth: 1, borderBottomColor: lineColor,
  },
  lineSize: {
    fontSize: fontSizeSmall,
  },
  onLineView1: onlineIconView,
  onLineBtn1: onlineIconText,
  sPrice: {
    color: redPrice,
    fontSize: fontSizeLarge,
  },
  bgFF: {
    backgroundColor: shadeBg,
  },
  btnBg: {
    backgroundColor: btnColor,
  },
  btnText: {
    color: shadeBg2,
    fontSize: fontSizeLarge,
  },
  arrowIcon: {
    width: 12,
    height: 12,
  },
  fontSize12: {
    fontSize: fontSizeSmall,
  },
  intervalSpace1: {
    backgroundColor: shadeBg1,
    height: 3,
    flexBasis: 10,
  },
  // 结算按钮
  footRight: {
    backgroundColor: mainColor,
  },
  cartStyle: {
    backgroundColor: invalidColor,
  },
  footRightText: {
    textAlign: 'center',
    color: '#FBFBFB',
  },
  // 横向选项样式
  chooseRowView: {
    paddingVertical: 15,
  },
  scrollViewbg: {
    height: Dimensions.get('window').height - 160,
  },

  // 选择条
  rtouchStyle: rowTouchStyle,
  rView: rowView,
  rLeftText: rowLeftText,
  rRightView: rowRightView,
  rRightText: rowRightText,
  rArrowIcon: rightArrowIcon,
  tStyle: touchStyle,

  fontMiddle: {
    fontSize: fontSizeMiddle,
  },
  fontLarge: {
    fontSize: fontSizeLarge,
  },
});
