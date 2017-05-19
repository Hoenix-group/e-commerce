import * as securedRestClient from '../utils/securedRestClient';
import Util from './../../utils/utils';

export async function valet(userPhone) {
  try {
    Util.consoleLog(`发送短信到${userPhone}`);
	  const url = 'customer.support.1@sap.com/users';
    await securedRestClient.get(url, userPhone);
  } catch (err) {
    Util.consoleLog(`错误信息${err}`);
  }
}


export const userInfo = async (userInfor) => {

  const ops = {
  body: userInfor,
};
  return securedRestClient.post('/users', ops);
};
