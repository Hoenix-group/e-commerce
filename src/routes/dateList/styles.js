import { Dimensions } from 'react-native';
import createStyle from './../../themes/baseStyle';

export default createStyle({
  dateItem: {
    height: 40,
    width: Dimensions.get('window').width,
    borderWidth: 1,
    borderColor: '#e9e9e9',
    fontSize: 16,
    textAlign: 'center',
  }
});
