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
import { CreateConditionDto, UpdateConditionDto } from '../dto';
import { ConditionsService } from '../services/conditions.service';

@Controller('conditions')
@Roles(
  EUserRole.ADMIN,
  EUserRole.DIRECCION,
  EUserRole.RRHH,
  EUserRole.COORDINADOR_AREA,
)
export class ConditionsController {
  constructor(private readonly conditionService: ConditionsService) { }

  @Post()
  @Roles(EUserRole.ADMIN, EUserRole.DIRECCION, EUserRole.RRHH)
  @HttpCode(HttpStatus.CREATED)
  @ResponseMessage('Condición creada exitosamente. Devuelve la condición creada.')
  @ApiBody({
    type: CreateConditionDto,
    description: 'Datos para crear una condición',
    required: true,
  })
  @ApiCommonResponses({
    summary: 'Crear condición',
    description: 'Crea una nueva condición.',
    createdDescription: 'Condición creada correctamente.',
    badRequestDescription: 'Datos inválidos para la creación.',
    internalErrorDescription: 'Error interno al crear la condición.',
    notFoundDescription: 'No se encontró el recurso solicitado.'
  })
  create(@Body() createConditionDto: CreateConditionDto) {
    return this.conditionService.create(createConditionDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Lista de condiciones obtenida exitosamente.')
  @ApiCommonResponses({
    summary: 'Listar condiciones',
    description: 'Obtiene todas las condiciones registradas.',
    createdDescription: 'Condiciones obtenidas correctamente.',
    badRequestDescription: 'Solicitud inválida.',
    internalErrorDescription: 'Error interno al obtener las condiciones.',
    notFoundDescription: 'No se encontraron condiciones.'
  })
  findAll() {
    return this.conditionService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Condición obtenida exitosamente.')
  @ApiCommonResponses({
    summary: 'Obtener condición',
    description: 'Obtiene una condición por su ID.',
    createdDescription: 'Condición obtenida correctamente.',
    badRequestDescription: 'ID inválido.',
    internalErrorDescription: 'Error interno al obtener la condición.',
    notFoundDescription: 'No se encontró la condición solicitada.'
  })
  findOne(@Param(ValidateIdPipe) id: string) {
    return this.conditionService.findOne(id);
  }

  @Patch(':id')
  @Roles(EUserRole.ADMIN, EUserRole.DIRECCION, EUserRole.RRHH)
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Condición actualizada exitosamente. Devuelve la condición actualizada.')
  @ApiBody({
    type: UpdateConditionDto,
    description: 'Datos para actualizar una condición',
    required: true,
  })
  @ApiCommonResponses({
    summary: 'Actualizar condición',
    description: 'Actualiza la información de una condición existente.',
    createdDescription: 'Condición actualizada correctamente.',
    badRequestDescription: 'Datos inválidos para la actualización.',
    internalErrorDescription: 'Error interno al actualizar la condición.',
    notFoundDescription: 'No se encontró la condición solicitada.'
  })
  update(
    @Param(ValidateIdPipe) id: string,
    @Body() updateConditionDto: UpdateConditionDto,
  ) {
    return this.conditionService.update(id, updateConditionDto);
  }

  @Delete(':id')
  @Roles(EUserRole.ADMIN, EUserRole.DIRECCION, EUserRole.RRHH)
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Condición eliminada exitosamente.')
  @ApiCommonResponses({
    summary: 'Eliminar condición',
    description: 'Elimina una condición por su ID.',
    createdDescription: 'Condición eliminada correctamente.',
    badRequestDescription: 'ID inválido.',
    internalErrorDescription: 'Error interno al eliminar la condición.',
    notFoundDescription: 'No se encontró la condición solicitada.'
  })
  remove(@Param(ValidateIdPipe) id: string) {
    return this.conditionService.remove(id);
  }
}
