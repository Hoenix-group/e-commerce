import createStyle from './../../../themes/baseStyle';
import Utils from '../../../utils/utils';
import {
  lineColor,
  color33, shadeBg2,
  cartBarHeight,
  redPrice, btnColor,
  fontSizePrice,
  fontSizeLarge,
  fontSizeMiddle,
  fontSizeSmall,
  fontSizeMin,
  onlineIconText,
  onlineIconView,
  color66, shadeBg, color99,
  tabRadius } from '../../../themes/fsBaseStyles';

export default createStyle({

  searchContainer: {
    top: Utils.top,
    flex: 1,
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
  end1: {
    justifyContent: 'flex-end',
  },
  end2: {
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  contentLR: {
    justifyContent: 'space-between',
  },
  b_top: {
    borderTopWidth: 0.5,
    borderTopColor: lineColor,
  },
  b_bottom: {
    borderBottomWidth: 0.5,
    borderBottomColor: lineColor,
  },
  marginB: {
    marginBottom: 5,
  },
  marginT: {
    marginTop: 10,
  },
  p_bottom: {
    paddingBottom: 5,
  },
  m_right: {
    marginRight: 5,
  },
  m_left: {
    marginLeft: 10,
  },
  p_left: {
    paddingLeft: 10,
  },
  p_top10: {
    paddingTop: 10,
  },
  paddingV: {
    paddingVertical: 20,
  },
  paddingV10: {
    paddingVertical: 10,
  },
  paddingV5: {
    paddingVertical: 5,
  },
  paddingH15: {
    paddingHorizontal: 15,
  },
  infoView: {
    marginHorizontal: 15,
    paddingVertical: 15,
    paddingLeft: 10,
    marginLeft: 50,
  },
  image_80_80: {
    width: 80,
    height: 80,
  },
  warranty: {
    borderWidth: 0.5,
    borderColor: '#005AB5',
  },

  warrantyItem: {
    padding: 2,
    color: '#005AB5',
  },

  bottom: {
    borderTopWidth: 0.5,
    borderTopColor: lineColor,
    flexDirection: 'row',
    minHeight: cartBarHeight,
  },
  textRadius: {
    borderRadius: 5,
  },
  flexDir: {
    flexDirection: 'row',
  },
  prices: {
    color: redPrice,
    fontSize: fontSizePrice,
  },
  checkall: {
    fontSize: fontSizeSmall,
    color: color33,
    marginLeft: 2,
  },
  checkallsmall: {
    fontSize: 13,
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
    height: 44, borderBottomWidth: 0.5, borderBottomColor: lineColor,
  },
  lineSize: {
    fontSize: fontSizeMin,
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
  fontSize10: {
    fontSize: fontSizeMin,
  },
  fontSize12: {
    fontSize: fontSizeSmall,
  },
  fontSize14: {
    fontSize: fontSizeMiddle,
  },
  fontSize16: {
    fontSize: fontSizeLarge,
  },
  fontSize18: {
    fontSize: fontSizeLarge + 2,
  },
  intervalSpace1: {
    backgroundColor: '#F0F0F0',
    height: 3,
    flexBasis: 10,
  },
  buttonStyle: {
    height: 35,
    width: 90,
    borderWidth: 0,
    backgroundColor: 'transparent',
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
    color: shadeBg2,
    fontSize: fontSizeLarge,
  },

  fontMiddle: {
    fontSize: fontSizeMiddle,
  },
  fontLarge: {
    fontSize: fontSizeLarge,
  },
});
