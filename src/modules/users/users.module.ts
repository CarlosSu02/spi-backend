import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { RolesService } from './services/roles.service';
import { RolesController } from './controllers/roles.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { TeacherRequiredFieldsForRoleConstraint } from './validators/teacher-required-fields.validator';
import { TeachersUndergradService } from '../teachers-undergrad/services/teachers-undergrad.service';
import { TeachersService } from '../teachers/services/teachers.service';
import { TeachersUndergradModule } from '../teachers-undergrad/teachers-undergrad.module';
import { TeachersModule } from '../teachers/teachers.module';

@Module({
  controllers: [UsersController, RolesController],
  providers: [
    PrismaService,
    UsersService,
    RolesService,
    TeacherRequiredFieldsForRoleConstraint,
  ],
  exports: [UsersService],
  imports: [TeachersUndergradModule, TeachersModule],
})
export class UsersModule {}
