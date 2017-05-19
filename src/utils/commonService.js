import {getAuthenticationToken} from '../utils/authentication';
import * as _ from 'lodash';
import * as config from './configuration';
const TIMEOUT = config.getConfiguration(config.APP_TIMEOUT);
const rootContext = `http://${config.getConfiguration(config.APP_DOMAIN)}${config.getConfiguration(config.APP_CONTEXT_ROOT)}`;


/*
 *  generate absolute URL for backend service
 */ 
const correntURL = (ops)=>{

	if(rootContext){
			if(ops.url.charAt(0)==='.'){
				ops.url = ops.url.slice(1);
			}else if(ops.url.charAt(0)!=='/'){
				ops.url = '/' + ops.url;
			}
			ops.url = rootContext + ops.url;
	   }
	if(ops.param){
			var sParam = Object.keys(ops.param).reduce((pre,current)=>{
				 if( _.isString( ops.param[current]) ||_.isNumber( ops.param[current])){
					 return  pre + (pre.length > 0?"&":'') + current + '=' + encodeURIComponent(ops.param[current]);
					}else if(_.isArray(ops.param[current])){
						return pre + (pre.length > 0?"&":'') + current + '=' +	encodeURIComponent(ops.param[current].join(','));
					} else if(_.isUndefined(ops.param[current]) || _.isNull(ops.param[current])){
						return pre ;
					} else if(_.isDate(ops.param[current])){
						return pre + (pre.length > 0?"&":'') + current + '=' +	ops.param[current].getTime();
					}else{
						throw new Error(`param type ${getType(ops.param[current]) } for query is not supported`);
					}
			}, '');
			if(sParam&&sParam.length > 0){
				ops.url = ops.url + "?" + sParam;
			}
		}
};

/**
 * Rejects a promise after `ms` number of milliseconds, if it is still pending
 */
const timeout = (promise, ms) =>{
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('timeout')), ms);
    promise.then(response => {
        clearTimeout(timer);
        resolve(response);
      })
      .catch(reject);
  });
};


const correntOption = async (option, method)=>{
	let token = await getAuthenticationToken();
	return {
			//credentials: 'same-origin',
			...option,
			headers:{
				...option.headers,
				AuthorizationToken:token
			},
			method:method
		};
};

const __fetch =  (_method) => async (option) => {
		
		let ops = await correntOption(option, _method);
		correntURL(ops);
		//let response = await fetch(ops.url,ops);
		let resposne = '';
		if (response.status >= 400) {
			var error = new Error(`response status : ${response.status}, Error is ${response.statusText}`);
			error.response = response;
			throw error;
		}
		if(response.headers.get('__authentication__') === 'failed'){
			//TODO handle auth failed
		}
		return response;

	};
/*
 *	 handle http GET request
 */
export const get = __fetch('GET');
/*
 *	 handle http POST request
 */
export const post = __fetch('POST');
/*
*	handle http GET request in JSON format
*/
export const getJson = async (option)=>{  

	if(option.headers){
		option.headers['Accept'] = 'application/json';
	}else{
		option.headers = {
			'Accept' : 'application/json',
		};
	}
	let response = await get(option);
	return response.json();
};

export const batchGet = (aOps)=>Promise.all(aOps.map(get));
export const batchGetJson = (aOps)=>Promise.all(aOps.map(getJson));

/*
*	handle http GET request in JSON format
*/
export const postJson = async (option, data)=>{
		if(option.headers){
			option.headers['Accept'] = 'application/json';
			option.headers['Content-Type'] = 'application/json';
		}else{
			option.headers = {
				'Content-Type':'application/json',
				'Accept' : 'application/json',
			};
		}
		option.body = typeof data ==='string'?data:JSON.stringify(data);
		let response = await post(option);
		return response.json();
};

export const batchPostJson = (aOps)=> Promise.all(aOps.map((ops)=> postJson(ops.option, ops.data)));

export const getContent = json=>json.map.__content__;


