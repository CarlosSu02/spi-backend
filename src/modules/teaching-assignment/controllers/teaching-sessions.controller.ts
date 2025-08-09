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
import { TeachingSessionsService } from '../services/teaching-sessions.service';
import { CreateTeachingSessionDto, UpdateTeachingSessionDto } from '../dto';
import { Roles } from 'src/common/decorators';
import { EUserRole } from 'src/common/enums';
import { ValidateIdPipe } from 'src/common/pipes';

@Controller('teaching-sessions')
export class TeachingSessionsController {
  constructor(
    private readonly teachingSessionsService: TeachingSessionsService,
  ) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(
    EUserRole.ADMIN,
    EUserRole.DIRECCION,
    EUserRole.RRHH,
    EUserRole.COORDINADOR_AREA,
  )
  @ApiBody({
    type: CreateTeachingSessionDto,
    description: 'Datos para crear sesión de enseñanza',
    required: true,
  })
  @ApiCommonResponses({
    summary: 'Crear sesión de enseñanza',
    description: 'Crea una nueva sesión de enseñanza en el sistema.',
    createdDescription: 'Sesión de enseñanza creada exitosamente.',
    badRequestDescription: 'Datos inválidos para la creación de la sesión.',
    internalErrorDescription: 'Error interno al crear la sesión.'
  })
  create(@Body() createAssignmentReportDto: CreateTeachingSessionDto) {
    return this.teachingSessionsService.create(createAssignmentReportDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @Roles(
    EUserRole.ADMIN,
    EUserRole.DIRECCION,
    EUserRole.RRHH,
    EUserRole.COORDINADOR_AREA,
    EUserRole.DOCENTE,
  )
  @ApiCommonResponses({
    summary: 'Listar sesiones de enseñanza',
    description: 'Obtiene la lista de todas las sesiones de enseñanza registradas.',
    okDescription: 'Lista de sesiones de enseñanza obtenida correctamente.',
    internalErrorDescription: 'Error interno al obtener las sesiones.'
  })
  findAll() {
    return this.teachingSessionsService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @Roles(
    EUserRole.ADMIN,
    EUserRole.DIRECCION,
    EUserRole.RRHH,
    EUserRole.COORDINADOR_AREA,
    EUserRole.DOCENTE,
  )
  @ApiCommonResponses({
    summary: 'Obtener sesión de enseñanza por ID',
    description: 'Obtiene la información de una sesión de enseñanza específica por su ID.',
    okDescription: 'Sesión de enseñanza obtenida correctamente.',
    internalErrorDescription: 'Error interno al obtener la sesión.',
    notFoundDescription: 'No se encontró la sesión solicitada.'
  })
  findOne(@Param(ValidateIdPipe) id: string) {
    return this.teachingSessionsService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @Roles(
    EUserRole.ADMIN,
    EUserRole.DIRECCION,
    EUserRole.RRHH,
    EUserRole.COORDINADOR_AREA,
    EUserRole.DOCENTE,
  )
  @ApiBody({
    type: UpdateTeachingSessionDto,
    description: 'Datos para actualizar sesión de enseñanza',
    required: true,
  })
  @ApiCommonResponses({
    summary: 'Actualizar sesión de enseñanza',
    description: 'Actualiza la información de una sesión de enseñanza existente.',
    internalErrorDescription: 'Error interno al actualizar la sesión.',
    notFoundDescription: 'No se encontró la sesión solicitada.'
  })
  update(
    @Param(ValidateIdPipe) id: string,
    @Body() updateTeachingSessionDto: UpdateTeachingSessionDto,
  ) {
    return this.teachingSessionsService.update(id, updateTeachingSessionDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @Roles(
    EUserRole.ADMIN,
    EUserRole.DIRECCION,
    EUserRole.RRHH,
    EUserRole.COORDINADOR_AREA,
  )
  @ApiCommonResponses({
    summary: 'Eliminar sesión de enseñanza',
    description: 'Elimina una sesión de enseñanza del sistema por su ID.',
    internalErrorDescription: 'Error interno al eliminar la sesión.',
    notFoundDescription: 'No se encontró la sesión solicitada.'
  })
  remove(@Param(ValidateIdPipe) id: string) {
    return this.teachingSessionsService.remove(id);
  }
}
