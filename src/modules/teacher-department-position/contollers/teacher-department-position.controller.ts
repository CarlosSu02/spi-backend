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
import {
  ApiPagination,
  GetCurrentUserId,
  ResponseMessage,
  Roles,
} from 'src/common/decorators';
import { QueryPaginationDto } from 'src/common/dto';
import { ApiParam } from '@nestjs/swagger';

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
  @ResponseMessage('Listado de docentes con su departamento y cargo.')
  @ApiPagination({
    summary: 'Listar docentes con su departamento y cargo',
    description:
      'Obtiene un listado paginado de docentes con su departamento y cargo',
  })
  findAll(@Query() query: QueryPaginationDto) {
    return this.teacherDepartmentPositionService.findAllWithPagination(query);
  }

  @Get('department/:departmentId')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage(
    'Listado de docentes con su departamento y cargo en un departamento en específico.',
  )
  @ApiParam({
    name: 'departmentId',
    description: 'ID del departamento para filtrar los docentes',
    type: String,
    format: 'uuid',
  })
  @ApiPagination({
    summary:
      'Listar docentes con su departamento y cargo por departamento en específico',
    description:
      'Obtiene un listado paginado de docentes con su departamento y cargo asociados a un departamento específico',
  })
  findAllByDepartmentId(
    @Query() query: QueryPaginationDto,
    @Param(ValidateIdPipe) departmentId: string,
  ) {
    return this.teacherDepartmentPositionService.findAllByDepartmentId(
      query,
      departmentId,
    );
  }

  // para que un coordinador de area pueda ver los docentes de su area o departamento
  // en este caso solo es para el rol COORDINADOR_AREA, y siempre y cuando este autenticado
  // no necesita el departmentId en la url, ya que el coordinador de área solo puede ver los docentes de su departamento
  // solo funcionara si el coordinador inicia sesión y tiene un departamento asignado
  @Get('coordinator')
  @Roles(EUserRole.COORDINADOR_AREA)
  @HttpCode(HttpStatus.OK)
  @ResponseMessage(
    'Listado de docentes con su departamento y cargo en un departamento en específico para coordinadores de área.',
  )
  @ApiPagination({
    summary:
      'Listar docentes con su departamento y cargo por departamento en específico para coordinadores de área (usuarios autenticados con rol COORDINADOR_AREA)',
    description:
      'Obtiene un listado paginado de docentes con su departamento y cargo asociados a un departamento específico para coordinadores de área',
  })
  async findAllByCoordinator(
    @Query() query: QueryPaginationDto,
    @GetCurrentUserId() userId: string,
  ) {
    const user =
      await this.teacherDepartmentPositionService.findOneByUserId(userId);

    return await this.teacherDepartmentPositionService.findAllByDepartmentId(
      query,
      user.department.id,
      user.teacher.id,
    );
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
