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
  UploadedFile,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { AcademicAssignmentReportsService } from '../services/academic-assignment-reports.service';
import {
  AcademicAssignmentDto,
  CreateAcademicAssignmentReportDto,
  propertiesAcademicAssignment,
  TAcademicAssignment,
  UpdateAcademicAssignmentReportDto,
} from '../dto';
import {
  ApiPagination,
  GetCurrentUserId,
  ResponseMessage,
  Roles,
} from 'src/common/decorators';
import { EUserRole } from 'src/common/enums';
import { ValidateIdPipe } from 'src/common/pipes';
import { ApiBody, ApiConsumes, ApiOperation, ApiParam } from '@nestjs/swagger';
import { ExcelFilesService } from 'src/modules/excel-files/services/excel-files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { QueryPaginationDto } from 'src/common/dto';
import { ApiCommonResponses } from 'src/common/decorators/api-response.decorator';

@Controller('academic-assignment-reports')
export class AssignmentReportsController {
  constructor(
    private readonly academicAssignmentReportsService: AcademicAssignmentReportsService,
    private readonly excelFilesService: ExcelFilesService<
      TAcademicAssignment,
      AcademicAssignmentDto
    >,
  ) { }

  @Post()
  @Roles(
    EUserRole.ADMIN,
    EUserRole.DIRECCION,
    EUserRole.RRHH,
    EUserRole.COORDINADOR_AREA,
  )
  @HttpCode(HttpStatus.CREATED)
  @ResponseMessage('Se ha creado un informe de asignación académica.')
  @ApiBody({
    type: CreateAcademicAssignmentReportDto,
    description: 'Datos necesarios para crear un informe de asignación académica.',
    required: true,
  })
  @ApiCommonResponses({
    summary: 'Crear informe de asignación académica',
    description: 'Crea un nuevo informe de asignación académica en el sistema.',
    createdDescription: 'Informe de asignación académica creado exitosamente.',
    badRequestDescription: 'Datos inválidos para la creación del informe.',
    internalErrorDescription: 'Error interno al crear el informe.'
  })
  create(
    @Body()
    createAcademicAssignmentReportDto: CreateAcademicAssignmentReportDto,
  ) {
    return this.academicAssignmentReportsService.create(
      createAcademicAssignmentReportDto,
    );
  }

  @Get()
  @Roles(
    EUserRole.ADMIN,
    EUserRole.DIRECCION,
    EUserRole.RRHH,
    EUserRole.COORDINADOR_AREA,
    EUserRole.DOCENTE,
  )
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Listado de informes de asignación académica.')
  @ApiPagination({
    summary: 'Obtener todos los informes de asignación académica',
    description:
      'Devuelve una lista de todos los informes de asignación académica.',
  })
  findAll(@Query() query: QueryPaginationDto) {
    return this.academicAssignmentReportsService.findAllWithPagination(query);
  }

  @Get('user/:id')
  @Roles(
    EUserRole.ADMIN,
    EUserRole.DIRECCION,
    EUserRole.RRHH,
    EUserRole.COORDINADOR_AREA,
    EUserRole.DOCENTE,
  )
  @HttpCode(HttpStatus.OK)
  @ResponseMessage(
    'Listado de informes de asignación académica de un usuario por ID.',
  )
  @ApiParam({
    name: 'id',
    description:
      'ID del usuario para obtener sus informes de asignación académica, este es el userId.',
    type: String,
    format: 'uuid',
  })
  @ApiPagination({
    summary:
      'Obtener todos los informes de asignación académica de un usuario por ID',
    description:
      'Devuelve una lista de todos los informes de asignación académica de un usuario específico.',
  })
  findAllByUserId(
    @Param(ValidateIdPipe) userId: string,
    @Query() query: QueryPaginationDto,
  ) {
    return this.academicAssignmentReportsService.findAllByUserIdAndCode(query, {
      userId,
    });
  }

  @Get('user/code/:code')
  @Roles(
    EUserRole.ADMIN,
    EUserRole.DIRECCION,
    EUserRole.RRHH,
    EUserRole.COORDINADOR_AREA,
    EUserRole.DOCENTE,
  )
  @HttpCode(HttpStatus.OK)
  @ResponseMessage(
    'Listado de informes de asignación académica de un usuario por ID.',
  )
  @ApiParam({
    name: 'code',
    description:
      'Código del usuario para obtener sus informes de asignación académica.',
    type: String,
    format: 'string',
  })
  @ApiPagination({
    summary:
      'Obtener todos los informes de asignación académica de un usuario por código',
    description:
      'Devuelve una lista de todos los informes de asignación académica de un usuario específico.',
  })
  findAllByCode(
    @Param('code') code: string,
    @Query() query: QueryPaginationDto,
  ) {
    return this.academicAssignmentReportsService.findAllByUserIdAndCode(query, {
      code,
    });
  }

  @Get('my')
  @Roles(
    EUserRole.ADMIN,
    EUserRole.DIRECCION,
    EUserRole.RRHH,
    EUserRole.COORDINADOR_AREA,
    EUserRole.DOCENTE,
  )
  @HttpCode(HttpStatus.OK)
  @ResponseMessage(
    'Listado de informes de asignación académica del usuario autenticado.',
  )
  @ApiPagination({
    summary:
      'Obtener todos los informes de asignación académica del usuario autenticado',
    description:
      'Devuelve una lista de todos los informes de asignación académica del usuario autenticado.',
  })
  findAllPersonal(
    @GetCurrentUserId() userId: string,
    @Query() query: QueryPaginationDto,
  ) {
    return this.academicAssignmentReportsService.findAllByUserIdAndCode(query, {
      userId,
    });
  }

  @Get('department/:departmentId')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage(
    'Listado de asignaciones académicas por el ID de un departamento.',
  )
  @ApiParam({
    name: 'departmentId',
    description: 'ID del departamento para filtrar las asignaciones académicas',
    type: String,
    format: 'uuid',
  })
  @ApiPagination({
    summary:
      'Listar las asignaciones académicas por departamento en específico',
    description:
      'Obtiene un listado paginado de asignaciones académicas asociadas a un departamento específico',
  })
  findAllByDepartmentId(
    @Query() query: QueryPaginationDto,
    @Param(ValidateIdPipe) departmentId: string,
  ) {
    return this.academicAssignmentReportsService.findAllByDepartmentId(
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
    'Listado de asignaciones académicas por departamento para coordinadores de área.',
  )
  @ApiPagination({
    summary:
      'Listar asignaciones académicas por departamento para coordinadores de área (usuarios autenticados con rol COORDINADOR_AREA)',
    description:
      'Obtiene un listado paginado de asignaciones académicas por departamento para coordinadores de área.',
  })
  findAllByCoordinator(
    @Query() query: QueryPaginationDto,
    @GetCurrentUserId() userId: string,
  ) {
    return this.academicAssignmentReportsService.findAllByCoordinator(
      query,
      userId,
    );
  }

  @Get(':id')
  @Roles(
    EUserRole.ADMIN,
    EUserRole.DIRECCION,
    EUserRole.RRHH,
    EUserRole.COORDINADOR_AREA,
    EUserRole.DOCENTE,
  )
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('La información del informe de asignación académica.')
  @ApiOperation({
    summary: 'Obtener un informe de asignación académica por ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del informe de asignación académica',
    type: String,
    format: 'uuid',
  })
  findOne(@Param(ValidateIdPipe) id: string) {
    return this.academicAssignmentReportsService.findOne(id);
  }

  @Patch(':id')
  @Roles(
    EUserRole.ADMIN,
    EUserRole.DIRECCION,
    EUserRole.RRHH,
    EUserRole.COORDINADOR_AREA,
  )
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Se ha actualizado un informe de asignación académica.')
  @ApiOperation({
    summary: 'Actualizar un informe de asignación académica por ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del informe de asignación académica a actualizar',
    type: String,
    format: 'uuid',
  })
  update(
    @Param(ValidateIdPipe) id: string,
    @Body()
    updateAcademicAssignmentReportDto: UpdateAcademicAssignmentReportDto,
  ) {
    return this.academicAssignmentReportsService.update(
      id,
      updateAcademicAssignmentReportDto,
    );
  }

  @Delete(':id')
  @Roles(
    EUserRole.ADMIN,
    EUserRole.DIRECCION,
    EUserRole.RRHH,
    EUserRole.COORDINADOR_AREA,
  )
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Se ha eliminado un informe de asignación académica.')
  @ApiOperation({
    summary: 'Eliminar un informe de asignación académica por ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del informe de asignación académica a eliminar',
    type: String,
    format: 'uuid',
  })
  remove(@Param(ValidateIdPipe) id: string) {
    return this.academicAssignmentReportsService.remove(id);
  }

  @Delete('/period/:id')
  @Roles(
    EUserRole.ADMIN,
    EUserRole.DIRECCION,
    EUserRole.RRHH,
    EUserRole.COORDINADOR_AREA,
  )
  @HttpCode(HttpStatus.OK)
  @ResponseMessage(
    'Se ha eliminado los informes de asignación académica para un periodo.',
  )
  @ApiOperation({
    summary: 'Eliminar todos los informes de asignación académica por periodo',
  })
  @ApiParam({
    name: 'id',
    description:
      'ID del periodo para eliminar informes de asignación académica',
    type: String,
    format: 'uuid',
  })
  removeAll(@Param(ValidateIdPipe) id: string) {
    return this.academicAssignmentReportsService.removeAll(id);
  }

  // Archivo Excel
  @Post('file')
  @Roles(
    EUserRole.ADMIN,
    EUserRole.DIRECCION,
    EUserRole.RRHH,
    EUserRole.COORDINADOR_AREA,
  )
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(HttpStatus.CREATED)
  @ResponseMessage('Se han creado los informes de asignación académica.')
  @ApiOperation({
    summary: 'Crea múltiples informes de asignación académica desde un archivo',
    description:
      'Debería crear múltiples informes de asignación académica a partir de un archivo Excel.',
  })
  @ApiBody({
    required: true,
    description: 'Archivo Excel con los datos de los informes de asignación.',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiConsumes('multipart/form-data')
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const handledFile = this.excelFilesService.handleFileUpload(file);

    const data = await this.excelFilesService.processFile(
      propertiesAcademicAssignment,
      handledFile.buffer,
    );

    return this.academicAssignmentReportsService.createFromExcel(data);
  }
}
