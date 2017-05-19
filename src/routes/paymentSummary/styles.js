import createStyle from './../../themes/baseStyle';
import {
  lineColor,
  color33,
  color99,
  fontSizeMax,
  fontSizeSmall,
  shadeBg1, fontSizeMin,
  color66, shadeBg,
} from '../../themes/fsBaseStyles';
export default createStyle({
  main: {
    backgroundColor: shadeBg1,
  },
  bottom: {
    flexDirection: 'column',
    backgroundColor: shadeBg,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  middle: {
    height: 10,
  },
  bottomItem: {
    width: 180,
    flexDirection: 'column',
    backgroundColor: shadeBg,
    alignItems: 'center',
    paddingVertical: 5,
  },
  bottomLine: {
    flexDirection: 'row',
    backgroundColor: 'white',
    alignItems: 'center',
  },
  top: {
    height: 250,
    flexDirection: 'column',
    backgroundColor: shadeBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  button: {
    height: 30,
    width: 90,
    backgroundColor: shadeBg,
    borderColor: color99,
  },
  fontSize12: {
    fontSize: fontSizeSmall,
  },
  text: {
    color: color99,
    fontSize: fontSizeSmall,
  },
  font: {
    color: color33,
    fontSize: fontSizeMax,
  },
  image: {
    width: 40,
    height: 40,
  },
});
