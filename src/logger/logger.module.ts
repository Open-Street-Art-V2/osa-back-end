import { Module } from '@nestjs/common';
import { CustomLogger } from './custom-logger';

@Module({
  controllers: [],
  providers: [CustomLogger],
})
export class LoggerModule {}
