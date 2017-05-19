import Dimensions from 'Dimensions';
import createStyle from './../../themes/baseStyle';


export default createStyle({

  image1:{
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').width
  },
  carousel: {

  },
  imageContainer:{
    height: Dimensions.get('window').width,
    padding:20,
  },
  image: {
    width: 60,
    height: 60,
  },
});