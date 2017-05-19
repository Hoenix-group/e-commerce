import { Platform } from 'react-native';
import createStyle from './../../themes/baseStyle';
import {
  lineColor,
  commonButton,
  onlineIconView, mainColor,
  onlineIconText, shadeBg1, shadeBg,
  color33, fontSizeMiddle, fontSizeLarge,
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
  left2: {
    justifyContent: 'flex-start',
  },
  end1: {
    justifyContent: 'flex-end',
  },
  contentLR: {
    justifyContent: 'space-between',
  },
  b_Top: {
    borderTopWidth: 1,
    borderTopColor: lineColor,
  },
  b_bottom: {
    borderBottomWidth: 1,
    borderBottomColor: lineColor,
  },
  m_right10: {
    marginRight: 10,
  },
  m_right15: {
    marginRight: 15,
  },
  m_left5: {
    marginLeft: 5,
  },
  m_left: {
    marginLeft: 10,
  },
  m_left15: {
    marginLeft: 15,
  },
  // 左右
  p_left15_lr: {
    paddingHorizontal: 15,
  },
  // 上下
  p_left15_lrv: {
    paddingVertical: 15,
  },
  p_left5_lrv: {
    paddingVertical: 5,
  },
  textColor: {
    color: color33,
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
    backgroundColor: mainColor,
  },
  swipeAct: {
    backgroundColor: 'gray',
  },
  arrowIcon: {
    width: 12,
    height: 12,
    marginRight: 8,
    marginTop: 8,
  },
  circleIcon: {
    marginTop: 0,
    marginRight: 6,
  },
  tagRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  comBtn: commonButton,
  color: {
    color: 'red',
  },
  comBtnText: {
    textAlign: 'center',
    lineHeight: Platform.OS === 'android' ? 30 : 38,
  },
  onLineView1: onlineIconView,
  onLineBtn1: onlineIconText,

  fontMiddle: {
    fontSize: fontSizeMiddle,
  },
  fontLarge: {
    fontSize: fontSizeLarge,
  },
  bg: {
    backgroundColor: shadeBg1,
  },
  bgff: {
    backgroundColor: shadeBg,
  },
});
