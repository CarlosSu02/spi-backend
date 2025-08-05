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
import { ApiOperation, ApiBody, ApiParam } from '@nestjs/swagger';
import {
  Roles,
  ResponseMessage,
  ApiPagination,
  GetCurrentUserId,
} from 'src/common/decorators';
import { EUserRole } from 'src/common/enums';
import { ValidateIdPipe } from 'src/common/pipes';
import { ComplementaryActivitiesService } from '../services/complementary-activities.service';
import {
  CreateComplementaryActivityDto,
  UpdateComplementaryActivityDto,
} from '../dto';
import { QueryPaginationDto } from 'src/common/dto';

@Controller('complementary-activities')
export class ComplementaryActivitiesController {
  constructor(
    private readonly complementaryActivitiesService: ComplementaryActivitiesService,
  ) {}

  @Post()
  @Roles(
    EUserRole.ADMIN,
    EUserRole.DIRECCION,
    EUserRole.RRHH,
    EUserRole.COORDINADOR_AREA,
    EUserRole.DOCENTE,
  )
  @HttpCode(HttpStatus.CREATED)
  @ResponseMessage('Se ha creado una actividad complmentaria.')
  @ApiOperation({
    summary: 'Crear una actividad complmentaria',
    description: 'Debería crear un nuevo tipo de actividad.',
  })
  @ApiBody({
    type: CreateComplementaryActivityDto,
    description: 'Datos necesarios para crear una actividad complmentaria.',
  })
  create(
    @Body()
    createComplementaryActivityDto: CreateComplementaryActivityDto,
  ) {
    return this.complementaryActivitiesService.create(
      createComplementaryActivityDto,
    );
  }

  @Get()
  @Roles(EUserRole.ADMIN, EUserRole.DIRECCION, EUserRole.RRHH)
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Listado de tipos de actividades.')
  @ApiOperation({
    summary: 'Obtener todos los tipos de actividades',
    description: 'Devuelve una lista de todos los tipos de actividades.',
  })
  @ApiPagination({
    summary: 'Obtener todas las actividades complementarias',
    description: 'Devuelve una lista de todas las actividades complementarias.',
  })
  findAll(@Query() query: QueryPaginationDto) {
    return this.complementaryActivitiesService.findAllWithPagination(query);
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
  @ResponseMessage('La información del tipo de actividad.')
  @ApiOperation({
    summary: 'Obtener una actividad complmentaria por ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del tipo de actividad a obtener',
    type: String,
    format: 'uuid',
  })
  findOne(@Param(ValidateIdPipe) id: string) {
    return this.complementaryActivitiesService.findOne(id);
  }

  @Get('my')
  @Roles(
    EUserRole.ADMIN,
    EUserRole.DIRECCION,
    EUserRole.RRHH,
    EUserRole.COORDINADOR_AREA,
    EUserRole.DOCENTE,
  )
  @HttpCode(HttpStatus.OK)
  @ResponseMessage(
    'Listado de actividades complementarias del usuario autenticado.',
  )
  @ApiPagination({
    summary:
      'Obtener todas las actividades complementarias del usuario autenticado',
    description:
      'Devuelve una lista de todas las actividades complementarias del usuario autenticado.',
  })
  findAllPersonal(
    @GetCurrentUserId() userId: string,
    @Query() query: QueryPaginationDto,
  ) {
    return this.complementaryActivitiesService.findAllByUserIdAndCode(query, {
      userId,
    });
  }

  @Patch(':id')
  @Roles(
    EUserRole.ADMIN,
    EUserRole.DIRECCION,
    EUserRole.RRHH,
    EUserRole.COORDINADOR_AREA,
    EUserRole.DOCENTE,
  )
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Se ha actualizado el tipo de actividad.')
  @ApiOperation({
    summary: 'Actualizar una actividad complmentaria por ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del tipo de actividad a actualizar',
    type: String,
    format: 'uuid',
  })
  update(
    @Param(ValidateIdPipe) id: string,
    @Body()
    updateComplementaryActivityDto: UpdateComplementaryActivityDto,
  ) {
    return this.complementaryActivitiesService.update(
      id,
      updateComplementaryActivityDto,
    );
  }

  @Delete(':id')
  @Roles(
    EUserRole.ADMIN,
    EUserRole.DIRECCION,
    EUserRole.RRHH,
    EUserRole.COORDINADOR_AREA,
    EUserRole.DOCENTE,
  )
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Se ha eliminado una actividad complmentaria.')
  @ApiOperation({
    summary: 'Eliminar una actividad complmentaria por ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del tipo de actividad a eliminar',
    type: String,
    format: 'uuid',
  })
  remove(@Param(ValidateIdPipe) id: string) {
    return this.complementaryActivitiesService.remove(id);
  }
}
