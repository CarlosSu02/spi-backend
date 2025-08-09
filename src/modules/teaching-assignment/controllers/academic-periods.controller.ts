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
import { ApiBody } from '@nestjs/swagger';
import { ApiCommonResponses } from 'src/common/decorators/api-response.decorator';
import { AcademicPeriodsService } from '../services/academic-periods.service';
import { CreateAcademicPeriodDto, UpdateAcademicPeriodDto } from '../dto';
import { Roles } from 'src/common/decorators';
import { EUserRole } from 'src/common/enums';
import { ValidateIdPipe } from 'src/common/pipes';

@Controller('academic-periods')
export class AcademicPeriodsController {
  constructor(
    private readonly academicPeriodsService: AcademicPeriodsService,
  ) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(
    EUserRole.ADMIN,
    EUserRole.DIRECCION,
    EUserRole.RRHH,
    EUserRole.COORDINADOR_AREA,
  )
  @ApiBody({
    type: CreateAcademicPeriodDto,
    description: 'Datos para crear periodo académico',
    required: true,
  })
  @ApiCommonResponses({
    summary: 'Crear periodo académico',
    description: 'Crea un nuevo periodo académico en el sistema.',
    createdDescription: 'Periodo académico creado exitosamente.',
    badRequestDescription: 'Datos inválidos para la creación del periodo.',
    internalErrorDescription: 'Error interno al crear el periodo.'
  })
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
  @ApiCommonResponses({
    summary: 'Listar periodos académicos',
    description: 'Obtiene la lista de todos los periodos académicos registrados.',
    okDescription: 'Lista de periodos académicos obtenida correctamente.',
    internalErrorDescription: 'Error interno al obtener los periodos.'
  })
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
  @ApiCommonResponses({
    summary: 'Obtener periodo académico por ID',
    description: 'Obtiene la información de un periodo académico específico por su ID.',
    okDescription: 'Periodo académico obtenido correctamente.',
    internalErrorDescription: 'Error interno al obtener el periodo.',
    notFoundDescription: 'No se encontró el periodo solicitado.'
  })
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
  @ApiBody({
    type: UpdateAcademicPeriodDto,
    description: 'Datos para actualizar periodo académico',
    required: true,
  })
  @ApiCommonResponses({
    summary: 'Actualizar periodo académico',
    description: 'Actualiza la información de un periodo académico existente.',
    internalErrorDescription: 'Error interno al actualizar el periodo.',
    notFoundDescription: 'No se encontró el periodo solicitado.'
  })
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
