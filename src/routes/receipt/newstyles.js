import { Dimensions } from 'react-native';
import createStyle from './../../themes/baseStyle';
import {
  lineColor, mainColor, shadeBg2, color33, color66, color99, cartBarHeight, fontSizeLarge, shadeBg1, shadeBg,
} from '../../themes/fsBaseStyles';

export default createStyle({
  scrollViewbg: {
    // height: Dimensions.get('window').height - 160,
    backgroundColor: shadeBg1,
    // backgroundColor: 'red',
  },
  viewBg: {
    backgroundColor: shadeBg,
    flex: 1,
  },
  viewWidth: {
    width: (Dimensions.get('window').width - 30) / 3,
  },
  viewWidthLeft: {
    marginLeft: 6,
  },
  textView: {
    color: color66,
    fontSize: fontSizeLarge,
    marginHorizontal: 10,
    marginVertical: 10,
  },
  marginRange: {
    marginHorizontal: 12,
    marginBottom: 10,
  },
  viewTop: {
    marginTop: 10,
  },
  marTB: {
    marginTop: 8,
    // marginBottom: 8,
  },
  h30: {
    height: 45,
    paddingTop: 0,
  },
  borderB: {
    borderBottomWidth: 1,
    borderBottomColor: lineColor,
  },
  contentLR: {
    justifyContent: 'space-between',
  },
  row1: {
    flexDirection: 'row',
  },
  bgkWrite: {
    backgroundColor: shadeBg,
  },
  left1: {
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  paddL: {
    paddingLeft: 12,
    paddingRight: 12,
  },
  smallInfo: {
    fontSize: fontSizeLarge,
    color: color66,
    width: 100,
  },
  smallInfo2: {
    color: color33,
    fontSize: fontSizeLarge,
    marginLeft: 10,
  },
  arrowIcon: {
    width: 12,
    height: 12,
    marginRight: 8,
    marginTop: 14,
  },
  editIcon: {
    width: 15,
    height: 15,
    marginRight: 20,
    marginTop: 14,
  },
  changeColor: {
    color: color99,
  },
  closeList: {
    position: 'relative',
    maxHeight: Dimensions.get('window').height / 2,
  },
  promView: {
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: shadeBg,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  promTitle: {
    textAlign: 'center',
    marginLeft: 6,
    height: 45,
    paddingTop: 16,
    fontSize: fontSizeLarge,
    color: color66,
  },
  closeIcon: {
    width: 16,
    height: 16,
    position: 'absolute',
    right: 10,
    top: 15,
  },
  desView: {
    borderTopColor: lineColor,
    borderTopWidth: 1,
  },
  desInfo: {
    color: color33,
    height: 45,
    paddingTop: 15,
    fontSize: fontSizeLarge,
  },
  btnBom: {
    borderTopColor: lineColor,
    borderTopWidth: 1,
    height: cartBarHeight,
  },
  btnSureView: {
    alignItems: 'center',
    backgroundColor: mainColor,
    flexDirection: 'row',
    justifyContent: 'center',
    flex: 1,
  },
  btnResetTest: {
    alignItems: 'center',
    alignSelf: 'center',
    color: color33,
  },
  btnSureTest: {
    alignSelf: 'center',
    color: shadeBg2,
  },
});
