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
  ) {}

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
    description:
      'Datos necesarios para crear un informe de asignación académica.',
    required: true,
  })
  @ApiCommonResponses({
    summary: 'Crear informe de asignación académica',
    createdDescription: 'Informe de asignación académica creado exitosamente.',
    badRequestDescription: 'Datos inválidos para la creación del informe.',
    internalErrorDescription: 'Error interno al crear el informe.',
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
  @ApiCommonResponses({
    summary: 'Obtener todos los informes de asignación académica',
    okDescription:
      'Listado de informes de asignación académica obtenido correctamente.',
    badRequestDescription: 'Solicitud inválida al obtener los informes.',
    internalErrorDescription: 'Error interno al obtener los informes.',
    notFoundDescription: 'No se encontraron informes de asignación académica.',
  })
  findAll(@Query() query: QueryPaginationDto) {
    return this.academicAssignmentReportsService.findAllWithPagination(query);
  }

  @Get('periods')
  @Roles(
    EUserRole.ADMIN,
    EUserRole.DIRECCION,
    EUserRole.RRHH,
    EUserRole.COORDINADOR_AREA,
    EUserRole.DOCENTE,
  )
  @HttpCode(HttpStatus.OK)
  @ResponseMessage(
    'Listado de solamente el periodo donde el usuario autenticado tiene informes.',
  )
  @ApiCommonResponses({
    summary:
      'Obtener todos los informes de asignación académica del usuario autenticado',
    okDescription:
      'Listado de periodos donde el usuario autenticado tiene informes de asignación académica obtenido correctamente.',
    badRequestDescription: 'Solicitud inválida al obtener los informes.',
    internalErrorDescription: 'Error interno al obtener los informes.',
    notFoundDescription: 'No se encontraron informes de asignación académica.',
  })
  findAllOnlyPeriods(@GetCurrentUserId() userId: string) {
    return this.academicAssignmentReportsService.findAllUserIdOnlyPeriods(
      userId,
    );
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
  @ApiCommonResponses({
    summary: 'Obtener informes por userId',
    okDescription: 'Listado de informes obtenido correctamente.',
    badRequestDescription: 'ID inválido para obtener informes.',
    internalErrorDescription: 'Error interno al obtener informes.',
    notFoundDescription: 'No se encontraron informes para el usuario.',
  })
  findAllByUserId(
    @Param('id', ValidateIdPipe) userId: string,
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
    'Listado de informes de asignación académica de un usuario por código.',
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
  @ApiCommonResponses({
    summary: 'Obtener informes por código de usuario',
    okDescription: 'Listado de informes obtenido correctamente.',
    badRequestDescription: 'Código inválido para obtener informes.',
    internalErrorDescription: 'Error interno al obtener informes.',
    notFoundDescription:
      'No se encontraron informes para el código proporcionado.',
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
  @ApiCommonResponses({
    summary: 'Obtener informes del usuario autenticado',
    okDescription: 'Listado de informes obtenido correctamente.',
    badRequestDescription: 'Solicitud inválida.',
    internalErrorDescription: 'Error interno al obtener informes.',
    notFoundDescription:
      'No se encontraron informes para el usuario autenticado.',
  })
  findAllPersonal(
    @GetCurrentUserId() userId: string,
    @Query() query: QueryPaginationDto,
  ) {
    return this.academicAssignmentReportsService.findAllByUserIdAndCode(query, {
      userId,
    });
  }

  @Get('my/period/:id')
  @Roles(
    EUserRole.ADMIN,
    EUserRole.DIRECCION,
    EUserRole.RRHH,
    EUserRole.COORDINADOR_AREA,
    EUserRole.DOCENTE,
  )
  @HttpCode(HttpStatus.OK)
  @ResponseMessage(
    'Informe de asignación académica del usuario autenticado obtenido por ID de periodo.',
  )
  @ApiCommonResponses({
    summary: 'Obtener informe del usuario autenticado',
    okDescription: 'Informe obtenido correctamente.',
    badRequestDescription: 'Solicitud inválida.',
    internalErrorDescription: 'Error interno al obtener el informe.',
    notFoundDescription:
      'No se encontró un informe para el usuario autenticado en el periodo indicado.',
  })
  findOnePersonalAndPeriodId(
    @GetCurrentUserId() userId: string,
    @Param('id', ValidateIdPipe) periodId: string,
  ) {
    return this.academicAssignmentReportsService.findOneByUserIdAndPeriodId(
      {
        userId,
      },
      periodId,
    );
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
  @ApiCommonResponses({
    summary: 'Obtener asignaciones por departamento',
    okDescription: 'Listado de asignaciones obtenido correctamente.',
    badRequestDescription: 'ID inválido para obtener asignaciones.',
    internalErrorDescription: 'Error interno al obtener asignaciones.',
    notFoundDescription: 'No se encontraron asignaciones para el departamento.',
  })
  findAllByDepartmentId(
    @Query() query: QueryPaginationDto,
    @Param('departmentId', ValidateIdPipe) departmentId: string,
  ) {
    return this.academicAssignmentReportsService.findAllByDepartmentId(
      query,
      departmentId,
    );
  }

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
  @ApiCommonResponses({
    summary: 'Obtener asignaciones para coordinadores de área',
    okDescription: 'Listado de asignaciones obtenido correctamente.',
    badRequestDescription: 'Solicitud inválida para coordinador.',
    internalErrorDescription: 'Error interno al obtener asignaciones.',
    notFoundDescription: 'No se encontraron asignaciones para el coordinador.',
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

  @Get('coordinator/periods')
  @Roles(EUserRole.COORDINADOR_AREA)
  @HttpCode(HttpStatus.OK)
  @ResponseMessage(
    'Lista de periodos académicos con asignaciones académicas registradas.',
  )
  @ApiPagination({
    summary:
      'Obtener periodos académicos con asignaciones registradas para coordinadores de área',
    description:
      'Retorna un listado paginado de los periodos académicos en los que existen asignaciones académicas vinculadas al departamento del coordinador de área autenticado.',
  })
  @ApiCommonResponses({
    summary: 'Consulta de periodos académicos con asignaciones',
    okDescription: 'Listado de periodos obtenido correctamente.',
    badRequestDescription: 'La solicitud contiene parámetros inválidos.',
    internalErrorDescription: 'Error interno al procesar la solicitud.',
    notFoundDescription:
      'No se encontraron periodos con asignaciones registradas.',
  })
  findAllByCoordinatorOnlyPeriods(
    @Query() query: QueryPaginationDto,
    @GetCurrentUserId() userId: string,
  ) {
    return this.academicAssignmentReportsService.findAllByCoordinatorOnlyPeriods(
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
  @ApiCommonResponses({
    summary: 'Obtener informe por ID',
    okDescription: 'Informe obtenido correctamente.',
    badRequestDescription: 'ID inválido para obtener informe.',
    internalErrorDescription: 'Error interno al obtener informe.',
    notFoundDescription: 'No se encontró el informe solicitado.',
  })
  findOne(@Param('id', ValidateIdPipe) id: string) {
    return this.academicAssignmentReportsService.findOne(id);
  }

  @Get('coordinator/periods/:periodId')
  @Roles(EUserRole.COORDINADOR_AREA)
  @HttpCode(HttpStatus.OK)
  @ResponseMessage(
    'Detalle de asignaciones académicas para el periodo especificado.',
  )
  @ApiOperation({
    summary: 'Obtener detalle de asignaciones académicas por periodo',
    description:
      'Permite a un coordinador de área autenticado consultar las asignaciones académicas correspondientes a un periodo académico específico.',
  })
  @ApiCommonResponses({
    summary: 'Consulta de asignaciones académicas por periodo',
    okDescription: 'Detalle de asignaciones obtenido correctamente.',
    badRequestDescription: 'La solicitud contiene parámetros inválidos.',
    internalErrorDescription: 'Error interno al procesar la solicitud.',
    notFoundDescription:
      'No se encontraron asignaciones para el periodo especificado.',
  })
  findOneByCoordinatorAndPeriodId(
    @Param('periodId', ValidateIdPipe) periodId: string,
    @GetCurrentUserId() userId: string,
  ) {
    return this.academicAssignmentReportsService.findOneByCoordinatorAndPeriodId(
      userId,
      periodId,
    );
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
  @ApiBody({ type: UpdateAcademicAssignmentReportDto })
  @ApiCommonResponses({
    summary: 'Actualizar informe por ID',
    okDescription: 'Informe actualizado correctamente.',
    badRequestDescription: 'Datos inválidos para actualizar informe.',
    internalErrorDescription: 'Error interno al actualizar informe.',
    notFoundDescription: 'No se encontró el informe a actualizar.',
  })
  update(
    @Param('id', ValidateIdPipe) id: string,
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
  @ApiCommonResponses({
    summary: 'Eliminar informe por ID',
    okDescription: 'Informe eliminado correctamente.',
    badRequestDescription: 'ID inválido para eliminar informe.',
    internalErrorDescription: 'Error interno al eliminar informe.',
    notFoundDescription: 'No se encontró el informe a eliminar.',
  })
  remove(@Param('id', ValidateIdPipe) id: string) {
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
  @ApiCommonResponses({
    summary: 'Eliminar informes por periodo',
    okDescription: 'Informes eliminados correctamente.',
    badRequestDescription: 'ID inválido para eliminar informes.',
    internalErrorDescription: 'Error interno al eliminar informes.',
    notFoundDescription: 'No se encontraron informes para el periodo.',
  })
  removeAll(@Param('id', ValidateIdPipe) id: string) {
    return this.academicAssignmentReportsService.removeAll(id);
  }

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
  @ApiCommonResponses({
    summary: 'Crear informes desde archivo',
    createdDescription: 'Informes creados exitosamente desde el archivo.',
    badRequestDescription: 'Archivo inválido o datos erróneos.',
    internalErrorDescription: 'Error interno al procesar el archivo.',
  })
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const handledFile = this.excelFilesService.handleFileUpload(file);

    const data = await this.excelFilesService.processFile(
      propertiesAcademicAssignment,
      handledFile.buffer,
    );

    return this.academicAssignmentReportsService.createFromExcel(data);
  }
}
