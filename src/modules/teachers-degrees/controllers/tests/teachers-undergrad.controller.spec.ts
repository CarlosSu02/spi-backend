import { Test, TestingModule } from '@nestjs/testing';
import { TeachersUndergradController } from '../teachers-undergrad.controller';

describe('TeachersUndergradController', () => {
  let controller: TeachersUndergradController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeachersUndergradController],
    }).compile();

    controller = module.get<TeachersUndergradController>(TeachersUndergradController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
