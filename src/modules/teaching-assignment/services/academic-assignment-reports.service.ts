import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  AcademicAssignmentDto,
  CreateAcademicAssignmentReportDto,
  CreateTeachingSessionDto,
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
import { CoursesService } from 'src/modules/course-classrooms/services/courses.service';
import { TCreateCourseClassroom } from 'src/modules/course-classrooms/types';
import { ModalitiesService } from 'src/modules/course-classrooms/services/modalities.service';
import { EClassModality } from 'src/modules/course-classrooms/enums';
import { formatISO } from 'date-fns';
import { ClassroomService } from 'src/modules/infraestructure/services/classroom.service';
import { TeachingSessionsService } from './teaching-sessions.service';
import { CourseClassroomsService } from 'src/modules/course-classrooms/services/course-classrooms.service';

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
    private readonly coursesService: CoursesService,
    private readonly modalitiesService: ModalitiesService,
    private readonly classroomService: ClassroomService,
    private readonly teachingSessionsService: TeachingSessionsService,
    private readonly courseClassroomsService: CourseClassroomsService,
  ) {}

  async create(
    createAcademicAssignmentReportDto: CreateAcademicAssignmentReportDto,
  ): Promise<TCreateAcademicAssignmentReport> {
    const { userId, departmentId, periodId } =
      createAcademicAssignmentReportDto;

    const currentDate = formatISO(new Date().toISOString());
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
        startDate: currentDate,
      } as CreateTeacherDepartmentPositionDto;

      await this.teacherDepartmentPositionService.create(dto);
    }

    const newAcademicAssignmentReport =
      await this.prisma.academic_Assignment_Report.create({
        data: {
          teacherId: teacher.id,
          departmentId,
          periodId,
          teachingSessions: {
            create: {
              consultHour: currentDate, // Fecha actual
              // +1 hour
              tutoringHour: formatISO(
                new Date(currentDate).getTime() + 3600000,
              ),
            },
          },
        },
        select: {
          id: true,
          teacherId: true,
          departmentId: true,
          periodId: true,
          teachingSessions: true,
        },
      });

    return newAcademicAssignmentReport;
  }

  async findAll(): Promise<TAcademicAssignmentReport[]> {
    const academicAssignmentReports =
      await this.prisma.academic_Assignment_Report.findMany({
        include: {
          teachingSessions: {
            include: {
              courseClassrooms: true,
            },
          },
        },
      });

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

  async removeAll(id: string): Promise<boolean> {
    const academicAssignmentReportDelete =
      await this.prisma.academic_Assignment_Report.deleteMany({
        where: {
          periodId: id, // Elimina todos los informes del periodo académico
        },
      });

    return !!academicAssignmentReportDelete;
  }

  // Con el archivo de excel
  async createFromExcel(data: ExcelResponseDto<AcademicAssignmentDto>) {
    const { year, pac, pac_modality } = this.parseAcademicTitle(data.subtitle);
    const academicPeriod =
      await this.academicPeriodsService.findOneByYearPacModality(
        year,
        pac,
        pac_modality,
      );

    const academicPeriodTitle = `Periodo Académico ${pac} ${pac_modality} ${year}`;

    // console.log('Academic Period:', academicPeriod.id);

    // En cuestion de rendimiento, es mejor hacer las consultas
    // de todos los datos necesarios antes de iterar sobre el archivo
    // y no hacer una consulta cada vez que se itere sobre un item
    // Aca se evita realizar hasta quiza +100 consultas a la base de datos
    const teachers = await this.teachersService.findAll();
    const teachersMap = new Map(teachers.map((t) => [t.code, t]));

    const departments = await this.departmentsService.findAll();
    const departmentsMap = new Map(
      departments.map((d) => [normalizeText(d.name), d]),
    );

    const allCourses = await this.coursesService.findAllWithSelect();
    const allCoursesMap = new Map(allCourses.map((c) => [c.code, c]));

    const modalities = await this.modalitiesService.findAll();
    const existingCourseClassrooms =
      await this.courseClassroomsService.findAllWithSelectAndPeriodId(
        academicPeriod.id,
      );

    const classrooms = await this.classroomService.findAll();
    const classroomsMap = new Map(
      classrooms.map((c) => [normalizeText(c.name), c]),
    );

    const allData = data.data;
    const coursesGroupByTeacherCodeEntries: Record<
      string,
      Omit<TAcademicAssignmentReport, 'id'> & {
        userId: string;
        courses: TCreateCourseClassroom[];
      }
    > = {};

    for (const item of allData) {
      const {
        id,
        teacherCode,
        courseCode,
        section,
        days,
        studentCount,
        classroomName,
        department,
        observation,
      } = item;

      // Comparar si ya existe en el arreglo otra clase con el mismo docente y asignatura
      if (
        allData.some(
          (cc) =>
            cc.id !== id && // Excluir el mismo id
            cc.teacherCode === teacherCode &&
            cc.courseCode === courseCode &&
            cc.section === section &&
            cc.days === days,
        )
      )
        throw new BadRequestException(
          `Ya existe una clase con el docente <${teacherCode}> con la asignatura <${courseCode}> en el periodo académico <${academicPeriodTitle}> con la sección <${section}> y días <${days}>. Por favor, verifique el archivo.`,
        );

      const teacher = teachersMap.get(teacherCode);

      if (!teacher)
        throw new NotFoundException(
          `No se encontró el docente con código <${teacherCode}>.`,
        );

      const departmentObj = departmentsMap.get(normalizeText(department));

      if (!departmentObj)
        throw new NotFoundException(
          `No se encontró el departamento con nombre <${department}>.`,
        );

      const course = allCoursesMap.get(courseCode);

      if (!course)
        throw new NotFoundException(
          `No se encontró la asignatura con código <${courseCode}>.`,
        );

      // Si la asignatura no se encuentra activa, lanzamos un error,
      // ya que puede ser una clase de un pensum anterior
      if (!course.activeStatus)
        throw new BadRequestException(
          `La asignatura con código <${courseCode}> no está activa.`,
        );

      // Si la asignatura no pertenece al departamento, lanzamos un error
      if (course.departmentId !== departmentObj.id)
        throw new BadRequestException(
          `La asignatura con código <${courseCode}> no pertenece al departamento <${department}>.`,
        );

      // existingClass - todos los de existingCourseClassrooms son del periodo académico actual
      // Este if verifica si ya existe una clase para el docente y la asignatura
      const existingCourseClassroom = existingCourseClassrooms.find(
        (cc) =>
          cc.courseId === course.id &&
          cc.days === days.toString() &&
          cc.teachingSession.assignmentReport.teacherId === teacher.id,
      );
      if (
        existingCourseClassroom &&
        existingCourseClassroom.teachingSession.assignmentReport.periodId ===
          academicPeriod.id
      )
        throw new BadRequestException(
          `Ya existe una clase para el docente <${teacherCode}> con la asignatura <${courseCode}> en el periodo académico ${academicPeriodTitle}>.`,
        );

      // Salones de clase
      if (
        classroomName === undefined ||
        classroomName === null ||
        classroomName === ''
      )
        throw new BadRequestException(
          `El nombre del salón de clase no puede estar vacío para el docente <${teacherCode}> con la asignatura <${courseCode}> en el periodo académico <${academicPeriodTitle}>.`,
        );

      const classroomObj = classroomsMap.get(
        normalizeText(classroomName.toString()),
      );

      if (!classroomObj)
        throw new NotFoundException(
          `No se encontró el salón de clase con nombre <${classroomName}>.`,
        );

      // Agrupamos las clases por docente, ya que en este punto ya están validadas
      const entry = coursesGroupByTeacherCodeEntries[teacherCode];

      coursesGroupByTeacherCodeEntries[teacherCode] = {
        teacherId: teacher.id,
        userId: teacher.userId,
        departmentId: departmentObj.id,
        periodId: academicPeriod.id,
        // courses: entry && entry.courses ? entry.courses : [],
        courses:
          entry && Object.prototype.hasOwnProperty.call(entry, 'courses')
            ? entry.courses
            : [],
      };

      coursesGroupByTeacherCodeEntries[teacherCode].courses.push({
        courseId: course.id,
        section,
        days: days.toString(),
        classroomId: classroomObj.id,
        modalityId:
          normalizeText(classroomName.toString()) ===
          normalizeText(EClassModality.TELEDUCATION)
            ? modalities.find(
                (m) =>
                  normalizeText(m.name as EClassModality) ===
                  normalizeText(EClassModality.TELEDUCATION),
              )!.id
            : modalities.find(
                (m) => (m.name as EClassModality) === EClassModality.PRESENTIAL,
              )!.id,
        studentCount,
        groupCode: `${teacherCode}-${section}-${days}`, // Generamos un código de grupo único
        nearGraduation: false, // Por defecto, ya que no se especifica en el archivo
        observation: observation || null, // Si no hay observación, se asigna
      });
    }

    const allAcademicAssignmentReports = await this.findAll();
    const results: TAcademicAssignmentReport[] &
      {
        teachingSessions: {
          courseClassrooms: TCreateCourseClassroom[];
        };
      }[] = [];

    for (const [, academicInfo] of Object.entries(
      coursesGroupByTeacherCodeEntries,
    )) {
      const { teacherId, userId, departmentId, periodId, courses } =
        academicInfo;

      const academicAssignmentReport =
        allAcademicAssignmentReports.find(
          (aar: TAcademicAssignmentReport) =>
            aar.teacherId === teacherId &&
            aar.departmentId === departmentId &&
            aar.periodId === periodId,
        ) ??
        (await this.create({
          userId,
          departmentId,
          periodId,
        } as CreateAcademicAssignmentReportDto));

      // no validamos si ya existe 'teachingSessions' porque ya lo hicimos al crear el informe
      // y en este punto nadie podria eliminarlo, ya que se estan creando en el mismo momento
      // pero nunca se sabe, asi que lo dejamos por si acaso
      const teachingSession =
        academicAssignmentReport.teachingSessions! &&
        academicAssignmentReport.teachingSessions.length !== 0
          ? academicAssignmentReport.teachingSessions[0]
          : await this.teachingSessionsService.create({
              consultHour: formatISO(new Date().toISOString()),
              tutoringHour: formatISO(
                new Date(new Date().getTime() + 3600000), // +1 hour
              ),
              assignmentReportId: academicAssignmentReport.id,
            } as CreateTeachingSessionDto);

      // Creamos CourseClassroom
      const courseClassrooms: TCreateCourseClassroom[] = await Promise.all(
        courses.map((cc) =>
          this.prisma.course_Classroom.create({
            data: {
              ...cc,
              teachingSessionId: teachingSession.id,
              courseStadistics: {
                create: {
                  APB: 0, // Asignación por defecto
                  ABD: 0, // Asignación por defecto
                  NSP: 0, // Asignación por defecto
                  RPB: 0, // Asignación por defecto
                },
              },
            },
          }),
        ),
      );

      results.push({
        ...academicAssignmentReport,
        teachingSessions: {
          ...teachingSession,
          courseClassrooms: courseClassrooms.map((cc) => ({
            ...cc,
            classroom: {
              id: cc.classroomId,
              name: classroomsMap.get(
                normalizeText(
                  classrooms.find((c) => c.id === cc.classroomId)!.name,
                ),
              )!.name,
            },
          })),
        },
      });
    }

    return results;
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
