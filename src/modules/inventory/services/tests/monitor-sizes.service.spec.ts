import { Test, TestingModule } from '@nestjs/testing';
import { MonitorSizesService } from '../monitor-sizes.service';

describe('MonitorSizesService', () => {
  let service: MonitorSizesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MonitorSizesService],
    }).compile();

    service = module.get<MonitorSizesService>(MonitorSizesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
