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
import { ApiBody } from '@nestjs/swagger';
import { ApiCommonResponses, ResponseMessage } from 'src/common/decorators';
import { Roles } from 'src/common/decorators';
import { EUserRole } from 'src/common/enums';
import { ValidateIdPipe } from 'src/common/pipes';
import { CreateMonitorTypeDto, UpdateMonitorTypeDto } from '../dto';
import { MonitorTypesService } from '../services/monitor-types.service';

@Controller('monitor-types')
@Roles(
  EUserRole.ADMIN,
  EUserRole.DIRECCION,
  EUserRole.RRHH,
  EUserRole.COORDINADOR_AREA,
)
export class MonitorTypesController {
  constructor(private readonly monitorTypesService: MonitorTypesService) { }

  @Post()
  @Roles(EUserRole.ADMIN, EUserRole.DIRECCION, EUserRole.RRHH)
  @HttpCode(HttpStatus.CREATED)
  @ResponseMessage('Tipo de monitor creado exitosamente. Devuelve el tipo de monitor creado.')
  @ApiBody({
    type: CreateMonitorTypeDto,
    description: 'Datos para crear un tipo de monitor',
    required: true,
  })
  @ApiCommonResponses({
    summary: 'Crear tipo de monitor',
    description: 'Crea un nuevo tipo de monitor.',
    createdDescription: 'Tipo de monitor creado correctamente.',
    badRequestDescription: 'Datos inválidos para la creación.',
    internalErrorDescription: 'Error interno al crear el tipo de monitor.',
    notFoundDescription: 'No se encontró el recurso solicitado.'
  })
  create(@Body() createMonitorTypeDto: CreateMonitorTypeDto) {
    return this.monitorTypesService.create(createMonitorTypeDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Lista de tipos de monitor obtenida exitosamente.')
  @ApiCommonResponses({
    summary: 'Listar tipos de monitor',
    description: 'Obtiene todos los tipos de monitor registrados.',
    createdDescription: 'Tipos de monitor obtenidos correctamente.',
    badRequestDescription: 'Solicitud inválida.',
    internalErrorDescription: 'Error interno al obtener los tipos de monitor.',
    notFoundDescription: 'No se encontraron tipos de monitor.'
  })
  findAll() {
    return this.monitorTypesService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Tipo de monitor obtenido exitosamente.')
  @ApiCommonResponses({
    summary: 'Obtener tipo de monitor',
    description: 'Obtiene un tipo de monitor por su ID.',
    createdDescription: 'Tipo de monitor obtenido correctamente.',
    badRequestDescription: 'ID inválido.',
    internalErrorDescription: 'Error interno al obtener el tipo de monitor.',
    notFoundDescription: 'No se encontró el tipo de monitor solicitado.'
  })
  findOne(@Param(ValidateIdPipe) id: string) {
    return this.monitorTypesService.findOne(id);
  }

  @Patch(':id')
  @Roles(EUserRole.ADMIN, EUserRole.DIRECCION, EUserRole.RRHH)
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Tipo de monitor actualizado exitosamente. Devuelve el tipo de monitor actualizado.')
  @ApiBody({
    type: UpdateMonitorTypeDto,
    description: 'Datos para actualizar un tipo de monitor',
    required: true,
  })
  @ApiCommonResponses({
    summary: 'Actualizar tipo de monitor',
    description: 'Actualiza la información de un tipo de monitor existente.',
    createdDescription: 'Tipo de monitor actualizado correctamente.',
    badRequestDescription: 'Datos inválidos para la actualización.',
    internalErrorDescription: 'Error interno al actualizar el tipo de monitor.',
    notFoundDescription: 'No se encontró el tipo de monitor solicitado.'
  })
  update(
    @Param(ValidateIdPipe) id: string,
    @Body() updateMonitorTypeDto: UpdateMonitorTypeDto,
  ) {
    return this.monitorTypesService.update(id, updateMonitorTypeDto);
  }

  @Delete(':id')
  @Roles(EUserRole.ADMIN, EUserRole.DIRECCION, EUserRole.RRHH)
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Tipo de monitor eliminado exitosamente.')
  @ApiCommonResponses({
    summary: 'Eliminar tipo de monitor',
    description: 'Elimina un tipo de monitor por su ID.',
    createdDescription: 'Tipo de monitor eliminado correctamente.',
    badRequestDescription: 'ID inválido.',
    internalErrorDescription: 'Error interno al eliminar el tipo de monitor.',
    notFoundDescription: 'No se encontró el tipo de monitor solicitado.'
  })
  remove(@Param(ValidateIdPipe) id: string) {
    return this.monitorTypesService.remove(id);
  }
}
