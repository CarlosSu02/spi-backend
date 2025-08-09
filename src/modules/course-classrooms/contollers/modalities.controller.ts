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
import { ApiOperation, ApiParam } from '@nestjs/swagger';
import { ApiBody, ApiProperty } from '@nestjs/swagger';
import { ApiCommonResponses } from 'src/common/decorators/api-response.decorator';
import { ResponseMessage, Roles } from 'src/common/decorators';
import { EUserRole } from 'src/common/enums';
import { ValidateIdPipe } from 'src/common/pipes';
import { CreateModalityDto, UpdateModalityDto } from '../dto';
import { ModalitiesService } from '../services/modalities.service';

@Controller('modalities')
export class ModalitiesController {
  constructor(private readonly modalitiesService: ModalitiesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ResponseMessage('Se ha creado una modalidad de curso.')
  @ApiOperation({
    summary: 'Crear una modalidad de curso',
    description: 'Debería crear una nueva modalidad de curso.',
  })
  @ApiBody({
    type: CreateModalityDto,
    description: 'Datos necesarios para crear una modalidad de curso.',
  })
  @ApiCommonResponses({
    summary: 'Crear una modalidad de curso',
    createdDescription: 'Se ha creado una modalidad de curso.',
  })
  @Roles(
    EUserRole.ADMIN,
    EUserRole.DIRECCION,
    EUserRole.RRHH,
    EUserRole.COORDINADOR_AREA,
  )
  create(
    @Body()
    createModalityDto: CreateModalityDto,
  ) {
    return this.modalitiesService.create(createModalityDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Listado de modalidades de curso.')
  @ApiOperation({
    summary: 'Obtener todas las modalidades de curso',
    description: 'Devuelve una lista de todas las modalidades de curso.',
  })
  @ApiCommonResponses({
    summary: 'Obtener todas las modalidades de curso',
    okDescription: 'Listado de modalidades de curso.',
  })
  @Roles(
    EUserRole.ADMIN,
    EUserRole.DIRECCION,
    EUserRole.RRHH,
    EUserRole.COORDINADOR_AREA,
    EUserRole.DOCENTE,
  )
  findAll() {
    return this.modalitiesService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('La información de la modalidad de curso.')
  @ApiOperation({
    summary: 'Obtener una modalidad de curso por ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la modalidad de curso a obtener',
    type: String,
    format: 'uuid',
  })
  @Roles(
    EUserRole.ADMIN,
    EUserRole.DIRECCION,
    EUserRole.RRHH,
    EUserRole.COORDINADOR_AREA,
    EUserRole.DOCENTE,
  )
  findOne(@Param(ValidateIdPipe) id: string) {
    return this.modalitiesService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Se ha actualizado la modalidad de curso.')
  @ApiOperation({
    summary: 'Actualizar una modalidad de curso por ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la modalidad de curso a actualizar',
    type: String,
    format: 'uuid',
  })
  @Roles(
    EUserRole.ADMIN,
    EUserRole.DIRECCION,
    EUserRole.RRHH,
    EUserRole.COORDINADOR_AREA,
  )
  update(
    @Param(ValidateIdPipe) id: string,
    @Body()
    updateModalityDto: UpdateModalityDto,
  ) {
    return this.modalitiesService.update(id, updateModalityDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Se ha eliminado una modalidad de curso.')
  @ApiOperation({
    summary: 'Eliminar una modalidad de curso por ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la modalidad de curso a eliminar',
    type: String,
    format: 'uuid',
  })
  @Roles(
    EUserRole.ADMIN,
    EUserRole.DIRECCION,
    EUserRole.RRHH,
    EUserRole.COORDINADOR_AREA,
  )
  remove(@Param(ValidateIdPipe) id: string) {
    return this.modalitiesService.remove(id);
  }
}
