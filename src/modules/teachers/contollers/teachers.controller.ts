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
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { TeachersService } from '../services/teachers.service';
import { CreateTeacherDto } from '../dto/create-teacher.dto';
import { UpdateTeacherDto } from '../dto/update-teacher.dto';
import { ResponseMessage, Roles } from 'src/common/decorators';
import { EUserRole } from 'src/common/enums';
import { ExtractIdInterceptor } from 'src/common/interceptors';
import { ValidateIdPipe } from 'src/common/pipes';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';
import { QueryPaginationDto } from 'src/common/dto';

@Controller('teachers')
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  @Post()
  @Roles(EUserRole.ADMIN, EUserRole.COORDINADOR_AREA, EUserRole.RRHH)
  @HttpCode(HttpStatus.CREATED)
  @ResponseMessage('Se ha creado un perfil de docente.')
  create(@Body() createTeacherDto: CreateTeacherDto) {
    return this.teachersService.create(createTeacherDto);
  }

  @Post('my')
  @HttpCode(HttpStatus.CREATED)
  @ResponseMessage('Se ha creado un perfil de docente.')
  @UseInterceptors(ExtractIdInterceptor)
  createMyTeacherProfile(@Body() createTeacherDto: CreateTeacherDto) {
    createTeacherDto.userId = createTeacherDto.currentUserId!; // no es una ruta publica por lo que siempre existira el currentUserId
    return this.teachersService.create(createTeacherDto);
  }

  @Get()
  @Roles(
    EUserRole.ADMIN,
    EUserRole.COORDINADOR_AREA,
    EUserRole.RRHH,
    EUserRole.DIRECCION,
  )
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Listado de docentes.')
  @ApiOperation({
    summary: 'Obtener todos los docentes',
    description: 'Devuelve una lista de todos los docentes.',
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
    return this.teachersService.findAllWithPagination(query);
  }

  @Get(':id')
  @Roles(
    EUserRole.ADMIN,
    EUserRole.COORDINADOR_AREA,
    EUserRole.RRHH,
    EUserRole.DIRECCION,
  )
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Se ha encontrado el docente.')
  findOne(@Param(ValidateIdPipe) id: string) {
    return this.teachersService.findOne(id);
  }

  @Get('teacher/:id')
  @Roles(
    EUserRole.ADMIN,
    EUserRole.COORDINADOR_AREA,
    EUserRole.RRHH,
    EUserRole.DIRECCION,
  )
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Se ha encontrado el docente por ID de usuario.')
  findTeacherByUserId(@Param(ValidateIdPipe) id: string) {
    return this.teachersService.findOneByUserId(id);
  }

  @Patch(':id')
  @Roles(EUserRole.ADMIN, EUserRole.COORDINADOR_AREA, EUserRole.RRHH)
  @HttpCode(HttpStatus.OK)
  update(
    @Param(ValidateIdPipe) id: string,
    @Body() updateTeacherDto: UpdateTeacherDto,
  ) {
    return this.teachersService.update(id, updateTeacherDto);
  }

  // Cambiar el active status del usuario a false, esto para no eliminar el registro
  @Delete(':id')
  @Roles(EUserRole.ADMIN, EUserRole.COORDINADOR_AREA, EUserRole.RRHH)
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Se ha eliminado el docente.')
  remove(@Param(ValidateIdPipe) id: string) {
    return this.teachersService.remove(id);
  }
}
