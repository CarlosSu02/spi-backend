import { AcademicAssignmentReportDto } from './academic-assignment-report.dto';

export class ExcelResponseDto<T> {
  title: string;
  subtitle: string;
  totalRecords: number;
  data: T[];
}
