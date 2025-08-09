import { ApiBody } from '@nestjs/swagger';
import { ApiCommonResponses } from 'src/common/decorators';
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
  Query,
} from '@nestjs/common';
import { ApiPagination, ResponseMessage, Roles } from 'src/common/decorators';
import { EUserRole } from 'src/common/enums';
import { ValidateIdPipe } from 'src/common/pipes';
import { PcEquipmentsService } from '../services/pc-equipments.service';
import { CreatePcEquipmentDto, UpdatePcEquipmentDto } from '../dto';
import { QueryPaginationDto } from 'src/common/dto';

@Controller('pc-equipments')
@Roles(
  EUserRole.ADMIN,
  EUserRole.DIRECCION,
  EUserRole.RRHH,
  EUserRole.COORDINADOR_AREA,
)
export class PcEquipmentsController {
  constructor(private readonly pcEquipmentsService: PcEquipmentsService) { }

  @Post()
  @Roles(EUserRole.ADMIN, EUserRole.DIRECCION, EUserRole.RRHH)
  @HttpCode(HttpStatus.CREATED)
  @ResponseMessage('Equipo de computo creado exitosamente. Devuelve el equipo creado.')
  @ApiBody({ type: CreatePcEquipmentDto, description: 'Datos para crear un equipo de computo', required: true })
  @ApiCommonResponses({
    summary: 'Crear equipo de computo',
    description: 'Crea un nuevo equipo de computo en el sistema.',
    createdDescription: 'Equipo de computo creado exitosamente.',
    badRequestDescription: 'Datos inválidos para la creación del equipo de computo.',
    internalErrorDescription: 'Error interno al crear el equipo de computo.',
    notFoundDescription: 'No se encontró el recurso solicitado.'
  })
  create(@Body() createPcEquipmentDto: CreatePcEquipmentDto) {
    return this.pcEquipmentsService.create(createPcEquipmentDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Listado de equipos de computo obtenidos correctamente.')
  @ApiCommonResponses({
    summary: 'Obtener todos los equipos de computo',
    okDescription: 'Listado de equipos de computo obtenido correctamente.',
    badRequestDescription: 'Solicitud inválida al obtener los equipos de computo.',
    internalErrorDescription: 'Error interno al obtener los equipos de computo.',
    notFoundDescription: 'No se encontraron equipos de computo.',
  })
  @ApiPagination({
    summary: 'Obtener todos los equipos de computo',
    description: 'Devuelve una lista de todos los equipos de computo.',
  })
  findAll(@Query() query: QueryPaginationDto) {
    return this.pcEquipmentsService.findAllWithPagination(query);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Equipo de computo obtenido correctamente.')
  @ApiCommonResponses({
    summary: 'Obtener equipo de computo por ID',
    okDescription: 'Equipo de computo obtenido correctamente.',
    badRequestDescription: 'ID inválido para obtener el equipo de computo.',
    internalErrorDescription: 'Error interno al obtener el equipo de computo.',
    notFoundDescription: 'No se encontró el equipo de computo solicitado.',
  })
  findOne(@Param(ValidateIdPipe) id: string) {
    return this.pcEquipmentsService.findOne(id);
  }

  @Patch(':id')
  @Roles(EUserRole.ADMIN, EUserRole.DIRECCION, EUserRole.RRHH)
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Equipo de computo actualizado exitosamente. Devuelve el equipo actualizado.')
  @ApiBody({ type: UpdatePcEquipmentDto, description: 'Datos para actualizar un equipo de computo', required: true })
  @ApiCommonResponses({
    summary: 'Actualizar equipo de computo',
    description: 'Actualiza la información de un equipo de computo existente.',
    createdDescription: 'Equipo de computo actualizado correctamente.',
    badRequestDescription: 'Datos inválidos para la actualización.',
    internalErrorDescription: 'Error interno al actualizar el equipo de computo.',
    notFoundDescription: 'No se encontró el equipo de computo solicitado.'
  })
  update(
    @Param(ValidateIdPipe) id: string,
    @Body() updatePcEquipmentDto: UpdatePcEquipmentDto,
  ) {
    return this.pcEquipmentsService.update(id, updatePcEquipmentDto);
  }

  @Delete(':id')
  @Roles(EUserRole.ADMIN, EUserRole.DIRECCION, EUserRole.RRHH)
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Equipo de computo eliminado correctamente.')
  @ApiCommonResponses({
    summary: 'Eliminar equipo de computo por ID',
    okDescription: 'Equipo de computo eliminado correctamente.',
    badRequestDescription: 'ID inválido para eliminar el equipo de computo.',
    internalErrorDescription: 'Error interno al eliminar el equipo de computo.',
    notFoundDescription: 'No se encontró el equipo de computo a eliminar.',
  })
  remove(@Param(ValidateIdPipe) id: string) {
    return this.pcEquipmentsService.remove(id);
  }
}
