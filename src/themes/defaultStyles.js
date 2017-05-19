/**
 * Created by kaimi on 2017/4/7.
 */
/**
 * 项目
 * 色彩搭配
 */
import { Dimensions } from 'react-native';

export default {
  // Dimensions
  win_width: Dimensions.get('window').width,           // 宽度
  win_height: Dimensions.get('window').height,         // 高度

  // 每个页面左右留白
  space: 10,

  // 所有通用按钮高度
  btn_height: 45,                                      // 确定、取消按钮

  // input
  input_height: 40,

  // 主色：蓝色
  blueColor: '#1687DD',                                // 按钮、线下：蓝色背景

  // 边框
  border_Color: '#D9D9D9',                             // 颜色
  border_Width: 0.5,                                   // 宽度
  border_checkbox: '#979797',                          // 宽度
  border_radius: 2,                                    // 圆角

  // 字体大小
  font_min: 12,                                        // 提示：次要文字
  font_Small: 14,                                      // 辅助文字
  font_Middle: 16,                                     // 商品头部、正文（ 项目默认字号 ）
  font_Large: 18,                                      // 头部大标题
  font_Max: 20,

  // 字体颜色
  font_c33: '#333333',                                 // 标题
  font_c66: '#666666',                                 // 正文：主要文字
  font_c99: '#999999',                                 // 辅助文：描述文字、帮助文字、灰色按钮失效字
  font_cCC: '#cccccc',
  font_cb2: '#B2B2B2',                                 // 输入框默认字色
  font_cb4: '#B4B4B4',                                 // 搜索框默认字色

  // 价格颜色
  font_cPrice: '#F23030',                              // 价格色

  // 背景色
  bg_F4: '#F4F4F4',                                     // 主背景色：每个页面默认背景色
  bg_FF: '#FFFFFF',                                     // 白色：格、框内底色
  bg_F5: '#F4F5F6',                                     // 搜索框底色、tab标签底色，
  bg_F2: '#F2F2F2',                                     // 小tab色、按钮失效
  bg_FB: '#FBFBFB',                                     //

  // 线上、线下
  bg_online: '#FE3824',                                 // 线上：红色背景

  // 布局
  //----
  // row
  flex: 1,
  flex_row: 'row',
  flex_col: 'column',
  flex_center: 'center',
  flex_start: 'flex-start',
  flex_end: 'flex-end',
  flex_between: 'space-between',

  // 距离
  m: 10,

  // 填充
  p: 10,

};

