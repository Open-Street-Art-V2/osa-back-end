import { Test, TestingModule } from '@nestjs/testing';
import { PropositionService } from './proposition.service';

describe('PropositionService', () => {
  let service: PropositionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PropositionService],
    }).compile();

    service = module.get<PropositionService>(PropositionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
