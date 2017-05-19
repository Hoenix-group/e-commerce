import createStyle from './../../themes/baseStyle';
import {
  color33, fontSizeMiddle,
  color66,
  borderBottom,
  rowTouchStyle, rowView, rowLeftText,
  rowRightView, rowRightText, rightArrowIcon,
  btnView, touchStyle, btnInsideView2, btnInsideView, btnInsideText,
} from '../../themes/fsBaseStyles';
export default createStyle({
  top: {
    flex: 1,
  },
  bottom: {
    justifyContent: 'center',
  },
  button: {
    marginHorizontal: 10,
    marginBottom: 10,
    height: 50,
    backgroundColor: '#4E86D9',
  },
  buttonLogout: {
    marginHorizontal: 10,
    marginBottom: 10,
    height: 50,
    backgroundColor: '#DB0000',
  },
  logo: {
    height: 60,
    width: 60,
  },
  itemInnerImage: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemInnerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  // 底部按钮样式
  bottom: btnView,
  tStyle: touchStyle,
  footRight: btnInsideView,
  footRightText: btnInsideText,
  footRight2: btnInsideView2,

  // 选择条
  rtouchStyle: rowTouchStyle,
  rView: rowView,
  rLeftText: rowLeftText,
  rRightView: rowRightView,
  rRightText: rowRightText,
  rArrowIcon: rightArrowIcon,

  b_bottom: borderBottom,
  font_16: {
    fontSize: fontSizeMiddle,
  },
  textColor: {
    color: color33,
  },
  textColor1: {
    color: color66,
  },
});
