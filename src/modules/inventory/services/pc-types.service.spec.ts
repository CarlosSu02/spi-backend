import { Test, TestingModule } from '@nestjs/testing';
import { PcTypesService } from './pc-types.service';

describe('PcTypesService', () => {
  let service: PcTypesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PcTypesService],
    }).compile();

    service = module.get<PcTypesService>(PcTypesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
