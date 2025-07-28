import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePcEquipmentDto, UpdatePcEquipmentDto } from '../dto';
import { TCreatePcEquipment, TPcEquipment, TUpdatePcEquipment } from '../types';

@Injectable()
export class PcEquipmentsService {
  constructor(private prisma: PrismaService) {}

  async create(
    createPcEquipmentDto: CreatePcEquipmentDto,
  ): Promise<TCreatePcEquipment> {
    const newPcEquipment = await this.prisma.pC_Equipment.create({
      data: {
        ...createPcEquipmentDto,
      },
    });

    return newPcEquipment;
  }

  async findAll(): Promise<TPcEquipment[]> {
    const pcEquipments = await this.prisma.pC_Equipment.findMany();

    return pcEquipments;
  }

  async findOne(id: string): Promise<TPcEquipment> {
    const pcEquipment = await this.prisma.pC_Equipment.findUnique({
      where: {
        id,
      },
    });

    if (!pcEquipment)
      throw new NotFoundException(`La marca con id <${id}> no fue encontrada.`);

    return pcEquipment;
  }

  async update(
    id: string,
    updatePcEquipmentDto: UpdatePcEquipmentDto,
  ): Promise<TUpdatePcEquipment> {
    const pcEquipmentUpdate = await this.prisma.pC_Equipment.update({
      where: {
        id,
      },
      data: {
        ...updatePcEquipmentDto,
      },
    });

    return pcEquipmentUpdate;
  }

  async remove(id: string): Promise<TPcEquipment> {
    const pcEquipmentDelete = await this.prisma.pC_Equipment.delete({
      where: {
        id,
      },
    });

    return pcEquipmentDelete;
  }
}
