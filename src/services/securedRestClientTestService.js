import * as securedRestClient from '../utils/securedRestClient';


function testPatchWithJson(uid) {
  return securedRestClient.patch(`/users/${uid}`, {
    body: {
      firstName: 'zl',
      lastName: 'li',
      titleCode: 'mr',
    },
    isJson: true,
  });
}

function testPutWithJson(uid) {
  return securedRestClient.put(`/users/${uid}`, {
    body: {
      firstName: 'zl',
      lastName: 'l',
      titleCode: 'mr',
    },
    isJson: true,
  });
}

function testDelete(uid) {
  return securedRestClient.remove(`/users/${uid}`);
}

function testGet() {
  return securedRestClient.get('/catalogs');
}

function testGetWithParams() {
  return securedRestClient.get('/catalogs', {
    params: {
      fields: 'BASIC',
      fields2: 'BASIC',
    },
  });
}

export async function runTestSuite() {
  await testGet();
  await testGetWithParams();
}
