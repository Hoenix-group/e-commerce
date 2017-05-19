import createStyle from './../../themes/baseStyle';
import {
  lineColor,
  color33,
  redPrice,
  fontSizeSmall,fontSizeLarge,
  shadeBg1,fontSizeMiddle,
  color66, shadeBg,
  btnView, touchStyle, btnInsideView2, btnInsideView, btnInsideText,
} from '../../themes/fsBaseStyles';
export default createStyle({
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
  alignLeft: {
    alignItems: 'flex-start',
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
  top: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: shadeBg1,
    justifyContent: 'flex-start',
  },
  placeHolder: {
    height: 50,
  },
  placeHolderMiddle: {
    height: 25,
  },
  placeHolderMinor: {
    height: 5,
  },
  logo: {
    height: 30,
    width: 30,
  },
  font: {
    fontSize: fontSizeMiddle,
    color: color33,
    paddingTop: 5,
    paddingBottom: 5,
  },
  red: {
    color: redPrice,
    fontSize: fontSizeMiddle,
  },
  red1: {
    color: redPrice,
    fontSize: fontSizeSmall,
    marginTop: 5,
  },
  red2: {
    color: redPrice,
    fontSize: fontSizeLarge,
  },
  white: {
    color: 'white',
  },
  grey: {
    color: color66,
  },
  textMargin: {
    paddingLeft: 15,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: shadeBg,
  },
  intervalSpace1: {
    backgroundColor: '#F0F0F0',
    height: 3,
    flexBasis: 10,
  },
  payWay: {
    backgroundColor: shadeBg,
    paddingLeft: 15,
    paddingTop: 15,
    paddingBottom: 15,
  },
  payWayText: {
    color: color66,
  },
  b_Top: {
    borderTopWidth: 1,
    borderTopColor: lineColor,
  },
  b_bottom: {
    borderBottomWidth: 1,
    borderBottomColor: lineColor,
  },
  payItems: {
    height: 50,
  },
  p_left: {
    paddingLeft: 15,
  },
  payTitle: {
    color: color33,
  },
  button: {
    marginHorizontal: 20,
    height: 50,
    backgroundColor: '#4E86D9',
  },
// 底部按钮样式
  bottom: btnView,
  tStyle: touchStyle,
  footRight: btnInsideView,
  footRightText: btnInsideText,
  footRight2: btnInsideView2,
});
