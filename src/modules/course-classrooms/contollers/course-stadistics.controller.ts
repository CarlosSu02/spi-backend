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
import { Roles, ResponseMessage } from 'src/common/decorators';
import { EUserRole } from 'src/common/enums';
import { ValidateIdPipe } from 'src/common/pipes';
import { CreateCourseStadisticDto, UpdateCourseStadisticDto } from '../dto';
import { CourseStadisticsService } from '../services/course-stadistics.service';

@Controller('course-stadistics')
@Roles(
  EUserRole.ADMIN,
  EUserRole.DIRECCION,
  EUserRole.RRHH,
  EUserRole.COORDINADOR_AREA,
  EUserRole.DOCENTE,
)
export class CourseStadisticsController {
  constructor(
    private readonly courseStadisticsService: CourseStadisticsService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ResponseMessage('Se ha creado una nueva estadística de asignatura.')
  @ApiOperation({
    summary: 'Crear una estadística de asignatura',
    description: 'Debería crear una nueva estadística de asignatura.',
  })
  @ApiBody({
    type: CreateCourseStadisticDto,
    description: 'Datos necesarios para crear una estadística de asignatura.',
  })
  @ApiCommonResponses({
    summary: 'Crear una estadística de asignatura',
    createdDescription: 'Se ha creado una nueva estadística de asignatura.',
  })
  create(
    @Body()
    createCourseStadisticDto: CreateCourseStadisticDto,
  ) {
    return this.courseStadisticsService.create(createCourseStadisticDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Listado de estadísticas de asignatura.')
  @ApiOperation({
    summary: 'Obtener todas las estadísticas de asignatura',
    description: 'Devuelve una lista de todas las estadísticas de asignatura.',
  })
  @ApiCommonResponses({
    summary: 'Obtener todas las estadísticas de asignatura',
    okDescription: 'Listado de estadísticas de asignatura.',
  })
  findAll() {
    return this.courseStadisticsService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('La información de la estadística de asignatura.')
  @ApiOperation({
    summary: 'Obtener una estadística de asignatura por ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la estadística de asignatura a obtener',
    type: String,
    format: 'uuid',
  })
  findOne(@Param(ValidateIdPipe) id: string) {
    return this.courseStadisticsService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Se ha actualizado la estadística de asignatura.')
  @ApiOperation({
    summary: 'Actualizar una estadística de asignatura por ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la estadística de asignatura a actualizar',
    type: String,
    format: 'uuid',
  })
  update(
    @Param(ValidateIdPipe) id: string,
    @Body()
    updateCourseStadisticDto: UpdateCourseStadisticDto,
  ) {
    return this.courseStadisticsService.update(id, updateCourseStadisticDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Se ha eliminado una estadística de asignatura.')
  @ApiOperation({
    summary: 'Eliminar una estadística de asignatura por ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la sección de la estadística de asignatura a eliminar',
    type: String,
    format: 'uuid',
  })
  remove(@Param(ValidateIdPipe) id: string) {
    return this.courseStadisticsService.remove(id);
  }
}
