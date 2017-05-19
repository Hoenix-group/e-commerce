import createStyle from './../../themes/baseStyle';
import {
  color33, fontSizeMiddle,
  color66,
  color99,
  borderBottom, fontSizeLarge,
  rowTouchStyle, rowView, rowLeftText,
  rowRightView, rowRightText, rightArrowIcon,
} from '../../themes/fsBaseStyles';
export default createStyle({
  fontSize14: {
    fontSize: fontSizeMiddle,
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
  m_left: {
    marginLeft: 10,
  },
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
  fontLarge: {
    fontSize: fontSizeLarge,
  },
});
