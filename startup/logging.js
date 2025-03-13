import winston from "winston";
import 'winston-mongodb'

console.log("Logging defined");

const winstonFormat = winston.format.combine(
    winston.format.json(), 
    winston.format.prettyPrint(), 
    winston.format.colorize(),
    winston.format.timestamp(),
);

const logger = winston.createLogger(
    {   
        format: winstonFormat,
        transports: [
            new winston.transports.File({
                filename: 'logfile.log',
                handleExceptions: true,
                handleRejections: true,

            }),
            new winston.transports.Console({
                format: winstonFormat
            }),
            new winston.transports.MongoDB({
                db: 'mongodb://localhost/vidly',
            }),
        ],
        exceptionHandlers: [
            new winston.transports.File({ filename: 'uncaughtExceptions.log' }),
            new winston.transports.Console({
                format: winstonFormat
            }),
        ],
        rejectionHandlers: [
            new winston.transports.File({
                filename: 'unhandledRejections.log',
            }),
            new winston.transports.Console({
                format: winstonFormat
            }),
        ],
        exitOnError: true
    }
);

export { logger };
