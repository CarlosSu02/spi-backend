import {
  Controller,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  HttpCode,
  HttpStatus,
  Get,
} from '@nestjs/common';
import { CreateDepartmentDto } from '../dto/create-department.dto';
import { UpdateDepartmentDto } from '../dto/update-department.dto';
import { DepartmentsService } from '../services/departments.service';
import { Roles } from 'src/common/decorators';
import { EUserRole } from 'src/common/enums';
import { ValidateIdPipe } from 'src/common/pipes';
import { ApiParam } from '@nestjs/swagger';
import { ApiOperation, ApiBody, ApiProperty } from '@nestjs/swagger';
import { ApiCommonResponses, ResponseMessage } from 'src/common/decorators';

@Controller('departments')
@Roles(EUserRole.ADMIN, EUserRole.DIRECCION, EUserRole.RRHH)
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ResponseMessage('Se ha creado un departamento.')
  @ApiOperation({
    summary: 'Crear un departamento',
    description: 'Debería crear un nuevo departamento.',
  })
  @ApiBody({
    type: CreateDepartmentDto,
    description: 'Datos necesarios para crear un departamento.',
  })
  @ApiCommonResponses({
    summary: 'Crear un departamento',
    createdDescription: 'Departamento creado exitosamente.',
    badRequestDescription: 'Datos inválidos para crear el departamento.',
    internalErrorDescription: 'Error interno al crear el departamento.',
  })
  create(@Body() createDepartmentDto: CreateDepartmentDto) {
    return this.departmentsService.create(createDepartmentDto);
  }

  @Get()
  @Roles(EUserRole.COORDINADOR_AREA)
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Listado de departamentos.')
  @ApiOperation({
    summary: 'Obtener todos los departamentos',
    description: 'Devuelve una lista de todos los departamentos.',
  })
  @ApiCommonResponses({ summary: 'Obtener todos los departamentos', okDescription: 'Listado de departamentos.' })
  findAll() {
    return this.departmentsService.findAll();
  }

  @Get(':id')
  @Roles(EUserRole.COORDINADOR_AREA)
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Información del departamento.')
  @ApiOperation({
    summary: 'Obtener un departamento por ID',
    description: 'Devuelve la información de un departamento específico.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del departamento a buscar',
    type: String,
    format: 'uuid',
  })
  @ApiCommonResponses({ summary: 'Obtener un departamento por ID', okDescription: 'Información del departamento.' })
  findOne(@Param(ValidateIdPipe) id: string) {
    return this.departmentsService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Se ha actualizado el departamento.')
  @ApiOperation({
    summary: 'Actualizar un departamento por ID',
    description: 'Actualiza la información de un departamento específico.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del departamento a actualizar',
    type: String,
    format: 'uuid',
  })
  @ApiCommonResponses({ summary: 'Actualizar un departamento por ID', okDescription: 'Se ha actualizado el departamento.' })
  update(
    @Param(ValidateIdPipe) id: string,
    @Body() updateDepartmentDto: UpdateDepartmentDto,
  ) {
    return this.departmentsService.update(id, updateDepartmentDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Se ha eliminado el departamento.')
  @ApiOperation({
    summary: 'Eliminar un departamento por ID',
    description: 'Elimina un departamento específico.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del departamento a eliminar',
    type: String,
    format: 'uuid',
  })
  @ApiCommonResponses({ summary: 'Eliminar un departamento por ID', okDescription: 'Se ha eliminado el departamento.' })
  remove(@Param(ValidateIdPipe) id: string) {
    return this.departmentsService.remove(id);
  }
}
