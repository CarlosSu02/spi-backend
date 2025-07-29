import { Test, TestingModule } from '@nestjs/testing';
import { AcademicAssignmentReportsService } from './academic-assignment-reports.service';

describe('AcademicAssignmentReportsService', () => {
  let service: AcademicAssignmentReportsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AcademicAssignmentReportsService],
    }).compile();

    service = module.get<AcademicAssignmentReportsService>(
      AcademicAssignmentReportsService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
