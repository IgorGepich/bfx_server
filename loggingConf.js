const log4js = require("log4js");
log4js.configure({
    appenders: {
        out: { type: 'console' },
        debug: { type: 'dateFile', filename: 'logs/debug',"pattern":"-dd-MM.log", alwaysIncludePattern:true},
        error: { type: 'dateFile', filename: 'logs/error', "pattern":"-dd-MM.log",alwaysIncludePattern:true},
        info: { type: 'dateFile', filename: 'logs/info', "pattern":"-dd-MM.log",alwaysIncludePattern:true},
        default: { type: 'dateFile', filename: 'logs/default', "pattern":"-dd-MM.log",alwaysIncludePattern:true}
    },
    categories: {
        info: { appenders: ['info'], level: 'info' },
        debug: { appenders: ['debug'], level: 'debug' },
        error: { appenders: ['error'], level: 'error' },
        default: { appenders: ['default'], level: 'info' }
    }}
);

exports.infoLogger = log4js.getLogger("info")
exports.errorLogger = log4js.getLogger("error")
exports.debugLogger = log4js.getLogger("debug")
exports.defaultLogger =log4js.getLogger("default")