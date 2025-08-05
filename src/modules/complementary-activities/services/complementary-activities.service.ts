import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateComplementaryActivityDto,
  UpdateComplementaryActivityDto,
} from '../dto';
import { TComplementaryActivity } from '../types';
import { normalizeText, paginate, paginateOutput } from 'src/common/utils';
import { IPaginateOutput } from 'src/common/interfaces';
import { QueryPaginationDto } from 'src/common/dto';

@Injectable()
export class ComplementaryActivitiesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createComplementaryActivityDto: CreateComplementaryActivityDto,
  ): Promise<TComplementaryActivity> {
    const newComplementaryActivity =
      await this.prisma.complementary_Activity.create({
        data: {
          ...createComplementaryActivityDto,
        },
      });

    return newComplementaryActivity;
  }

  async findAll(): Promise<TComplementaryActivity[]> {
    const complementaryActivities =
      await this.prisma.complementary_Activity.findMany();

    return complementaryActivities;
  }

  async findAllWithPagination(
    query: QueryPaginationDto,
  ): Promise<IPaginateOutput<TComplementaryActivity>> {
    const [complementaryActivities, count] = await Promise.all([
      this.prisma.complementary_Activity.findMany({
        ...paginate(query),
      }),
      this.prisma.complementary_Activity.count(),
    ]);

    return paginateOutput<TComplementaryActivity>(
      complementaryActivities,
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
  ): Promise<IPaginateOutput<TComplementaryActivity>> {
    // const teacher = await this.teachersService.findOneByUserId(userId);
    const { userId, code } = user;

    const [complementaryActivities, count] = await Promise.all([
      this.prisma.complementary_Activity.findMany({
        where: {
          assignmentReport: {
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
        },
        ...paginate(query),
        relationLoadStrategy: 'join',
      }),
      this.prisma.academic_Assignment_Report.count({
        where: {
          teacher: {
            userId,
          },
        },
      }),
    ]);

    if (count === 0)
      throw new NotFoundException(
        `No encontraron se actividades complementarias para el usuario <${userId ?? code}>.`,
      );

    return paginateOutput<TComplementaryActivity>(
      complementaryActivities,
      count,
      query,
    );
  }

  async findOne(id: string): Promise<TComplementaryActivity> {
    const activityType = await this.prisma.complementary_Activity.findUnique({
      where: {
        id,
      },
    });

    if (!activityType)
      throw new NotFoundException(
        `La actividad complementaria con id ${id} no fue encontrada.`,
      );

    return activityType;
  }

  async update(
    id: string,
    updateComplementaryActivityDto: UpdateComplementaryActivityDto,
  ): Promise<TComplementaryActivity> {
    const activityTypeUpdate = await this.prisma.complementary_Activity.update({
      where: {
        id,
      },
      data: {
        ...updateComplementaryActivityDto,
      },
    });

    return activityTypeUpdate;
  }

  async remove(id: string): Promise<TComplementaryActivity> {
    const activityTypeDelete = await this.prisma.complementary_Activity.delete({
      where: {
        id,
      },
    });

    return activityTypeDelete;
  }
}
