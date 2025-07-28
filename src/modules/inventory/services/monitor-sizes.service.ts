import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMonitorSizeDto, UpdateMonitorSizeDto } from '../dto';
import { TCreateMonitorSize, TMonitorSize, TUpdateMonitorSize } from '../types';

@Injectable()
export class MonitorSizesService {
  constructor(private prisma: PrismaService) {}

  async create(
    createMonitorSizeDto: CreateMonitorSizeDto,
  ): Promise<TCreateMonitorSize> {
    const newMonitorSize = await this.prisma.monitor_Size.create({
      data: {
        ...createMonitorSizeDto,
      },
    });

    return newMonitorSize;
  }

  async findAll(): Promise<TMonitorSize[]> {
    const monitorSizes = await this.prisma.monitor_Size.findMany();

    return monitorSizes;
  }

  async findOne(id: string): Promise<TMonitorSize> {
    const monitorSize = await this.prisma.monitor_Size.findUnique({
      where: {
        id,
      },
    });

    if (!monitorSize)
      throw new NotFoundException(
        `El tamaño de monitor con id <${id}> no fue encontrado.`,
      );

    return monitorSize;
  }

  async update(
    id: string,
    updateMonitorSizeDto: UpdateMonitorSizeDto,
  ): Promise<TUpdateMonitorSize> {
    const monitorSizeUpdate = await this.prisma.monitor_Size.update({
      where: {
        id,
      },
      data: {
        ...updateMonitorSizeDto,
      },
    });

    return monitorSizeUpdate;
  }

  async remove(id: string): Promise<TMonitorSize> {
    const monitorSizeDelete = await this.prisma.monitor_Size.delete({
      where: {
        id,
      },
    });

    return monitorSizeDelete;
  }
}
