import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { RolesService } from './services/roles.service';
import { RolesController } from './controllers/roles.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { TeacherRequiredFieldsForRoleConstraint } from './validators/teacher-required-fields.validator';

@Module({
  controllers: [UsersController, RolesController],
  providers: [
    PrismaService,
    UsersService,
    RolesService,
    TeacherRequiredFieldsForRoleConstraint,
  ],
})
export class UsersModule {}
