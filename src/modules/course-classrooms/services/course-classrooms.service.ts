import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCourseClassroomDto, UpdateCourseClassroomDto } from '../dto';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  TCreateCourseClassroom,
  TCourseClassroom,
  TUpdateCourseClassroom,
  TCourseClassroomSelectPeriod,
  TCourse,
} from '../types';
import { AcademicPeriodsService } from 'src/modules/teaching-assignment/services/academic-periods.service';
import { IPaginateOutput } from 'src/common/interfaces';
import { QueryPaginationDto } from 'src/common/dto';
import { paginate, paginateOutput } from 'src/common/utils';
import { TTeachingSession } from 'src/modules/teaching-assignment/types';
import { formatISO } from 'date-fns';
import { TeacherDepartmentPositionService } from 'src/modules/teachers/services/teacher-department-position.service';
import { PositionsService } from 'src/modules/teachers-config/services/positions.service';
import { EPosition } from 'src/modules/teachers-config/enums';
import { CreateTeacherDepartmentPositionDto } from 'src/modules/teachers/dto/create-teacher-department-position.dto';

@Injectable()
export class CourseClassroomsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly academicPeriodsService: AcademicPeriodsService,
    private readonly teacherDepartmentPositionService: TeacherDepartmentPositionService,
    private readonly positionsService: PositionsService,
  ) {}

  async create(
    createCourseClassroomDto: CreateCourseClassroomDto,
  ): Promise<TCreateCourseClassroom> {
    const newCourseClassroom = await this.prisma.courseClassroom.create({
      data: {
        ...createCourseClassroomDto,
      },
    });

    return newCourseClassroom;
  }

  async findAll(): Promise<TCourseClassroom[]> {
    const courseClassrooms = await this.prisma.courseClassroom.findMany();

    return courseClassrooms;
  }

  async findAllWithPagination(
    query: QueryPaginationDto,
  ): Promise<IPaginateOutput<TCourseClassroom>> {
    const [courseClassrooms, count] = await Promise.all([
      this.prisma.courseClassroom.findMany({
        ...paginate(query),
        relationLoadStrategy: 'join',
        include: {
          course: true,
        },
      }),
      this.prisma.courseClassroom.count(),
    ]);

    return paginateOutput<TCourseClassroom>(courseClassrooms, count, query);
  }

  async findAllWithSelectAndPeriodId(
    periodId: string,
  ): Promise<TCourseClassroomSelectPeriod[]> {
    const courseClassrooms = await this.prisma.courseClassroom.findMany({
      where: {
        // courseId: course.id,
        // days: days.toString(),
        teachingSession: {
          assignmentReport: {
            periodId,
          },
        },
      },
      select: {
        id: true,
        classroomId: true,
        courseId: true,
        days: true,
        groupCode: true,
        teachingSession: {
          select: {
            assignmentReport: {
              select: {
                periodId: true,
                teacherId: true,
              },
            },
          },
        },
      },
    });

    return courseClassrooms;
  }

  async findOne(id: string): Promise<
    TCourseClassroom & {
      course: TCourse;
      teachingSession: TTeachingSession & {
        assignmentReport: { periodId: string };
      };
    }
  > {
    const courseClassroom = await this.prisma.courseClassroom.findUnique({
      where: {
        id,
      },
      include: {
        course: true,
        teachingSession: {
          include: {
            assignmentReport: {
              select: {
                periodId: true,
              },
            },
          },
        },
      },
    });

    if (!courseClassroom)
      throw new NotFoundException(
        `La clase en el salón con id ${id} no fue encontrada.`,
      );

    return courseClassroom;
  }

  async findCurrentPeriodAndUserId(
    userId: string,
  ): Promise<TCourseClassroom[]> {
    const currentPeriodData =
      await this.academicPeriodsService.currentAcademicPeriod();

    const courseClassrooms = await this.prisma.courseClassroom.findMany({
      where: {
        teachingSession: {
          assignmentReport: {
            periodId: currentPeriodData.id,
            teacher: {
              userId,
            },
          },
        },
      },
      relationLoadStrategy: 'join',
      include: {
        course: {
          select: {
            name: true,
            code: true,
            uvs: true,
            department: {
              select: {
                name: true,
                center: true,
              },
            },
          },
        },
        classroom: {
          select: {
            name: true,
          },
        },
      },
    });

    if (courseClassrooms.length === 0)
      throw new NotFoundException(
        `No se encontraron clases para el docente con id <${userId}>.`,
      );

    return courseClassrooms;
  }

  async findAllByCoordinatorAndPeriodId(
    userId: string,
    periodId: string,
  ): Promise<
    (TCourseClassroom & {
      teacher: { id: string; userId: string; name: string; code: string };
    })[]
  > {
    const user =
      await this.teacherDepartmentPositionService.findOneByUserId(userId);

    const courseClassrooms = await this.prisma.courseClassroom.findMany({
      where: {
        teachingSession: {
          assignmentReport: {
            periodId,
            departmentId: user.departmentId,
          },
        },
      },
      relationLoadStrategy: 'join',
      include: {
        course: {
          select: {
            name: true,
            code: true,
            uvs: true,
            department: {
              select: {
                name: true,
                center: true,
              },
            },
          },
        },
        classroom: {
          select: {
            name: true,
          },
        },
        teachingSession: {
          select: {
            assignmentReport: {
              select: {
                teacher: {
                  select: {
                    id: true,
                    userId: true,
                    user: {
                      select: {
                        code: true,
                        name: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (courseClassrooms.length === 0)
      throw new NotFoundException(
        'No se encontraron asignaturas para el periodo seleccionado.',
      );

    const mapped: (TCourseClassroom & {
      teacher: { id: string; userId: string; name: string; code: string };
    })[] = courseClassrooms.map(({ teachingSession, ...cc }) => ({
      ...cc,
      teacher: {
        id: teachingSession.assignmentReport.teacher.id,
        userId: teachingSession.assignmentReport.teacher.userId,
        ...teachingSession.assignmentReport.teacher.user,
      },
    }));

    return mapped;
  }

  async update(
    id: string,
    updateCourseClassroomDto: UpdateCourseClassroomDto,
  ): Promise<TUpdateCourseClassroom> {
    const courseClassroomUpdate = await this.prisma.courseClassroom.update({
      where: {
        id,
      },
      data: {
        ...updateCourseClassroomDto,
      },
    });

    return courseClassroomUpdate;
  }

  // CurrentPeriod
  async changeCourseClassroom(teacherId: string, courseClassroomId: string) {
    const courseClassroomData = await this.findOne(courseClassroomId);
    const currentPeriod =
      await this.academicPeriodsService.currentAcademicPeriod();

    if (
      courseClassroomData.teachingSession.assignmentReport.periodId !==
      currentPeriod.id
    )
      throw new BadRequestException(
        `No puede cambiar una clase que no sea del periodo actual <${currentPeriod.title}>.`,
      );

    const { course, teachingSession, ...dataToCreate } = courseClassroomData;

    const currentDate = formatISO(new Date().toISOString());

    const assignmentReport = await this.prisma.academicAssignmentReport.upsert({
      where: {
        teacherId_departmentId_periodId: {
          departmentId: course.departmentId,
          teacherId,
          periodId: currentPeriod.id,
        },
      },
      // update: {
      //   teachingSession: {
      //     update: {
      //       courseClassrooms: {
      //         connect: {
      //           id: courseClassroomId,
      //         },
      //         // connectOrCreate: {
      //         //   where: { id: courseClassroomId },
      //         //   create: {
      //         //     ...dataToCreate,
      //         //   },
      //         // },
      //       },
      //     },
      //   },
      // },
      create: {
        teacherId,
        departmentId: course.departmentId,
        periodId: teachingSession.assignmentReport.periodId,
        teachingSession: {
          create: {
            consultHour: currentDate, // Fecha actual
            // +1 hour
            tutoringHour: formatISO(new Date(currentDate).getTime() + 3600000),
          },
        },
      },
      update: {},
      relationLoadStrategy: 'join',
      include: { teachingSession: { select: { id: true } } },
    });

    await this.prisma.courseClassroom.update({
      where: { id: courseClassroomId },
      data: {
        teachingSessionId: assignmentReport.teachingSession?.id,
      },
    });

    const existingTeacherDeptPos =
      await this.teacherDepartmentPositionService.findOneByTeacherIdAndDepartmentId(
        teacherId,
        course.departmentId,
      );

    // no existe el docente en el departamento, por lo que se crea un nuevo cargo
    if (!existingTeacherDeptPos) {
      const positionId = (
        await this.positionsService.findOneByName(EPosition.NONE as string)
      ).id;

      const dto = {
        departmentId: course.departmentId,
        positionId,
        startDate: currentDate,
      } as CreateTeacherDepartmentPositionDto;

      await this.teacherDepartmentPositionService.createWithTeacherId(
        teacherId,
        dto,
      );
    }
  }

  async remove(id: string): Promise<TCourseClassroom> {
    const courseClassroomDelete = await this.prisma.courseClassroom.delete({
      where: {
        id,
      },
    });

    return courseClassroomDelete;
  }
}
