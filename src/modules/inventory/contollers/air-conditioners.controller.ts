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
import { AirConditionersService } from '../services/air-conditioners.service';
import { CreateAirConditionerDto, UpdateAirConditionerDto } from '../dto';

@Controller('air-conditioners')
@Roles(
  EUserRole.ADMIN,
  EUserRole.DIRECCION,
  EUserRole.RRHH,
  EUserRole.COORDINADOR_AREA,
)
export class AirConditionersController {
  constructor(
    private readonly airConditionersService: AirConditionersService,
  ) { }

  @Post()
  @Roles(EUserRole.ADMIN, EUserRole.DIRECCION, EUserRole.RRHH)
  @HttpCode(HttpStatus.CREATED)
  @ResponseMessage('Aire acondicionado creado exitosamente. Devuelve el aire acondicionado creado.')
  @ApiBody({
    type: CreateAirConditionerDto,
    description: 'Datos para crear un aire acondicionado',
    required: true,
  })
  @ApiCommonResponses({
    summary: 'Crear aire acondicionado',
    description: 'Crea un nuevo registro de aire acondicionado.',
    createdDescription: 'Aire acondicionado creado correctamente.',
    badRequestDescription: 'Datos inválidos para la creación.',
    internalErrorDescription: 'Error interno al crear el aire acondicionado.',
    notFoundDescription: 'No se encontró el recurso solicitado.'
  })
  create(@Body() createAirConditionerDto: CreateAirConditionerDto) {
    return this.airConditionersService.create(createAirConditionerDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Lista de aires acondicionados obtenida exitosamente.')
  @ApiCommonResponses({
    summary: 'Listar aires acondicionados',
    description: 'Obtiene todos los registros de aires acondicionados.',
    createdDescription: 'Registros obtenidos correctamente.',
    badRequestDescription: 'Solicitud inválida.',
    internalErrorDescription: 'Error interno al obtener los registros.',
    notFoundDescription: 'No se encontraron registros.'
  })
  findAll() {
    return this.airConditionersService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Aire acondicionado obtenido exitosamente.')
  @ApiCommonResponses({
    summary: 'Obtener aire acondicionado',
    description: 'Obtiene un aire acondicionado por su ID.',
    createdDescription: 'Aire acondicionado obtenido correctamente.',
    badRequestDescription: 'ID inválido.',
    internalErrorDescription: 'Error interno al obtener el aire acondicionado.',
    notFoundDescription: 'No se encontró el aire acondicionado solicitado.'
  })
  findOne(@Param(ValidateIdPipe) id: string) {
    return this.airConditionersService.findOne(id);
  }

  @Patch(':id')
  @Roles(EUserRole.ADMIN, EUserRole.DIRECCION, EUserRole.RRHH)
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Aire acondicionado actualizado exitosamente. Devuelve el aire acondicionado actualizado.')
  @ApiBody({
    type: UpdateAirConditionerDto,
    description: 'Datos para actualizar un aire acondicionado',
    required: true,
  })
  @ApiCommonResponses({
    summary: 'Actualizar aire acondicionado',
    description: 'Actualiza la información de un aire acondicionado existente.',
    createdDescription: 'Aire acondicionado actualizado correctamente.',
    badRequestDescription: 'Datos inválidos para la actualización.',
    internalErrorDescription: 'Error interno al actualizar el aire acondicionado.',
    notFoundDescription: 'No se encontró el aire acondicionado solicitado.'
  })
  update(
    @Param(ValidateIdPipe) id: string,
    @Body() updateAirConditionerDto: UpdateAirConditionerDto,
  ) {
    return this.airConditionersService.update(id, updateAirConditionerDto);
  }

  @Delete(':id')
  @Roles(EUserRole.ADMIN, EUserRole.DIRECCION, EUserRole.RRHH)
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Aire acondicionado eliminado exitosamente.')
  @ApiCommonResponses({
    summary: 'Eliminar aire acondicionado',
    description: 'Elimina un aire acondicionado por su ID.',
    createdDescription: 'Aire acondicionado eliminado correctamente.',
    badRequestDescription: 'ID inválido.',
    internalErrorDescription: 'Error interno al eliminar el aire acondicionado.',
    notFoundDescription: 'No se encontró el aire acondicionado solicitado.'
  })
  remove(@Param(ValidateIdPipe) id: string) {
    return this.airConditionersService.remove(id);
  }
}
