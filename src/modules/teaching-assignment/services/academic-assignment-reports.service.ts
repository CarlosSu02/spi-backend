import { Injectable, NotFoundException } from '@nestjs/common';
import {
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

@Injectable()
export class AcademicAssignmentReportsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly teachersService: TeachersService,
  ) {}

  async create(
    createAcademicAssignmentReportDto: CreateAcademicAssignmentReportDto,
  ): Promise<TCreateAcademicAssignmentReport> {
    const { userId, departmentId, periodId } =
      createAcademicAssignmentReportDto;

    const teacher = await this.teachersService.findOneByUserId(userId);

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
}
