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
} from '@nestjs/common';
import { TeachersService } from '../services/teachers.service';
import { CreateTeacherDto } from '../dto/create-teacher.dto';
import { UpdateTeacherDto } from '../dto/update-teacher.dto';
import { Roles } from 'src/common/decorators';
import { EUserRole } from 'src/common/enums';
import { ExtractIdInterceptor } from 'src/common/interceptors';
import { ValidateIdPipe } from 'src/common/pipes';

@Controller('teachers')
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  @Post()
  @Roles(EUserRole.ADMIN, EUserRole.COORDINADOR_AREA, EUserRole.RRHH)
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createTeacherDto: CreateTeacherDto) {
    return this.teachersService.create(createTeacherDto);
  }

  @Post('my')
  @HttpCode(HttpStatus.CREATED)
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
  findAll() {
    return this.teachersService.findAll();
  }

  @Get(':id')
  @Roles(
    EUserRole.ADMIN,
    EUserRole.COORDINADOR_AREA,
    EUserRole.RRHH,
    EUserRole.DIRECCION,
  )
  @HttpCode(HttpStatus.OK)
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
  remove(@Param(ValidateIdPipe) id: string) {
    return this.teachersService.remove(id);
  }
}
