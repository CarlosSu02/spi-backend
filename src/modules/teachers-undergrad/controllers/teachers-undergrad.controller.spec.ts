import { Test, TestingModule } from '@nestjs/testing';
import { TeachersUndergradController } from './teachers-undergrad.controller';
import { TeachersUndergradService } from '../services/teachers-undergrad.service';

describe('TeachersUndergradController', () => {
  let controller: TeachersUndergradController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeachersUndergradController],
      providers: [TeachersUndergradService],
    }).compile();

    controller = module.get<TeachersUndergradController>(
      TeachersUndergradController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
