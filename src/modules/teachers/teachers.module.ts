import { forwardRef, Module } from '@nestjs/common';
import { TeachersService } from './services/teachers.service';
import { TeachersController } from './contollers/teachers.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  IsValidConfigTeacherConstraint,
  IsValidGradDegreeConstraint,
  IsValidUserIdConstraint,
} from './validators';
import { ShiftsService } from '../teachers-config/services/shifts.service';
import { ContractTypesService } from '../teachers-config/services/contract-types.service';
import { TeacherCategoriesService } from '../teachers-config/services/teacher-categories.service';
import { TeachersUndergradModule } from '../teachers-undergrad/teachers-undergrad.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    forwardRef(() => TeachersUndergradModule),
  ],
  controllers: [TeachersController],
  providers: [
    PrismaService,
    TeachersService,
    ShiftsService,
    ContractTypesService,
    TeacherCategoriesService,
    IsValidGradDegreeConstraint,
    IsValidConfigTeacherConstraint,
    IsValidUserIdConstraint,
  ],
  exports: [
    TeachersService,
    IsValidGradDegreeConstraint,
    IsValidConfigTeacherConstraint,
    IsValidUserIdConstraint,
  ],
})
export class TeachersModule {}
