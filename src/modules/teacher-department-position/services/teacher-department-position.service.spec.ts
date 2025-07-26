import { Test, TestingModule } from '@nestjs/testing';
import { TeacherDepartmentPositionService } from './teacher-department-position.service';

describe('TeacherDepartmentPositionService', () => {
  let service: TeacherDepartmentPositionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TeacherDepartmentPositionService],
    }).compile();

    service = module.get<TeacherDepartmentPositionService>(
      TeacherDepartmentPositionService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
