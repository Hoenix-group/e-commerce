import { View, ScrollView, Text, TouchableHighlight, Image, TextInput } from 'react-native';
import { Actions } from 'react-native-router-flux';
import React, { Component, PropTypes } from 'react';
import { connect } from 'dva/mobile';
import { Popup, Toast, Flex } from 'antd-mobile';
import * as validator from '../../utils/validator';
import FsRootView from './../../components/common/FsRootView';
import RsTag from './../../components/Tag/Tag';
import newstyles from './newstyles';

class ReceiptView extends Component {
  componentDidMount() {
    const { data, dispatch } = this.props;
    if (data.id) {
      dispatch({ type: 'receipt/getReceiptByCode', code: data.id });
    }
    this.props.dispatch({ type: 'receipt/getAllReceipts', updateAll: false });
  }

  changeType(num) {
    const { data, dispatch } = this.props;
    dispatch({ type: 'receipt/changeType', receiptType: num });

    if (num === 2) {
      const updateAll = !data.id || data.invoiceType !== 'ELECTRONIC';
      dispatch({ type: 'receipt/getAllReceipts', updateAll });
    }
  }

  changeKind(num) {
    this.props.dispatch({ type: 'receipt/changeKind', receiptKind: num });
  }

  changeReceiverMobile(mobile) {
    this.props.dispatch({ type: 'receipt/changeReceiverMobile', receiverMobile: mobile });
  }

  changeReceiverMail(mail) {
    this.props.dispatch({ type: 'receipt/changeReceiverMail', receiverMail: mail });
  }

  changeReceiptHeader(header) {
    this.props.dispatch({ type: 'receipt/changeReceiptHeader', receiptHeader: header });
  }

  handleMobileBlur(mobile) {
    this.props.dispatch({ type: 'receipt/changeReceiverMobile', receiverMobile: validator.formatPhoneNumber(mobile) });
  }

  // 与下方contents发票内容的种类相对应
  contentCodeToCN(code) {
    switch (code) {
      case 'DETAIL':
        return '明细';
      default:
        return '';
    }
  }

  confirm(data) {
    const receipt = {
      username: data.receiverName,
      invoiceType: data.receiptType === 1 ? 'COMMON' : 'ELECTRONIC',
      invoiceContent: data.receiptContent,
      invoiceHeader: data.receiptHeader,
      headerType: data.receiptKind === 1 ? 'PERSONAL' : 'COMPANY',
    };

    if (!validator.validateNotNull(data.receiptHeader, '抬头名称')) {
      return;
    }

    if (data.receiptType === 2) {
      if (!validator.validateNotNull(data.receiverMail, '邮箱')) {
        return;
      }

      if (!validator.validateEmailFormat(data.receiverMail, '邮箱')) {
        return;
      }

      if (!validator.validateNotNull(data.receiverMobile, '手机')) {
        return;
      }

      if (!validator.validatePhoneFormat(data.receiverMobile, '手机')) {
        return;
      }

      receipt.phone = data.receiverMobile;
      receipt.email = data.receiverMail;
    }

    if (!validator.validateNotNull(data.receiptContent, '发票内容')) {
      return;
    }

    if (data.id) {
      receipt.id = data.id;
      this.props.dispatch({ type: 'receipt/updateReceipt', receipt });
    } else {
      this.props.dispatch({ type: 'receipt/createReceipt', receipt });
    }
  }

  cancelReceipt(id) {
    if (id) {
      this.props.dispatch({ type: 'receipt/removeInvoiceInCart' });
    } else {
      Actions.checkout();
    }
  }

  // 选择发票内容
  detail() {
    const contents = [{ id: 1, code: 'DETAIL', value: '明细' }];
    return (
      <View style={[newstyles.closeList, newstyles.promView]}>
        <View style={[newstyles.center, newstyles.row1]}>
          <Text style={newstyles.promTitle}>发票内容</Text>
        </View>
        <View style={newstyles.desView}>
          {
            contents.map(item => <Text key={item.id} style={newstyles.desInfo} onPress={() => { this.confirmContent(item.code); }}>{item.value}</Text>)
          }
        </View>
        <ScrollView />
        {/* 关闭按钮 */}
        <TouchableHighlight style={newstyles.closeIcon} underlayColor={'rgba(0,0,0,0)'} onPress={() => { Popup.hide(); }}>
          <Image style={{ width: 12, height: 12 }} source={require('./../../../images/productDetallsImgs/icons/rn-close-s.png')} />
        </TouchableHighlight>
      </View>
    );
  }

  confirmContent(code) {
    this.props.dispatch({ type: 'receipt/changeReceiptContent', receiptContent: code });
    Popup.hide();
  }

  invoice(array = []) {
    return (
      <View style={[newstyles.closeList, newstyles.promView]}>
        <View style={[newstyles.center, newstyles.row1]}>
          <Text style={newstyles.promTitle}>电子发票</Text>
        </View>
        <View style={newstyles.desView}>
          {
            array.map(item => <Text key={item.id} style={newstyles.desInfo} onPress={() => { this.selectEinvoice(item); }}>{`电子发票-${item.id}`}</Text>)
          }
        </View>
        <ScrollView />
        {/* 关闭按钮 */}
        <TouchableHighlight style={newstyles.closeIcon} underlayColor={'rgba(0,0,0,0)'} onPress={() => { Popup.hide(); }}>
          <Image style={{ width: 12, height: 12 }} source={require('./../../../images/productDetallsImgs/icons/rn-close-s.png')} />
        </TouchableHighlight>
      </View>
    );
  }

  selectEinvoice(eInvoice) {
    if (eInvoice) {
      const invoiceInfo = {
        receiptType: 2,
        receiptHeader: eInvoice.invoiceHeader,
        receiverMobile: eInvoice.phone,
        receiverMail: eInvoice.email,
        receiptKind: eInvoice.headerType === 'COMPANY' ? 2 : 1,
        receiverInfo: eInvoice.id,
        receiptContent: eInvoice.invoiceContent,
      };
      this.props.dispatch({ type: 'receipt/updateReceiptWithoutId', invoiceInfo });
    }
    Popup.hide();
  }

  // 弹出窗内容
  popupShow(chooseNum, eInvoices) {
    // 1->电子发票,2->发票内容
    if (chooseNum === 1) {
      if (eInvoices.length) {
        Popup.show(this.invoice(eInvoices), { maskClosable: true, animationType: 'slide-up', onMaskClose: () => { Popup.hide(); } });
      } else {
        // Toast.info('当前没有可用电子发票');
      }
    } else {
      Popup.show(this.detail(), { maskClosable: true, animationType: 'slide-up', onMaskClose: () => { Popup.hide(); } });
    }
  }

  render() {
    const { data } = this.props;
    return (
      <FsRootView isNavBarHidden={false}>
        <ScrollView style={newstyles.scrollViewbg}>
          <View style={newstyles.viewBg}>
            <Flex>
              <Flex.Item><Text style={newstyles.textView}>发票类型</Text></Flex.Item>
            </Flex>
            <Flex align="start" style={newstyles.marginRange}>
              <View style={[newstyles.viewWidth, newstyles.viewWidthLeft]}>
                <RsTag
                  childrens="纸质发票"
                  // 切换发票类型
                  onChange={() => this.changeType(1)}
                  // 选中状态
                  selected={Boolean(data.receiptType === 1)}
                  isUsenumberOfLinesAndNum={0}
                />
              </View>

              {
                data.isOnline ? (
                  <View style={[newstyles.viewWidth, newstyles.viewWidthLeft]}>
                    <RsTag
                      childrens="电子发票"
                      // 切换发票类型
                      onChange={() => this.changeType(2)}
                      // 选中状态
                      selected={Boolean(data.receiptType === 2)}
                      isUsenumberOfLinesAndNum={0}
                    />
                  </View>
                ) : null
              }

            </Flex>
          </View>

          <View style={[newstyles.viewBg, newstyles.viewTop]}>
            <Flex>
              <Flex.Item><Text style={newstyles.textView}>发票抬头</Text></Flex.Item>
            </Flex>
            <Flex align="start" style={newstyles.marginRange}>
              <View style={[newstyles.viewWidth, newstyles.viewWidthLeft]}>
                <RsTag
                  childrens="个人"
                  // 切换发票抬头
                  onChange={() => this.changeKind(1)}
                  // 选中状态
                  selected={Boolean(data.receiptKind === 1)}
                  isUsenumberOfLinesAndNum={0}
                />
              </View>
              <View style={[newstyles.viewWidth, newstyles.viewWidthLeft]}>
                <RsTag
                  childrens="单位"
                  // 切换发票抬头
                  onChange={() => this.changeKind(2)}
                  // 选中状态
                  selected={Boolean(data.receiptKind === 2)}
                  isUsenumberOfLinesAndNum={0}
                />
              </View>
            </Flex>
          </View>

          <View style={[newstyles.viewBg, newstyles.viewTop]}>
            {
              data.receiptType === 2 ? (
                <Flex>
                  <Flex.Item><Text style={newstyles.textView}>收票人信息</Text></Flex.Item>
                </Flex>
              ) : null
            }

            <View style={[newstyles.h30, newstyles.borderB, newstyles.contentLR, newstyles.row1, newstyles.bgkWrite]}>
              <View style={[newstyles.left1, newstyles.row1, newstyles.paddL]}>
                <Text style={[newstyles.smallInfo]}>抬头名称:</Text>
                <TextInput underlineColorAndroid="transparent" style={[newstyles.smallInfo2, { width: 210 }]} value={data.receiptHeader} onChangeText={value => this.changeReceiptHeader(value)} />
              </View>
            </View>

            {
              data.receiptType === 2 ? (
                <View>
                  <TouchableHighlight underlayColor={'rgba(0,0,0,0)'} onPress={() => { this.popupShow(1, data.eInvoices); }}>
                    <View style={[newstyles.h30, newstyles.borderB, newstyles.contentLR, newstyles.row1, newstyles.bgkWrite]}>
                      <View style={[newstyles.left1, newstyles.row1, newstyles.paddL]}>
                        <Text style={[newstyles.smallInfo]}>发票:</Text>
                        <Text style={[newstyles.smallInfo2, { paddingLeft: 5 }]}>{data.receiverInfo}</Text>
                      </View>
                      <Image style={newstyles.arrowIcon} source={require('./../../../images/productDetallsImgs/icons/rn-chevron-right.png')} />
                    </View>
                  </TouchableHighlight>

                  <View style={[newstyles.h30, newstyles.borderB, newstyles.contentLR, newstyles.row1, newstyles.bgkWrite]}>
                    <View style={[newstyles.left1, newstyles.row1, newstyles.paddL]}>
                      <Text style={[newstyles.smallInfo]}>收票人手机:</Text>
                      <TextInput underlineColorAndroid="transparent" keyboardType="numeric" style={[newstyles.smallInfo2, { width: 210 }]} value={data.receiverMobile} onChangeText={value => this.changeReceiverMobile(value)} onBlur={() => { this.handleMobileBlur(data.receiverMobile); }} />
                    </View>
                  </View>

                  <View style={[newstyles.h30, newstyles.borderB, newstyles.contentLR, newstyles.row1, newstyles.bgkWrite]}>
                    <View style={[newstyles.left1, newstyles.row1, newstyles.paddL]}>
                      <Text style={[newstyles.smallInfo]}>收票人邮箱:</Text>
                      <TextInput underlineColorAndroid="transparent" keyboardType="email-address" style={[newstyles.smallInfo2, { width: 210 }]} value={data.receiverMail} onChangeText={value => this.changeReceiverMail(value)} />
                    </View>
                  </View>
                </View>
              ) : null
            }

            <TouchableHighlight underlayColor={'rgba(0,0,0,0)'} onPress={() => { this.popupShow(2); }}>
              <View style={[newstyles.h30, newstyles.borderB, newstyles.contentLR, newstyles.row1, newstyles.bgkWrite]}>
                <View style={[newstyles.left1, newstyles.row1, newstyles.paddL]}>
                  <Text style={[newstyles.smallInfo]}>发票内容:</Text>
                  <Text style={[newstyles.smallInfo2, { paddingLeft: 5 }]}>{this.contentCodeToCN(data.receiptContent)}</Text>
                </View>
                <Image style={newstyles.arrowIcon} source={require('./../../../images/productDetallsImgs/icons/rn-chevron-right.png')} />
              </View>
            </TouchableHighlight>
          </View>
        </ScrollView>

        <View style={[newstyles.btnBom, newstyles.center, newstyles.row1]}>
          <TouchableHighlight underlayColor={'rgba(0,0,0,0)'} onPress={() => { this.cancelReceipt(data.id); }} style={{ flex: 1 }}>
            <View>
              <Text style={newstyles.btnResetTest}>不开发票</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight underlayColor={'rgba(0,0,0,0)'} onPress={() => { this.confirm(data); }} style={{ flex: 1 }}>
            <View style={[newstyles.btnSureView]}>
              <Text style={newstyles.btnSureTest}>确定</Text>
            </View>
          </TouchableHighlight>
        </View>
      </FsRootView>
    );
  }
}

ReceiptView.propTypes = {
  data: PropTypes.object,
  dispatch: PropTypes.func,
};

export default connect(({ receipt }) => ({
  data: receipt,
}))(ReceiptView);
