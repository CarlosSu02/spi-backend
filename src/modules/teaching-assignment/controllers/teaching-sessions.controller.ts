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
import { TeachingSessionsService } from '../services/teaching-sessions.service';
import { CreateTeachingSessionDto, UpdateTeachingSessionDto } from '../dto';
import { Roles } from 'src/common/decorators';
import { EUserRole } from 'src/common/enums';
import { ValidateIdPipe } from 'src/common/pipes';

@Controller('teaching-sessions')
export class TeachingSessionsController {
  constructor(
    private readonly teachingSessionsService: TeachingSessionsService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(
    EUserRole.ADMIN,
    EUserRole.DIRECCION,
    EUserRole.RRHH,
    EUserRole.COORDINADOR_AREA,
  )
  create(@Body() createAssignmentReportDto: CreateTeachingSessionDto) {
    return this.teachingSessionsService.create(createAssignmentReportDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @Roles(
    EUserRole.ADMIN,
    EUserRole.DIRECCION,
    EUserRole.RRHH,
    EUserRole.COORDINADOR_AREA,
    EUserRole.DOCENTE,
  )
  findAll() {
    return this.teachingSessionsService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @Roles(
    EUserRole.ADMIN,
    EUserRole.DIRECCION,
    EUserRole.RRHH,
    EUserRole.COORDINADOR_AREA,
    EUserRole.DOCENTE,
  )
  findOne(@Param(ValidateIdPipe) id: string) {
    return this.teachingSessionsService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @Roles(
    EUserRole.ADMIN,
    EUserRole.DIRECCION,
    EUserRole.RRHH,
    EUserRole.COORDINADOR_AREA,
    EUserRole.DOCENTE,
  )
  update(
    @Param(ValidateIdPipe) id: string,
    @Body() updateTeachingSessionDto: UpdateTeachingSessionDto,
  ) {
    return this.teachingSessionsService.update(id, updateTeachingSessionDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @Roles(
    EUserRole.ADMIN,
    EUserRole.DIRECCION,
    EUserRole.RRHH,
    EUserRole.COORDINADOR_AREA,
  )
  remove(@Param(ValidateIdPipe) id: string) {
    return this.teachingSessionsService.remove(id);
  }
}
