import { Test, TestingModule } from '@nestjs/testing';
import { TeacherDepartmentPositionService } from '../services/teacher-department-position.service';
import { TeacherDepartmentPositionController } from './teacher-department-position.controller';

describe('TeacherDepartmentPositionController', () => {
  let controller: TeacherDepartmentPositionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeacherDepartmentPositionController],
      providers: [TeacherDepartmentPositionService],
    }).compile();

    controller = module.get<TeacherDepartmentPositionController>(
      TeacherDepartmentPositionController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
