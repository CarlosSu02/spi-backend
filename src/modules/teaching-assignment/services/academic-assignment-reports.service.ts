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
  TAcademicPeriod,
  TAcademicAssignmentReportFileView,
} from '../types';
import { TeachersService } from 'src/modules/teachers/services/teachers.service';
import { AcademicPeriodsService } from './academic-periods.service';
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
import { TClassroom } from 'src/modules/infraestructure/types';
import { Prisma } from '@prisma/client';
import { TCustomOmit } from 'src/common/types';
import { TComplementaryActivity } from 'src/modules/complementary-activities/types';
import { EPosition } from 'src/modules/teachers-config/enums';
import { PositionsService } from 'src/modules/teachers-config/services/positions.service';
import { CreateTeacherDepartmentPositionDto } from 'src/modules/teachers/dto/create-teacher-department-position.dto';
import { TeacherDepartmentPositionService } from 'src/modules/teachers/services/teacher-department-position.service';
import { TCenterJoin, TDepartment } from 'src/modules/centers/types';
import { CenterDepartmentsService } from 'src/modules/centers/services/center-departments.service';
import { CentersService } from 'src/modules/centers/services/centers.service';

interface ParsedTitle {
  year: number;
  pac: number;
  pac_modality: TPacModality;
  title: string;
}

type TGroupedCoursesByTeacher = Record<
  string,
  Omit<TAcademicAssignmentReport, 'id'> & {
    userId: string;
    courses: TCreateCourseClassroom[];
  }
>;

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
    centerDepartment: {
      select: {
        id: true,
        centerId: true,
        departmentId: true,
        center: {
          select: {
            name: true,
          },
        },
        department: {
          select: {
            name: true,
          },
        },
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
    private readonly centersService: CentersService,
    private readonly coursesService: CoursesService,
    private readonly modalitiesService: ModalitiesService,
    private readonly classroomService: ClassroomService,
    private readonly teachingSessionsService: TeachingSessionsService,
    private readonly courseClassroomsService: CourseClassroomsService,
    private readonly centerDepartmentsService: CenterDepartmentsService,
  ) {}

  async create(
    createAcademicAssignmentReportDto: CreateAcademicAssignmentReportDto,
  ): Promise<TCreateAcademicAssignmentReport> {
    const { userId, centerDepartmentId, periodId } =
      createAcademicAssignmentReportDto;

    const currentDate = formatISO(new Date().toISOString());
    const teacher = await this.teachersService.findOneByUserId(userId);

    // Primero verificamos si el docente pertenece al departamento
    // es decir buscamos si el docente esta asignado a ese departamento
    // si no lo esta, lo creamos con cargo academico "ninguno" y fecha de inicio
    // el mismo dia de la creacion del informe
    const existingTeacherDeptPos =
      await this.teacherDepartmentPositionService.findOneByTeacherCodeAndCenterDepartmentId(
        teacher.code,
        centerDepartmentId,
      );

    // no existe el docente en el departamento, por lo que se crea un nuevo informe
    if (!existingTeacherDeptPos) {
      const positionId = (
        await this.positionsService.findOneByName(EPosition.NONE as string)
      ).id;

      const dto = {
        userId,
        centerDepartmentId,
        positionId,
        startDate: currentDate,
      } as CreateTeacherDepartmentPositionDto;

      await this.teacherDepartmentPositionService.create(dto);
    }

    const newAcademicAssignmentReport =
      await this.prisma.academicAssignmentReport.create({
        data: {
          teacherId: teacher.id,
          centerDepartmentId,
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
          centerDepartmentId: true,
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
          centerDepartmentId: true,
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
          centerDepartmentId: true,
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

  async findAllByCenterDepartmentId(
    query: QueryPaginationDto,
    centerDepartmentId: string,
  ): Promise<IPaginateOutput<TAcademicAssignmentReport>> {
    await this.centerDepartmentsService.findOne(centerDepartmentId);

    const where = {
      centerDepartmentId,
    };

    const [academicAssignmentReports, count] = await Promise.all([
      this.prisma.academicAssignmentReport.findMany({
        where,
        ...paginate(query),
        relationLoadStrategy: 'join',
        include: this.includeOptionsAAR,
        omit: {
          teacherId: true,
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
  async findAllByCoordinator(
    query: QueryPaginationDto,
    userId: string,
    centerDepartmentId: string,
  ) {
    // Validacion
    await this.teacherDepartmentPositionService.findOneDepartmentHeadByUserIdAndCenterDepartment(
      userId,
      centerDepartmentId,
    );

    return await this.findAllByCenterDepartmentId(query, centerDepartmentId);
  }

  async findAllByCoordinatorOnlyPeriods(
    query: QueryPaginationDto,
    userId: string,
    centerDepartmentId: string,
  ): Promise<
    IPaginateOutput<
      TAcademicPeriod & { title: string; centerDepartmentId: string }
    >
  > {
    const user =
      await this.teacherDepartmentPositionService.findOneDepartmentHeadByUserIdAndCenterDepartment(
        userId,
        centerDepartmentId,
      );

    // Periodos donde existen reportes y que sean del departamento del usuario.
    const [periods, count] = await Promise.all([
      this.prisma.academicAssignmentReport.findMany({
        ...paginate(query),
        distinct: ['periodId'],
        where: {
          centerDepartmentId,
        },
        relationLoadStrategy: 'join',
        select: {
          period: true,
          centerDepartmentId: true,
        },
      }),
      this.prisma.academicAssignmentReport
        .findMany({
          distinct: ['periodId'],
          where: {
            centerDepartmentId: user.centerDepartmentId,
          },
          select: {
            periodId: true,
          },
        })
        .then((results) => results.length),
    ]);

    if (count === 0)
      throw new BadRequestException(
        `No se encontraron planificaciones académica para el departamento <${user.centerDepartment.department.name}>.`,
      );

    const mapped = periods.map(({ period, centerDepartmentId }) => ({
      ...period,
      title: `PAC No. ${period.pac}, ${period.pac_modality}, ${period.year}`,
      centerDepartmentId,
    }));

    return paginateOutput(mapped, count, query);
  }

  async findOne(id: string): Promise<TAcademicAssignmentReport> {
    const academicAssignmentReport =
      await this.prisma.academicAssignmentReport.findUnique({
        where: {
          id,
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
        },
        omit: {
          teacherId: true,
          centerDepartmentId: true,
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
          id: true,
          period: true,
          centerDepartment: {
            select: {
              id: true,
              centerId: true,
              departmentId: true,
              center: {
                select: {
                  name: true,
                },
              },
              department: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      });

    if (academicAssignmentReports.length === 0)
      throw new BadRequestException(
        `No se encontraron informes de asignación académica para el usuario con id <${userId}>`,
      );

    return academicAssignmentReports.map((p) => ({
      ...p.period,
      reportId: p.id,
      centerDepartmentId: p.centerDepartment.id,
      center: p.centerDepartment.center.name,
      department: p.centerDepartment.department.name,
    }));
  }

  async findOneByUserIdAndPeriodIdAndCenterDepartmentId(
    user: {
      userId?: string;
      code?: string;
    },
    periodId: string,
    centerDepartmentId: string,
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
          centerDepartmentId,
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
          centerDepartmentId: true,
        },
      });

    if (!academicAssignmentReport)
      throw new NotFoundException(
        `No se encontraron informes de asignación académica para el usuario con ID <${userId}> en el periodo <${periodId}>.`,
      );

    return academicAssignmentReport;
  }

  async findOneByCoordinatorAndPeriodId(
    userId: string,
    centerDepartmentId: string,
    periodId: string,
  ): Promise<TAcademicAssignmentReport[]> {
    // Validacion
    await this.teacherDepartmentPositionService.findOneDepartmentHeadByUserIdAndCenterDepartment(
      userId,
      centerDepartmentId,
    );

    const academicAssignmentReports =
      await this.prisma.academicAssignmentReport.findMany({
        where: {
          periodId,
          centerDepartmentId,
        },
        relationLoadStrategy: 'join',
        include: this.includeOptionsAAR,
        omit: {
          teacherId: true,
          centerDepartmentId: true,
        },
      });

    if (academicAssignmentReports.length === 0)
      throw new NotFoundException(
        'No se encontraron asignaciones académicas para el periodo seleccionado.',
      );

    return academicAssignmentReports;
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

  parsedTitleFromExcel(subtitle: string) {
    return this.parseAcademicTitle(subtitle);
  }

  // parsedData
  async parsedData(
    allData: AcademicAssignmentDto[],
    centerDepartmentId: string,
    currentUserId: string,
    parseAcademicTitle?: ParsedTitle,
  ) {
    const coordinator =
      await this.teacherDepartmentPositionService.findOneDepartmentHeadByUserIdAndCenterDepartment(
        currentUserId,
        centerDepartmentId,
      );

    await this.academicPeriodsService.currentAcademicPeriod(
      parseAcademicTitle && parseAcademicTitle.pac_modality,
    );
    const academicPeriod =
      await this.academicPeriodsService.getNextAcademicPeriod(
        await this.academicPeriodsService.currentAcademicPeriod(),
      );
    const academicPeriodTitle = `Periodo Académico No. ${academicPeriod.pac}, ${academicPeriod.pac_modality}, ${academicPeriod.year}`;

    // En cuestion de rendimiento, es mejor hacer las consultas
    // de todos los datos necesarios antes de iterar sobre el archivo
    // y no hacer una consulta cada vez que se itere sobre un item
    // Aca se evita realizar hasta quiza +100 consultas a la base de datos
    const [
      teachers,
      centerDepartments,
      allCourses,
      modalities,
      existingCourseClassrooms,
      classrooms,
    ] = await Promise.all([
      this.teachersService.findAll(),
      this.centersService.findOne(coordinator.centerDepartment.centerId),
      this.coursesService.findAllByCenterDepartmentId(centerDepartmentId),
      this.modalitiesService.findAll(),
      this.courseClassroomsService.findAllWithSelectAndPeriodId(
        academicPeriod.id,
      ),
      this.classroomService.findAll(),
    ]);

    const teachersMap = new Map(teachers.map((t) => [t.code, t]));
    // const centerDepartmentsMap = new Map(
    //   centerDepartments.map((d) => [normalizeText(d.name), d]),
    // );
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

    const coursesGroupByTeacherCodeEntries: Record<
      string,
      Omit<TAcademicAssignmentReport, 'id'> & {
        userId: string;
        courses: TCreateCourseClassroom[];
      }
    > = {};
    const coursesArray: TAcademicAssignmentReportFileView[] = [];

    for (const item of allData) {
      const {
        teacherCode,
        courseCode,
        section,
        days,
        studentCount,
        classroomName,
        departmentName,
        center: centerName,
        observation,
      } = item;

      // Validar días al inicio
      this.validateDays(days);

      this.validateUniqueClass(allData, item);

      const teacher = this.findTeacher(teachersMap, teacherCode);
      // const center = this.findCenterDepartment(centerDepartments, centerName);
      const department = this.findDepartment(
        // new Map(center.departments.map((d) => [normalizeText(d.name), d])),
        centerDepartments.departments,
        departmentName,
      );
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
          centerDepartmentId: department.centerDepartmentId,
          periodId: academicPeriod.id,
          courses: [],
        };
      }

      const courseElement = {
        courseId: course.id,
        section,
        days: days.toString(),
        classroomId: classroom.id,
        modalityId: this.getModalityId(classroom.name, modalities),
        studentCount,
        groupCode: `${teacherCode}-${section}-${days}`, // Generamos un código de grupo único
        nearGraduation: false, // Por defecto, ya que no se especifica en el archivo
        observation: observation || null, // Si no hay observación, se asigna
      };

      coursesGroupByTeacherCodeEntries[teacherCode].courses.push(courseElement);

      coursesArray.push({
        userId: teacher.userId,
        teacherId: teacher.id,
        teacherCode: teacher.code,
        teacherName: teacher.name,
        courseCode: course.code,
        courseName: course.name,
        uv: course.uvs,
        section,
        studentCount,
        days,
        center: centerDepartments.name,
        classroomName: classroom.name,
        departmentName: course.department.name,
        centerDepartmentId: department.centerDepartmentId,
        coordinator: coordinator.teacher.user.name,
        observation: courseElement.observation,
      });
    }

    return {
      coursesView: {
        pacId: academicPeriod.id,
        pac: academicPeriod.pac,
        year: academicPeriod.year,
        pac_modality: academicPeriod.pac_modality,
        title: academicPeriodTitle,
        courses: coursesArray,
      },
      coursesGroupByTeacherCodeEntries,
    };
  }

  // createFromArray
  async createFromArray(
    coursesGroupByTeacherCodeEntries: TGroupedCoursesByTeacher,
  ) {
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
      const { teacherId, userId, centerDepartmentId, periodId, courses } =
        academicInfo;

      const academicAssignmentReport =
        allAcademicAssignmentReports.find(
          (aar: TAcademicAssignmentReport) =>
            aar.teacherId === teacherId &&
            aar.centerDepartmentId === centerDepartmentId &&
            aar.periodId === periodId,
        ) ??
        (await this.create({
          userId,
          centerDepartmentId,
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
            },
          })),
        },
      });
    }

    return results;
  }

  private parseAcademicTitle(title?: string): ParsedTitle | undefined {
    if (!title) return;

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
      throw new BadRequestException(`No se detectó año en “${title}”.`);
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
        `Ya existe una clase con el docente <${item.teacherCode}>...`,
      );
    }
  }

  private validateDays(days: string) {
    const validDays = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'];

    const regex = /^(Lu|Ma|Mi|Ju|Vi|Sa|Do)+$/;

    if (!regex.test(days)) {
      throw new BadRequestException(
        `El valor de 'days' (${days}) no es válido. Debe ser combinación de: ${validDays.join(
          ', ',
        )}.`,
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

  private findCenterDepartment(
    centerDepartments: Map<string, TCenterJoin>,
    center: string,
  ): TCenterJoin {
    const centerDepartment = centerDepartments.get(normalizeText(center));

    if (!centerDepartment)
      throw new NotFoundException(
        `No se encontró el centro con nombre <${center}>.`,
      );

    return centerDepartment;
  }

  private findDepartment(
    departments: (TDepartment & { centerDepartmentId: string })[],
    departmentName: string,
  ): TDepartment & { centerDepartmentId: string } {
    const department = departments.find((d) => d.name === departmentName);

    if (!department)
      throw new NotFoundException(
        `No se encontró el departamento con nombre <${departmentName}> en el centro seleccionado.`,
      );

    return department;
  }

  private findCourse(
    allCoursesMap: Map<string, TOutputCourseWithSelect>,
    courseCode: string,
    department: TDepartment & { centerDepartmentId: string },
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
