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
  TPacModality,
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
import {
  TCourseClassroomSelectPeriod,
  TCreateCourseClassroom,
  TModality,
  TOutputCourseWithSelect,
} from 'src/modules/course-classrooms/types';
import { ModalitiesService } from 'src/modules/course-classrooms/services/modalities.service';
import { EClassModality } from 'src/modules/course-classrooms/enums';
import { formatISO } from 'date-fns';
import { ClassroomService } from 'src/modules/infraestructure/services/classroom.service';
import { TeachingSessionsService } from './teaching-sessions.service';
import { CourseClassroomsService } from 'src/modules/course-classrooms/services/course-classrooms.service';
import { TOutputTeacher } from 'src/modules/teachers/types';
import { TDepartment } from 'src/modules/departments/types';
import { TClassroom } from 'src/modules/infraestructure/types';
import { Prisma } from '@prisma/client';
import { TCustomOmit } from 'src/common/types';
import { TComplementaryActivity } from 'src/modules/complementary-activities/types';

interface ParsedTitle {
  year: number;
  pac: number;
  pac_modality: TPacModality;
  title: string;
}

@Injectable()
export class AcademicAssignmentReportsService {
  private readonly includeOptionsAAR = {
    period: true,
    teacher: {
      select: {
        id: true,
        user: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
    },
    department: {
      select: {
        id: true,
        name: true,
      },
    },
    teachingSession: {
      include: {
        courseClassrooms: {
          // select: {
          //   id: true,
          //   courseId: true,
          //   classroomId: true,
          //   section: true,
          //   days: true,
          //   studentCount: true,
          //   groupCode: true,
          //   nearGraduation: true,
          //   observation: true,
          //   modality: true,
          // },
          omit: {
            teachingSessionId: true,
            modalityId: true,
          },
          include: {
            modality: true,
            course: true,
            courseStadistic: true,
          },
        },
      },
    },
  };

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
        teacher.code,
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
      await this.prisma.academicAssignmentReport.create({
        data: {
          teacherId: teacher.id,
          departmentId,
          periodId,
          teachingSession: {
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
          teachingSession: true,
        },
      });

    return newAcademicAssignmentReport;
  }

  async findAll(): Promise<TAcademicAssignmentReport[]> {
    const academicAssignmentReports =
      await this.prisma.academicAssignmentReport.findMany({
        relationLoadStrategy: 'join',
        include: {
          teachingSession: {
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
      this.prisma.academicAssignmentReport.findMany({
        ...paginate(query),
        relationLoadStrategy: 'join',
        include: this.includeOptionsAAR,
        omit: {
          teacherId: true,
          departmentId: true,
        },
      }),
      this.prisma.academicAssignmentReport.count(),
    ]);

    return paginateOutput<TAcademicAssignmentReport>(
      academicAssignmentReports,
      count,
      query,
    );
  }

  async findAllByUserIdAndCode(
    query: QueryPaginationDto,
    user: {
      userId?: string;
      code?: string;
    },
  ): Promise<IPaginateOutput<TAcademicAssignmentReport>> {
    // const teacher = await this.teachersService.findOneByUserId(userId);
    const { userId, code } = user;

    const [academicAssignmentReports, count] = await Promise.all([
      this.prisma.academicAssignmentReport.findMany({
        where: {
          teacher: {
            OR: [
              {
                userId,
              },
              {
                user: {
                  code: code ? normalizeText(code) : undefined,
                },
              },
            ],
          },
        },
        ...paginate(query),
        relationLoadStrategy: 'join',
        include: this.includeOptionsAAR,
        omit: {
          teacherId: true,
          departmentId: true,
        },
      }),
      this.prisma.academicAssignmentReport.count({
        where: {
          teacher: {
            userId,
          },
        },
      }),
    ]);

    if (count === 0)
      throw new NotFoundException(
        `No se encontraron informes de asignación académica para el usuario con ID <${userId}>.`,
      );

    return paginateOutput<TAcademicAssignmentReport>(
      academicAssignmentReports,
      count,
      query,
    );
  }

  async findAllByDepartmentId(
    query: QueryPaginationDto,
    departmentId: string,
  ): Promise<IPaginateOutput<TAcademicAssignmentReport>> {
    await this.departmentsService.findOne(departmentId);

    const where = {
      departmentId,
    };

    const [academicAssignmentReports, count] = await Promise.all([
      this.prisma.academicAssignmentReport.findMany({
        where,
        ...paginate(query),
        relationLoadStrategy: 'join',
        include: this.includeOptionsAAR,
        omit: {
          teacherId: true,
          departmentId: true,
        },
      }),
      this.prisma.academicAssignmentReport.count({
        where,
      }),
    ]);

    return paginateOutput<TAcademicAssignmentReport>(
      academicAssignmentReports,
      count,
      query,
    );
  }

  // Para no inicializar el teacherDepartmentPositionService en el controller
  async findAllByCoordinator(query: QueryPaginationDto, userId: string) {
    const user =
      await this.teacherDepartmentPositionService.findOneByUserId(userId);

    return await this.findAllByDepartmentId(query, user.department.id);
  }

  async findOne(id: string): Promise<TAcademicAssignmentReport> {
    const academicAssignmentReport =
      await this.prisma.academicAssignmentReport.findUnique({
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

  async findAllUserIdOnlyPeriods(userId: string) {
    const academicAssignmentReports =
      await this.prisma.academicAssignmentReport.findMany({
        where: {
          teacher: {
            userId,
          },
        },
        select: {
          period: true,
        },
      });

    if (academicAssignmentReports.length === 0)
      throw new BadRequestException(
        `No se encontraron informes de asignación académica para el usuario con id <${userId}>`,
      );

    return academicAssignmentReports.map((p) => p.period);
  }

  async findOneByUserIdAndPeriodId(
    user: {
      userId?: string;
      code?: string;
    },
    periodId: string,
  ): Promise<
    TAcademicAssignmentReport & {
      complementaryActivities: TComplementaryActivity[];
    }
  > {
    // const teacher = await this.teachersService.findOneByUserId(userId);
    const { userId, code } = user;

    const existsPeriod = await this.academicPeriodsService.findOne(periodId);

    const academicAssignmentReport =
      await this.prisma.academicAssignmentReport.findFirst({
        where: {
          teacher: {
            OR: [
              {
                userId,
              },
              {
                user: {
                  code: code ? normalizeText(code) : undefined,
                },
              },
            ],
          },
          periodId,
        },
        relationLoadStrategy: 'join',
        include: {
          ...this.includeOptionsAAR,
          complementaryActivities: {
            include: {
              verificationMedia: {
                include: {
                  verificationMediaFiles: true,
                },
              },
              activityType: true,
            },
          },
          // teachingSessions: {
          //   include: {
          //     courseClassrooms: {
          //       include: {
          //         course: true,
          //         courseStadistics: true,
          //       },
          //     },
          //   },
          // },
        },
        omit: {
          teacherId: true,
          departmentId: true,
        },
      });

    if (!academicAssignmentReport)
      throw new NotFoundException(
        `No se encontraron informes de asignación académica para el usuario con ID <${userId}> en el periodo <${periodId}>.`,
      );

    return academicAssignmentReport;
  }

  async update(
    id: string,
    updateAcademicAssignmentReportDto: UpdateAcademicAssignmentReportDto,
  ): Promise<TUpdateAcademicAssignmentReport> {
    const academicAssignmentReportUpdate =
      await this.prisma.academicAssignmentReport.update({
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
      await this.prisma.academicAssignmentReport.delete({
        where: {
          id,
        },
      });

    return academicAssignmentReportDelete;
  }

  async removeAll(id: string): Promise<Prisma.BatchPayload> {
    const academicAssignmentReportDelete =
      await this.prisma.academicAssignmentReport.deleteMany({
        where: {
          periodId: id, // Elimina todos los informes del periodo académico
        },
      });

    return academicAssignmentReportDelete;
  }

  // Con el archivo de excel
  async createFromExcel(data: ExcelResponseDto<AcademicAssignmentDto>) {
    const { pac_modality } = this.parseAcademicTitle(data.subtitle);

    // FIX: para no depender del titulo, esto se cambiara, del titulo solo se necesitara la modalidad
    // const academicPeriod =
    // await this.academicPeriodsService.findOneByYearPacModality(
    //   year,
    //   pac,
    //   pac_modality,
    // );

    await this.academicPeriodsService.currentAcademicPeriod(pac_modality);
    const academicPeriod =
      await this.academicPeriodsService.getNextAcademicPeriod(
        await this.academicPeriodsService.currentAcademicPeriod(pac_modality),
      );
    const academicPeriodTitle = `Periodo Académico No. ${academicPeriod.pac}, ${pac_modality}, ${academicPeriod.year}`;

    // En cuestion de rendimiento, es mejor hacer las consultas
    // de todos los datos necesarios antes de iterar sobre el archivo
    // y no hacer una consulta cada vez que se itere sobre un item
    // Aca se evita realizar hasta quiza +100 consultas a la base de datos
    const [
      teachers,
      departments,
      allCourses,
      modalities,
      existingCourseClassrooms,
      classrooms,
    ] = await Promise.all([
      this.teachersService.findAll(),
      this.departmentsService.findAll(),
      this.coursesService.findAllWithSelect(),
      this.modalitiesService.findAll(),
      this.courseClassroomsService.findAllWithSelectAndPeriodId(
        academicPeriod.id,
      ),
      this.classroomService.findAll(),
    ]);

    const teachersMap = new Map(teachers.map((t) => [t.code, t]));
    const departmentsMap = new Map(
      departments.map((d) => [normalizeText(d.name), d]),
    );
    const allCoursesMap = new Map(allCourses.map((c) => [c.code, c]));
    const classroomsMap = new Map(
      classrooms.map((c) => [normalizeText(c.name), c]),
    );
    const existingCourseClassroomsMap = new Map<
      string,
      TCourseClassroomSelectPeriod
    >();
    existingCourseClassrooms.forEach((cc) => {
      const key = `${cc.courseId}|${cc.days}|${cc.teachingSession.assignmentReport.teacherId}`;
      existingCourseClassroomsMap.set(key, cc);
    });

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
        teacherCode,
        courseCode,
        section,
        days,
        studentCount,
        classroomName,
        departmentName,
        observation,
      } = item;

      this.validateUniqueClass(allData, item);

      const teacher = this.findTeacher(teachersMap, teacherCode);
      const department = this.findDepartment(departmentsMap, departmentName);
      const course = this.findCourse(allCoursesMap, courseCode, department);

      // existingClass - todos los de existingCourseClassrooms son del periodo académico actual
      // Este if verifica si ya existe una clase para el docente y la asignatura
      const existingKey = `${course.id}|${days}|${teacher.id}`;
      this.validateCourseClassroom(
        existingCourseClassroomsMap,
        existingKey,
        teacherCode,
        courseCode,
        academicPeriodTitle,
        academicPeriod.id,
      );

      // Salones de clase
      if (!classroomName || classroomName === null || classroomName === '')
        throw new BadRequestException(
          `El nombre del salón de clase no puede estar vacío para el docente <${teacherCode}> con la asignatura <${courseCode}> en el periodo académico <${academicPeriodTitle}>.`,
        );

      const classroom = this.findClassroom(classroomsMap, classroomName);

      // Agrupamos las clases por docente, ya que en este punto ya están validadas
      if (!coursesGroupByTeacherCodeEntries[teacherCode]) {
        coursesGroupByTeacherCodeEntries[teacherCode] = {
          teacherId: teacher.id,
          userId: teacher.userId,
          departmentId: department.id,
          periodId: academicPeriod.id,
          courses: [],
        };
      }

      coursesGroupByTeacherCodeEntries[teacherCode].courses.push({
        courseId: course.id,
        section,
        days: days.toString(),
        classroomId: classroom.id,
        modalityId: this.getModalityId(classroom.name, modalities),
        studentCount,
        groupCode: `${teacherCode}-${section}-${days}`, // Generamos un código de grupo único
        nearGraduation: false, // Por defecto, ya que no se especifica en el archivo
        observation: observation || null, // Si no hay observación, se asigna
      });
    }

    const allAcademicAssignmentReports = await this.findAll();
    const results: TAcademicAssignmentReport[] &
      {
        teachingSession: {
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
        academicAssignmentReport.teachingSession ??
        (await this.teachingSessionsService.create({
          consultHour: formatISO(new Date().toISOString()),
          tutoringHour: formatISO(
            new Date(new Date().getTime() + 3600000), // +1 hour
          ),
          assignmentReportId: academicAssignmentReport.id,
        } as CreateTeachingSessionDto));

      // Creamos CourseClassroom
      const courseClassrooms: TCreateCourseClassroom[] = await Promise.all(
        courses.map((cc) =>
          this.prisma.courseClassroom.create({
            data: {
              ...cc,
              teachingSessionId: teachingSession.id,
              courseStadistic: {
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
        teachingSession: {
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
    let pac_modality: TPacModality = 'Trimestre';

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
      pac_modality = modMatch[1] as TPacModality;
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

  private validateUniqueClass(
    allData: AcademicAssignmentDto[],
    item: AcademicAssignmentDto,
  ) {
    if (
      allData.some(
        (cc) =>
          cc.id !== item.id &&
          cc.teacherCode === item.teacherCode &&
          cc.courseCode === item.courseCode &&
          cc.section === item.section &&
          cc.days === item.days,
      )
    ) {
      throw new BadRequestException(
        `Ya existe una clase con el docente <${item.teacherCode}> ...`,
      );
    }
  }

  private findTeacher(
    teachersMap: Map<
      string,
      TCustomOmit<
        TOutputTeacher,
        | 'categoryName'
        | 'contractTypeName'
        | 'shiftName'
        | 'postgrads'
        | 'undergrads'
      >
    >,
    teacherCode: string,
  ): TCustomOmit<
    TOutputTeacher,
    | 'categoryName'
    | 'contractTypeName'
    | 'shiftName'
    | 'postgrads'
    | 'undergrads'
  > {
    const teacher = teachersMap.get(teacherCode);

    if (!teacher)
      throw new NotFoundException(
        `No se encontró el docente con código <${teacherCode}>.`,
      );

    return teacher;
  }

  private findDepartment(
    departmentsMap: Map<string, TDepartment>,
    departmentName: string,
  ): TDepartment {
    const department = departmentsMap.get(normalizeText(departmentName));

    if (!department)
      throw new NotFoundException(
        `No se encontró el departamento con nombre <${departmentName}>.`,
      );

    return department;
  }

  private findCourse(
    allCoursesMap: Map<string, TOutputCourseWithSelect>,
    courseCode: string,
    department: TDepartment,
  ): TOutputCourseWithSelect {
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
    if (course.departmentId !== department.id)
      throw new BadRequestException(
        `La asignatura con código <${courseCode}> no pertenece al departamento <${department.name}>.`,
      );

    return course;
  }

  private findClassroom(
    classroomsMap: Map<string, TClassroom>,
    classroomName: string,
  ): TClassroom {
    const classroom = classroomsMap.get(normalizeText(classroomName));

    if (!classroom)
      throw new NotFoundException(
        `No se encontró el salón de clase con nombre <${classroomName}>.`,
      );

    return classroom;
  }

  private validateCourseClassroom(
    existingCourseClassroomsMap: Map<string, TCourseClassroomSelectPeriod>,
    key: string,
    teacherCode: string,
    courseCode: string,
    academicPeriodTitle: string,
    periodId: string,
  ): TCourseClassroomSelectPeriod | undefined {
    const existingCourseClassroom = existingCourseClassroomsMap.get(key);

    if (
      existingCourseClassroom &&
      existingCourseClassroom.teachingSession.assignmentReport.periodId ===
        periodId
    )
      throw new BadRequestException(
        `Ya existe una clase para el docente <${teacherCode}> con la asignatura <${courseCode}> en el periodo académico ${academicPeriodTitle}>.`,
      );

    return existingCourseClassroom;
  }

  private getModalityId(
    classroomName: string,
    modalities: TModality[],
  ): string {
    if (
      normalizeText(classroomName.toString()) ===
      normalizeText(EClassModality.TELEDUCATION)
    )
      return (
        modalities.find(
          (m) =>
            normalizeText(m.name as EClassModality) ===
            normalizeText(EClassModality.TELEDUCATION),
        )?.id || ''
      );

    return (
      modalities.find(
        (m) => (m.name as EClassModality) === EClassModality.PRESENTIAL,
      )?.id || ''
    );
  }
}
