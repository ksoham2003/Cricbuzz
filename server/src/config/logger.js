import pino from "pino";
import env from "./env.js";

const logger = pino({
    level: env.LOG_LEVEL,
    timestamp: () => `,"time":"${new Date().toISOString()}"`,
    formatters: {
        bindings: () => ({}),
        logRecord: (obj) => {
            const { time, level, msg, ...rest } = obj;
            return {
                time,
                level,
                msg,
                ...rest,
            };
        },
    },
    transport: process.env.NODE_ENV === "development" ? { target: "pino-pretty" } : undefined,
    browser:{
        asObject: true,
    }
    
});

export default logger;