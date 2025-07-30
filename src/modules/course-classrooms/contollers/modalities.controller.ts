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
import { ResponseMessage, Roles } from 'src/common/decorators';
import { EUserRole } from 'src/common/enums';
import { ValidateIdPipe } from 'src/common/pipes';
import { CreateModalityDto, UpdateModalityDto } from '../dto';
import { ModalitiesService } from '../services/modalities.service';

@Controller('modalities')
export class ModalitiesController {
  constructor(private readonly courseClassroomsService: ModalitiesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ResponseMessage('Se ha creado una modalidad de curso.')
  @ApiOperation({
    summary: 'Crear una modalidad de curso',
    description: 'Debería crear una nueva modalidad de curso.',
  })
  // @ApiBody({
  //   type: CreateModalityDto,
  //   description:
  //     'Datos necesarios para crear una modalidad de curso.',
  // })
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
    return this.courseClassroomsService.create(createModalityDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Listado de modalidades de curso.')
  @ApiOperation({
    summary: 'Obtener todos las modalidades de curso',
    description: 'Devuelve una lista de todas las modalidades de curso.',
  })
  @Roles(
    EUserRole.ADMIN,
    EUserRole.DIRECCION,
    EUserRole.RRHH,
    EUserRole.COORDINADOR_AREA,
    EUserRole.DOCENTE,
  )
  findAll() {
    return this.courseClassroomsService.findAll();
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
    return this.courseClassroomsService.findOne(id);
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
    return this.courseClassroomsService.update(id, updateModalityDto);
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
    return this.courseClassroomsService.remove(id);
  }
}
