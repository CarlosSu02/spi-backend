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
import { CreateCourseDto, UpdateCourseDto } from '../dto';
import { CoursesService } from '../services/courses.service';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ResponseMessage('Se ha creado una asignatura.')
  @ApiOperation({
    summary: 'Crear una asignatura',
    description: 'Debería crear una nueva asignatura.',
  })
  // @ApiBody({
  //   type: CreateCourseDto,
  //   description:
  //     'Datos necesarios para crear una asignatura.',
  // })
  @Roles(
    EUserRole.ADMIN,
    EUserRole.DIRECCION,
    EUserRole.RRHH,
    EUserRole.COORDINADOR_AREA,
  )
  create(
    @Body()
    createCourseDto: CreateCourseDto,
  ) {
    return this.coursesService.create(createCourseDto);
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
    return this.coursesService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('La información de la asignatura.')
  @ApiOperation({
    summary: 'Obtener una asignatura por ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la asignatura a obtener',
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
    return this.coursesService.findOne(id);
  }

  @Get('code/:code')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('La información de la asignatura.')
  @ApiOperation({
    summary: 'Obtener una asignatura por código',
  })
  // @ApiParam({
  //   name: 'Code',
  //   description: 'Código de la asignatura a obtener',
  //   type: String,
  // })
  @Roles(
    EUserRole.ADMIN,
    EUserRole.DIRECCION,
    EUserRole.RRHH,
    EUserRole.COORDINADOR_AREA,
    EUserRole.DOCENTE,
  )
  findOneByCode(@Param('code') code: string) {
    return this.coursesService.findOneByCode(code);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Se ha actualizado la asignatura.')
  @ApiOperation({
    summary: 'Actualizar una asignatura por ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la asignatura a actualizar',
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
    updateCourseDto: UpdateCourseDto,
  ) {
    return this.coursesService.update(id, updateCourseDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Se ha eliminado una asignatura.')
  @ApiOperation({
    summary: 'Eliminar una asignatura por ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la asignatura a eliminar',
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
    return this.coursesService.remove(id);
  }
}
