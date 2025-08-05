import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ActivityTypesService } from '../services/activity-types.service';
import { ApiBody, ApiOperation, ApiParam } from '@nestjs/swagger';
import { Roles, ResponseMessage } from 'src/common/decorators';
import { EUserRole } from 'src/common/enums';
import { ValidateIdPipe } from 'src/common/pipes';
import { CreateActivityTypeDto, UpdateActivityTypeDto } from '../dto';

@Controller('activity-types')
export class ActivityTypesController {
  constructor(private readonly activityTypesService: ActivityTypesService) {}

  @Post()
  @Roles(EUserRole.ADMIN, EUserRole.DIRECCION, EUserRole.RRHH)
  @HttpCode(HttpStatus.CREATED)
  @ResponseMessage('Se ha creado un tipo de actividad.')
  @ApiOperation({
    summary: 'Crear un tipo de actividad',
    description: 'Debería crear un nuevo tipo de actividad.',
  })
  @ApiBody({
    type: CreateActivityTypeDto,
    description: 'Datos necesarios para crear un tipo de actividad.',
  })
  create(
    @Body()
    createActivityTypeDto: CreateActivityTypeDto,
  ) {
    return this.activityTypesService.create(createActivityTypeDto);
  }

  @Get()
  @Roles(EUserRole.ADMIN, EUserRole.DIRECCION, EUserRole.RRHH)
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Listado de tipos de actividades.')
  @ApiOperation({
    summary: 'Obtener todos los tipos de actividades',
    description: 'Devuelve una lista de todos los tipos de actividades.',
  })
  findAll() {
    return this.activityTypesService.findAll();
  }

  @Get(':id')
  @Roles(
    EUserRole.ADMIN,
    EUserRole.DIRECCION,
    EUserRole.RRHH,
    EUserRole.COORDINADOR_AREA,
    EUserRole.DOCENTE,
  )
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('La información del tipo de actividad.')
  @ApiOperation({
    summary: 'Obtener un tipo de actividad por ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del tipo de actividad a obtener',
    type: String,
    format: 'uuid',
  })
  findOne(@Param(ValidateIdPipe) id: string) {
    return this.activityTypesService.findOne(id);
  }

  @Patch(':id')
  @Roles(EUserRole.ADMIN, EUserRole.DIRECCION, EUserRole.RRHH)
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Se ha actualizado el tipo de actividad.')
  @ApiOperation({
    summary: 'Actualizar un tipo de actividad por ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del tipo de actividad a actualizar',
    type: String,
    format: 'uuid',
  })
  update(
    @Param(ValidateIdPipe) id: string,
    @Body()
    updateActivityTypeDto: UpdateActivityTypeDto,
  ) {
    return this.activityTypesService.update(id, updateActivityTypeDto);
  }

  @Delete(':id')
  @Roles(EUserRole.ADMIN, EUserRole.DIRECCION, EUserRole.RRHH)
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Se ha eliminado un tipo de actividad.')
  @ApiOperation({
    summary: 'Eliminar un tipo de actividad por ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del tipo de actividad a eliminar',
    type: String,
    format: 'uuid',
  })
  remove(@Param(ValidateIdPipe) id: string) {
    return this.activityTypesService.remove(id);
  }
}
