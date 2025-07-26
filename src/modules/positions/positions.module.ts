import { Module } from '@nestjs/common';
import { PositionsController } from './controllers/positions.controller';
import { PositionsService } from './services/positions.service';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  IsValidNamePositionConstraint,
  IsValidPositionIdConstraint,
} from './validators';

@Module({
  controllers: [PositionsController],
  providers: [
    PrismaService,
    PositionsService,
    IsValidNamePositionConstraint,
    IsValidPositionIdConstraint,
  ],
  exports: [
    PositionsService,
    IsValidNamePositionConstraint,
    IsValidPositionIdConstraint,
  ],
})
export class PositionsModule {}
