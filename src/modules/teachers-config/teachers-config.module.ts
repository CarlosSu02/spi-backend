import { Module } from '@nestjs/common';
import { TeacherCategoriesService } from './services/teacher-categories.service';
import { ContractTypesService } from './services/contract-types.service';
import { ShiftsService } from './services/shifts.service';
import { ContractTypesController } from './controllers/contract-types.controller';
import { ShiftsController } from './controllers/shifts.controller';
import { TeacherCategoriesController } from './controllers/teacher-categories.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [
    TeacherCategoriesController,
    ContractTypesController,
    ShiftsController,
  ],
  providers: [
    PrismaService,
    TeacherCategoriesService,
    ContractTypesService,
    ShiftsService,
  ],
})
export class TeachersConfigModule {}
