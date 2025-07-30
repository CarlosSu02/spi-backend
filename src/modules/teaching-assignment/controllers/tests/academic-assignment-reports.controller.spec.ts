import { Test, TestingModule } from '@nestjs/testing';
import { AssignmentReportsController } from '../academic-assignment-reports.controller';
import { AcademicAssignmentReportsService } from '.../services/academic-assignment-reports.service';

describe('AcademicAssignmentReportsController', () => {
  let controller: AssignmentReportsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssignmentReportsController],
      providers: [AcademicAssignmentReportsService],
    }).compile();

    controller = module.get<AssignmentReportsController>(
      AssignmentReportsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
