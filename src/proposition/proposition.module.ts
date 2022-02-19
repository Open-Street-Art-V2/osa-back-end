import { Module } from '@nestjs/common';
import { PropositionService } from './proposition.service';
import { PropositionController } from './proposition.controller';

@Module({
  controllers: [PropositionController],
  providers: [PropositionService],
})
export class PropositionModule {}
