import createStyle from './../../themes/baseStyle';
import {
  shadeBg3, tabRadius,
  lineColor, chooseColor,
  color33, mainColor,
  redPrice, rowJustifyLeftCenter,
  fontSizeLarge, rowJustifyCenter,
  fontSizeSmall,
  color66, shadeBg, color99,
} from '../../themes/fsBaseStyles';
export default createStyle({
  center: rowJustifyCenter,
  leftCenter: rowJustifyLeftCenter,
  tabtitle: {
    borderColor: lineColor,
    borderBottomWidth: 0.5,
    flexDirection: 'row',
  },
  tabStyle: {
    // minWidth: 100,
    paddingHorizontal: 10,
    paddingTop: 0,
  },
  tabStyleActive: {
    // minWidth: 100,
    paddingHorizontal: 10,
    borderBottomWidth: 1.5,
    borderColor: mainColor,
  },
  tabtext: {
    padding: 10,
    textAlign: 'left',
    fontSize: fontSizeLarge,
    color: color33,
  },
  color33: {
    color: color33,
  },
  addressItem: {
    // width: 100,
    flex: 1,
    paddingHorizontal: 10,
    paddingLeft: 20,
  },
  closeIcon: {
    width: 16,
    height: 16,
    position: 'absolute',
    right: 10,
    top: 15,
  },
  areaTitle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 45,
    alignSelf: 'center',
  },
  areaText: {
    color: color66,
    fontSize: fontSizeLarge,
  },
});
