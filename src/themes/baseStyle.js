import { Platform, StyleSheet } from 'react-native';
import * as _ from 'lodash';
import Dimensions from 'Dimensions';

export const baseStyle = {

      deviceSize: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height
    },
  container: {
    flex: 1,
    backgroundColor: '#fbfbfb',
    marginTop: Platform.OS === 'android' ? 0 : 20,
  },
  carousel: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  mv10: {
    marginVertical: 10,
  },
  mv20: {
    marginVertical: 20,
  },
  mh20: {
    marginHorizontal: 20,
  },
  m20: {
    margin: 20,
  },
  m30: {
    margin: 30,
  },
  m10: {
    margin: 10,
  },
  m_top5: {
    marginTop: 5,
  },
  m_left40: {
    marginLeft: 40,
  },
  m_left60: {
    marginLeft: 60,
  },
  m_right20: {
    marginRight: 20,
  },
  p10: {
    padding: 10,
  },
  commonTitle: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderColor: '#ddd',
    padding: 5,
    backgroundColor: '#F8F8F8',
  },
  scrollViewMarginBottom: {
    marginBottom: Platform.OS === 'android' ? 0 : 20,
  },
  fd_row: {
    flexDirection: 'row',
  },
  pv10: {
    paddingVertical: 10,
  },
  ph10: {
    paddingHorizontal: 10,
  },
  p_top10: {
    paddingTop: 10,
  },
  p_top50: {
    paddingTop: 50,
  },
  p_right20: {
    paddingRight: 20,
  },
  p20: {
    padding: 20,
  },

  mv5: {
    marginVertical: 5,
  },

  m2: {
    margin: 2,
  },

  m_left20: {
    marginLeft: 20,
  },

  m_bottom10: {
    marginBottom: 10,
  },

  font_w: {
    color: 'white',
  },
  font_wb: {
    color: 'white',
    fontWeight: 'bold',
  },
  font_r: {
    color: 'red',
  },
  font_g: {
    color: '#7B7B7B',
  },
  font_b: {
    color: '#2894FF',
  },
  font_12: {
    fontSize: 12,
  },
  font_14: {
    fontSize: 14,
  },
  font_18: {
    fontSize: 18,
  },
  font_10: {
    fontSize: 10,
  },
  btn_b: {
    backgroundColor: '#2894FF',
  },
  btn_disable: {
    backgroundColor: '#E0E0E0',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  stretch: {
    alignItems: 'stretch',
    justifyContent: 'space-around',
  },
  onLineView: {
    borderRadius: 2,
    height: 18,
    backgroundColor: '#2894FF',
  },
  onLineBtn: {
    color: 'white',
    padding: 2,
  },
  image_thumb: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
  intervalSpace: {
    backgroundColor: '#F0F0F0',
    height: 10,
    flexBasis: 10,
  },

  // Button 统一样式
  button1: {
    marginHorizontal: 20,
    height: 50,
    backgroundColor: '#005AB5',
  },
};
export default function createStyle(oStyle) {
  if (!_.isObject(oStyle)) {
    return StyleSheet.create(Object.assign({}, baseStyle));
  }
  try {
    return StyleSheet.create(Object.assign({}, baseStyle, oStyle));
  } catch (e) {
    return StyleSheet.create(Object.assign({}, baseStyle));
  }
}
