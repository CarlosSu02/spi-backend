import { Test, TestingModule } from '@nestjs/testing';
import { TeacherCategoriesService } from './teacher-categories.service';

describe('TeacherCategoriesService', () => {
  let service: TeacherCategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TeacherCategoriesService],
    }).compile();

    service = module.get<TeacherCategoriesService>(TeacherCategoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
