import { Test, TestingModule } from '@nestjs/testing';
import { PropositionController } from './proposition.controller';
import { PropositionService } from './proposition.service';

describe('PropositionController', () => {
  let controller: PropositionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PropositionController],
      providers: [PropositionService],
    }).compile();

    controller = module.get<PropositionController>(PropositionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
