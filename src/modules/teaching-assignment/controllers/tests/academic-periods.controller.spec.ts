import { Test, TestingModule } from '@nestjs/testing';
import { AcademicPeriodsController } from '../academic-periods.controller';
import { AcademicPeriodsService } from '.../services/academic-periods.service';

describe('AcademicPeriodsController', () => {
  let controller: AcademicPeriodsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AcademicPeriodsController],
      providers: [AcademicPeriodsService],
    }).compile();

    controller = module.get<AcademicPeriodsController>(
      AcademicPeriodsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
