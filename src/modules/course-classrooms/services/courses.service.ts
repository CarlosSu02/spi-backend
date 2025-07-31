import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCourseDto, UpdateCourseDto } from '../dto';
import { TCreateCourse, TCourse, TUpdateCourse } from '../types';
import { normalizeText, paginate, paginateOutput } from 'src/common/utils';
import { IPaginateOutput } from 'src/common/interfaces';
import { QueryPaginationDto } from 'src/common/dto';

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

  async findAllWithPagination(
    query: QueryPaginationDto,
  ): Promise<IPaginateOutput<TCourse>> {
    const [courses, count] = await Promise.all([
      this.prisma.course.findMany({
        ...paginate(query),
      }),
      this.prisma.course.count(),
    ]);

    return paginateOutput<TCourse>(courses, count, query);
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
