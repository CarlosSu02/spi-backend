import { Test, TestingModule } from '@nestjs/testing';
import { ComplementaryActivitiesService } from '../complementary-activities.service';

describe('ComplementaryActivitiesService', () => {
  let service: ComplementaryActivitiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ComplementaryActivitiesService],
    }).compile();

    service = module.get<ComplementaryActivitiesService>(
      ComplementaryActivitiesService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
