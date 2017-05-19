import createStyle from './../../themes/baseStyle';
import Dimensions from 'Dimensions';
import { shadeBg1, lineColor, redPrice, fontSizeSmall, fontSizeMiddle, fontSizeLarge, color33, color66, mainColor, paddingSmall, paddingLarge, paddingMiddle, marginMiddle, marginLarge, marginSmall,commonButton } from './../../themes/fsBaseStyles';

export default createStyle({
  listItem: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: lineColor,
  },
  //给获取验证码行用的
  listItem2: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: lineColor,
  },
  listLabel: {
    flex: 2.1,
    paddingLeft: 16,
    alignItems: 'flex-end',
    paddingVertical: 16,
  },
  //给获取验证码行用的
  listLabel2: {
    flex: 2.1,
    paddingLeft: 16,
    alignItems: 'flex-end',
    paddingVertical: 16,
  },
  labelText: {
    color: color33,
    fontSize: fontSizeLarge,
  },
  listInput: {
    flex: 6,
    paddingRight: 16,
    justifyContent: 'center',
  },
  listText: {
    flex: 6,
    paddingRight: 16,
    justifyContent: 'center',
    paddingVertical: 16,
  },
  listInputL: {
    flex: 4,
    justifyContent: 'center',
  },
  listInputR: {
    flex: 2,
    paddingRight: 16,
    paddingVertical: 12,
  },
  textInput: {
    padding: 0,
    marginLeft: 10,
    //height: 18,
    //marginTop:4,
    fontSize: fontSizeLarge,
    //textAlignVertical: 'bottom',
    flex: 1,
    justifyContent: 'center',
    color: color33,
  },
  // 获取验证码button样式
  buttonSmall: {
    paddingHorizontal:8,
    borderRadius:0,
    width: 82,
    height:28,
  },
  //获取验证码button text
  buttonSmallText: {
    fontSize: fontSizeSmall, 
    color: commonButton.color,
  },
  //日期控件左侧label view
  labelViewO: {
    paddingLeft: 0, 
    borderColor:lineColor,
    borderBottomWidth:1,
  },
  labelTextO: {
    width: (Dimensions.get('window').width)*0.28,
    paddingLeft: 16,
    textAlign: 'right',
    marginVertical:3.5,
    height: 27.5,
    marginTop: 11.5,
    fontSize: fontSizeLarge,
    color: color33,
  },
  //选择支付方式
  listHeader: {
    fontSize: fontSizeMiddle,
    color: color66,
    paddingVertical: paddingLarge,
    paddingLeft: 20,
  },
  checkboxContainer: {
    marginLeft: 20,
    borderBottomWidth: 1,
    borderColor: lineColor,
  },
  checkboxItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingLeft: paddingLarge,
  },
  checkboxLabel: {
    fontSize: fontSizeMiddle,
    color: color33,
//flex: 1,
   // height: 20,
  },
  checkboxPro: {
    fontSize: fontSizeSmall,
    color: redPrice,
    paddingTop: paddingSmall,
    //flex: 1,
  },
  imgArea: {
    flex: 1,
  },
  textArea: {
    flex: 5,
    flexDirection: 'column',
  },
  //灰条的分隔
  greyBar: {
    height:8,
    backgroundColor:shadeBg1,
  },
  //支付方式的logo
  logo: {
    height: 26,
    width: 26,
  },
});
