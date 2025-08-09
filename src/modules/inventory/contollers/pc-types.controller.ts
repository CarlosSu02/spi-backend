import { ApiBody, ApiProperty } from '@nestjs/swagger';
import { ApiCommonResponses, ResponseMessage } from 'src/common/decorators';
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
import { Roles } from 'src/common/decorators';
import { EUserRole } from 'src/common/enums';
import { ValidateIdPipe } from 'src/common/pipes';
import { PcTypesService } from '../services/pc-types.service';
import { CreatePcTypeDto, UpdatePcTypeDto } from '../dto';

@Controller('pc-types')
@Roles(
  EUserRole.ADMIN,
  EUserRole.DIRECCION,
  EUserRole.RRHH,
  EUserRole.COORDINADOR_AREA,
)
export class PcTypesController {
  constructor(private readonly pcTypesService: PcTypesService) { }

  @Post()
  @Roles(EUserRole.ADMIN, EUserRole.DIRECCION, EUserRole.RRHH)
  @HttpCode(HttpStatus.CREATED)
  @ResponseMessage('Tipo de PC creado exitosamente. Devuelve el tipo de PC creado.')
  @ApiBody({ type: CreatePcTypeDto, description: 'Datos para crear un tipo de PC', required: true })
  @ApiCommonResponses({
    summary: 'Crear tipo de PC',
    description: 'Crea un nuevo tipo de PC en el sistema.',
    createdDescription: 'Tipo de PC creado exitosamente.',
    badRequestDescription: 'Datos inválidos para la creación del tipo de PC.',
    internalErrorDescription: 'Error interno al crear el tipo de PC.',
    notFoundDescription: 'No se encontró el recurso solicitado.'
  })
  create(@Body() createPcTypeDto: CreatePcTypeDto) {
    return this.pcTypesService.create(createPcTypeDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Listado de tipos de PC obtenidos correctamente.')
  @ApiCommonResponses({
    summary: 'Obtener todos los tipos de PC',
    okDescription: 'Listado de tipos de PC obtenido correctamente.',
    badRequestDescription: 'Solicitud inválida al obtener los tipos de PC.',
    internalErrorDescription: 'Error interno al obtener los tipos de PC.',
    notFoundDescription: 'No se encontraron tipos de PC.',
  })
  findAll() {
    return this.pcTypesService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Tipo de PC obtenido correctamente.')
  @ApiCommonResponses({
    summary: 'Obtener tipo de PC por ID',
    okDescription: 'Tipo de PC obtenido correctamente.',
    badRequestDescription: 'ID inválido para obtener el tipo de PC.',
    internalErrorDescription: 'Error interno al obtener el tipo de PC.',
    notFoundDescription: 'No se encontró el tipo de PC solicitado.',
  })
  findOne(@Param(ValidateIdPipe) id: string) {
    return this.pcTypesService.findOne(id);
  }

  @Patch(':id')
  @Roles(EUserRole.ADMIN, EUserRole.DIRECCION, EUserRole.RRHH)
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Tipo de PC actualizado exitosamente. Devuelve el tipo de PC actualizado.')
  @ApiBody({ type: UpdatePcTypeDto, description: 'Datos para actualizar un tipo de PC', required: true })
  @ApiCommonResponses({
    summary: 'Actualizar tipo de PC',
    description: 'Actualiza la información de un tipo de PC existente.',
    createdDescription: 'Tipo de PC actualizado correctamente.',
    badRequestDescription: 'Datos inválidos para la actualización.',
    internalErrorDescription: 'Error interno al actualizar el tipo de PC.',
    notFoundDescription: 'No se encontró el tipo de PC solicitado.'
  })
  update(
    @Param(ValidateIdPipe) id: string,
    @Body() updatePcTypeDto: UpdatePcTypeDto,
  ) {
    return this.pcTypesService.update(id, updatePcTypeDto);
  }

  @Delete(':id')
  @Roles(EUserRole.ADMIN, EUserRole.DIRECCION, EUserRole.RRHH)
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Tipo de PC eliminado correctamente.')
  @ApiCommonResponses({
    summary: 'Eliminar tipo de PC por ID',
    okDescription: 'Tipo de PC eliminado correctamente.',
    badRequestDescription: 'ID inválido para eliminar el tipo de PC.',
    internalErrorDescription: 'Error interno al eliminar el tipo de PC.',
    notFoundDescription: 'No se encontró el tipo de PC a eliminar.',
  })
  remove(@Param(ValidateIdPipe) id: string) {
    return this.pcTypesService.remove(id);
  }
}
