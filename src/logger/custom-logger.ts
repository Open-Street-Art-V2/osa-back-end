import {
  ConsoleLogger,
  Injectable,
  LoggerService,
  LogLevel,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CustomLogger extends ConsoleLogger implements LoggerService {
  fs;
  path: string;
  constructor(private configService: ConfigService) {
    super();
    this.fs = require('fs');
    this.path = this.configService.get('LOG_FILE_PATH');
  }
  log(message: any, ...optionalParams: any[]) {
    super.log(message, ...optionalParams);
    this.fs.writeFile(
      this.path,
      'LOG ' + '[' + optionalParams[0] + '] ' + message + '\n',
      { flag: 'a+' },
      (err) => {
        if (err) {
          console.log(err);
          super.log('Writing to log FAILED with following error: \n' + err);
        }
      },
    );
  }
  error(message: any, ...optionalParams: any[]) {
    super.error(message, ...optionalParams);
    this.fs.writeFile(
      this.path,
      'ERROR ' + '[' + optionalParams[1] + '] ' + message + '\n',
      { flag: 'a+' },
      (err) => {
        if (err) {
          console.log(err);
          super.log('Writing to log FAILED');
        }
      },
    );
  }
  warn(message: any, ...optionalParams: any[]) {
    super.warn(message, ...optionalParams);
  }
  debug(message: any, ...optionalParams: any[]) {
    super.debug(message, ...optionalParams);
  }
  verbose(message: any, ...optionalParams: any[]) {
    super.verbose(message, ...optionalParams);
  }
  setLogLevels(levels: LogLevel[]) {
    throw new Error('Method not implemented.');
  }
}
