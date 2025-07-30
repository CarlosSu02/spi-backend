import { Test, TestingModule } from '@nestjs/testing';
import { TeachersUndergradService } from '../teachers-undergrad.service';

describe('TeachersUndergradService', () => {
  let service: TeachersUndergradService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TeachersUndergradService],
    }).compile();

    service = module.get<TeachersUndergradService>(TeachersUndergradService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
