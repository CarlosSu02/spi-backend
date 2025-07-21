import { Module } from '@nestjs/common';
import { TeachersService } from './services/teachers.service';
import { TeachersController } from './contollers/teachers.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { TeachersUndergradService } from '../teachers-undergrad/services/teachers-undergrad.service';
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
// import { IsValidUndergradDegreeConstraint } from './dto/create-teacher.dto';

@Module({
  controllers: [TeachersController],
  providers: [
    PrismaService,
    RolesService,
    UsersService,
    TeachersService,
    TeachersUndergradService,
    ShiftsService,
    ContractTypesService,
    TeacherCategoriesService,
    IsValidGradDegreeConstraint,
    IsValidConfigTeacherConstraint,
    IsValidUserIdConstraint,
  ],
})
export class TeachersModule {}
