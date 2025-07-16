import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { ValidateIdPipe } from 'src/common/pipes';
import { Roles } from 'src/common/decorators';
import { EUserRole } from '../../../common/enums';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(EUserRole.ADMIN, EUserRole.COORDINADOR_AREA, EUserRole.RRHH)
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Roles(
    EUserRole.ADMIN,
    EUserRole.COORDINADOR_AREA,
    EUserRole.DIRECCION,
    EUserRole.RRHH,
  )
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @Roles(
    EUserRole.ADMIN,
    EUserRole.COORDINADOR_AREA,
    EUserRole.DIRECCION,
    EUserRole.RRHH,
  )
  @HttpCode(HttpStatus.OK)
  findOne(@Param(ValidateIdPipe) id: string) {
    return this.usersService.findOne(id);
  }

  @Get('role/:id')
  @Roles(
    EUserRole.ADMIN,
    EUserRole.COORDINADOR_AREA,
    EUserRole.DIRECCION,
    EUserRole.RRHH,
  )
  @HttpCode(HttpStatus.OK)
  findAllUsersWithRole(@Param(ValidateIdPipe) roleId: string) {
    return this.usersService.findAllUsersWithRole(roleId);
  }

  @Patch(':id')
  @Roles(EUserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  update(
    @Param(ValidateIdPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles(EUserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  remove(@Param(ValidateIdPipe) id: string) {
    return this.usersService.remove(id);
  }
}
