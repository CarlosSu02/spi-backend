import { Test, TestingModule } from '@nestjs/testing';
import { VerificationMediasController } from '../verification-medias.controller';

describe('VerificationMediasController', () => {
  let controller: VerificationMediasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VerificationMediasController],
    }).compile();

    controller = module.get<VerificationMediasController>(
      VerificationMediasController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
