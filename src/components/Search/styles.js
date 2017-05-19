import { Dimensions, Platform } from 'react-native';
import createStyle from './../../themes/baseStyle';
import {
  lineColor, chooseColor, color33, color66, colorCC,
  redPrice, fontSizeLarge, fontSizeMiddle, fontSizeMin, mainColor,
} from '../../themes/fsBaseStyles';

export default createStyle({
  container: {
    justifyContent: 'space-around',
    flexDirection: 'row',
    flexWrap: 'wrap',
    top: 20,
  },
  comment: {
    height: Platform.OS === 'android' ? Dimensions.get('window').height : Dimensions.get('window').height - 20,

  },
  tagView: {
    marginLeft: 15,
    marginVertical: 2,
    height: 40,
    width: (Dimensions.get('window').width - 60) / 3,
  },
  hottag: {
    marginHorizontal: 5,
    marginVertical: 10,
    height: 60,
    width: (Dimensions.get('window').width - 40) / 4,
  },
  hoticon: {
    width: (Dimensions.get('window').width - 40) / 4,
    height: 40,
    resizeMode: 'contain',
  },
  icon: {
    width: 20,
    height: 20,
    marginVertical: 10,
    resizeMode: 'contain',
  },
  tagBorderView: {
    marginHorizontal: 15,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: lineColor,
    height: 30,
    justifyContent: 'center',
    width: 100,
    paddingHorizontal: 8,
  },
  textView: {
    marginHorizontal: 15,
    marginVertical: 10,
    fontSize: fontSizeLarge,
    color: color66,
  },
  btnView: {
    marginHorizontal: 5,
    marginVertical: 5,
  },
  styleLine: {
    borderColor: lineColor,
    borderWidth: 0.5,
    marginHorizontal: 15,
    marginVertical: 5,
  },
  stylePage: {
    color: mainColor,
    fontSize: fontSizeLarge,
    marginVertical: 10,
    paddingRight: 10,
  },
  activeText: {
    color: '#108ee9',
  },
  hotText: {
    textAlign: 'center',
    paddingTop: 5,
  },
});

