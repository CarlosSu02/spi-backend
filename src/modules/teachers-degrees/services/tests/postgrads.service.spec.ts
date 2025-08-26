import { Test, TestingModule } from '@nestjs/testing';
import { PostgradsService } from '../postgrads.service';

describe('TeachersPostgradService', () => {
  let service: PostgradsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostgradsService],
    }).compile();

    service = module.get<PostgradsService>(PostgradsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
