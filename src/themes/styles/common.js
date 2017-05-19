import Dimensions from 'Dimensions';
import { Platform, StyleSheet } from 'react-native';
import * as theme from './constants';


export default {
  /**
   * common
   */

   w170:{
     width: 170
   },

   h76:{
     height: 76
   },

  flex1: {
    flex: 1
  },
  flex2: {
    flex: 2
  },
  flex3: {
    flex: 3
  },
  flex4: {
    flex: 4
  },
  flex5: {
    flex: 5
  },
  flex6: {
    flex: 6
  },
  flex7: {
    flex: 7
  },
  flexRow: {
    flexDirection: 'row'
  },
  flexCol: {
    flexDirection: 'column'
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  alignL: {
    alignItems: "flex-start"
  },
  alignR: {
    alignItems: "flex-end"
  },
  alignT: {
    justifyContent: "flex-start"
  },
  alignB: {
    justifyContent: "flex-end"
  },
  alignSelfS: {
    alignSelf: 'flex-start'
  },
  alignSelfE: {
    alignSelf: 'flex-end'
  },
  alignSelfC: {
    alignSelf: 'center'
  },
  alignTextC: {
    textAlign: 'center'
  },
  /**
   * font
   */
  fontXS: {
    fontSize: theme.fontSizeXS
  },
  fontSM: {
    fontSize: theme.fontSizeSM
  },
  fontMD: {
    fontSize: theme.fontSizeMD
  },
  fontLG: {
    fontSize: theme.fontSizeLG
  },
  fontXL: {
    fontSize: theme.fontSizeXL
  },
  /**
   * color
   */
  contentPrimary: {
    color: theme.brandPrimary
  },
  contentBlack: {
    color: theme.textColor1
  },
  contentDark: {
    color: theme.textColor2
  },
  contentGrey: {
    color: theme.textColor3
  },
  contentWhite: {
    color: theme.textColor4
  },
  contentDisabled: {
    color: theme.textDisabled
  },
  /**
   * padding
   */
  paddingXS: {
    padding: theme.spaceXS
  },
  paddingHXS: {
    paddingHorizontal: theme.spaceXS
  },
  paddingVXS: {
    paddingVertical: theme.spaceXS
  },
  paddingSM: {
    padding: theme.spaceSM
  },
  paddingHSM: {
    paddingHorizontal: theme.spaceSM
  },
  paddingVSM: {
    paddingVertical: theme.spaceSM
  },
  paddingMD: {
    padding: theme.spaceMD
  },
  paddingHMD: {
    paddingHorizontal: theme.spaceMD
  },
  paddingVMD: {
    paddingVertical: theme.spaceMD
  },
  paddingLG: {
    padding: theme.spaceLG
  },
  paddingHLG: {
    paddingHorizontal: theme.spaceLG
  },
  paddingVLG: {
    paddingVertical: theme.spaceLG
  },
  paddingXL: {
    padding: theme.spaceXL
  },
  paddingHXL: {
    paddingHorizontal: theme.spaceXL
  },
  paddingVXL: {
    paddingVertical: theme.spaceXL
  },
  /**
   * margin
   */
  marginXS: {
    margin: theme.spaceXS
  },
  marginHXS: {
    marginHorizontal: theme.spaceXS
  },
  marginVXS: {
    marginVertical: theme.spaceXS
  },
  marginSM: {
    margin: theme.spaceSM
  },
  marginHSM: {
    marginHorizontal: theme.spaceSM
  },
  marginVSM: {
    marginVertical: theme.spaceSM
  },
  marginMD: {
    margin: theme.spaceMD
  },
  marginHMD: {
    marginHorizontal: theme.spaceMD
  },
  marginVMD: {
    marginVertical: theme.spaceMD
  },
  marginLG: {
    margin: theme.spaceLG
  },
  marginHLG: {
    marginHorizontal: theme.spaceLG
  },
  marginVLG: {
    marginVertical: theme.spaceLG
  },
  marginXL: {
    margin: theme.spaceXL
  },
  marginHXL: {
    marginHorizontal: theme.spaceXL
  },
  marginVXL: {
    marginVertical: theme.spaceXL
  },
  /**
   * background
   */
  bgGrey: {
    backgroundColor: theme.backgroundColor2
  },
  bgWhite: {
    backgroundColor: theme.backgroundColor1
  },
  bgSeparator: {
    backgroundColor: theme.separatorColor
  },
  /**
   * border
   */
  borderRadiusMD: {
    borderRadius: theme.borderRadiusMD
  },
  /**
   * separator
   */
  separatorSM: {
    height: (theme.fontSizeSM / 2),
    borderBottomColor: theme.borderColor1,
    borderBottomWidth: theme.borderWidthMD
  },
  separatorTextViewSM: {
    height: theme.fontSizeSM
  },
  separatorTextSM: {
    fontSize: theme.fontSizeSM,
    textAlign: 'center'
  },
  separatorMD: {
    height: (theme.fontSizeMD / 2),
    borderBottomColor: theme.borderColor1,
    borderBottomWidth: theme.borderWidthMD
  },
  separatorLG: {
    height: (theme.fontSizeLG / 2),
    borderBottomColor: theme.borderColor1,
    borderBottomWidth: theme.borderWidthMD
  },
  /**
   * button
   */
  //clear antd Button style
  buttonClear: {
    borderRadius: 0,
    borderColor: 'transparent',
    backgroundColor: 'transparent',
    paddingLeft: 0,
    paddingRight: 0
  },
  buttonPrimaryViewLG: {
    backgroundColor: theme.brandPrimary,
    height: theme.buttonLG,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPrimaryTextLG: {
    color: theme.textColor4,
    fontSize: theme.fontSizeLG
  },
  buttonPrimaryAntdLG: {
    backgroundColor: theme.brandPrimary,
    height: theme.buttonLG,
    borderColor: theme.brandPrimary
  },
  buttonPrimaryDisabledAntdLG: {
    backgroundColor: theme.buttonDisabled,
    height: theme.buttonLG,
    borderColor: theme.buttonDisabled
  },
  // 无结果页的button
  buttonSecondaryViewMD: {
    borderRadius: theme.borderRadiusMD,
    height: theme.buttonMD,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: theme.borderWidthMD,
    borderColor: theme.borderColor1,
    paddingHorizontal: theme.spaceSM
  },
  buttonSecondaryTextMD: {
    color: theme.textColor2,
    fontSize: theme.fontSizeLG
  },
  /**
   * input
   */
  inputLG: {
    height: theme.inputLG,
    fontSize: theme.fontSizeMD
  },
  // inputTextLG: {
  //   color: theme.textColor1,
  //   fontSize: theme.fontSizeMD,
  // }
  /**
   * react-native-router-flux navigationBar
   */
  navStyle:{
    backgroundColor: theme.backgroundColor1,
    borderBottomColor: theme.borderColor1,
    borderBottomWidth: theme.borderWidthMD
  },
  navTitleStyle:{
    fontSize: theme.fontSizeLG,
    color: theme.textColor1,
    marginTop: 2
  }
};
