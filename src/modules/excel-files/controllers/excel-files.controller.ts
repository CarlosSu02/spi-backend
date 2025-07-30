import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ExcelFilesService } from '../services/excel-files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ExcelResponseDto } from '../dto/excel-response.dto';
import {
  AcademicAssignmentReportDto,
  propertiesAcademicAssignmentReport,
  TAcademicAssignmentReport,
} from '../dto/academic-assignment-report.dto';

@Controller('excel-files')
export class ExcelFilesController {
  constructor(
    private readonly excelFilesService: ExcelFilesService<
      TAcademicAssignmentReport,
      AcademicAssignmentReportDto
    >,
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ExcelResponseDto<AcademicAssignmentReportDto>> {
    if (!file) throw new BadRequestException('El archivo es requerido.');

    if (!file.originalname.match(/\.(xlsx|xls)$/))
      throw new BadRequestException(
        'El archivo debe ser un Excel, formato permtido: (.xlsx o .xls)',
      );

    return await this.excelFilesService.processFile(
      propertiesAcademicAssignmentReport,
      file.buffer,
    );
  }
}
