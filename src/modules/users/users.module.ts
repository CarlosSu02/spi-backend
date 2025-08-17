import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { RolesService } from './services/roles.service';
import { RolesController } from './controllers/roles.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { TeacherRequiredFieldsForRoleConstraint } from './validators/teacher-required-fields.validator';
import { TeachersUndergradModule } from '../teachers-undergrad/teachers-undergrad.module';
import { TeachersPostgradModule } from '../teachers-postgrad/teachers-postgrad.module';
import { TeachersModule } from '../teachers/teachers.module';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    forwardRef(() => TeachersModule),
    forwardRef(() => TeachersUndergradModule),
    forwardRef(() => TeachersPostgradModule),
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
