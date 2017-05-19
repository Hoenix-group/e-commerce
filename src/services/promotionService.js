import * as securedRestClient from '../utils/securedRestClient';
import * as storage from '../utils/globalStorage';

export async function getAll(filters, pageSize, currentPage) {
  try {
    const employeeId = await storage.getCurrentEmployeeId();
    const regionId = await storage.getCurrentRegionId();
    return await securedRestClient.get('/promotions', {
      params: {
        employee: employeeId,
        pageSize: pageSize || 20,
        currentPage: currentPage || 0,
        province: filters.province || '',
        city: filters.city || '',
        type: filters.type || '',
        region: regionId,
        pos: filters.pos || '',
        channel: filters.channel || '',
        isCurrentLevel: false,
      },
    });
  } catch (err) {
    return {};
  }
}

export async function get(promotionId, region, channel) {
  try {
    const employeeId = await storage.getCurrentEmployeeId();
    return await securedRestClient.get(`/promotions/${promotionId}`, {
      params: {
        employee: employeeId,
        region: region || '',
        channel: channel || '',
      },
    });
  } catch (err) {
    return {};
  }
}
