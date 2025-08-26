import { forwardRef, Module } from '@nestjs/common';
import { TeachersService } from './services/teachers.service';
import { TeachersController } from './contollers/teachers.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  IsValidConfigTeacherConstraint,
  IsValidGradDegreeConstraint,
  IsValidUserIdConstraint,
} from './validators';
import { UsersModule } from '../users/users.module';
import { TeacherPreferencesService } from './services/teacher-preferences.service';
import { TeacherPreferencesController } from './contollers/teacher-preferences.controller';
import { TeachersDegreesModule } from '../teachers-degrees/teachers-degrees.module';
import { TeachersConfigModule } from '../teachers-config/teachers-config.module';
import { TeacherDepartmentPositionController } from './contollers/teacher-department-position.controller';
import { TeacherDepartmentPositionService } from './services/teacher-department-position.service';
import { CentersModule } from '../centers/centers.module';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    forwardRef(() => TeachersDegreesModule),
    TeachersConfigModule,
    CentersModule,
  ],
  controllers: [
    TeachersController,
    TeacherPreferencesController,
    TeacherDepartmentPositionController,
  ],
  providers: [
    PrismaService,
    TeachersService,
    TeacherPreferencesService,
    TeacherDepartmentPositionService,
    IsValidGradDegreeConstraint,
    IsValidConfigTeacherConstraint,
    IsValidUserIdConstraint,
  ],
  exports: [
    TeachersService,
    TeacherPreferencesService,
    TeacherDepartmentPositionService,
    IsValidGradDegreeConstraint,
    IsValidConfigTeacherConstraint,
    IsValidUserIdConstraint,
  ],
})
export class TeachersModule {}
