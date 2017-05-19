import * as securedRestClient from '../utils/securedRestClient';
import * as storage from '../utils/globalStorage';


export const SHOW_LOGISTICS_STATUS = [
  'SHIPPED', 'COMPLETED', 'PAID',
];
export const SHOW_CANCEL_STATUS = [
  'UNPAID',
];
export const SHOW_BUYAGAIN_STATUS = [
  'COMPLETED', 'CANCELLED', 'PAID',
];
export const SHOW_INVOICE_STATUS = [
  'COMPLETED', 'READY', 'SHIPPED', 'PAID',
];

const STATUS_LABEL = [
  {
    status: 'CREATED',
    label: '已创建',
  },
  {
    status: 'COMPLETED',
    label: '已完成',
  },
  {
    status: 'READY',
    label: '备货中',
  },
  {
    status: 'SHIPPED',
    label: '运输中',
  },
  {
    status: 'CANCELLED',
    label: '已取消',
  },
  {
    status: 'UNPAID',
    label: '未支付',
  },
  {
    status: 'PAID',
    label: '已支付',
  },
  {
    status: 'CLOSED',
    label: '已关闭',
  },
  {
    status: 'PROCESSING_ERROR',
    label: '正在处理错误',
  },
];

export function filterStatus(array, status) {
  for (let id = 0; id < array.length; id += 1) {
    const entry = array[id];
    if ((entry === status)) {
      return true;
    }
  }

  return false;
}

export function getStatusLabel(status) {
  const result = STATUS_LABEL.filter(item => item.status === status);
  if (result && result.length > 0) {
    return result[0].label;
  }

  return '未知状态';
}


export async function getOrders(input, pageSize, currentPage) {
  try {
    const employeeId = await storage.getCurrentEmployeeId();

    return await securedRestClient.get(`/users/${employeeId}/query/orders`, {
      params: {
        pageSize: pageSize || 20,
        currentPage: currentPage || 0,
        code: input || '',
        // productName: input || '',
        employee: employeeId,
      },
      isJson: true,
    });
  } catch (err) {
    return {};
  }
}

export async function getOrder(code) {
  try {
    return await securedRestClient.get(`/fsorders/${code}`, {
      params: {
        fields: 'FULL',
      },
    });
  } catch (err) {
    return {};
  }
}

export async function cancelOrder(code) {
  try {
    return await securedRestClient.post('/cancelOrder', {
      body: {
        orderCode: code,
      },
    });
  } catch (err) {
    return {};
  }
}
