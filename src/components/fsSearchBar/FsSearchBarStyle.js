import variables from './../../themes/defaultStyles';
import cStyles from './../../themes/commonStyles';

const FsSearchBarStyle = {
  touchableWithoutFeedback: {
    backgroundColor: 'pink',
  },
  view: {
    ...this.touchableWithoutFeedback,
    paddingBottom: 8,
    paddingTop: 8,
    // paddingLeft: 8,
    // paddingRight: 8,
    flexDirection: variables.flex_row,
    //backgroundColor: 'transparent'
  },
  paddingL: {
    paddingLeft: 8,
    paddingRight: 8,
  },
  textInput: {
    height: 28,
    alignSelf: 'stretch',
    backgroundColor: variables.bg_F5,
    paddingVertical: 0,
    borderWidth: variables.border_Width,
    borderColor: variables.border_Color,
    borderRadius: 5,
    fontSize: 14,
    color: variables.font_cb4,
    flex: 5,
    paddingLeft: 35,
    paddingRight: 35,
    paddingTop: 0,
    paddingBottom: 0,
  },
  text: {
    backgroundColor: variables.bg_FF,
    lineHeight: 24,
    color: variables.font_c99,
  },
  imageLeft: {
    position: 'absolute',
    left: 16,
    top: 14,
    height: 14,
    width: 14,
  },
  imageLeft2: {
    left: 55,
  },
  imageRight: {
    position: 'absolute',
    right: 20,
    top: 12,
  },
  imageRight2: {
    top: 14,
    right: 50,
  },
  imageRight3: {
    right: 60,
  },
  imageRight4: {
    height: 14,
    width: 14,
    resizeMode: 'contain',
  },
  imageRight5: {
    right: 80,
  },
  mageRight: {
    position: 'absolute',
    right: 65,
    top: 10,
    height: 20,
    width: 20,
  },
  searchBarLeft: {
    width: 48,
  },
  searchBarMiddle: {
    flex: 1,
  },
  searchBarRight: {
    width: 40,
  },
  cancelTextContainel: {
    height: 28,
    justifyContent: variables.flex_center,
    alignItems: variables.flex_center,
  },
  cancelText: {
    fontSize: 14,
    color: '#a2a2a2',
    paddingLeft: 15,
  },

};
export default cStyles(FsSearchBarStyle);

