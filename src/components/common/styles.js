import createStyle from './../../themes/baseStyle';

export default createStyle({
  rootView: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  imgLeft: {
    width: 13,
    height: 21,
  },

  windowCover:{
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0

  },
  
  fillParent: {
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
});
