import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAudioEquipmentDto, UpdateAudioEquipmentDto } from '../dto';
import {
  TAudioEquipment,
  TCreateAudioEquipment,
  TUpdateAudioEquipment,
} from '../types';

@Injectable()
export class AudioEquipmentService {
  constructor(private prisma: PrismaService) {}

  async create(
    createAudioEquipmentDto: CreateAudioEquipmentDto,
  ): Promise<TCreateAudioEquipment> {
    const newAudioEquipment = await this.prisma.audio_Equipment.create({
      data: {
        ...createAudioEquipmentDto,
      },
    });

    return newAudioEquipment;
  }

  async findAll(): Promise<TAudioEquipment[]> {
    const audioEquipments = await this.prisma.audio_Equipment.findMany();

    return audioEquipments;
  }

  async findOne(id: string): Promise<TAudioEquipment> {
    const audioEquipment = await this.prisma.audio_Equipment.findUnique({
      where: {
        id,
      },
    });

    if (!audioEquipment)
      throw new NotFoundException(
        `El edificio con id <${id}> no fue encontrado.`,
      );

    return audioEquipment;
  }

  async update(
    id: string,
    updateAudioEquipmentDto: UpdateAudioEquipmentDto,
  ): Promise<TUpdateAudioEquipment> {
    const audioEquipmentUpdate = await this.prisma.audio_Equipment.update({
      where: {
        id,
      },
      data: {
        ...updateAudioEquipmentDto,
      },
    });

    return audioEquipmentUpdate;
  }

  async remove(id: string): Promise<TAudioEquipment> {
    const audioEquipmentDelete = await this.prisma.audio_Equipment.delete({
      where: {
        id,
      },
    });

    return audioEquipmentDelete;
  }
}
