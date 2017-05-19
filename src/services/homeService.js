import {getJson, getContent} from '../utils/commonService';
import Util from './../../utils/utils';

export const fetchRandom = async (id)=>{
  Util.consoleLog(`service got info from effect view ${id}`);
  try{
    var json =  await getJson({url: '/api'});
    if(json.status === 'success'){
      Util.consoleLog("ping server success");
      return getContent(json); 
    }
  }catch(err){
 // incase no http server running,  just for example  
    return await new Promise((res) => setTimeout(res, 1000))
      .then(() => ({number:Math.floor(Math.random() * 100)}));
  }
};