import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { RolesService } from './services/roles.service';
import { RolesController } from './controllers/roles.controller';

@Module({
  controllers: [UsersController, RolesController],
  providers: [UsersService, RolesService],
})
export class UsersModule {}
