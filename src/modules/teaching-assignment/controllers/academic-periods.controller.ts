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
import { AcademicPeriodsService } from '../services/academic-periods.service';
import { CreateAcademicPeriodDto, UpdateAcademicPeriodDto } from '../dto';
import { Roles } from 'src/common/decorators';
import { EUserRole } from 'src/common/enums';
import { ValidateIdPipe } from 'src/common/pipes';

@Controller('academic-periods')
export class AcademicPeriodsController {
  constructor(
    private readonly academicPeriodsService: AcademicPeriodsService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(
    EUserRole.ADMIN,
    EUserRole.DIRECCION,
    EUserRole.RRHH,
    EUserRole.COORDINADOR_AREA,
  )
  create(@Body() createAssignmentReportDto: CreateAcademicPeriodDto) {
    return this.academicPeriodsService.create(createAssignmentReportDto);
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
    return this.academicPeriodsService.findAll();
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
    return this.academicPeriodsService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @Roles(
    EUserRole.ADMIN,
    EUserRole.DIRECCION,
    EUserRole.RRHH,
    EUserRole.COORDINADOR_AREA,
  )
  update(
    @Param(ValidateIdPipe) id: string,
    @Body() updateAcademicPeriodDto: UpdateAcademicPeriodDto,
  ) {
    return this.academicPeriodsService.update(id, updateAcademicPeriodDto);
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
    return this.academicPeriodsService.remove(id);
  }
}
