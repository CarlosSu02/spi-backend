import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCourseStadisticDto, UpdateCourseStadisticDto } from '../dto';
import {
  TCreateCourseStadistic,
  TCourseStadistic,
  TUpdateCourseStadistic,
} from '../types';

@Injectable()
export class CourseStadisticsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createCourseStadisticDto: CreateCourseStadisticDto,
  ): Promise<TCreateCourseStadistic> {
    const newCourseStadistic = await this.prisma.course_Stadistic.create({
      data: {
        ...createCourseStadisticDto,
      },
    });

    return newCourseStadistic;
  }

  async findAll(): Promise<TCourseStadistic[]> {
    const courseStadistics = await this.prisma.course_Stadistic.findMany();

    return courseStadistics;
  }

  async findOne(id: string): Promise<TCourseStadistic> {
    const courseStadistic = await this.prisma.course_Stadistic.findUnique({
      where: {
        id,
      },
    });

    if (!courseStadistic)
      throw new NotFoundException(
        `La estadística de clase con id ${id} no fue encontrada.`,
      );

    return courseStadistic;
  }

  async update(
    id: string,
    updateCourseStadisticDto: UpdateCourseStadisticDto,
  ): Promise<TUpdateCourseStadistic> {
    const courseStadisticUpdate = await this.prisma.course_Stadistic.update({
      where: {
        id,
      },
      data: {
        ...updateCourseStadisticDto,
      },
    });

    return courseStadisticUpdate;
  }

  async remove(id: string): Promise<TCourseStadistic> {
    const courseStadisticDelete = await this.prisma.course_Stadistic.delete({
      where: {
        id,
      },
    });

    return courseStadisticDelete;
  }
}
