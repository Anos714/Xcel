import pino from 'pino';

const isProduction = process.env.NODE_ENV === "production";

export const logger=pino({
    level:isProduction?"info":"debug",

    serializers: {
        err: pino.stdSerializers.err,    
        error: pino.stdSerializers.err,   
    },

    
    base: isProduction ? { app: "Xcel-backend" } : undefined,

    transport:
    isProduction?undefined:{
        target:"pino-pretty",
        options:{
            colorize:true,
            translateTime:"SYS:standard",
            ignore:"pid,hostname"
        }
    }
})