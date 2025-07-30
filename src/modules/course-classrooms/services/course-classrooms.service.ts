import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCourseClassroomDto, UpdateCourseClassroomDto } from '../dto';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  TCreateCourseClassroom,
  TCourseClassroom,
  TUpdateCourseClassroom,
} from '../types';

@Injectable()
export class CourseClassroomsService {
  constructor(private readonly prisma: PrismaService) {}

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
