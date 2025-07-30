import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCourseDto, UpdateCourseDto } from '../dto';
import { TCreateCourse, TCourse, TUpdateCourse } from '../types';
import { normalizeText } from 'src/common/utils';

@Injectable()
export class CoursesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCourseDto: CreateCourseDto): Promise<TCreateCourse> {
    const newCourse = await this.prisma.course.create({
      data: {
        ...createCourseDto,
      },
    });

    return newCourse;
  }

  async findAll(): Promise<TCourse[]> {
    const courses = await this.prisma.course.findMany();

    return courses;
  }

  async findOne(id: string): Promise<TCourse> {
    const course = await this.prisma.course.findUnique({
      where: {
        id,
      },
    });

    if (!course)
      throw new NotFoundException(
        `La asignatura con id ${id} no fue encontrada.`,
      );

    return course;
  }

  async findOneByCode(code: string): Promise<TCourse> {
    const course = await this.prisma.course.findUnique({
      where: {
        code: normalizeText(code),
      },
    });

    if (!course)
      throw new NotFoundException(
        `La asignatura con el código <${code}> no fue encontrada.`,
      );

    return course;
  }

  async update(
    id: string,
    updateCourseDto: UpdateCourseDto,
  ): Promise<TUpdateCourse> {
    const courseUpdate = await this.prisma.course.update({
      where: {
        id,
      },
      data: {
        ...updateCourseDto,
      },
    });
    return courseUpdate;
  }

  async remove(id: string): Promise<TCourse> {
    const courseDelete = await this.prisma.course.delete({
      where: {
        id,
      },
    });

    return courseDelete;
  }
}
