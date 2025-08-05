import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateActivityTypeDto, UpdateActivityTypeDto } from '../dto';
import { TActivityType } from '../types';

@Injectable()
export class ActivityTypesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createActivityTypeDto: CreateActivityTypeDto,
  ): Promise<TActivityType> {
    const newActivityType = await this.prisma.activity_Type.create({
      data: {
        ...createActivityTypeDto,
      },
    });

    return newActivityType;
  }

  async findAll(): Promise<TActivityType[]> {
    const activityTypes = await this.prisma.activity_Type.findMany();

    return activityTypes;
  }

  async findOne(id: string): Promise<TActivityType> {
    const activityType = await this.prisma.activity_Type.findUnique({
      where: {
        id,
      },
    });

    if (!activityType)
      throw new NotFoundException(
        `El tipo de actividad con id ${id} no fue encontrada.`,
      );

    return activityType;
  }

  async update(
    id: string,
    updateActivityTypeDto: UpdateActivityTypeDto,
  ): Promise<TActivityType> {
    const activityTypeUpdate = await this.prisma.activity_Type.update({
      where: {
        id,
      },
      data: {
        ...updateActivityTypeDto,
      },
    });

    return activityTypeUpdate;
  }

  async remove(id: string): Promise<TActivityType> {
    const activityTypeDelete = await this.prisma.activity_Type.delete({
      where: {
        id,
      },
    });

    return activityTypeDelete;
  }
}
