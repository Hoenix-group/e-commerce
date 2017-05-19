import Util from './utils';

const oDebug = console.debug;
const oInfo = console.info;
const oLog = Util.consoleLog;
const oWarn = console.warn;
const oError = console.error;
const oTrace = console.trace;

console.debug = (...val) => { oDebug(`[${Date.now()}]`, val); };
console.info = (...val) => { oInfo(`[${Date.now()}]`, val); };
Util.consoleLog = (...val) => { oLog(`[${Date.now()}]`, val); };
console.warn = (...val) => { oWarn(`[${Date.now()}]`, val); };
console.error = (...val) => { oError(`[${Date.now()}]`, val); };
console.trace = (...val) => { oTrace(`[${Date.now()}]`, val); };
