/**
 * Created by F162228 on 2017/1/22.
 */
import { Dimensions, Platform } from 'react-native';
import createStyle from './../../themes/baseStyle';
import {
  lineColor, mainColor, shadeBg2, shadeBg3,
  color66, fontSizeLarge,
  color33, fontSizePrice, fontSizeMiddle,
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
  contentBT: {
    justifyContent: 'space-between',
    // alignItems: 'flex-end',
  },
  paddLR: {
    paddingHorizontal: 10,
  },
  paddLR1: {
    paddingHorizontal: 5,
  },
  priceTitle: {
    height: 35,
    lineHeight: Platform.OS === 'ios' ? 44 : 35,
    color: color66,
    fontSize: fontSizeLarge,
  },
  inputStyle: {
    height: Platform.OS === 'android' ? 40 : 35,
    borderColor: lineColor,
    borderWidth: 1,
    textAlign: 'center',
    fontSize: fontSizeMiddle,
  },
  inputView: {
    // paddingHorizontal: 10,
    paddingVertical: 10,
  },
  borderT: {
    borderTopColor: lineColor,
    borderTopWidth: 1,
    // marginBottom: 6,
  },
  arrowIcon: {
    width: 12,
    height: 12,
    marginRight: 8,
    marginTop: 8,
  },
  padd: {
    // paddingHorizontal: 30,
    paddingVertical: 12,
    paddingLeft: 10,
  },
  tagView: {
    marginHorizontal: Platform.OS === 'android' ? 10 : 6,
    // marginVertical: 10,
    height: 40,
    width: Platform.OS === 'android' ?
      (Dimensions.get('window').width / 2 - 60) :
      (Dimensions.get('window').width / 2 - 50),
  },
  filterTitle: {
    color: color66,
    fontSize: fontSizeLarge,
  },
  btnResetTest: {
    textAlign: 'center',
    paddingTop: Platform.OS === 'ios' ? 11 : 6,
    fontSize: fontSizePrice,
    color: color33,
  },
  btnBom: {
    flex: 0.6,
    borderTopColor: lineColor,
    borderTopWidth: 1,
  },
  btnSureView: {
    flex: 1,
    backgroundColor: mainColor,

  },
  btnSureTest: {
    textAlign: 'center',
    paddingTop: Platform.OS === 'ios' ? 11 : 8,
    fontSize: fontSizePrice,
    color: shadeBg2,
  },
  readMoreTouch: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: shadeBg3,
    paddingVertical: 8,
    paddingHorizontal: 8,
    margin: 8,
    borderWidth: 0.5,
    borderColor: lineColor,
    borderRadius: 2,
  },
  readMoreView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  readMoreText: {
    color: color33,
  },
});
