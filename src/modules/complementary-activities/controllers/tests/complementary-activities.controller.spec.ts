import { Test, TestingModule } from '@nestjs/testing';
import { ComplementaryActivitiesController } from '../complementary-activities.controller';

describe('ComplementaryActivitiesController', () => {
  let controller: ComplementaryActivitiesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ComplementaryActivitiesController],
    }).compile();

    controller = module.get<ComplementaryActivitiesController>(
      ComplementaryActivitiesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
