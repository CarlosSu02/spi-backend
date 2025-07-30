import { Test, TestingModule } from '@nestjs/testing';
import { CourseStadisticsService } from '../course-stadistics.service';

describe('CourseStadisticsService', () => {
  let service: CourseStadisticsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CourseStadisticsService],
    }).compile();

    service = module.get<CourseStadisticsService>(CourseStadisticsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
