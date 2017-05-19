import { Dimensions, Platform } from 'react-native';
import createStyle from './../../themes/baseStyle';
import {
  lineColor, fontSizeMiddle, color33, chooseColor,
} from '../../themes/fsBaseStyles';

export default createStyle({
  tag: {
    borderRadius: 3,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    overflow: 'visible',
    flex: 1,
  },
  wrap: {
    overflow: 'hidden',
    borderRadius: 3,
    borderWidth: 0.5,
    borderStyle: 'solid',
    paddingVertical: 6,
    height: 30,
  },
  wrapSmall: {
    paddingVertical: 1.5,
    paddingHorizontal: 5,
  },
  text: {
    fontSize: fontSizeMiddle,
    textAlign: 'center',
    // width: (Dimensions.get('window').width - 60) / 3,
    width: Platform.OS === 'android' ?
      ((Dimensions.get('window').width - 60) / 2 - 25) :
      ((Dimensions.get('window').width - 60) / 2 - 15),
  },
  textSmall: {
    fontSize: 10,
  },
  normalWrap: {
    backgroundColor: '#fff',
    borderColor: lineColor,
  },
  normalText: {
    color: color33,
    textAlign: 'center',
  },
  activeWrap: {
    backgroundColor: '#fff',
    borderColor: chooseColor,
  },
  activeText: {
    color: chooseColor,
  },
  disabledWrap: {
    backgroundColor: '#bbb',
    borderWidth: 0,
  },
  disabledText: {
    color: '#bbb',
  },
  close: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#f2f2f2',
  },
  closeIOS: {
    overflow: 'hidden',
  },
  closeAndroid: {
  },
  closeText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 10,
    lineHeight: 14,

  },
  closeTransform: {
    transform: [
      { translateX: 1 },
      { rotate: '45deg' },
      { translateX: 0 },
    ],
  },
  closeTransformIos: {
    transform: [
      { translateX: 1 },
      { rotate: '45deg' },
      { translateX: 0 },
    ],
  },
  closeIcon: {
    width: 16,
    height: 16,
    position: 'absolute',
    right: -1,
    top: 0,
  },
});
