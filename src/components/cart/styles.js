import Dimensions from 'Dimensions';
import createStyle from './../../themes/baseStyle';
import {
  lineColor, shadeBg, mainColor, color33, onlineIconText, onlineIconView,
  redPrice, marginMiddle, fontSizeLarge, fontSizeMiddle, shadeBg1, fontSizeMin,
} from './../../themes/fsBaseStyles';

export default createStyle({

  searchContainer: {
    borderBottomWidth: 1,
    borderBottomColor: lineColor,
    backgroundColor: shadeBg,
    height: Dimensions.get('window').height,
  },
  container: {
    backgroundColor: shadeBg1,
  },
  flex: {
    flex: 1,
  },
  row1: {
    flexDirection: 'row',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  left1: {
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  left2: {
    justifyContent: 'flex-start',
  },
  end1: {
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  contentLR: {
    justifyContent: 'space-between',
  },
  b_top: {
    borderTopWidth: 1,
    borderTopColor: lineColor,
  },
  b_bottom: {
    borderBottomWidth: 1,
    borderBottomColor: lineColor,
  },
  container_header: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: shadeBg,
  },
  container_body: {
    flex: 2,
    flexDirection: 'row',
    backgroundColor: shadeBg,
  },
  m_left5: {
    marginLeft: marginMiddle,
  },
  online: {
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderColor: mainColor,
  },
  imageView: {
    flex: 5,
    flexDirection: 'row',
  },
  image: {
    width: 60,
    height: 60,
    flexBasis: 60,
  },
  totalView: {
    flex: 2,
  },
  arrowIcon: {
    width: 12,
    height: 12,
  },
  font_14: {
    fontSize: fontSizeMiddle,
    color: color33,
  },
  onLineView1: onlineIconView,
  onLineBtn1: onlineIconText,
  sPrice: {
    color: redPrice,
    fontSize: fontSizeMiddle,
  },

  fontLarge: {
    fontSize: fontSizeLarge,
  },

});
