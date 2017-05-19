
import { Actions } from 'react-native-router-flux';
import { Toast } from 'antd-mobile';
import * as invoiceService from '../../services/invoiceService';
import Util from '../../utils/utils';

export default{
  namespace: 'receipt',
  state: {
    receiptType: 1, // 1-> 纸质发票,2->电子发票,3->增值税发票
    receiptKind: 1, // 1->个人,2->单位
    receiptHeader: '',
    receiverInfo: '',
    receiverName: '',
    receiverMobile: '',
    receiverMail: '',
    receiptContent: 'DETAIL',
    id: '',
    eInvoices: [],
  },
  effects: {
    * createReceipt({ receipt }, { call }) {
      const data = yield call(invoiceService.createInvoice, receipt);
      if (data) {
        const response = yield call(invoiceService.setInvoiceInCart, data.id);
        if (response) {
          Actions.checkout();
        } else {
          Toast.fail('购物车关联发票失败', 1);
        }
      } else {
        Toast.fail('新增发票失败', 1);
      }
    },
    * getReceiptByCode({ code }, { call, put }) {
      const data = yield call(invoiceService.getInvoiceByCode, code);
      if (data) {
        const invoiceInfo = {
          receiptType: data.invoiceType === 'COMMON' ? 1 : 2,
          receiptKind: data.headerType === 'PERSONAL' ? 1 : 2,
          receiptHeader: data.invoiceHeader,
          receiverMobile: data.phone,
          receiverMail: data.email,
          id: data.id,
          receiverInfo: data.id,
          invoiceType: data.invoiceType,
          receiptContent: data.invoiceContent,
        };

        yield put({ type: 'updateReceiptByCode', invoiceInfo });
      } else {
        Toast.fail('获取发票失败', 1);
      }
    },
    * getAllReceipts({ updateAll }, { call, put }) {
      const { fsInvoiceList } = yield call(invoiceService.getAllInvoices);
      let eInvoices = [];

      if (fsInvoiceList) {
        eInvoices = fsInvoiceList.filter(item => item.invoiceType === 'ELECTRONIC');
      }

      if (eInvoices.length) {
        yield put({ type: 'updateEInvoices', eInvoices });
      } else {
        return;
      }

      if (updateAll) {
        const last = eInvoices[eInvoices.length - 1];
        const invoiceInfo = {
          receiptType: 2,
          receiptKind: last.headerType === 'PERSONAL' ? 1 : 2,
          receiverInfo: last.id,
          receiverMail: last.email,
          receiverMobile: last.phone,
          receiptHeader: last.invoiceHeader,
          receiptContent: last.invoiceContent };
        yield put({ type: 'updateReceiptWithoutId', invoiceInfo });
      }
    },
    * updateReceipt({ receipt }, { call }) {
      const data = yield call(invoiceService.updateInvoice, receipt);
      if (data) {
        Actions.checkout();
      } else {
        Toast.fail('更新发票失败', 1);
      }
    },
    * removeInvoiceInCart(action, { call }) {
      const data = yield call(invoiceService.removeInvoiceInCart);
      if (data) {
        Actions.checkout();
      } else {
        Toast.fail('删除购物车发票失败');
      }
    },
    // 以下两个方法暂时没用到
    * deleteReceipt(action, { call }) {
      const data = yield call(invoiceService.deleteInvoiceByCode);
      Util.consoleLog(data);
    },
    * setDefaultReceipt(action, { call }) {
      const data = yield call(invoiceService.setDefaultInvoice);
      Util.consoleLog(data);
    },
  },
  reducers: {
    initReceipt(state, { receiverName, receiptHeader, id, isOnline }) {
      return { ...state, receiverName, receiptHeader, id, isOnline };
    },
    updateReceiptByCode(state, { invoiceInfo }) {
      return { ...state, ...invoiceInfo };
    },
    updateReceiptWithoutId(state, { invoiceInfo }) {
      return { ...state, ...invoiceInfo };
    },
    updateEInvoices(state, { eInvoices }) {
      return { ...state, eInvoices };
    },
    changeType(state, { receiptType }) {
      return { ...state, receiptType };
    },
    changeKind(state, { receiptKind }) {
      return { ...state, receiptKind };
    },
    changeReceiptHeader(state, { receiptHeader }) {
      return { ...state, receiptHeader };
    },
    changeReceiptContent(state, { receiptContent }) {
      return { ...state, receiptContent };
    },
    changeReceiverMobile(state, { receiverMobile }) {
      return { ...state, receiverMobile };
    },
    changeReceiverMail(state, { receiverMail }) {
      return { ...state, receiverMail };
    },
  },
};
