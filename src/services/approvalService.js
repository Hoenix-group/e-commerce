// import { Actions } from 'react-native-router-flux';
import moment from 'moment';
import * as securedRestClient from '../utils/securedRestClient';
import * as storage from '../utils/globalStorage';

export function formateDateString(date) {
  if (isNaN(date.getTime())) {
    return '';
  }
  return moment(date).utcOffset(8).format('L');
}

export async function getApprovalList() {
  try {
    const loginData = await storage.getCurrentLogin();
    const { loginId } = loginData;
    // vouchers/approveApplyInfos/P160111
    const url = `/vouchers/approveApplyInfos/${loginId}`;
    const { data } = await securedRestClient.get(url, {});
    return data;
  } catch (err) {
    console.log(`错误信息${err}`);
  }
  return {};
}

export async function updateApproval({ approve, applyId }) {
  try {
    // /vouchers/approveApply/0000003Q?approve=true
    const url = `/vouchers/approveApply/${applyId}?approve=${approve}`;
    //const url = `/vouchers/approveApplyInfos/${loginId}`;
    const { data } = await securedRestClient.put(url, {});
    return data;
  } catch (err) {
    console.log(`错误信息${err}`);
  }
  return {};
}


