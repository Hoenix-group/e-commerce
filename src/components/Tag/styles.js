import { Dimensions } from 'react-native';
import createStyle from './../../themes/baseStyle';

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
    fontSize: 12,
    textAlign: 'center',
    paddingHorizontal: 5,
    width: (Dimensions.get('window').width - 100) / 3,
    height: 30,
  },
  unChangetext: {
    fontSize: 12,
    textAlign: 'center',
    paddingHorizontal: 5,
    height: 30,
  },
  textSmall: {
    fontSize: 10,
  },
  normalWrap: {
    backgroundColor: '#fff',
    borderColor: '#e1e1e1',
  },
  normalText: {
    color: '#333',
  },
  activeWrap: {
    backgroundColor: '#fff',
    borderColor: '#108ee9',
  },
  activeText: {
    color: '#108ee9',
  },
  disabledWrap: {
    backgroundColor: '#ccc',
    borderWidth: 0,
  },
  disabledText: {
    color: '#fff',
  },
  close: {
    position: 'absolute',
    top: -2,
    right: 4,
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
