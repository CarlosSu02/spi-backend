import { Test, TestingModule } from '@nestjs/testing';
import { TeachingSessionsService } from './teaching-sessions.service';

describe('TeachingSessionsService', () => {
  let service: TeachingSessionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TeachingSessionsService],
    }).compile();

    service = module.get<TeachingSessionsService>(TeachingSessionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
