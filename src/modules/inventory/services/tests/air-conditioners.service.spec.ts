import { Test, TestingModule } from '@nestjs/testing';
import { AirConditionersService } from '../air-conditioners.service';

describe('AirConditionersService', () => {
  let service: AirConditionersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AirConditionersService],
    }).compile();

    service = module.get<AirConditionersService>(AirConditionersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
