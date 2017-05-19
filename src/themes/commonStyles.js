import { Dimensions, Platform, StyleSheet } from 'react-native';
import * as _ from 'lodash';
import variables from './defaultStyles';

export const commonStyles = {
  /**
   * 字体大小
   */
  fontSizeMax: {
    fontSize: variables.font_Max,
  },
  // 头部大标题
  fontSizeLarge: {
    fontSize: variables.font_Large,
  },
  // 商品头部、正文
  fontSizeMiddle: {
    fontSize: variables.font_Middle,
  },
  // 辅助文字
  fontSizeSmall: {
    fontSize: variables.font_Small,
  },
  // 提示：次要文字
  fontSizeMin: {
    fontSize: variables.font_min,
  },

  /**
   * 字体颜色
   */
  // 辅助色：标题
  color33: {
    color: variables.font_c33,
  },
  // 正文：主要文字
  color66: {
    color: variables.font_c66,
  },
  // 辅助文：描述文字、帮助文字、灰色按钮失效字
  color99: {
    color: variables.font_c99,
  },
  colorCC: {
    color: variables.font_cCC,
  },
  // 输入框默认字色
  inputDefult: {
    color: variables.font_cb2,
  },
  // 搜索框默认字色
  searchDefult: {
    color: variables.font_cb4,
  },
  // 价格
  priceColor: {
    color: variables.font_cPrice,
  },

  /**
   * 背景色
   */
  // 主背景色：每个页面默认背景色
  shadeBg: {
    backgroundColor: variables.bg_F4,
  },
  // 格、框内底色
  shadeBgWrite: {
    backgroundColor: variables.bg_FF,
  },
  // 搜索框底色、tab标签底色，
  shadeBgTag: {
    backgroundColor: variables.bg_F5,
  },
  // 小tab色、按钮失效
  shadeBgGray: {
    backgroundColor: variables.bg_F2,
  },

  /**
   * 蓝色系
   */
  // 主色：按钮色、tag蓝、蓝色字
  mainColor: {
    color: variables.blueColor,
  },
  mainBlueBkg: {
    backgroundColor: variables.blueColor,
  },

  /**
   * margin
   */
  m: {
    margin: variables.m - 5,
  },
  m10: {
    margin: variables.m,
  },
  m15: {
    margin: variables.m + 5,
  },
  m20: {
    margin: variables.m * 2,
  },
  m25: {
    margin: variables.m + 25,
  },
  m30: {
    margin: variables.m * 3,
  },
  // 上下
  mv5: {
    marginVertical: 5,
  },
  mv10: {
    marginVertical: variables.m,
  },
  mv15: {
    marginVertical: 15,
  },
  mv20: {
    marginVertical: 20,
  },
  mv25: {
    marginVertical: 25,
  },
  mv30: {
    marginVertical: 30,
  },
  // 左右
  mh5: {
    marginHorizontal: 5,
  },
  mh10: {
    marginHorizontal: variables.m,
  },
  mh15: {
    marginHorizontal: 15,
  },
  mh20: {
    marginHorizontal: 20,
  },
  mh25: {
    marginHorizontal: 25,
  },
  mh30: {
    marginHorizontal: 30,
  },

  /**
   * padding
   */
  p5: {
    padding: 5,
  },
  p10: {
    padding: variables.p,
  },
  p15: {
    padding: 15,
  },
  p20: {
    padding: 20,
  },
  p25: {
    padding: 25,
  },
  p30: {
    padding: 30,
  },
  // 上下
  pv5: {
    paddingVertical: 5,
  },
  pv10: {
    paddingVertical: variables.p,
  },
  pv15: {
    paddingVertical: 15,
  },
  pv20: {
    paddingVertical: 20,
  },
  pv25: {
    paddingVertical: 25,
  },
  pv30: {
    paddingVertical: 30,
  },
  // 左右
  ph5: {
    paddingHorizontal: 5,
  },
  ph10: {
    paddingHorizontal: variables.p,
  },
  ph15: {
    paddingHorizontal: 15,
  },
  ph20: {
    paddingHorizontal: 20,
  },
  ph25: {
    paddingHorizontal: 25,
  },
  ph30: {
    paddingHorizontal: 30,
  },

  /**
   * 布局
   */
  flex: {
    flex: variables.flex,
  },
  flexRow: {
    flexDirection: variables.flex_row,
  },
  col: {
    flexDirection: variables.flex_col,
  },

  /**
   * justify
   * 垂直方向
   */
  // 垂直居中：文本或者图片水平
  justifyCenter: {
    justifyContent: variables.flex_center,
  },
  justifyLeft: {
    justifyContent: variables.flex_start,
  },
  justifyLeftRight: {
    justifyContent: variables.flex_between, //左右
  },
  justifyEnd: {
    justifyContent: variables.flex_end,
  },

  /**
   * alignItems
   * 侧轴方向
   */
  // 水平居中
  alignCenter: {
    alignItems: variables.flex_center,
  },
  alignLef: {
    alignItems: variables.flex_start,
  },
  alignEnd: {
    alignItems: variables.flex_end,
  },

  /**
   * 设置父容器
   * 子元素排列方式
   */
  // 1、row

  // 横向-居中:显示子元素
  rowJustifyCenter: {
    flexDirection: variables.flex_row,
    justifyContent: variables.flex_center,
    alignItems: variables.flex_center,
  },
  // 横向-左对其:显示子元素（左对齐 子元素水平垂直居中）
  rowJustifyLeftCenter: {
    flexDirection: variables.flex_row,
    justifyContent: variables.flex_start,
    alignItems: variables.flex_center,
  },
  // 横向-左对其:显示子元素（左对齐 子元素左上对齐）
  rowJustifyLeft: {
    flexDirection: variables.flex_row,
    justifyContent: variables.flex_start,
    alignItems: variables.flex_start,
  },
  // 横向-右对其:显示子元素（右对其 子元素水平垂直居中）
  rowJustifyRightCenter: {
    flexDirection: variables.flex_row,
    justifyContent: variables.flex_end,
    alignItems: variables.flex_center,
  },
  // 横向-右对其:显示子元素（右对其 子元素右上对齐）
  rowJustifyRight: {
    flexDirection: variables.flex_row,
    justifyContent: variables.flex_end,
    alignItems: variables.flex_end,
  },

  // 2、column

  // 纵向-居中:显示子元素
  columnJustifyCenter: {
    flexDirection: variables.flex_col,
    justifyContent: variables.flex_center,
    alignItems: variables.flex_center,
  },
  // 纵向-左对其:显示子元素
  columnJustifyLeftCenter: {
    flexDirection: variables.flex_col,
    justifyContent: variables.flex_start,
    alignItems: variables.flex_center,
  },
  columnJustifyLeft: {
    flexDirection: variables.flex_col,
    justifyContent: variables.flex_start,
    alignItems: variables.flex_start,
  },
  // 纵向-右对其:显示子元素
  columnJustifyRightCenter: {
    flexDirection: variables.flex_col,
    justifyContent: variables.flex_end,
    alignItems: variables.flex_center,
  },
  columnJustifyRight: {
    flexDirection: variables.flex_col,
    justifyContent: variables.flex_end,
    alignItems: variables.flex_end,
  },

  /**
   * flexWrap
   * 定义子元素在父视图内是否允许多行排列
   */
  flexWrapYes: {
    flexWrap: 'wrap',
  },
  flexWrapNo: {
    flexWrap: 'nowrap',
  },

  /**
   * 分割线
   */
  dividingLine: {
    color: variables.border_Color,
    width: variables.border_Width,
  },

  /**
   * border
   */
  borderAll: {
    borderWidth: variables.border_Width,
    borderColor: variables.border_Color,
  },
  borderT: {
    borderTopWidth: variables.border_Width,
    borderTopColor: variables.border_Color,
  },
  borderB: {
    borderBottomWidth: variables.border_Width,
    borderBottomColor: variables.border_Color,
  },

  /**
   * checkbox
   * 边框线
   */
  checkBox:{
    width: 18,
    height: 18
  },
  checkBoxLine: {
    borderColor: variables.border_checkbox,
  },

  /**
   * 箭头
   */
  arrowIcon: {
    width: 14,
    height: 14,
  },
  closeIcon: {
    width: 16,
    height: 16,
  },

  /**
   * tab：边框圆角
   */
  tabRadius: {
    borderRadius: variables.border_radius,
  },

  /**
   * btn：统一高度
   */
  btnHeight: {
    height: variables.btn_height,
  },

  /**
   *
   * 常用btn样式
   *
   */
  // 1、蓝色-button
  // （1）蓝色：正常
  baseBtnView: {
    width: variables.win_width - 20,
    height: variables.btn_height,
    backgroundColor: variables.blueColor,
    borderRadius: variables.border_radius,
    alignItems: variables.flex_center,
    justifyContent: variables.flex_center,
    alignSelf: variables.flex_center,
  },
  baseBtnText: {
    color: variables.bg_FF,
    fontSize: variables.font_Middle,
  },
  btn: {
    height: variables.btn_height,
    backgroundColor: variables.blueColor,
    borderRadius: variables.border_radius,
  },
  // （2）灰色：失效
  disBtnView: {
    width: variables.win_width - 20,
    height: variables.btn_height,
    marginLeft: 10,
    backgroundColor: variables.bg_F2,
    borderRadius: variables.border_radius,
    alignItems: variables.flex_center,
    justifyContent: variables.flex_center,
    alignSelf: variables.flex_center,
  },
  disBtnText: {
    color: '#999999',
    fontSize: variables.font_Middle,
  },
  disBtn:{
    height: variables.btn_height,
    backgroundColor: variables.bg_F2,
    borderRadius: variables.border_radius,
    borderWidth: 0
  },
  // 参考
  // <Button type="primary" onClick={() => { }} disabled={this.props.disabled} style={[styles.btn, styles.disBtn]} >
  //   <Text style={styles.color99}>{this.props.showtext}</Text>
  // </Button>

  // ----
  // 2、蓝框-button
  // （1）蓝框：正常
  blueLineBtnView: {
    minWidth: 90,
    minHeight: 28,
    borderWidth: variables.border_Width,
    borderColor: variables.border_Color,
    borderRadius: variables.border_radius,
    alignItems: variables.flex_center,
    justifyContent: variables.flex_center,
    alignSelf: variables.flex_center,
  },
  blueLineBtnText: {
    color: variables.bg_FF,
    fontSize: variables.font_Small,
  },

  /**
   * 线上、线下图标样式
   */
  onlineColor: {
    color: variables.bg_online,
  },
  lineColor: {
    color: variables.blueColor,
  },
  // 线上：红色
  onlineIconView: {
    minWidth: 32,
    minHeight: 16,
    backgroundColor: variables.bg_online,
    borderRadius: variables.border_radius,
    alignItems: variables.flex_center,
    justifyContent: variables.flex_center,
    alignSelf: variables.flex_center,
  },
  onlineIconText: {
    color: variables.bg_FF,
    fontSize: variables.font_min,
  },
  // 线下：蓝色
  lineIconView: {
    minWidth: 32,
    minHeight: 16,
    backgroundColor: variables.blueColor,
    borderRadius: variables.border_radius,
    alignItems: variables.flex_center,
    justifyContent: variables.flex_center,
    alignSelf: variables.flex_center,
  },
  lineIconText: {
    color: variables.bg_FF,
    fontSize: variables.font_min,
  },

  /**
   * 蓝底图标 width不固定的
   */
  primaryIconView: {
    borderRadius: variables.border_radius,
    height: 18,
    backgroundColor: variables.blueColor,
    alignItems: variables.flex_center,
    justifyContent: variables.flex_center,
    paddingVertical: 1,
    paddingHorizontal: 4,
    alignSelf: variables.flex_center,
  },
  primaryIconText: {
    color: variables.bg_FF,
    fontSize: this.fontSizeMin,
  },

  /**
   * 页面底部-双botton样式（蓝色）
   *
   * 参考：
   * 支付结果页面
   * ./routes/payment/PaymentQRView
   */
  // 最外层View
  btnView: {
    height: 100,
    flexDirection: variables.flex_col,
    backgroundColor: variables.bg_FF,
    justifyContent: variables.flex_center,
  },
  // TouchableHighlight样式
  touchStyle: {
    flex: 1,
  },
  // 两个按钮样式
  btnInsideView: {
    flex: 1,
    height: 45,
    backgroundColor: variables.blueColor,
    justifyContent: variables.flex_center,
    alignItems: variables.flex_center,
    flexDirection: variables.flex_row,
  },
  btnInsideText: {
    flex: 1,
    textAlign: variables.flex_center,
    color: '#FBFBFB',
    justifyContent: variables.flex_center,
    alignSelf: variables.flex_center,
    fontSize: variables.font_Middle,
  },
  // 第二个按和第一个按钮之间距离
  btnInsideView2: {
    marginTop: 5,
  },

  /**
   * 选择条
   *
   * 参考：
   * 订单结算页面
   * ./routes/checkout/CheckoutView
   * (选择赠品)
   */
  // TouchableHighlight样式
  rowTouchStyle: {
    flex: 1,
    paddingHorizontal: variables.m + 5,
    paddingRight: variables.p,
  },
  // 最外侧view，内容分两端显示
  rowView: {
    flex: 1,
    justifyContent: variables.flex_between,
    flexDirection: variables.flex_row,
    paddingVertical: 15,
  },
  // 左侧内容
  rowLeftText: {
    color: variables.font_c33,
    fontSize: variables.font_Middle,
  },
  // 右侧View
  rowRightView: {
    justifyContent: variables.flex_center,
    alignItems: variables.flex_center,
    flexDirection: variables.flex_row,
  },
  // 右侧内容
  rowRightText: {
    color: variables.font_c66,
    fontSize: variables.font_Middle,
  },
  // 右侧尖头
  rightArrowIcon: {
    width: 12,
    height: 12,
  },

  /**
   * notice bar
   *
   * 参考：
   * 预约查询－预约界面
   * ./routes/appointment/AddAppointmentCustomerView
   * 输入未注册的手机号时 页面最上方会出现一个notice
   */
  WarningBarView: {
    borderRadius: variables.border_radius * 2,
    borderWidth: variables.border_Width,
    borderColor: '#D4F0FC',
    backgroundColor: '#E6F3FC',
    marginHorizontal: 12,
    marginVertical: 8,
    height: 30,
    flexDirection: variables.flex_row,
    justifyContent: variables.flex_center,
    alignItems: variables.flex_center,
  },
  WarningBarImage: {
    width: 18,
    height: 18,
    marginHorizontal: 5,
  },
  WarningBarText: {
    color: variables.font_c66,
    flex: 10,
  },

};

export default function cStyles(oStyle) {
  if (!_.isObject(oStyle)) {
    return StyleSheet.create(Object.assign({}, commonStyles));
  }
  try {
    return StyleSheet.create(Object.assign({}, commonStyles, oStyle));
  } catch (e) {
    return StyleSheet.create(Object.assign({}, commonStyles));
  }
}
