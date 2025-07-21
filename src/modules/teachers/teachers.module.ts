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
import { UsersService } from '../users/services/users.service';
import { RolesService } from '../users/services/roles.service';
import { TeachersUndergradModule } from '../teachers-undergrad/teachers-undergrad.module';
import { UsersModule } from '../users/users.module';
// import { IsValidUndergradDegreeConstraint } from './dto/create-teacher.dto';

@Module({
  controllers: [TeachersController],
  providers: [
    PrismaService,
    RolesService,
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
  imports: [
    forwardRef(() => TeachersUndergradModule),
    forwardRef(() => UsersModule),
  ],
})
export class TeachersModule {}
