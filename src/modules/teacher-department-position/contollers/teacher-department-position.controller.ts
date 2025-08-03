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
  Query,
} from '@nestjs/common';
import { CreateTeacherDepartmentPositionDto } from '../dto/create-teacher-department-position.dto';
import { UpdateTeacherDepartmentPositionDto } from '../dto/update-teacher-department-position.dto';
import { TeacherDepartmentPositionService } from '../services/teacher-department-position.service';
import { ValidateIdPipe } from 'src/common/pipes';
import { EUserRole } from 'src/common/enums';
import { ApiPagination, ResponseMessage, Roles } from 'src/common/decorators';
import { QueryPaginationDto } from 'src/common/dto';

@Controller('teacher-department-position')
@Roles(
  EUserRole.ADMIN,
  EUserRole.COORDINADOR_AREA,
  EUserRole.RRHH,
  EUserRole.DIRECCION,
)
export class TeacherDepartmentPositionController {
  constructor(
    private readonly teacherDepartmentPositionService: TeacherDepartmentPositionService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body()
    createTeacherDepartmentPositionDto: CreateTeacherDepartmentPositionDto,
  ) {
    return this.teacherDepartmentPositionService.create(
      createTeacherDepartmentPositionDto,
    );
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Listado de docentes con su departamento y cargo')
  @ApiPagination({
    summary: 'Listar docentes con su departamento y cargo',
    description:
      'Obtiene un listado paginado de docentes con su departamento y cargo',
  })
  findAll(@Query() query: QueryPaginationDto) {
    return this.teacherDepartmentPositionService.findAllWithPagination(query);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param(ValidateIdPipe) id: string) {
    return this.teacherDepartmentPositionService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param(ValidateIdPipe) id: string,
    @Body()
    updateTeacherDepartmentPositionDto: UpdateTeacherDepartmentPositionDto,
  ) {
    return this.teacherDepartmentPositionService.update(
      id,
      updateTeacherDepartmentPositionDto,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param(ValidateIdPipe) id: string) {
    return this.teacherDepartmentPositionService.remove(id);
  }
}
