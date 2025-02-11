import { Test, TestingModule } from '@nestjs/testing';
import { HisabService } from './hisab.service';

describe('HisabService', () => {
  let service: HisabService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HisabService],
    }).compile();

    service = module.get<HisabService>(HisabService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
