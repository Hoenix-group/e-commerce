import { Platform, Dimensions } from 'react-native';
import createStyle from './../../themes/baseStyle';
import {
  lineColor, btnColor,marginLarge,
  color33, shadeBg2, fontSizeMiddle,
  redPrice, cartBarHeight,
  fontSizeLarge, fontSizePrice,
  fontSizeSmall, onlineIconView, onlineIconText,
  mainColor, shadeBg1,
  color66, shadeBg, color99, fontSizeMin,
} from '../../themes/fsBaseStyles';
export default createStyle({
  /**
   * 公用部分
   * start
   */
  bgF: {
    backgroundColor: shadeBg,
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
  },
  end1: {
    justifyContent: 'flex-end',
  },
  contentLR: {
    justifyContent: 'space-between',
  },
  // 边框
  b_Top: {
    borderTopWidth: 1,
    borderTopColor: lineColor,
  },
  b_bottom: {
    borderBottomWidth: 1,
    borderBottomColor: lineColor,
  },
  // 间距
  marginB: {
    marginBottom: 5,
  },
  marginB10: {
    marginBottom: 10,
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
  mv5: {
    marginVertical: 5,
  },
  mv10: {
    marginVertical: 10,
  },
  // 填充
  p_top5: {
    paddingTop: 5,
  },
  p_top10: {
    paddingTop: 10,
  },
  p_bottom: {
    paddingBottom: 5,
  },
  p_bottom10: {
    paddingBottom: 10,
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
  // 左右
  p_left15_lr: {
    paddingHorizontal: 15,
  },
  // 上下
  p_left15_lrv: {
    paddingVertical: 15,
  },
  p_left10_lrv: {
    paddingVertical: 10,
  },
  p_left5_lrv: {
    paddingVertical: 5,
  },
  // 字体大小
  font_16: {
    fontSize: fontSizeLarge,
  },
  // 字体颜色
  textColor: {
    color: color33,
  },
  textColor1: {
    color: color66,
  },
  textColor2: {
    color: color99,
  },
  fontw: {
    fontWeight: 'bold',
  },
  /** * end ***/
  itemInnerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemInnerImage: {
    flexDirection: 'row',
  },
  alignRight: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  button: {
    backgroundColor: '#4E86D9',
  },
  buttonText: {
    color: 'white',
  },
  image: {
    height: 60,
    width: 60,
    marginRight: 10,
  },
  navImageView: {
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navImage: {
    width: 14,
    height: 14,
  },
  navSearchBar: {
    flexDirection: 'row',
    backgroundColor: '#E0E0E0',
    marginTop: Platform.OS === 'android' ? 0 : 5,
  },
  fillView: {
    flex: 1,
  },
  footer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  images: {
    paddingVertical: 10,
  },
  intervalSpace1: {
    backgroundColor: shadeBg1,
    height: 10,
    flexBasis: 10,
  },
  sPrice: {
    color: redPrice,
  },
  bottomItem: {
    width: 180,
    flexDirection: 'column',
    backgroundColor: shadeBg,
    alignItems: 'center',
    paddingVertical: 5,
  },
  button: {
    height: 30,
    width: 65,
    backgroundColor: shadeBg,
    borderColor: color99,
  },
  fontSize12: {
    fontSize: fontSizeSmall,
  },
  blueBtnBor: {
    borderColor: mainColor,
  },
  blueBtnText: {
    color: mainColor,
  },
  lineSize: {
    fontSize: fontSizeMin,
  },
  onLineView1: onlineIconView,
  onLineBtn1: onlineIconText,
  bgFF: {
    backgroundColor: shadeBg,
  },
  bg:{
    backgroundColor: shadeBg1,
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
  // 结算按钮
  footRight: {
    backgroundColor: '#0083E0',
  },
  cartStyle: {
    backgroundColor: '#66b5ec',
  },
  footRightText: {
    textAlign: 'center',
    color: '#FBFBFB',
  },
  // 横向选项样式
  chooseRowView: {
    paddingVertical: 15,
  },

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
    fontSize: fontSizeSmall,
    textAlign: 'center',
    marginTop: 3,
    paddingVertical: 4,
    marginRight: 5,
  },

  typeSelected: {
    color: '#108EE9',
    borderColor: '#108EE9',
  },
  /* 配送方式样式结束 */
  selfAdds: {
    width: 80,
    marginTop: 2,
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
    color: color66,
    fontSize: fontSizeSmall,
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
  textInput: {
    padding: 8,
    marginLeft: 5,
    borderWidth: 1,
    borderColor: lineColor,
    width: 100,
    height: 30,
    backgroundColor: '#fff',
    fontSize: fontSizeSmall,
  },
  popupConfirm: {
    height: 40,
    bottom: 0,
  },
  adds: {
    width: Dimensions.get('window').width,
    height: 36,
    paddingTop: 6,
    fontSize: 16,
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
    backgroundColor: 'white',
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
    fontSize: fontSizeSmall,
  },
  summaryArea: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
  },
  summaryAmount: {
    paddingLeft:15,
    textAlign:'right',
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  /**
   *
   */
  infoView: {
    marginHorizontal: 10,
    paddingVertical: 8,
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
    fontSize: fontSizeMiddle,
    color: color66,
    marginLeft: 2,
  },
  saleText: {
    fontSize: fontSizeMiddle,
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
  buttonArea: {
    borderTopWidth: 1,
    borderColor: lineColor,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  buttonWidth: {
    width: 74,
  },
  m_Ver:{
    marginVertical:marginLarge,
  },
  fontLarge:{
    fontSize:fontSizeLarge,
  },
  text_Right:{
    textAlign:'right',
  },
  statusColor:{
    color:mainColor,
  },
});
