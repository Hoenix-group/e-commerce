import createStyle from './../../themes/baseStyle';
import {
  shadeBg3, tabRadius,
  lineColor, chooseColor,
  color33, mainColor,
  redPrice, rowJustifyLeftCenter,
  fontSizeLarge,
  fontSizeSmall,
  color66, shadeBg, color99,
} from '../../themes/fsBaseStyles';
export default createStyle({
  flex: {
    flex: 1,
  },
  mainBg: {
    backgroundColor: shadeBg3,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  left1: {
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  /**
   * 全家团圆套餐
   */
  // 总view
  viewOutSide: {
    flex: 1,
    backgroundColor: shadeBg,
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  // 标题vew
  titleView: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: lineColor,
  },
  titleView1: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: lineColor,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  titleText: {
    color: color66,
    fontSize: fontSizeLarge,
  },
  // 商品view (可以公用)
  proMainView: {
    flex: 1,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: lineColor,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  imgView: {
    padding: 10,
    paddingLeft: 0,
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
  },
  imgView1: {
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: lineColor,
  },
  img: {
    borderWidth: 1,
    borderColor: lineColor,
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
  img1: {
    borderWidth: 1,
    borderColor: lineColor,
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
  imgIcon: {
    width: 14,
    height: 14,
  },
  proView: {
    flex: 1,
    marginLeft: 5,
  },
  proTitleView: {
    flexWrap: 'wrap',
    paddingTop: 5,
  },
  proTitleText: {
    fontSize: fontSizeLarge,
    color: color33,
  },
  tagView: {
    flexDirection: 'row',
    paddingTop: 10,
  },
  tagText: {
    fontSize: 12,
    color: color99,
    marginRight: 5,
  },
  priceMainView: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    height: 30,
    top: 0,
  },
  priceView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  priceText: {
    color: redPrice,
    fontSize: fontSizeLarge,
  },
  priceText1: {
    color: redPrice,
    fontSize: fontSizeLarge,
  },
  numView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  numText: {
    color: color66,
  },
  /**
   * 套餐价、结算
   */
  comMainView: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  comLeftView: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
  },
  comLeftText: {
    color: color33,
    paddingVertical: 10,
    fontSize: fontSizeLarge,
  },
  btnRightView: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: mainColor,
    borderRadius: 3,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  btnRightText: {
    color: mainColor,
    fontSize: fontSizeLarge,
  },
  /**
   * 空格
   */
  intervalSpace: {
    backgroundColor: '#F0F0F0',
    height: 10,
    flexBasis: 10,
  },
  ImgLeft: {
    marginHorizontal: 5,
  },
  imgLeft: {
    width: 13,
    height: 21,
  },
  /**
   * 线上、线下
   */
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
  /**
   * leftCenter
   */
  leftCenter: rowJustifyLeftCenter,

  mr5: {
    marginRight: 5,
  },
});
