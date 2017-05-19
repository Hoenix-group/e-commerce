import { Platform, Dimensions } from 'react-native';
import createStyle from './../../themes/baseStyle';

export default createStyle({
  quickSearchBarStyle: {
    top: 85,
  },
  stickyStyle: {
    zIndex: 999,
  },
  sectionColor: {
    backgroundColor: '#F5F5F9',
  },
  labelRow: {
    flexDirection: 'row',
  },
  positionLabel: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  positionLabel1: {
    width: (Dimensions.get('window').width-70)/4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
  },
});
