import * as securedRestClient from '../utils/securedRestClient';
import * as storage from '../utils/globalStorage';

export const getChannelLabel = (code) => {
  if (code === '01') {
    return '线上';
  } else if (code === '03') {
    return '线下';
  } else if (code === 'all') {
    return '全渠道';
  }

  return '未知';
};

export const getChannelString = (code) => {
  if (code === '01') {
    return 'ONLINE';
  } else if (code === '03') {
    return 'OFFLINE';
  }

  return 'Unknown';
};

export const classifyChannelLabel = (labels) => {
  if (!labels || !Array.isArray(labels)) {
    return [];
  }

  const newLabels = [];
  if (labels.includes('五星享购APP') || labels.includes('五星享购WEB')) {
    newLabels.push('线上');
  } else if (labels.includes('自有门店')) {
    newLabels.push('线下');
  } else if (labels.includes('全渠道')) {
    newLabels.push('全渠道');
  } else {
    newLabels.push('线下');
  }

  return newLabels;
};

export async function getRegionChildren(parentCode) {
  try {
    const userId = await storage.getCurrentEmployeeId();
    const { data } = await securedRestClient.get(`/users/${userId}/fsadminregion/${parentCode}`);

    if (data.members) {
      data.members = data.members.map(item => ({ value: item.id, label: item.name }));
    }

    return { data };
  } catch (err) {
    return {};
  }
}
