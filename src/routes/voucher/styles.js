import createStyle from './../../themes/baseStyle';

import {
  lineColor, color33, color66, fontSizeSmall, cartBarHeight, fontSizeLarge,
} from '../../themes/fsBaseStyles';

export default createStyle({
  voucherCard: {
    borderWidth: 0.5,
    borderColor: '#999',
    marginTop: 8,
    marginBottom: 2,
    marginRight: 30,
    //marginLeft: 30,
  },
  marginLeft30: {
    marginLeft: 30,
  },
  font_grey: {
    color: '#999',
    fontSize: 13,
  },
  font_16: {
    fontSize: 16,
  },
  font_right: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottom_Btn_View: {
    flexDirection: 'row',
    flexGrow: 1, 
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    height: 40,
  },
  bottom_Btn_Group: {
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
  },
  bottom_Btn_Left: {
    borderRightWidth: 1,
    borderRightColor: '#E0E0E0',
  },
  bottom_Btn_Right: {
    borderLeftWidth: 1,
    borderLeftColor: '#E0E0E0',
  },
  flexGrow08: {
    flexGrow: 0.9,
  },
  bottom_Btn_One: {
    backgroundColor:'#2894FF',
  },
  icon_Style: {
    width: 20,
    // height: 20,
    marginVertical: 10,
    resizeMode: 'contain',
  },
});
