import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { RolesService } from './services/roles.service';
import { RolesController } from './controllers/roles.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { TeacherRequiredFieldsForRoleConstraint } from './validators/teacher-required-fields.validator';
import { TeachersModule } from '../teachers/teachers.module';
import { MailModule } from '../mail/mail.module';
import { TeacherDepartmentPositionModule } from '../teacher-department-position/teacher-department-position.module';
import { PositionsModule } from '../positions/positions.module';

@Module({
  imports: [
    forwardRef(() => TeachersModule),
    forwardRef(() => TeacherDepartmentPositionModule),
    forwardRef(() => PositionsModule),
    MailModule,
  ],
  controllers: [UsersController, RolesController],
  providers: [
    PrismaService,
    UsersService,
    RolesService,
    TeacherRequiredFieldsForRoleConstraint,
  ],
  exports: [UsersService, RolesService],
})
export class UsersModule {}
