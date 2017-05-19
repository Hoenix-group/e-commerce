import createStyle from './../../themes/baseStyle';
import {
  lineColor,
  fontSizeMiddle,
  color33, shadeBg1,
  color66, shadeBg,
  paddingLarge, color99,
  paddingMiddle, fontSizeSmall,
  marginMiddle, fontSizeLarge,
  marginLarge } from './../../themes/fsBaseStyles';
export default createStyle({
  itemInnerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  labelRow: {
    flexDirection: 'row',
  },
  label: {
    marginRight: 5,
    color: '#108EE9',
    borderColor: '#108EE9',
    borderWidth: 1,
    borderRadius: 3,
  },
  footer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterTable: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  filterColumn: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBackground: {
    backgroundColor: '#0083E0',
  },
  filterColor: {
    color: color33,
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
  detailHeaderRight: {
    flex: 7,
    justifyContent: 'center',
    paddingLeft: paddingMiddle,
  },
  detailListView: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  detailListViewFirst: {
    marginTop: 5,
  },
  detailListTitle: {
    fontSize: fontSizeLarge,
    color: color66,
    marginRight: marginMiddle,
    flexBasis: 65,
    textAlign: 'left',
  },
  detailListContent: {
    color: color33,
    textAlign: 'left',
    fontSize: fontSizeLarge,
  },
  resultList: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: lineColor,
    backgroundColor: shadeBg,
  },
  resultListLeft: {
    paddingVertical: 16,
    paddingLeft: 15,
    alignItems: 'flex-start',
    paddingRight: 15,
    flex: 7,
  },
  resultListOne: {
    paddingVertical: 16,
    paddingLeft: 25,
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderColor: lineColor,
  },
  resultListRight: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexDirection: 'row',
    marginVertical: 16,
    marginRight: 10,
    marginTop: 12,
    flex: 3,
  },
  customerListRight: {
    flex: 3,
    justifyContent: 'flex-start',
  },
  centerAlign: {
    alignItems: 'center',
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
  font33: {
    color: color33,
    fontSize: fontSizeMiddle,
    paddingBottom: 8,
  },
  fontTitle: {
    color: color99,
    fontSize: fontSizeSmall,
    paddingTop: 5,
    textAlign: 'right',
    paddingRight: 5,
  },
  fontSizeLarge: {
    fontSize: fontSizeLarge,
  },
  listViewStyle: {
    borderTopWidth: 1,
    borderTopColor: lineColor,
    backgroundColor: shadeBg1,
  },
  scrollBg: {
    backgroundColor: shadeBg1,
  },
  bgFF: {
    backgroundColor: shadeBg,
  },
});
