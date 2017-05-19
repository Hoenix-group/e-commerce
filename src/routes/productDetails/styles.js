import { Platform } from 'react-native';
import createStyle from './../../themes/baseStyle';
import {
  lineColor, color33, color66, fontSizeSmall, cartBarHeight, fontSizeLarge,
} from '../../themes/fsBaseStyles';

export default createStyle({
  main: {
    flexDirection: 'column',
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
  icon16: {
    width: 16,
    height: 16,
  },
  tab: {
    borderBottomWidth: 1,
    borderBottomColor: lineColor,
  },
  tabs: {
    textAlign: 'center',
    fontSize: fontSizeLarge,
  },
  tabFont: {
    paddingTop: 16,
    paddingBottom: 8,
    color: color66,
  },
  imgLeft: {
    width: 13,
    height: 21,
  },
  active: {
    borderBottomWidth: 2,
    borderColor: '#1687dd',
  },
  activeFont: {
    color: color33,
  },
  fd_footer: {
    borderTopWidth: 1,
    borderTopColor: lineColor,
  },
  footRight: {
    backgroundColor: '#0083E0',
  },
  footRightText: {
    textAlign: 'center',
    color: '#FBFBFB',
    // lineHeight: Platform.OS === 'ios' ? 38 : 28,
  },
  footLeft: {
  },
  footLeftText: {
    fontSize: fontSizeSmall,
    color: color66,
    textAlign: 'center',
    paddingTop: 2,
    paddingBottom: 2,
  },
  footImg: {
    marginTop: 2,
  },
  cartStyle: {
    backgroundColor: '#66b5ec',
  },
  cartLoseStyle: {
    color: '#cccccc',
  },
});
