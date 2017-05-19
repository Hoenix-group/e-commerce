import * as securedRestClient from '../utils/securedRestClient';
import * as storage from '../utils/globalStorage';
import Util from '../utils/utils';

export async function getInvoiceByCode(invoiceId) {
  try {
    const { customerId, channel } = await storage.getCurrentCart();
    const region = await storage.getCurrentRegionId();
    const url = `/users/${customerId}/invoices/${invoiceId}?channel=${channel}&region=${region}&fields=FULL`;
    const { data } = await securedRestClient.get(url, {});
    return data;
  } catch (error) {
    Util.consoleLog('获取发票信息错误->', error);
    return false;
  }
}

export async function getAllInvoices() {
  try {
    const { customerId, channel } = await storage.getCurrentCart();
    const region = await storage.getCurrentRegionId();
    const url = `/users/${customerId}/invoices?channel=${channel}&region=${region}&fields=FULL`;
    const { data } = await securedRestClient.get(url, {});
    return data;
  } catch (error) {
    Util.consoleLog('获取全部发票信息错误->', error);
    return false;
  }
}

export async function createInvoice(invoiceData) {
  try {
    const { customerId, channel } = await storage.getCurrentCart();
    const region = await storage.getCurrentRegionId();
    const url = `/users/${customerId}/invoices?channel=${channel}&region=${region}`;
    const opt = { body: invoiceData, isJson: true };
    const { data } = await securedRestClient.post(url, opt);
    return data;
  } catch (error) {
    Util.consoleLog('新增发票失败->', error);
    return false;
  }
}

export async function updateInvoice(invoiceData) {
  try {
    const { customerId, channel } = await storage.getCurrentCart();
    const region = await storage.getCurrentRegionId();
    const url = `/users/${customerId}/invoices?channel=${channel}&region=${region}`;
    const opt = { body: invoiceData, isJson: true };
    const { data } = await securedRestClient.put(url, opt);
    return data;
  } catch (error) {
    Util.consoleLog('修改发票错误->', error);
    return false;
  }
}

export async function deleteInvoiceByCode(invoiceId) {
  try {
    const { customerId, channel } = await storage.getCurrentCart();
    const region = await storage.getCurrentRegionId();
    const url = `/users/${customerId}/invoices/${invoiceId}?channel=${channel}&region=${region}`;
    const { data } = await securedRestClient.remove(url, { isJson: true });
    return data;
  } catch (error) {
    Util.consoleLog('删除发票错误->', error);
    return false;
  }
}

export async function setDefaultInvoice(invoiceId) {
  try {
    const { customerId, channel } = await storage.getCurrentCart();
    const region = await storage.getCurrentRegionId();
    const url = `/users/${customerId}/invoices/default/${invoiceId}?channel=${channel}&region=${region}`;
    const { data } = await securedRestClient.patch(url, { isJson: true });
    return data;
  } catch (error) {
    Util.consoleLog('设置默认发票错误->', error);
    return false;
  }
}

export async function setInvoiceInCart(invoiceId) {
  try {
    const { customerId, cartId, channel } = await storage.getCurrentCart();
    const region = await storage.getCurrentRegionId();
    const url = `/users/${customerId}/carts/${cartId}/invoices/${invoiceId}?channel=${channel}&region=${region}`;
    const { data } = await securedRestClient.put(url, { isJson: true });
    return data;
  } catch (error) {
    Util.consoleLog('在购物车中设置发票错误->', error);
    return false;
  }
}

export async function removeInvoiceInCart() {
  try {
    const { customerId, cartId, channel } = await storage.getCurrentCart();
    const region = await storage.getCurrentRegionId();
    const url = `/users/${customerId}/carts/${cartId}/invoices?channel=${channel}&region=${region}`;
    const { data } = await securedRestClient.remove(url, { isJson: true });
    return data;
  } catch (error) {
    Util.consoleLog('在购物车中删除发票错误->', error);
    return false;
  }
}
