import { Dimensions } from 'react-native';
import createStyle from './../../themes/baseStyle';


export default createStyle({
  head: {
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  hearClear: {
    textAlign: 'left',
    color: '#5AAFEE',
    marginHorizontal: 25,
    fontSize: 14,
    lineHeight: 30,
  },
  hearContent: {
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 32,
  },
  hearSubmit: {
    textAlign: 'right',
    marginHorizontal: 25,
    color: '#5AAFEE',
    fontSize: 14,
    lineHeight: 30,
  },
  rightText: {
    flex: 2,
  },
  poptext: {
    marginHorizontal: 10,
  },
  icon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  textCenter: {
    textAlignVertical: 'center',
    alignSelf: 'center',
  },
});
