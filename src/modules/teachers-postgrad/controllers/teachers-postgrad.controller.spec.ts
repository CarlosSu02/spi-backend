import { Test, TestingModule } from '@nestjs/testing';
import { TeachersPostgradController } from './teachers-postgrad.controller';

describe('TeachersPostgradController', () => {
  let controller: TeachersPostgradController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeachersPostgradController],
    }).compile();

    controller = module.get<TeachersPostgradController>(
      TeachersPostgradController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
