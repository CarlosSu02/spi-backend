import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCourseClassroomDto, UpdateCourseClassroomDto } from '../dto';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  TCreateCourseClassroom,
  TCourseClassroom,
  TUpdateCourseClassroom,
  TCourseClassroomSelectPeriod,
} from '../types';
import { AcademicPeriodsService } from 'src/modules/teaching-assignment/services/academic-periods.service';

@Injectable()
export class CourseClassroomsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly academicPeriodsService: AcademicPeriodsService,
  ) {}

  async create(
    createCourseClassroomDto: CreateCourseClassroomDto,
  ): Promise<TCreateCourseClassroom> {
    const newCourseClassroom = await this.prisma.course_Classroom.create({
      data: {
        ...createCourseClassroomDto,
      },
    });

    return newCourseClassroom;
  }

  async findAll(): Promise<TCourseClassroom[]> {
    const courseClassrooms = await this.prisma.course_Classroom.findMany();

    return courseClassrooms;
  }

  async findAllWithSelectAndPeriodId(
    periodId: string,
  ): Promise<TCourseClassroomSelectPeriod[]> {
    const courseClassrooms = await this.prisma.course_Classroom.findMany({
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

  async findOne(id: string): Promise<TCourseClassroom> {
    const courseClassroom = await this.prisma.course_Classroom.findUnique({
      where: {
        id,
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

    const courseClassrooms = await this.prisma.course_Classroom.findMany({
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

  async update(
    id: string,
    updateCourseClassroomDto: UpdateCourseClassroomDto,
  ): Promise<TUpdateCourseClassroom> {
    const courseClassroomUpdate = await this.prisma.course_Classroom.update({
      where: {
        id,
      },
      data: {
        ...updateCourseClassroomDto,
      },
    });

    return courseClassroomUpdate;
  }

  async remove(id: string): Promise<TCourseClassroom> {
    const courseClassroomDelete = await this.prisma.course_Classroom.delete({
      where: {
        id,
      },
    });

    return courseClassroomDelete;
  }
}
