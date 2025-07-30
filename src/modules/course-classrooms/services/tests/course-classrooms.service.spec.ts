import { Test, TestingModule } from '@nestjs/testing';
import { CourseClassroomsService } from '../course-classrooms.service';

describe('CourseClassroomsService', () => {
  let service: CourseClassroomsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CourseClassroomsService],
    }).compile();

    service = module.get<CourseClassroomsService>(CourseClassroomsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
