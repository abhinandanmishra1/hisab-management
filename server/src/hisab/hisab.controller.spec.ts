import { Test, TestingModule } from '@nestjs/testing';
import { HisabController } from './hisab.controller';

describe('HisabController', () => {
  let controller: HisabController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HisabController],
    }).compile();

    controller = module.get<HisabController>(HisabController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
