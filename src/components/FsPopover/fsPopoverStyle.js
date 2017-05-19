import {Platform, StyleSheet} from 'react-native';
import createStyle from './../../themes/baseStyle';

export default createStyle({
  container: {
    justifyContent: 'center',
    backgroundColor: '#fff'
  },
  modalContainer: {
    position: 'absolute',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderRadius: 8,
    zIndex: 2,
  },
  text: {
    color: '#fff',
  },
  arrow: {
    position: 'absolute',
    transform: [{rotate: '180deg'}],
  },
  maskStyle: {
    flex: 1,
    zIndex: 1,
  }
})
