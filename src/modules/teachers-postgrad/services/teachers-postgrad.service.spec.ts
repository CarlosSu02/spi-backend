import { Test, TestingModule } from '@nestjs/testing';
import { TeachersPostgradService } from './teachers-postgrad.service';

describe('TeachersPostgradService', () => {
  let service: TeachersPostgradService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TeachersPostgradService],
    }).compile();

    service = module.get<TeachersPostgradService>(TeachersPostgradService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
