// import request, { getJson } from './../utils/request';
// import { SERVER_URL_CONFIG } from './../utils/configuration';

export function initialCategory() {
//   return getJson(`${SERVER_URL_CONFIG.REST_SERVER_URL}/catalogs`);
    return new Promise((resolve)=>resolve({}));
}