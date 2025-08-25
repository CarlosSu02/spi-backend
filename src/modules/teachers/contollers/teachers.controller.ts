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
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { TeachersService } from '../services/teachers.service';
import { CreateTeacherDto } from '../dto/create-teacher.dto';
import { UpdateTeacherDto } from '../dto/update-teacher.dto';
import {
  ApiPagination,
  GetCurrentUserId,
  ResponseMessage,
  Roles,
} from 'src/common/decorators';
import { ApiCommonResponses } from 'src/common/decorators/api-response.decorator';
import { EUserRole } from 'src/common/enums';
import { ExtractIdInterceptor } from 'src/common/interceptors';
import { ValidateIdPipe } from 'src/common/pipes';
import { QueryPaginationDto } from 'src/common/dto';
import { ApiBody } from '@nestjs/swagger';

@Controller('teachers')
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  @Post()
  @Roles(EUserRole.ADMIN, EUserRole.COORDINADOR_AREA, EUserRole.RRHH)
  @HttpCode(HttpStatus.CREATED)
  @ResponseMessage('Se ha creado un perfil de docente.')
  @ApiBody({
    type: CreateTeacherDto,
    description: 'Datos para crear un perfil de docente',
  })
  @ApiCommonResponses({
    summary: 'Crear un perfil de docente',
    createdDescription: 'Se ha creado un perfil de docente.',
  })
  create(@Body() createTeacherDto: CreateTeacherDto) {
    return this.teachersService.create(createTeacherDto);
  }

  // FIX: eliminar esto, ya que cuando se crea un usuario, si es DOCENTE o COORDINADOR_AREA,...
  // ...se debe elegir el departamento al que pertenece
  @Post('my')
  @HttpCode(HttpStatus.CREATED)
  @ResponseMessage('Se ha creado un perfil de docente.')
  @UseInterceptors(ExtractIdInterceptor)
  @ApiBody({
    type: CreateTeacherDto,
    description: 'Datos para crear mi perfil de docente',
  })
  @ApiCommonResponses({
    summary: 'Crear mi perfil de docente',
    createdDescription: 'Se ha creado un perfil de docente.',
  })
  createMyTeacherProfile(@Body() createTeacherDto: CreateTeacherDto) {
    createTeacherDto.userId = createTeacherDto.currentUserId!; // no es una ruta pública, currentUserId siempre existe
    return this.teachersService.create(createTeacherDto);
  }

  @Get()
  @Roles(
    EUserRole.ADMIN,
    EUserRole.COORDINADOR_AREA,
    EUserRole.RRHH,
    EUserRole.DIRECCION,
  )
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Listado de docentes.')
  @ApiPagination({
    summary: 'Obtener todos los docentes',
    description: 'Devuelve una lista de todos los docentes.',
  })
  @ApiCommonResponses({
    summary: 'Obtener todos los docentes',
    okDescription: 'Listado de docentes.',
  })
  findAll(@Query() query: QueryPaginationDto) {
    return this.teachersService.findAllWithPagination(query);
  }

  @Get('teacher/:id')
  @Roles(
    EUserRole.ADMIN,
    EUserRole.COORDINADOR_AREA,
    EUserRole.RRHH,
    EUserRole.DIRECCION,
  )
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Se ha encontrado el docente por ID de usuario.')
  @ApiCommonResponses({
    summary: 'Obtener docente por ID de usuario',
    okDescription: 'Se ha encontrado el docente por ID de usuario.',
  })
  findTeacherByUserId(@Param('id', ValidateIdPipe) id: string) {
    return this.teachersService.findOneByUserId(id);
  }

  @Get('my')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Perfil de docente autenticado.')
  @ApiCommonResponses({
    summary: 'Perfil de docente autenticado',
    createdDescription: 'Perfil de docente autenticado.',
  })
  getCurrentProfile(@GetCurrentUserId() userId: string) {
    return this.teachersService.findOneByUserId(userId);
  }

  @Get(':id')
  @Roles(
    EUserRole.ADMIN,
    EUserRole.COORDINADOR_AREA,
    EUserRole.RRHH,
    EUserRole.DIRECCION,
  )
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Se ha encontrado el docente.')
  @ApiCommonResponses({
    summary: 'Obtener un docente por ID',
    okDescription: 'Se ha encontrado el docente.',
  })
  findOne(@Param('id', ValidateIdPipe) id: string) {
    return this.teachersService.findOne(id);
  }

  @Patch(':id')
  @Roles(EUserRole.ADMIN, EUserRole.COORDINADOR_AREA, EUserRole.RRHH)
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Docente actualizado exitosamente.')
  @ApiBody({
    type: UpdateTeacherDto,
    description: 'Datos para actualizar un perfil de docente',
  })
  @ApiCommonResponses({
    summary: 'Actualizar un docente por ID',
    okDescription: 'Se ha actualizado el docente.',
  })
  update(
    @Param('id', ValidateIdPipe) id: string,
    @Body() updateTeacherDto: UpdateTeacherDto,
  ) {
    return this.teachersService.update(id, updateTeacherDto);
  }

  // Cambiar el active status del usuario a false, para no eliminar el registro físicamente
  @Delete(':id')
  @Roles(EUserRole.ADMIN, EUserRole.COORDINADOR_AREA, EUserRole.RRHH)
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Docente desactivado exitosamente.')
  @ApiCommonResponses({
    summary: 'Eliminar un docente por ID',
    okDescription: 'Se ha desactivado el docente.',
  })
  remove(@Param('id', ValidateIdPipe) id: string) {
    return this.teachersService.remove(id);
  }
}
