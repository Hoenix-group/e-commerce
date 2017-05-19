import React from 'react';
import dva from 'dva/mobile';
import createLogger from 'redux-logger';
import createLoading from 'dva-loading';
import Router from './router.js';
import * as models from './models';
import * as config from './utils/configuration.js';


const app = config.isDev() ? dva({
  onAction: createLogger(),
}) : dva();
app.use(createLoading());

Object.keys(models).forEach(key => app.model(models[key]));

// const _XHR = GLOBAL.originalXMLHttpRequest ?  
//     GLOBAL.originalXMLHttpRequest :           
//     GLOBAL.XMLHttpRequest                     

// XMLHttpRequest = _XHR;


app.router(() => <Router />);

export default app;
