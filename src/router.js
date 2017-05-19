import React from 'react';
import { Image, View } from 'react-native';
import { Carousel, Toast } from 'antd-mobile';
import { Router, Scene, Actions } from 'react-native-router-flux';
import { shadeBg, color33, fontSizeMax, shadeBg3 } from './themes/fsBaseStyles';
import FsPopover from './components/common/FsPopover';
import { HomeView, HomeManageView, LoginView, SearchView, ProductListView, MyCartView,
  CheckoutView, ProductDetailsView, PaymentQRView, CashDeskView, PaymentSummaryView, GroupView, CustomerCheckListView,
  CustomerDetailView, CustomerListView, ValetView, ValetRegisterView, ForgetView, PerformanceView, AppointmentListView,
  AppointmentDetailView, MyAppointmentListView, ApointInfoView, PromotionListView, PromotionDetailsView, AddressListView,
  AddressEditorView, OrderListView, OrderDetailsView, WishlistView, ReceiptView, ProfileView, CombinationPackageView,
  PasswordView, AddAppointmentCustomerView, SignAppointmentListView, AddAppointmentCustomerResultView,
  ConsumptionPointDetail, RegionListView, PrestoreListView, PrestoreDetailView, AddCustomerToPrestoreView, ListPrestoreCustomersView,
  NotificationListView, SystemNotificationDetailView, CompanyNotificationDetailView, DistributionView, ListAppointedCustomersView,
  SignAppointmentView, VoucherListView, VoucherTransferView, DateListView, AddCustomerToPrestoreResultView, MyPrestoreListView, MyPrestoreDetailView,
  ApplyNewVoucherView, ApprovalListView, ApprovalDetailView,operatorCommodityView } from './routes';

if (!Carousel.prototype.componentWillUnmount) {
  Carousel.prototype.componentWillUnmount = Carousel.prototype.componentWillUnMount;
}

let timeOutId = 0;
let backPressTimes = 0;
const onExitApp = () => {
  clearTimeout(timeOutId);

  if (backPressTimes > 0) {
    backPressTimes = 0;
    return false;
  }

  Toast.info('再点一次退出程序', 1, null, false);
  backPressTimes += 1;
  timeOutId = setTimeout(() => {
    backPressTimes = 0;
  }, 1000);
  return true;
};

const renderLeftButton = () => {
  return (<Image style={{ marginLeft: 0 }} source={require('./../images/back_icon.png')} />);
};

const prestoreOperations = [
  { action: 'prestorecustomerlist', menuname: '顾客清单' },
];

const AppRouter = () => (
  <Router onExitApp={onExitApp}>
    <Scene key="root" renderLeftButton={renderLeftButton()} navigationBarStyle={{ backgroundColor: shadeBg, borderBottomColor: shadeBg3 }} titleStyle={{ color: color33, fontSize: fontSizeMax }}>
      <Scene key="userLogin" component={LoginView} hideNavBar type="reset" initial />
      <Scene key="home" hideNavBar component={HomeView} type="reset" />
      <Scene key="globalSearch" component={SearchView} />
      <Scene key="homeManage" hideNavBar component={HomeManageView} title="首页管理" />
      <Scene key="mycart" component={MyCartView} hideNavBar onLeft={() => { }} leftTitle=" " title="顾客购物车" />
      <Scene key="checkout" hideNavBar={false} component={CheckoutView} title="订单结算" onBack={() => Actions.mycart({ refresh: true })} />
      <Scene key="productList" hideNavBar component={ProductListView} title="商品列表" />
      <Scene key="cashDesk" hideNavBar={false} component={CashDeskView} title="收银台" type="reset" />
      {/* 组合销售查询 */}
      <Scene key="CombinationPackage" hideNavBar={Boolean(true)} component={CombinationPackageView} title="组合套餐" />
      <Scene key="paymentQR" hideNavBar={false} component={PaymentQRView} title="二维码" />
      <Scene key="paymentSummary" hideNavBar={false} component={PaymentSummaryView} title="支付结果" type="reset" />

      {/* 我的顾客页面*/}
      <Scene key="customergroup" hideNavBar={false} component={GroupView} title="分组管理" />
      <Scene
        key="customerListView" hideNavBar={false} component={CustomerListView}
        title="我的顾客" rightTitle="管理" onRight={() => { Actions.customergroup(); }}
      />
      <Scene key="customerDetail" hideNavBar={false} component={CustomerDetailView} title="顾客详情" />
      <Scene
        key="customerCheckListView" hideNavBar={false} component={CustomerCheckListView}
        title="我的顾客" backTitle="取消"
      />

      {/* 会员积分页面*/}
      <Scene key="consumptionPointDetail" title="会员积分" hideNavBar={false} component={ConsumptionPointDetail} />

      <Scene key="productDetailsView" hideNavBar component={ProductDetailsView} title="商品详情" />
      <Scene key="valet" component={ValetView} hideNavBar={false} onLeft={() => { }} leftTitle=" " title="联系方式" />
      <Scene key="valetregister" component={ValetRegisterView} hideNavBar={false} title="代客注册" />
      <Scene key="forgetPassword" component={ForgetView} hideNavBar={false} onLeft={() => { }} leftTitle=" " title="忘记密码" />
      <Scene key="performances" component={PerformanceView} hideNavBar={false} onLeft={() => { }} leftTitle=" " title="我的绩效" />
      {/* 预约列表页面*/}
      <Scene key="appointmentlist" component={AppointmentListView} hideNavBar={false} onLeft={() => {}} leftTitle=" " title="预约查询" />
      <Scene key="appointmentDetail" component={AppointmentDetailView} hideNavBar title="活动详情" />
      <Scene key="apoint" component={MyAppointmentListView} hideNavBar={false} onLeft={() => {}} leftTitle=" " title="我的预约" />
      <Scene key="apointInfo" component={ApointInfoView} hideNavBar={false} onLeft={() => {}} leftTitle=" " title="预约详情" />
      <Scene key="promotionList" component={PromotionListView} hideNavBar={false} title="促销查询" />
      <Scene key="promotionDetails" component={PromotionDetailsView} hideNavBar={false} title="促销详情" />
      <Scene key="addressList" hideNavBar={false} component={AddressListView} title="收货地址" onBack={() => Actions.checkout()} />
      <Scene key="newAddress" hideNavBar={false} component={AddressEditorView} title="新增收货地址" onBack={() => Actions.addressList()} />
      <Scene key="editAddress" hideNavBar={false} component={AddressEditorView} title="编辑收货地址" onBack={() => Actions.addressList()} />
      <Scene key="wishlist" hideNavBar={false} component={WishlistView} title="收藏夹" />
      <Scene key="orderList" hideNavBar component={OrderListView} title="我的订单" />
      <Scene key="orderDetails" hideNavBar={false} component={OrderDetailsView} title="订单详情" />
      <Scene key="distribution" component={DistributionView} title="配送安装时间" />
      <Scene key="receipt" hideNavBar={false} component={ReceiptView} title="发票信息" />
      <Scene key="addAppointmentCustomer" hideNavBar={false} component={AddAppointmentCustomerView} title="预约信息" />
      {/* 预约成功页面*/}
      <Scene key="addAppointmentCustomerResult" renderBackButton={() => (<View />)} hideNavBar={false} component={AddAppointmentCustomerResultView} title="预约成功" onBack={() => { Actions.popTo('appointmentlist'); }} />
      {/* 预约顾客清单*/}
      <Scene key="listAppointedCustomers" renderBackButton={() => (<View />)} hideNavBar={false} component={ListAppointedCustomersView} title="预约顾客清单" />
      <Scene key="signAppointment" hideNavBar={false} component={SignAppointmentView} title="签到信息" />
      <Scene key="signAppointmentList" hideNavBar={false} component={SignAppointmentListView} title="我的签到" />
      <Scene key="profile" hideNavBar={false} component={ProfileView} title="个人信息" />
      <Scene key="password" hideNavBar={false} component={PasswordView} title="修改密码" />
      <Scene key="regionList" hideNavBar component={RegionListView} title="选择区域" />
      {/* 预存列表页面*/}
      <Scene key="prestoreList" hideNavBar={false} component={PrestoreListView} title="预存查询" />
      {/* 预存详情页面*/}
      {/* <Scene key="prestoreDetail" hideNavBar={false} component={PrestoreDetailView} title="活动详情" renderRightButton={() => (<FsPopover baseitems={prestoreOperations} />)} />*/}
      <Scene key="prestoreDetail" hideNavBar component={PrestoreDetailView} title="活动详情" />
      {/* 客户预存页面*/}
      <Scene key="addPrestoreCustomer" hideNavBar={false} component={AddCustomerToPrestoreView} title="预存信息" />
      {/* 预存顾客清单页面*/}
      <Scene key="prestorecustomerlist" renderBackButton={() => (<View />)} hideNavBar={false} component={ListPrestoreCustomersView} title="预存顾客清单" />
      {/* 预存成功页面*/}
      <Scene key="addCustomerToPrestoreResultView" renderBackButton={() => (<View />)} hideNavBar={false} component={AddCustomerToPrestoreResultView} title="预存成功" onBack={() => { Actions.popTo('prestoreList'); }} />
      {/* 我的预存列表页*/}
      <Scene key="myPrestoreListView" hideNavBar={false} component={MyPrestoreListView} title="我的预存" />
      {/* 我的预存详细页*/}
      <Scene key="myPrestoreDetailView" hideNavBar={false} component={MyPrestoreDetailView} title="预存详情" />
      <Scene key="notificationList" hideNavBar={false} component={NotificationListView} title />
      <Scene key="systemNotificationDetail" hideNavBar={false} component={SystemNotificationDetailView} title="消息详情" />
      <Scene key="companyNotificationDetail" hideNavBar={false} component={CompanyNotificationDetailView} title="消息详情" />
      <Scene key="voucher" hideNavBar={false} component={VoucherListView} title="我的卡券" />
      <Scene key="voucherTransfer" hideNavBar={false} component={VoucherTransferView} title="我的卡券" />
      <Scene key="applyNewVoucher" hideNavBar={false} component={ApplyNewVoucherView} title="我的卡券" />
      <Scene key="dateList" hideNavBar={false} component={DateListView} title="时间选择" />
      <Scene key="approval" hideNavBar={false} component={ApprovalListView} title="我的审批" />
      <Scene key="approvalDetail" hideNavBar={false} component={ApprovalDetailView} title="审批详情" />
      <Scene key="operatorCommodity" hideNavBar component={operatorCommodityView} title="运营商商品" />
    </Scene>
  </Router>
);

export default AppRouter;
