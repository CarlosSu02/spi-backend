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
import { ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ResponseMessage, Roles } from 'src/common/decorators';
import { EUserRole } from 'src/common/enums';
import { ValidateIdPipe } from 'src/common/pipes';
import { CreateCourseDto, UpdateCourseDto } from '../dto';
import { CoursesService } from '../services/courses.service';
import { QueryPaginationDto } from 'src/common/dto';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  @Roles(
    EUserRole.ADMIN,
    EUserRole.DIRECCION,
    EUserRole.RRHH,
    EUserRole.COORDINADOR_AREA,
  )
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
  create(
    @Body()
    createCourseDto: CreateCourseDto,
  ) {
    return this.coursesService.create(createCourseDto);
  }

  @Get()
  @Roles(
    EUserRole.ADMIN,
    EUserRole.DIRECCION,
    EUserRole.RRHH,
    EUserRole.COORDINADOR_AREA,
    EUserRole.DOCENTE,
  )
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Listado de asignaturas.')
  @ApiOperation({
    summary: 'Obtener todos las asignatura',
    description: 'Devuelve una lista de todas las asignatura.',
  })
  // @ApiQuery({
  //   name: 'query',
  //   description: 'Parámetros de paginación y filtrado',
  //   type: QueryPaginationDto,
  //   required: true,
  // })
  @ApiQuery({
    name: 'page',
    type: Number,
    description: 'Número de página para la paginación',
    required: false,
  })
  @ApiQuery({
    name: 'size',
    type: Number,
    description: 'Número de elementos por página',
    required: false,
  })
  findAll(@Query() query: QueryPaginationDto) {
    return this.coursesService.findAllWithPagination(query);
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
  findOne(@Param(ValidateIdPipe) id: string) {
    return this.coursesService.findOne(id);
  }

  @Get('code/:code')
  @Roles(
    EUserRole.ADMIN,
    EUserRole.DIRECCION,
    EUserRole.RRHH,
    EUserRole.COORDINADOR_AREA,
    EUserRole.DOCENTE,
  )
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
  findOneByCode(@Param('code') code: string) {
    return this.coursesService.findOneByCode(code);
  }

  @Patch(':id')
  @Roles(
    EUserRole.ADMIN,
    EUserRole.DIRECCION,
    EUserRole.RRHH,
    EUserRole.COORDINADOR_AREA,
  )
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
  update(
    @Param(ValidateIdPipe) id: string,
    @Body()
    updateCourseDto: UpdateCourseDto,
  ) {
    return this.coursesService.update(id, updateCourseDto);
  }

  @Delete(':id')
  @Roles(
    EUserRole.ADMIN,
    EUserRole.DIRECCION,
    EUserRole.RRHH,
    EUserRole.COORDINADOR_AREA,
  )
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
  remove(@Param(ValidateIdPipe) id: string) {
    return this.coursesService.remove(id);
  }
}
