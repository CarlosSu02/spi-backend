import { Test, TestingModule } from '@nestjs/testing';
import { CourseStadisticsController } from '../course-stadistics.controller';

describe('CourseStadisticsController', () => {
  let controller: CourseStadisticsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CourseStadisticsController],
    }).compile();

    controller = module.get<CourseStadisticsController>(
      CourseStadisticsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
