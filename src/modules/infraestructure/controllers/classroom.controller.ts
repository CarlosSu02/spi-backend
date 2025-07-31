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
import { UpdateClassroomDto } from '../dto/update-classroom.dto';
import { ResponseMessage, Roles } from 'src/common/decorators';
import { EUserRole } from 'src/common/enums';
import { ValidateIdPipe } from 'src/common/pipes';
import { ClassroomService } from '../services/classroom.service';
import { CreateClassroomDto } from '../dto/create-classroom.dto';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';
import { QueryPaginationDto } from 'src/common/dto';

@Controller('classrooms')
@Roles(
  EUserRole.ADMIN,
  EUserRole.DIRECCION,
  EUserRole.RRHH,
  EUserRole.COORDINADOR_AREA,
)
export class ClassroomController {
  constructor(private readonly classroomService: ClassroomService) {}

  @Post()
  @Roles(EUserRole.ADMIN, EUserRole.DIRECCION, EUserRole.RRHH)
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createClassroomDto: CreateClassroomDto) {
    return this.classroomService.create(createClassroomDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Listado de aulas.')
  @ApiOperation({
    summary: 'Obtener todas las aulas',
    description: 'Devuelve una lista de todas las aulas.',
  })
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
    return this.classroomService.findAllWithPagination(query);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Se ha encontrado el aula.')
  findOne(@Param(ValidateIdPipe) id: string) {
    return this.classroomService.findOne(id);
  }

  @Patch(':id')
  @Roles(EUserRole.ADMIN, EUserRole.DIRECCION, EUserRole.RRHH)
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Se ha actualizado el aula.')
  update(
    @Param(ValidateIdPipe) id: string,
    @Body() updateClassroomDto: UpdateClassroomDto,
  ) {
    return this.classroomService.update(id, updateClassroomDto);
  }

  @Delete(':id')
  @Roles(EUserRole.ADMIN, EUserRole.DIRECCION, EUserRole.RRHH)
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Se ha eliminado el aula.')
  remove(@Param(ValidateIdPipe) id: string) {
    return this.classroomService.remove(id);
  }
}
