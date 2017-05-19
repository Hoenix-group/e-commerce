import * as securedRestClient from '../utils/securedRestClient';
import * as storage from '../utils/globalStorage';

const APP_ID = '200100';

function getPayChannel(channel) {
  if (channel === 'WEIXIN') {
    return '134';
  }

  if (channel === 'ALIPAY-O2O') {
    return '115';
  }

  return '';
}

export async function pay(orderCode, channel) {
  try {
    const saleChannel = await storage.getCurrentChannel();
    return await securedRestClient.post('/payment/pay', {
      body: {
        orderNo: orderCode,
        appId: APP_ID,
        goodsName: '五星电器 产品',
        goodsDesc: '五星电器',
        payChannelNo: getPayChannel(channel),
        payChannelTypeNo: channel,
        saleChannelNo: saleChannel,
      },
      isJson: true,
    });
  } catch (err) {
    return {};
  }
}

export async function queryStatus(orderCode, channel, gwTradeNo) {
  try {
    const saleChannel = await storage.getCurrentChannel();
    return await securedRestClient.get(`/payment/pay/status/${orderCode}`, {
      params: {
        payChannelTypeNo: getPayChannel(channel),
        appId: APP_ID,
        gwTradeNo,
        saleChannelNo: saleChannel,
      },
    });
  } catch (err) {
    return {};
  }
}

export async function getPaymentPromotions() {
  const sample = { data: [
      { value: 'ALIPAY-O2O', label: '5.1-5.3限时98折', discount: '0.95' },
      { value: 'WEIXIN', label: '买单立享85折', discount: '0.85' },
  ] };

  return sample;

  // try {
  //   const { data } = await securedRestClient.get('/payment/promotions');
  //   if (data && !data[0]) {
  //     return sample;
  //   }

  //   return { data };
  // } catch (err) {
  //   return sample;
  // }
}

