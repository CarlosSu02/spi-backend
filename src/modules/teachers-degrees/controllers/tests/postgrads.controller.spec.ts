import { Test, TestingModule } from '@nestjs/testing';
import { PostgradsService } from '.../services/postgrads.service';
import { PostgradsController } from '../postgrads.controller';

describe('TeachersPostgradController', () => {
  let controller: PostgradsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostgradsController],
      providers: [PostgradsService],
    }).compile();

    controller = module.get<PostgradsController>(PostgradsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
