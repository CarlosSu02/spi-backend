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
import { UsersModule } from '../users/users.module';
import { TeacherPreferencesService } from './services/teacher-preferences.service';
import { TeacherPreferencesController } from './contollers/teacher-preferences.controller';
import { TeachersDegreesModule } from '../teachers-degrees/teachers-degrees.module';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    forwardRef(() => TeachersDegreesModule),
  ],
  controllers: [TeachersController, TeacherPreferencesController],
  providers: [
    PrismaService,
    TeachersService,
    TeacherPreferencesService,
    ShiftsService,
    ContractTypesService,
    TeacherCategoriesService,
    IsValidGradDegreeConstraint,
    IsValidConfigTeacherConstraint,
    IsValidUserIdConstraint,
  ],
  exports: [
    TeachersService,
    TeacherPreferencesService,
    IsValidGradDegreeConstraint,
    IsValidConfigTeacherConstraint,
    IsValidUserIdConstraint,
  ],
})
export class TeachersModule {}
