import { Test, TestingModule } from '@nestjs/testing';
import { TrophieService } from './trophie.service';

describe('TrophieService', () => {
  let service: TrophieService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TrophieService],
    }).compile();

    service = module.get<TrophieService>(TrophieService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
