import { Dimensions } from 'react-native';
import variables from './../../themes/defaultStyles';
import createStyle from './../../themes/styles';

export default createStyle({
  logo_image: {
    width: 170,
    height: 76,
    // width: Dimensions.get('window').width,
    // height: Math.ceil((Dimensions.get('window').width * 76) / 170),
  },
  logoContainer: {
    paddingHorizontal: variables.p * 5,
    alignItems: variables.flex_center,
  },
  usernameContainer: {
    marginTop: 37,
    flexDirection: variables.flex_row,
    paddingHorizontal: variables.p,
  },
  passwordContainer: {
    marginTop: 11,
    flexDirection: variables.flex_row,
    paddingHorizontal: variables.p,
  },
  textInput: {
    flex: 1,
    fontSize: variables.font_Middle,
    padding: variables.p,
    borderWidth: 0,
    height: variables.input_height,
    backgroundColor: variables.bg_FF,
    paddingLeft: variables.p,
    color: variables.font_c33,
  },
  checkboxContainer: {
    marginTop: variables.m * 2,
    flexDirection: variables.flex_row,
    paddingHorizontal: variables.p,
  },
  checkbox: {
    flexDirection: variables.flex_row,
    alignItems: variables.flex_center,
  },
  buttonContainer: {
    marginTop: variables.m * 2,
    flexDirection: variables.flex_row,
    paddingHorizontal: variables.p,
  },
  forgetContainer: {
    marginTop: variables.m + 4,
    flexDirection: variables.flex_row,
    paddingHorizontal: variables.p,
  },
  forget: {
    flex: variables.flex,
    flexDirection: variables.flex_row,
    alignItems: variables.flex_center,
  },
  forgetText: {
    fontSize: variables.font_Small,
    color: variables.blueColor,
  },
  versionContainer: {
    flexDirection: variables.flex_row,
    justifyContent: variables.flex_center,
  },
  version: {
    color: variables.font_c99,
    fontSize: variables.font_min,
  },
  loginText: {
    color: variables.font_c33,
    fontSize: variables.font_Middle,
    width: variables.btn_height,
  },
  remPwd: {
    paddingLeft: variables.p,
    color: variables.font_c33,
    fontSize: variables.font_Small,
  },
  loginView: {
    flex: variables.flex,
    justifyContent: variables.flex_start,
    paddingBottom: variables.p + 5,
    marginTop: variables.m * 4,
  },
});
