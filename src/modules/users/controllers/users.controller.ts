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
import { ApiBody } from '@nestjs/swagger';
import { ApiCommonResponses } from 'src/common/decorators/api-response.decorator';
import { ResponseMessage } from 'src/common/decorators';
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
  @ResponseMessage('Usuario creado exitosamente.')
  @ApiBody({
    type: CreateUserDto,
    description: 'Datos para crear usuario',
    required: true,
  })
  @ApiCommonResponses({
    summary: 'Crear usuario',
    description: 'Crea un nuevo usuario en el sistema.',
    createdDescription: 'Usuario creado exitosamente.',
    badRequestDescription: 'Datos inválidos para la creación del usuario.',
    internalErrorDescription: 'Error interno al crear el usuario.',
  })
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
  @ResponseMessage('Listado de usuarios.')
  @ApiCommonResponses({
    summary: 'Listar usuarios',
    description: 'Obtiene la lista de todos los usuarios registrados.',
    okDescription: 'Lista de usuarios obtenida correctamente.',
    internalErrorDescription: 'Error interno al obtener los usuarios.',
  })
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
  @ResponseMessage('Información de usuario obtenida.')
  @ApiCommonResponses({
    summary: 'Obtener usuario por ID',
    description: 'Obtiene la información de un usuario específico por su ID.',
    okDescription: 'Usuario obtenido correctamente.',
    internalErrorDescription: 'Error interno al obtener el usuario.',
    notFoundDescription: 'No se encontró el usuario solicitado.',
  })
  findOne(@Param('id', ValidateIdPipe) id: string) {
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
  @ResponseMessage('Listado de usuarios por rol obtenido.')
  @ApiCommonResponses({
    summary: 'Listar usuarios por rol',
    description: 'Obtiene la lista de usuarios según el rol especificado.',
    okDescription: 'Lista de usuarios por rol obtenida correctamente.',
    internalErrorDescription: 'Error interno al obtener los usuarios por rol.',
    notFoundDescription: 'No se encontraron usuarios para el rol especificado.',
  })
  findAllUsersWithRole(@Param('roleId', ValidateIdPipe) roleId: string) {
    return this.usersService.findAllUsersWithRole(roleId);
  }

  @Patch(':id')
  @Roles(EUserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Usuario actualizado correctamente.')
  @ApiBody({
    type: UpdateUserDto,
    description: 'Datos para actualizar usuario',
    required: true,
  })
  @ApiCommonResponses({
    summary: 'Actualizar usuario',
    description: 'Actualiza la información de un usuario existente.',
    internalErrorDescription: 'Error interno al actualizar el usuario.',
    notFoundDescription: 'No se encontró el usuario solicitado.',
  })
  update(
    @Param('id', ValidateIdPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles(EUserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Usuario eliminado correctamente.')
  @ApiCommonResponses({
    summary: 'Eliminar usuario',
    description: 'Elimina un usuario del sistema por su ID.',
    internalErrorDescription: 'Error interno al eliminar el usuario.',
    notFoundDescription: 'No se encontró el usuario solicitado.',
  })
  remove(@Param('id', ValidateIdPipe) id: string) {
    return this.usersService.remove(id);
  }
}
