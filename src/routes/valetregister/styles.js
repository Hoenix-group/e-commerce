import createStyle from './../../themes/baseStyle';
import {
  color33,
  lineColor,
  commonButton,
  paddingLarge,
  paddingMiddle,
  fontSizeSmall,
  marginLarge,
  fontSizeLarge,
  fontSizeMiddle, color66 } from './../../themes/fsBaseStyles';
export default createStyle({
  itemHeight: {
    height: 50,
  },
  itemHeightAddress: {
    height: 200,
  },
  inputItem: {
    fontSize: fontSizeMiddle,
    color: color66,
  },
  font_14: {
    fontSize: fontSizeMiddle,
  },

//  注册行
//  最外层
  viewOutSide: {
    flex: 1,
    paddingHorizontal: 10,
  },
  viewMain: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: lineColor,
  },
  // 左侧
  leftView: {
    flex: 7.5,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
  },
  // 文本
  leftText: {
    width: 58,
    color: color33,
    fontSize: fontSizeLarge,
    padding: 0,
  },
  // 文本框
  leftInput: {
    flex: 1,
  },
  // checkbox
  leftCheckbox: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 15,
    paddingLeft: 15,
  },
  // 右侧
  rightView: {
    flex: 2.5,
  },
});
