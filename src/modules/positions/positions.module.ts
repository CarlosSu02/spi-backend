import { Module } from '@nestjs/common';
import { PositionsController } from './controllers/positions.controller';
import { PositionsService } from './services/positions.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { IsValidNamePositionConstraint } from './validators';

@Module({
  controllers: [PositionsController],
  providers: [PrismaService, PositionsService, IsValidNamePositionConstraint],
  exports: [PositionsService, IsValidNamePositionConstraint],
})
export class PositionsModule {}
