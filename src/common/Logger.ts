import * as winston from 'winston'
import { Provider, Provided, Singleton } from 'typescript-ioc';

const logger: Provider = {
    get: () => {
        return winston.createLogger({
            level: 'info',
            format: winston.format.cli(),
            transports: [
                new winston.transports.Console()
            ]
        });
    }
};

@Singleton
@Provided(logger)
export default class Logger{
    [key: string]: any;
}
