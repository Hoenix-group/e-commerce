/**
 * Created by haorui on 2017/2/16.
 */
/**
 * 分割线
 */
// 内容分割线表格框、页面边框线
export const lineColor = '#D9D9D9';

/**
 * 背景色
 */
// 主背景色
export const shadeBg = '#ffffff';
export const shadeBg1 = '#F4F4F4';
// 白色：格、框内底色
export const shadeBg2 = '#FBFBFB';
// 灰色：按钮底色、搜索框底色、tab标签底色，
export const shadeBg3 = '#F4F4F4';
// 灰色：小的关闭按钮色
export const shadeBg4 = '#B8B8B8';

/**
 * 蓝色系
 */
// 主色：主logo表头、按钮色、当前选中字体。
export const mainColor = '#0083e0';
export const btnColor = '#1687DD';
// 状态色：上下状态箭头、勾选
export const chooseColor = '#0076ca';
// 链接：超链接、按钮文字
export const linkColor = '#0083e0';
// 失效
export const invalidColor = '#66b5ec';

/**
 * 字体颜色
 */
// 辅助色：标题
export const color33 = '#333333';
// 正文：主要文字
export const color66 = '#666666';
// 辅助文：描述文字、帮助文字
export const color99 = '#999999';
// 失效：失效文字、不可点击
export const colorCC = '#cccccc';

/**
 * 寓意色
 */
// 价格颜色、大小
export const redPrice = '#F23030';
export const fontSizePrice = 16;
export const sellPrice = {
  color: redPrice,
  fontSize: fontSizePrice,
};
/**
 * 字体大小
 */
export const fontSizeMax = 18;
// 标题
export const fontSizeLarge = 16;
// 正文：一般文字
export const fontSizeMiddle = 14;
// 辅助文字：一般文字
export const fontSizeSmall = 12;
// 提示：次要文字
export const fontSizeMin = 10;

/**
 *
 */
// tab：边框圆角
export const tabRadius = 2;

/**
 * 商品详情页下部留给“加入购物车”组件的高度
 */
export const cartBarHeight = 40;

/**
 * 常用统一按钮配色
 */
// 蓝色button
export const commonButton = {
  height: 40,
  backgroundColor: mainColor,
  color: shadeBg2,
};

// 蓝框button
export const secondaryButtonViewMiddle = {
  height: 30,
  backgroundColor: shadeBg,
  alignItems: 'center',
  justifyContent: 'center',
  borderWidth: 1,
  borderColor: mainColor,
  borderRadius: 2,
  padding: 5,
};

export const secondaryButtonTextMiddle = {
  color: mainColor,
  fontSize: fontSizeMiddle,
};

// 灰框button
export const greyButtonViewMiddle = {
  height: 30,
  backgroundColor: shadeBg,
  alignItems: 'center',
  justifyContent: 'center',
  borderWidth: 1,
  borderColor: color99,
  borderRadius: 2,
  padding: 5,
};

export const greyButtonTextMiddle = {
  color: color33,
  fontSize: fontSizeMiddle,
};

/**
 * 间距：margin
 */
// 大间距
export const marginLarge = 10;
// 中间距
export const marginMiddle = 5;
// 小间距
export const marginSmall = 2;

/**
 * 填充：padding
 */
// 大间距
export const paddingLarge = 10;
// 中间距
export const paddingMiddle = 5;
// 小间距
export const paddingSmall = 2;

/**
 * 边框
 */
// 上边框
export const borderTop = {
  borderTopWidth: 1,
  borderTopColor: lineColor,
};
// 下边框
export const borderBottom = {
  borderBottomWidth: 1,
  borderBottomColor: lineColor,
};
// 左边框
export const borderLeft = {
  borderLeftWidth: 1,
  borderLeftColor: lineColor,
};
// 右边框
export const borderRight = {
  borderRightWidth: 1,
  borderRightColor: lineColor,
};

  /**
 * 线上、线下图标样式
 */
export const onlineIconView = {
  width: 35,
  borderRadius: 2,
  height: 18,
  backgroundColor: mainColor,
};
export const onlineIconText = {
  color: shadeBg,
  paddingTop: 2,
  paddingBottom: 2,
  paddingLeft: 4,
  paddingRight: 4,
  fontSize: fontSizeSmall,
};

/**
 * 蓝底图标 width不固定的
 */

export const primaryIconView = {
  borderRadius: 2,
  height: 18,
  backgroundColor: mainColor,
  alignItems: 'center',
  justifyContent: 'center',
  paddingVertical: 1,
  paddingHorizontal: 4,
};

export const primaryIconText = {
  color: shadeBg,
  fontSize: fontSizeSmall,
};

/**
 * 页面底部-双botton样式（蓝色）
 *
 * 参考：
 * 支付结果页面
 * ./routes/payment/PaymentQRView
 */
// 最外层View
export const btnView = {
  height: 100,
  flexDirection: 'column',
  backgroundColor: shadeBg,
  justifyContent: 'center',
};
// TouchableHighlight样式
export const touchStyle = {
  flex: 1,
};
// 两个按钮样式
export const btnInsideView = {
  flex: 1,
  height: cartBarHeight,
  backgroundColor: mainColor,
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'row',
};
export const btnInsideText = {
  flex: 1,
  textAlign: 'center',
  color: shadeBg2,
  justifyContent: 'center',
  alignSelf: 'center',
  fontSize: fontSizeLarge,
};
// 第二个按和第一个按钮之间距离
export const btnInsideView2 = {
  marginTop: 5,
};

/**
 * 选择条
 *
 * 参考：
 * 订单结算页面
 * ./routes/checkout/CheckoutView
 * (选择赠品)
 */
// TouchableHighlight样式
export const rowTouchStyle = {
  flex: 1,
  paddingHorizontal: 15,
  paddingRight: 10,
};
// 最外侧view，内容分两端显示
export const rowView = {
  flex: 1,
  justifyContent: 'space-between',
  flexDirection: 'row',
  paddingVertical: 15,
};
// 左侧内容
export const rowLeftText = {
  color: color33,
  fontSize: fontSizeLarge,
};
// 右侧View
export const rowRightView = {
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'row',
};
// 右侧内容
export const rowRightText = {
  color: color66,
  fontSize: fontSizeLarge,
};
// 右侧尖头
export const rightArrowIcon = {
  width: 12,
  height: 12,
};

/**
 * notice bar
 *
 * 参考：
 * 预约查询－预约界面
 * ./routes/appointment/AddAppointmentCustomerView
 * 输入未注册的手机号时 页面最上方会出现一个notice
 */

export const WarningBarView = {
  borderRadius: 4,
  borderWidth: 1,
  borderColor: '#D4F0FC',
  backgroundColor: '#E6F3FC',
  marginHorizontal: 12,
  marginVertical: 8,
  height: 30,
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
};

export const WarningBarImage = {
  width: 18,
  height: 18,
  marginHorizontal: marginMiddle,
};

export const WarningBarText = {
  color: color66,
  flex: 10,
};

/**
 *
 * 设置父容器
 *
 * 子元素排列方式
 *
 */
// row

// 横向-居中:显示子元素
export const rowJustifyCenter = {
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
};

// 横向-左对其:显示子元素
export const rowJustifyLeft = {
  flexDirection: 'row',
  justifyContent: 'flex-start',
  alignItems: 'flex-start',
};
export const rowJustifyLeftCenter = {
  flexDirection: 'row',
  justifyContent: 'flex-start',
  alignItems: 'center',
};
// 横向-右对其:显示子元素
export const rowJustifyRight = {
  flexDirection: 'row',
  justifyContent: 'flex-end',
  alignItems: 'flex-end',
};
export const rowJustifyRightCenter = {
  flexDirection: 'row',
  justifyContent: 'flex-end',
  alignItems: 'center',
};

// column

// 纵向-居中:显示子元素
export const columnJustifyCenter = {
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
};

// 纵向-左对其:显示子元素
export const columnJustifyLeft = {
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'flex-start',
};
export const columnJustifyLeftCenter = {
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'center',
};
// 纵向-右对其:显示子元素
export const columnJustifyRight = {
  flexDirection: 'column',
  justifyContent: 'flex-end',
  alignItems: 'flex-end',
};
export const columnJustifyRightCenter = {
  flexDirection: 'column',
  justifyContent: 'flex-end',
  alignItems: 'center',
};
