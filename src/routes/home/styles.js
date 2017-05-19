import variables from './../../themes/defaultStyles';
import cStyles from './../../themes/commonStyles';

export default cStyles({
  carousel: {
    justifyContent: variables.flex_center,
    alignItems: variables.flex_center,
  },
  item: {
    backgroundColor: variables.bg_FF,
  },
  itemText: {
    height: 200,
    lineHeight: 200,
  },
  image: {
    width: variables.win_width,
  },
  imageContainer: {
    height: 190,
  },
  leftItem: {
    backgroundColor: variables.bg_FF,
    alignItems: variables.flex_center,
    marginRight: variables.m - 8,
    marginBottom: variables.m - 6,
    height: 200,
    padding: variables.p - 5,
    width: (variables.win_width - 4) / 2,
  },
  rightItem: {
    backgroundColor: '#fff',
    alignItems: 'center',
    marginLeft: 2,
    marginBottom: 4,
    height: 200,
    padding: 5,
    width: (variables.win_width - 4) / 2,
  },
  gridView: {
    borderWidth: variables.border_Width,
    borderColor: variables.border_Color,
    flex: variables.flex,
    justifyContent: variables.flex_center,
    alignItems: variables.flex_center,
    backgroundColor: variables.bg_FB,
  },
  RegionBarImg: {
    height: 18,
    width: 21,
    resizeMode: 'contain',
    marginBottom: 2,
  },
  rightSideImg: {
    height: 18,
    width: 18,
    resizeMode: 'contain',
  },
  RegionBarText: {
    fontSize: variables.font_min - 2,
    color: variables.bg_FB,
    alignItems: variables.flex_center,
  },
  renderText: {
    color: variables.font_c33,
    fontSize: variables.font_Small,
  },
  recommendedTitle:{
        height: 40,
        backgroundColor:variables.blueColor,
        justifyContent:'center',
        alignItems:'center'
    }
});
