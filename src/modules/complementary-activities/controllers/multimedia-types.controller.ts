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
import { ApiOperation, ApiBody, ApiParam } from '@nestjs/swagger';
import { Roles, ResponseMessage } from 'src/common/decorators';
import { EUserRole } from 'src/common/enums';
import { ValidateIdPipe } from 'src/common/pipes';
import { UpdateMultimediaTypeDto } from '../dto/update-multimedia-type.dto';
import { MultimediaTypesService } from '../services/multimedia-types.service';
import { CreateMultimediaTypeDto } from '../dto';

@Controller('multimedia-types')
export class MultimediaTypesController {
  constructor(
    private readonly multimediaTypesService: MultimediaTypesService,
  ) {}

  @Post()
  @Roles(EUserRole.ADMIN, EUserRole.DIRECCION, EUserRole.RRHH)
  @HttpCode(HttpStatus.CREATED)
  @ResponseMessage('Se ha creado un tipo de multimedia.')
  @ApiOperation({
    summary: 'Crear un tipo de multimedia',
    description: 'Debería crear un nuevo tipo de multimedia.',
  })
  @ApiBody({
    type: CreateMultimediaTypeDto,
    description: 'Datos necesarios para crear un tipo de multimedia.',
  })
  create(
    @Body()
    createMultimediaTypeDto: CreateMultimediaTypeDto,
  ) {
    return this.multimediaTypesService.create(createMultimediaTypeDto);
  }

  @Get()
  @Roles(EUserRole.ADMIN, EUserRole.DIRECCION, EUserRole.RRHH)
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Listado de tipos de multimediaes.')
  @ApiOperation({
    summary: 'Obtener todos los tipos de multimediaes',
    description: 'Devuelve una lista de todos los tipos de multimediaes.',
  })
  findAll() {
    return this.multimediaTypesService.findAll();
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
  @ResponseMessage('La información del tipo de multimedia.')
  @ApiOperation({
    summary: 'Obtener un tipo de multimedia por ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del tipo de multimedia a obtener',
    type: String,
    format: 'uuid',
  })
  findOne(@Param(ValidateIdPipe) id: string) {
    return this.multimediaTypesService.findOne(id);
  }

  @Patch(':id')
  @Roles(EUserRole.ADMIN, EUserRole.DIRECCION, EUserRole.RRHH)
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Se ha actualizado el tipo de multimedia.')
  @ApiOperation({
    summary: 'Actualizar un tipo de multimedia por ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del tipo de multimedia a actualizar',
    type: String,
    format: 'uuid',
  })
  update(
    @Param(ValidateIdPipe) id: string,
    @Body()
    updateMultimediaTypeDto: UpdateMultimediaTypeDto,
  ) {
    return this.multimediaTypesService.update(id, updateMultimediaTypeDto);
  }

  @Delete(':id')
  @Roles(EUserRole.ADMIN, EUserRole.DIRECCION, EUserRole.RRHH)
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Se ha eliminado un tipo de multimedia.')
  @ApiOperation({
    summary: 'Eliminar un tipo de multimedia por ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del tipo de multimedia a eliminar',
    type: String,
    format: 'uuid',
  })
  remove(@Param(ValidateIdPipe) id: string) {
    return this.multimediaTypesService.remove(id);
  }
}
