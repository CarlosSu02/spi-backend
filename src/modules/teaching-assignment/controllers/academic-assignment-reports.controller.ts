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
import { ApiPagination, ResponseMessage, Roles } from 'src/common/decorators';
import { EUserRole } from 'src/common/enums';
import { ValidateIdPipe } from 'src/common/pipes';
import { ApiBody, ApiConsumes, ApiOperation, ApiParam } from '@nestjs/swagger';
import { ExcelFilesService } from 'src/modules/excel-files/services/excel-files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { QueryPaginationDto } from 'src/common/dto';

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
  @ApiOperation({
    summary: 'Crear un informe de asignación académica',
    description: 'Debería crear un nuevo informe de asignación académica.',
  })
  // @ApiBody({
  //   type: CreateAcademicAssignmentReportDto,
  //   description:
  //     'Datos necesarios para crear un informe de asignación académica.',
  // })
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
