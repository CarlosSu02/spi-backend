import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CreateDepartmentDto } from '../dto/create-department.dto';
import { UpdateDepartmentDto } from '../dto/update-department.dto';
import { DepartmentsService } from '../services/departments.service';
import { Roles } from 'src/common/decorators';
import { EUserRole } from 'src/common/enums';
import { ValidateIdPipe } from 'src/common/pipes';
import { ApiParam } from '@nestjs/swagger';

@Controller('departments')
@Roles(EUserRole.ADMIN, EUserRole.DIRECCION, EUserRole.RRHH)
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createDepartmentDto: CreateDepartmentDto) {
    return this.departmentsService.create(createDepartmentDto);
  }

  @Get()
  @Roles(EUserRole.COORDINADOR_AREA)
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.departmentsService.findAll();
  }

  @Get(':id')
  @Roles(EUserRole.COORDINADOR_AREA)
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    description: 'ID del departamento a buscar',
    type: String,
    format: 'uuid',
  })
  findOne(@Param(ValidateIdPipe) id: string) {
    return this.departmentsService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param(ValidateIdPipe) id: string,
    @Body() updateDepartmentDto: UpdateDepartmentDto,
  ) {
    return this.departmentsService.update(id, updateDepartmentDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param(ValidateIdPipe) id: string) {
    return this.departmentsService.remove(id);
  }
}
