import { ApiCommonResponses, ResponseMessage } from 'src/common/decorators';
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
import { CreatePositionDto } from '../dto/create-position.dto';
import { UpdatePositionDto } from '../dto/update-position.dto';
import { PositionsService } from '../services/positions.service';
import { Roles } from 'src/common/decorators';
import { EUserRole } from 'src/common/enums';
import { ValidateIdPipe } from 'src/common/pipes';
import { ApiBody } from '@nestjs/swagger';

@Controller('positions')
@Roles(EUserRole.ADMIN, EUserRole.DIRECCION, EUserRole.RRHH)
export class PositionsController {
  constructor(private readonly positionsService: PositionsService) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ResponseMessage('Cargo creado exitosamente. Devuelve el cargo creado.')
  @ApiBody({ type: CreatePositionDto, description: 'Datos para crear un cargo', required: true })
  @ApiCommonResponses({
    summary: 'Crear cargo',
    description: 'Crea un nuevo cargo en el sistema.',
    createdDescription: 'Cargo creado exitosamente.',
    badRequestDescription: 'Datos inválidos para la creación del cargo.',
    internalErrorDescription: 'Error interno al crear el cargo.',
    notFoundDescription: 'No se encontró el recurso solicitado.'
  })
  create(@Body() createPositionDto: CreatePositionDto) {
    return this.positionsService.create(createPositionDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.positionsService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param(ValidateIdPipe) id: string) {
    return this.positionsService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Cargo actualizado exitosamente. Devuelve el cargo actualizado.')
  @ApiBody({ type: UpdatePositionDto, description: 'Datos para actualizar un cargo', required: true })
  @ApiCommonResponses({
    summary: 'Actualizar cargo',
    description: 'Actualiza la información de un cargo existente.',
    createdDescription: 'Cargo actualizado correctamente.',
    badRequestDescription: 'Datos inválidos para la actualización.',
    internalErrorDescription: 'Error interno al actualizar el cargo.',
    notFoundDescription: 'No se encontró el cargo solicitado.'
  })
  update(
    @Param(ValidateIdPipe) id: string,
    @Body() updatePositionDto: UpdatePositionDto,
  ) {
    return this.positionsService.update(id, updatePositionDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param(ValidateIdPipe) id: string) {
    return this.positionsService.remove(id);
  }
}
