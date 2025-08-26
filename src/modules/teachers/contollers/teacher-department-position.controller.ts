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
  Query,
} from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { ApiCommonResponses } from 'src/common/decorators';
import { CreateTeacherDepartmentPositionDto } from '../dto/create-teacher-department-position.dto';
import { UpdateTeacherDepartmentPositionDto } from '../dto/update-teacher-department-position.dto';
import { TeacherDepartmentPositionService } from '../services/teacher-department-position.service';
import { ValidateIdPipe } from 'src/common/pipes';
import { EUserRole } from 'src/common/enums';
import {
  ApiPagination,
  GetCurrentUserId,
  ResponseMessage,
  Roles,
} from 'src/common/decorators';
import { QueryPaginationDto } from 'src/common/dto';
import { ApiParam } from '@nestjs/swagger';

@Controller('teacher-department-position')
@Roles(
  EUserRole.ADMIN,
  EUserRole.COORDINADOR_AREA,
  EUserRole.RRHH,
  EUserRole.DIRECCION,
)
export class TeacherDepartmentPositionController {
  constructor(
    private readonly teacherDepartmentPositionService: TeacherDepartmentPositionService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ResponseMessage('Se ha creado la relación docente-departamento-cargo.')
  @ApiBody({
    type: CreateTeacherDepartmentPositionDto,
    description: 'Datos para crear la relación docente-departamento-cargo.',
  })
  @ApiCommonResponses({
    summary: 'Crear relación docente-departamento-cargo',
    createdDescription:
      'Relación docente-departamento-cargo creada exitosamente.',
    badRequestDescription:
      'Datos inválidos para crear la relación docente-departamento-cargo.',
    internalErrorDescription:
      'Error interno al crear la relación docente-departamento-cargo.',
  })
  create(
    @Body()
    createTeacherDepartmentPositionDto: CreateTeacherDepartmentPositionDto,
  ) {
    return this.teacherDepartmentPositionService.create(
      createTeacherDepartmentPositionDto,
    );
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Listado de docentes con su departamento y cargo.')
  @ApiCommonResponses({
    summary: 'Listar docentes con su departamento y cargo',
    okDescription:
      'Listado de docentes con departamento y cargo obtenido correctamente.',
    badRequestDescription:
      'Solicitud inválida al obtener los docentes con departamento y cargo.',
    internalErrorDescription:
      'Error interno al obtener los docentes con departamento y cargo.',
    notFoundDescription: 'No se encontraron docentes con departamento y cargo.',
  })
  @ApiPagination({
    summary: 'Listar docentes con su departamento y cargo',
    description:
      'Obtiene un listado paginado de docentes con su departamento y cargo',
  })
  findAll(@Query() query: QueryPaginationDto) {
    return this.teacherDepartmentPositionService.findAllWithPagination(query);
  }

  @Get('department/:departmentId')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage(
    'Listado de docentes con su departamento y cargo en un departamento en específico.',
  )
  @ApiCommonResponses({
    summary:
      'Listar docentes con su departamento y cargo por departamento en específico',
    okDescription: 'Listado obtenido correctamente.',
    badRequestDescription:
      'Solicitud inválida al obtener los docentes por departamento.',
    internalErrorDescription:
      'Error interno al obtener los docentes por departamento.',
    notFoundDescription: 'No se encontraron docentes para el departamento.',
  })
  @ApiParam({
    name: 'departmentId',
    description: 'ID del departamento para filtrar los docentes',
    type: String,
    format: 'uuid',
  })
  @ApiPagination({
    summary:
      'Listar docentes con su departamento y cargo por departamento en específico',
    description:
      'Obtiene un listado paginado de docentes con su departamento y cargo asociados a un departamento específico',
  })
  findAllByDepartmentId(
    @Query() query: QueryPaginationDto,
    @Param('departmentId', ValidateIdPipe) departmentId: string,
  ) {
    return this.teacherDepartmentPositionService.findAllByDepartmentId(
      query,
      departmentId,
    );
  }

  // para que un coordinador de area pueda ver los docentes de su area o departamento
  // en este caso solo es para el rol COORDINADOR_AREA, y siempre y cuando este autenticado
  // no necesita el departmentId en la url, ya que el coordinador de área solo puede ver los docentes de su departamento
  // solo funcionara si el coordinador inicia sesión y tiene un departamento asignado
  @Get('coordinator')
  @Roles(EUserRole.COORDINADOR_AREA)
  @HttpCode(HttpStatus.OK)
  @ResponseMessage(
    'Listado de docentes con su departamento y cargo en un departamento en específico para coordinadores de área.',
  )
  @ApiCommonResponses({
    summary:
      'Listar docentes con su departamento y cargo por departamento en específico para coordinadores de área',
    okDescription: 'Listado obtenido correctamente para coordinador.',
    badRequestDescription:
      'Solicitud inválida al obtener los docentes para coordinador.',
    internalErrorDescription:
      'Error interno al obtener los docentes para coordinador.',
    notFoundDescription: 'No se encontraron docentes para el coordinador.',
  })
  @ApiPagination({
    summary:
      'Listar docentes con su departamento y cargo por departamento en específico para coordinadores de área (usuarios autenticados con rol COORDINADOR_AREA)',
    description:
      'Obtiene un listado paginado de docentes con su departamento y cargo asociados a un departamento específico para coordinadores de área',
  })
  async findAllByCoordinator(
    @Query() query: QueryPaginationDto,
    @GetCurrentUserId() userId: string,
  ) {
    const user =
      await this.teacherDepartmentPositionService.findOneByUserId(userId);

    return await this.teacherDepartmentPositionService.findAllByDepartmentId(
      query,
      user.department.id,
      user.teacher.id,
    );
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Información de la relación docente-departamento-cargo.')
  @ApiCommonResponses({
    summary: 'Obtener una relación docente-departamento-cargo por ID',
    okDescription: 'Relación obtenida correctamente.',
    badRequestDescription: 'ID inválido para obtener la relación.',
    internalErrorDescription: 'Error interno al obtener la relación.',
    notFoundDescription: 'No se encontró la relación solicitada.',
  })
  findOne(@Param('id', ValidateIdPipe) id: string) {
    return this.teacherDepartmentPositionService.findOne(id);
  }

  @Get('my/department/:departmentId')
  @Roles(EUserRole.DOCENTE, EUserRole.COORDINADOR_AREA)
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Información de la relación personal-departamento por ID.')
  @ApiCommonResponses({
    summary:
      'Obtener una relación personal-departamento por ID de usuario y departamento',
    okDescription: 'Relación personal-departamento obtenida correctamente.',
    badRequestDescription:
      'Parámetros inválidos para obtener la relación personal-departamento.',
    internalErrorDescription:
      'Error interno al obtener la relación personal-departamento.',
    notFoundDescription:
      'No se encontró la relación personal-departamento solicitada.',
  })
  findOnePersonalAndDepartmentId(
    @GetCurrentUserId() userId: string,
    @Param('departmentId', ValidateIdPipe) departmentId: string,
  ) {
    return this.teacherDepartmentPositionService.findPositionByUserIdAndDepId(
      userId,
      departmentId,
    );
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage(
    'Relación docente-departamento-cargo actualizada correctamente.',
  )
  @ApiCommonResponses({
    summary: 'Actualizar una relación docente-departamento-cargo por ID',
    okDescription: 'Relación actualizada correctamente.',
    badRequestDescription: 'Datos inválidos para actualizar la relación.',
    internalErrorDescription: 'Error interno al actualizar la relación.',
    notFoundDescription: 'No se encontró la relación a actualizar.',
  })
  update(
    @Param('id', ValidateIdPipe) id: string,
    @Body()
    updateTeacherDepartmentPositionDto: UpdateTeacherDepartmentPositionDto,
  ) {
    return this.teacherDepartmentPositionService.update(
      id,
      updateTeacherDepartmentPositionDto,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage(
    'Relación docente-departamento-cargo eliminada correctamente.',
  )
  @ApiCommonResponses({
    summary: 'Eliminar una relación docente-departamento-cargo por ID',
    okDescription: 'Relación eliminada correctamente.',
    badRequestDescription: 'ID inválido para eliminar la relación.',
    internalErrorDescription: 'Error interno al eliminar la relación.',
    notFoundDescription: 'No se encontró la relación a eliminar.',
  })
  remove(@Param('id', ValidateIdPipe) id: string) {
    return this.teacherDepartmentPositionService.remove(id);
  }
}
