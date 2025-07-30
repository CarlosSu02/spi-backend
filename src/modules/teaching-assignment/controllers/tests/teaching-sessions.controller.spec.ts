import { Test, TestingModule } from '@nestjs/testing';
import { TeachingSessionsController } from '../teaching-sessions.controller';
import { TeachingSessionsService } from '.../services/teaching-sessions.service';

describe('TeachingSessionsController', () => {
  let controller: TeachingSessionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeachingSessionsController],
      providers: [TeachingSessionsService],
    }).compile();

    controller = module.get<TeachingSessionsController>(
      TeachingSessionsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
