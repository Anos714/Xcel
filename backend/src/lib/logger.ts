import pino, { transport } from 'pino';
import {env} from '../config/env.js';

export const logger=pino({
    level:env.NODE_ENV==="production"?"info":"debug",

    transport:
    env.NODE_ENV==="production"?undefined:{
        target:"pino-pretty",
        options:{
            colorize:true,
            translateTime:"SYS:standard",
            ignore:"pid,hostname"
        }
    }
})