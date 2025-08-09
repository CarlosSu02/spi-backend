import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCourseStadisticDto, UpdateCourseStadisticDto } from '../dto';
import {
  TCreateCourseStadistic,
  TCourseStadistic,
  TUpdateCourseStadistic,
} from '../types';
import { CourseClassroomsService } from './course-classrooms.service';
import { IPaginateOutput } from 'src/common/interfaces';
import { QueryPaginationDto } from 'src/common/dto';
import { paginate, paginateOutput } from 'src/common/utils';

@Injectable()
export class CourseStadisticsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly courseClassroomsService: CourseClassroomsService,
  ) {}

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

  async findAllWithPagination(
    query: QueryPaginationDto,
  ): Promise<IPaginateOutput<TCourseStadistic>> {
    const [courseStadistics, count] = await Promise.all([
      this.prisma.course_Stadistic.findMany({
        ...paginate(query),
      }),
      this.prisma.course_Stadistic.count(),
    ]);

    return paginateOutput<TCourseStadistic>(courseStadistics, count, query);
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
    const { studentCount } = await this.courseClassroomsService.findOne(id);
    const { ABD, APB, NSP, RPB } = updateCourseStadisticDto;

    const valuesToSum = [ABD, APB, NSP, RPB].filter((v) => this.isNumber(v));

    if (valuesToSum.length > 0) {
      const total = valuesToSum.reduce((acc, val) => acc + val, 0);
      if (total !== studentCount) {
        throw new BadRequestException(
          `La suma de ABD, APB, NSP, RPB (${total}) no coincide con la cantidad de estudiantes <${studentCount}>`,
        );
      }
    }

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

  private isNumber(value: unknown): value is number {
    return typeof value === 'number';
  }
}
