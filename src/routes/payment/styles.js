import createStyle from './../../themes/baseStyle';
import {
  btnView, touchStyle, btnInsideView2, btnInsideView, btnInsideText,
} from '../../themes/fsBaseStyles';
export default createStyle({
  top: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrImage: {
    width: 300,
    height: 300,
  },
  text: {
    fontSize: 18,
    color: 'white',
  },
  placeHolder: {
    height: 5,
  },
  flex: {
    flex: 1,
  },
  row1: {
    flexDirection: 'row',
  },
  button: {
    marginHorizontal: 20,
    height: 50,
    backgroundColor: '#4E86D9',
  },
  // 底部按钮样式
  bottom: btnView,
  tStyle: touchStyle,
  footRight: btnInsideView,
  footRightText: btnInsideText,
  footRight2: btnInsideView2,
});
