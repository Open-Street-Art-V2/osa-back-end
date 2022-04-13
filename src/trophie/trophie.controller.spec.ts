import { Test, TestingModule } from '@nestjs/testing';
import { TrophieController } from './trophie.controller';
import { TrophieService } from './trophie.service';

describe('TrophieController', () => {
  let controller: TrophieController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrophieController],
      providers: [TrophieService],
    }).compile();

    controller = module.get<TrophieController>(TrophieController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
