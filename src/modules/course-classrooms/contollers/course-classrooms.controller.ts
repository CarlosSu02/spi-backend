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
import { CreateCourseClassroomDto, UpdateCourseClassroomDto } from '../dto';
import { CourseClassroomsService } from '../services/course-classrooms.service';
import { ResponseMessage, Roles } from 'src/common/decorators';
import { EUserRole } from 'src/common/enums';
import { ValidateIdPipe } from 'src/common/pipes';
import { ApiOperation, ApiParam } from '@nestjs/swagger';

@Controller('course-classrooms')
export class CourseClassroomsController {
  constructor(
    private readonly courseClassroomsService: CourseClassroomsService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ResponseMessage('Se ha creado una sección de asignatura.')
  @ApiOperation({
    summary: 'Crear una sección de asignatura',
    description: 'Debería crear una nueva sección de asignatura.',
  })
  // @ApiBody({
  //   type: CreateCourseClassroomDto,
  //   description:
  //     'Datos necesarios para crear una sección de asignatura.',
  // })
  @Roles(
    EUserRole.ADMIN,
    EUserRole.DIRECCION,
    EUserRole.RRHH,
    EUserRole.COORDINADOR_AREA,
  )
  create(
    @Body()
    createCourseClassroomDto: CreateCourseClassroomDto,
  ) {
    return this.courseClassroomsService.create(createCourseClassroomDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Listado de secciones de asignatura.')
  @ApiOperation({
    summary: 'Obtener todos las secciones de asignatura',
    description: 'Devuelve una lista de todas las secciones de asignatura.',
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
  @ResponseMessage('La información de la sección de asignatura.')
  @ApiOperation({
    summary: 'Obtener una sección de asignatura por ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la sección de asignatura a obtener',
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
  @ResponseMessage('Se ha actualizado la sección de asignatura.')
  @ApiOperation({
    summary: 'Actualizar una sección de asignatura por ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la sección de asignatura a actualizar',
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
    updateCourseClassroomDto: UpdateCourseClassroomDto,
  ) {
    return this.courseClassroomsService.update(id, updateCourseClassroomDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Se ha eliminado una sección de asignatura.')
  @ApiOperation({
    summary: 'Eliminar una sección de asignatura por ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la sección de asignatura a eliminar',
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
