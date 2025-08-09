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
import { CreateMonitorSizeDto, UpdateMonitorSizeDto } from '../dto';
import { MonitorSizesService } from '../services/monitor-sizes.service';

@Controller('monitor-sizes')
@Roles(
  EUserRole.ADMIN,
  EUserRole.DIRECCION,
  EUserRole.RRHH,
  EUserRole.COORDINADOR_AREA,
)
export class MonitorSizesController {
  constructor(private readonly monitorSizesService: MonitorSizesService) { }

  @Post()
  @Roles(EUserRole.ADMIN, EUserRole.DIRECCION, EUserRole.RRHH)
  @HttpCode(HttpStatus.CREATED)
  @ResponseMessage('Tamaño de monitor creado exitosamente. Devuelve el tamaño de monitor creado.')
  @ApiBody({
    type: CreateMonitorSizeDto,
    description: 'Datos para crear un tamaño de monitor',
    required: true,
  })
  @ApiCommonResponses({
    summary: 'Crear tamaño de monitor',
    description: 'Crea un nuevo tamaño de monitor.',
    createdDescription: 'Tamaño de monitor creado correctamente.',
    badRequestDescription: 'Datos inválidos para la creación.',
    internalErrorDescription: 'Error interno al crear el tamaño de monitor.',
    notFoundDescription: 'No se encontró el recurso solicitado.'
  })
  create(@Body() createMonitorSizeDto: CreateMonitorSizeDto) {
    return this.monitorSizesService.create(createMonitorSizeDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Lista de tamaños de monitor obtenida exitosamente.')
  @ApiCommonResponses({
    summary: 'Listar tamaños de monitor',
    description: 'Obtiene todos los tamaños de monitor registrados.',
    createdDescription: 'Tamaños de monitor obtenidos correctamente.',
    badRequestDescription: 'Solicitud inválida.',
    internalErrorDescription: 'Error interno al obtener los tamaños de monitor.',
    notFoundDescription: 'No se encontraron tamaños de monitor.'
  })
  findAll() {
    return this.monitorSizesService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Tamaño de monitor obtenido exitosamente.')
  @ApiCommonResponses({
    summary: 'Obtener tamaño de monitor',
    description: 'Obtiene un tamaño de monitor por su ID.',
    createdDescription: 'Tamaño de monitor obtenido correctamente.',
    badRequestDescription: 'ID inválido.',
    internalErrorDescription: 'Error interno al obtener el tamaño de monitor.',
    notFoundDescription: 'No se encontró el tamaño de monitor solicitado.'
  })
  findOne(@Param(ValidateIdPipe) id: string) {
    return this.monitorSizesService.findOne(id);
  }

  @Patch(':id')
  @Roles(EUserRole.ADMIN, EUserRole.DIRECCION, EUserRole.RRHH)
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Tamaño de monitor actualizado exitosamente. Devuelve el tamaño de monitor actualizado.')
  @ApiBody({
    type: UpdateMonitorSizeDto,
    description: 'Datos para actualizar un tamaño de monitor',
    required: true,
  })
  @ApiCommonResponses({
    summary: 'Actualizar tamaño de monitor',
    description: 'Actualiza la información de un tamaño de monitor existente.',
    createdDescription: 'Tamaño de monitor actualizado correctamente.',
    badRequestDescription: 'Datos inválidos para la actualización.',
    internalErrorDescription: 'Error interno al actualizar el tamaño de monitor.',
    notFoundDescription: 'No se encontró el tamaño de monitor solicitado.'
  })
  update(
    @Param(ValidateIdPipe) id: string,
    @Body() updateMonitorSizeDto: UpdateMonitorSizeDto,
  ) {
    return this.monitorSizesService.update(id, updateMonitorSizeDto);
  }

  @Delete(':id')
  @Roles(EUserRole.ADMIN, EUserRole.DIRECCION, EUserRole.RRHH)
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Tamaño de monitor eliminado exitosamente.')
  @ApiCommonResponses({
    summary: 'Eliminar tamaño de monitor',
    description: 'Elimina un tamaño de monitor por su ID.',
    createdDescription: 'Tamaño de monitor eliminado correctamente.',
    badRequestDescription: 'ID inválido.',
    internalErrorDescription: 'Error interno al eliminar el tamaño de monitor.',
    notFoundDescription: 'No se encontró el tamaño de monitor solicitado.'
  })
  remove(@Param(ValidateIdPipe) id: string) {
    return this.monitorSizesService.remove(id);
  }
}
