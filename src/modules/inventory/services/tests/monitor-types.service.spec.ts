import { Test, TestingModule } from '@nestjs/testing';
import { MonitorTypesService } from '../monitor-types.service';

describe('MonitorTypesService', () => {
  let service: MonitorTypesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MonitorTypesService],
    }).compile();

    service = module.get<MonitorTypesService>(MonitorTypesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
