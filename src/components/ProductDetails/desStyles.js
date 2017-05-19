import createStyle from './../../themes/baseStyle';
const Dimensions = require('Dimensions');

export default createStyle({
    /* 公共部分 */
  image: {
    // 设置宽度
    width: Dimensions.get('window').width,
    resizeMode: 'contain',
    marginTop: 0,
    paddingTop: 0,
  },
});
