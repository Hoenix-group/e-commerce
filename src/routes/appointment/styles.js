import createStyle from './../../themes/baseStyle';
import Dimensions from 'Dimensions';
import { shadeBg, fontSizeMax, shadeBg1, lineColor, fontSizeMiddle, fontSizeLarge, color33, color66, redPrice, mainColor, paddingLarge, paddingMiddle, marginMiddle, marginLarge, marginSmall } from './../../themes/fsBaseStyles';

export default createStyle({
  greyHeaderArea: {
    backgroundColor: shadeBg1,
    paddingVertical: paddingLarge,
    flexDirection: 'row',
  },
  headerLeft: {
    flex: 3,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: fontSizeLarge,
    color: color33,
  },
  appointmentName: {
    color: color33,
    fontSize: fontSizeMiddle,
    textAlign: 'left',
  },
  resultList: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: lineColor,
  },
  resultListLeft: {
    flex: 3,
    paddingVertical: 16,
    paddingLeft: 25,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexDirection: 'column',
  },
  resultListOne: {
    paddingVertical: 16,
    paddingLeft: 25,
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderColor: lineColor,
  },
  resultListOneFlex: {
    paddingVertical: 16,
    paddingLeft: 25,
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderColor: lineColor,
    flexDirection: 'row',
  },
  resultListRight: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginVertical: 16,
    marginRight: 16,
  },
  customerListRight: {
    flex: 3,
    justifyContent: 'flex-start',
  },
  centerAlign: {
    alignItems: 'center',
  },
  detailHeader: {
    borderBottomWidth: 1,
    borderColor: lineColor,
    height: 52,
    paddingHorizontal: paddingLarge,
    paddingVertical: 16,
    flexDirection: 'row',
  },
  detailHeaderLeft: {
    // flex: 2,
    width: 60,
    // flexBasis: 35,
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginLeft: marginLarge,
  },
  resultListOneLeft: {
    width: 70,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  detailHeaderRight: {
    flex: 7,
    justifyContent: 'center',
    paddingLeft: paddingMiddle,
  },
  resultListOneRight: {
    flex: 7,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: paddingMiddle,
  },
  detailListView: {
    flex: 0.8,
    flexDirection: 'row',
    marginBottom: 12,
    marginHorizontal: 16,
  },
  detailListViewFirst: {
    marginTop: 22,
  },
  detailListTitle: {
    fontSize: fontSizeMiddle,
    color: color66,
    marginRight: marginMiddle,
    width: 70,
    flex: 1.5,
    flexBasis: 70,
    textAlign: 'left',
  },
  detailListContent: {
    flex: 4,
    color: color33,
    textAlign: 'left',
    fontSize: fontSizeMiddle,
  },
  onlineIcon: {
    // width: 34,
    // marginLeft: 8,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  secondaryButton: {
    // width: 44,
    // marginLeft: 8,
  },
  fontMain: {
    color: color33,
    fontSize: fontSizeMiddle,
  },
  fontGrey: {
    color: color66,
    fontSize: fontSizeMiddle,
  },
  fontTitle: {
    color: color33,
    fontSize: fontSizeLarge,
  },
  buttonArea: {
    borderTopWidth: 1,
    borderColor: lineColor,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  buttonWidth: {
    width: 78,
  },
  marginBM: {
    marginBottom: marginMiddle,
  },
  marginLS: {
    marginLeft: marginSmall,
  },
  buttonAngle: {
    borderRadius: 0,
    height: 50,
  },
  footer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  fontPrice: {
    color: redPrice,
    fontSize: fontSizeMiddle,
  },
  borderT: {
    borderTopWidth: 1,
    borderTopColor: lineColor,
  },
  paddingM: {
    padding: paddingMiddle,
  },

  /**
   * 自定义头部
   */
  itemView: {
    width: 95,
    borderBottomWidth: 1,
    borderColor: '#252525',
  },
  itemText: {
    color: shadeBg,
    textAlign: 'center',
  },
  outsideView: {
    position: 'relative',
    height: 44,
    borderBottomWidth: 1,
    borderBottomColor: lineColor,
  },
  imgView: {
    left: 5,
    marginHorizontal: 5,
  },
  LeftImg: {
    width: 13, height: 21,
  },
  headerText: {
    textAlign: 'center',
    fontSize: fontSizeMax,
    color: '#333333',
  },


});
