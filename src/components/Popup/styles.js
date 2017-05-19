import { Platform } from 'react-native';
import createStyle from './../../themes/baseStyle';

export default createStyle({
  wrap: {
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  wrapTop: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    // top: Platform.OS === 'ios' ? 96 : 80,
  },
  textOnclick: {
    borderBottomWidth: 1,
    borderBottomColor: '#108ee9',
    color: '#349EEC',
  },
  tab: {
    // paddingTop: 5,
    // marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EBEBEB',
  },
  tabs: {
    textAlign: 'center',
    fontSize: 14,
  },
  tabFont: {
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 15,
    paddingRight: 15,
  },
});
