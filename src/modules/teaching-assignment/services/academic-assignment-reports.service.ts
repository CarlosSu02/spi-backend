import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  AcademicAssignmentDto,
  CreateAcademicAssignmentReportDto,
  UpdateAcademicAssignmentReportDto,
} from '../dto';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  TCreateAcademicAssignmentReport,
  TAcademicAssignmentReport,
  TUpdateAcademicAssignmentReport,
} from '../types';
import { TeachersService } from 'src/modules/teachers/services/teachers.service';
import { TeacherDepartmentPositionService } from 'src/modules/teacher-department-position/services/teacher-department-position.service';
import { PositionsService } from 'src/modules/positions/services/positions.service';
import { EPosition } from 'src/modules/positions/enums';
import { CreateTeacherDepartmentPositionDto } from 'src/modules/teacher-department-position/dto/create-teacher-department-position.dto';
import { ExcelResponseDto } from 'src/modules/excel-files/dto/excel-response.dto';
import { AcademicPeriodsService } from './academic-periods.service';
import { DepartmentsService } from 'src/modules/departments/services/departments.service';
import { normalizeText, paginate, paginateOutput } from 'src/common/utils';
import { IPaginateOutput } from 'src/common/interfaces';
import { QueryPaginationDto } from 'src/common/dto';

interface ParsedTitle {
  year: number;
  pac: number;
  pac_modality: 'Trimestre' | 'Semestre';
  title: string;
}

@Injectable()
export class AcademicAssignmentReportsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly academicPeriodsService: AcademicPeriodsService,
    private readonly teachersService: TeachersService,
    private readonly teacherDepartmentPositionService: TeacherDepartmentPositionService,
    private readonly positionsService: PositionsService,
    private readonly departmentsService: DepartmentsService,
  ) {}

  async create(
    createAcademicAssignmentReportDto: CreateAcademicAssignmentReportDto,
  ): Promise<TCreateAcademicAssignmentReport> {
    const { userId, departmentId, periodId } =
      createAcademicAssignmentReportDto;

    const teacher = await this.teachersService.findOneByUserId(userId);

    // Primero verificamos si el docente pertenece al departamento
    // es decir buscamos si el docente esta asignado a ese departamento
    // si no lo esta, lo creamos con cargo academico "ninguno" y fecha de inicio
    // el mismo dia de la creacion del informe
    const existingTeacherDeptPos =
      await this.teacherDepartmentPositionService.findOneByTeacherCodeAndDepartmentId(
        teacher.user.code,
        departmentId,
      );

    // no existe el docente en el departamento, por lo que se crea un nuevo informe
    if (!existingTeacherDeptPos) {
      const positionId = (
        await this.positionsService.findOneByName(EPosition.NONE as string)
      ).id;

      const dto = {
        userId,
        departmentId,
        positionId,
      } as CreateTeacherDepartmentPositionDto;

      await this.teacherDepartmentPositionService.create(dto);
    }

    const newAcademicAssignmentReport =
      await this.prisma.academic_Assignment_Report.create({
        data: {
          teacherId: teacher.id,
          departmentId,
          periodId,
        },
      });

    return newAcademicAssignmentReport;
  }

  async findAll(): Promise<TAcademicAssignmentReport[]> {
    const academicAssignmentReports =
      await this.prisma.academic_Assignment_Report.findMany();

    return academicAssignmentReports;
  }

  async findAllWithPagination(
    query: QueryPaginationDto,
  ): Promise<IPaginateOutput<TAcademicAssignmentReport>> {
    const [academicAssignmentReports, count] = await Promise.all([
      this.prisma.academic_Assignment_Report.findMany({
        ...paginate(query),
      }),
      this.prisma.academic_Assignment_Report.count(),
    ]);

    return paginateOutput<TAcademicAssignmentReport>(
      academicAssignmentReports,
      count,
      query,
    );
  }

  async findOne(id: string): Promise<TAcademicAssignmentReport> {
    const academicAssignmentReport =
      await this.prisma.academic_Assignment_Report.findUnique({
        where: {
          id,
        },
      });

    if (!academicAssignmentReport)
      throw new NotFoundException(
        `La asignación académica con id <${id}> no fue encontrada.`,
      );

    return academicAssignmentReport;
  }

  async update(
    id: string,
    updateAcademicAssignmentReportDto: UpdateAcademicAssignmentReportDto,
  ): Promise<TUpdateAcademicAssignmentReport> {
    const academicAssignmentReportUpdate =
      await this.prisma.academic_Assignment_Report.update({
        where: {
          id,
        },
        data: {
          ...updateAcademicAssignmentReportDto,
        },
      });

    return academicAssignmentReportUpdate;
  }

  async remove(id: string): Promise<TAcademicAssignmentReport> {
    const academicAssignmentReportDelete =
      await this.prisma.academic_Assignment_Report.delete({
        where: {
          id,
        },
      });

    return academicAssignmentReportDelete;
  }

  // Con el archivo de excel
  async createFromExcel(data: ExcelResponseDto<AcademicAssignmentDto>) {
    // console.log('Data from Excel:', data);
    // console.log('Academic Title:', data.title);
    // console.log(this.parseAcademicTitle(data.subtitle));
    const { year, pac, pac_modality } = this.parseAcademicTitle(data.subtitle);
    const academicPeriod =
      await this.academicPeriodsService.findOneByYearPacModality(
        year,
        pac,
        pac_modality,
      );

    console.log('Academic Period:', academicPeriod.id);

    const teachers = await this.teachersService.findAll();
    const teacherMap = new Map(teachers.map((t) => [t.code, t]));

    // lo mismo con las clases y departamentos
    const departments = await this.departmentsService.findAll();
    const departmentMap = new Map(
      departments.map((d) => [normalizeText(d.name), d]),
    );

    const teachersDeptPosition =
      await this.teacherDepartmentPositionService.findAll();

    console.log('Departments:', departmentMap);

    for (const course of data.data) {
      const { teacherCode, courseCode, days, studentCount, department } =
        course;

      // const teacher = await this.teachersService.findOneByCode(teacherCode);
      const teacher = teacherMap.get(teacherCode);
      console.log(teacher);

      if (!teacher)
        throw new NotFoundException(
          `No se encontró el docente con código <${teacherCode}>.`,
        );

      const departmentObj = departmentMap.get(normalizeText(department));

      if (!departmentObj)
        throw new NotFoundException(
          `No se encontró el departamento con nombre <${department}>.`,
        );

      console.log('Teacher:', teacher.name);
    }

    return data;
  }

  private parseAcademicTitle(title: string): ParsedTitle {
    // Inicialmente permitimos numero o null
    let year: number | null = null;
    let pac: number | null = null;
    let pac_modality: 'Trimestre' | 'Semestre' = 'Trimestre';

    const yearMatch = title.match(/\b(20\d{2})\b/);
    if (yearMatch) {
      year = parseInt(yearMatch[1], 10);
    }

    const pacMap: Record<string, number> = {
      primero: 1,
      segundo: 2,
      tercer: 3,
    };
    const pacRegex = new RegExp(
      `\\b(${Object.keys(pacMap).join('|')})\\b`,
      'i',
    );
    const pacMatch = title.match(pacRegex);
    if (pacMatch) {
      pac = pacMap[pacMatch[1].toLowerCase()];
    }

    const modMatch = title.match(/\b(semestre|trimestre)\b/i);
    if (modMatch) {
      pac_modality = modMatch[1] as 'Trimestre' | 'Semestre';
    }

    // Valor por defecto si no se encontró
    if (year === null) {
      throw new BadRequestException(`No se detectó año en “${title}”`);
    }

    if (pac === null) {
      pac = 1;
    }

    return {
      year,
      pac,
      pac_modality,
      title,
    };
  }
}
