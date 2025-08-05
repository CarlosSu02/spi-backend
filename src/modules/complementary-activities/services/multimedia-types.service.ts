import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateMultimediaTypeDto } from '../dto/update-multimedia-type.dto';
import { TMultimediaType } from '../types';
import { CreateMultimediaTypeDto } from '../dto';

@Injectable()
export class MultimediaTypesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createMultimediaTypeDto: CreateMultimediaTypeDto,
  ): Promise<TMultimediaType> {
    const newMultimediaType = await this.prisma.multimedia_Type.create({
      data: {
        ...createMultimediaTypeDto,
      },
    });

    return newMultimediaType;
  }

  async findAll(): Promise<TMultimediaType[]> {
    const multimediaTypes = await this.prisma.multimedia_Type.findMany();

    return multimediaTypes;
  }

  async findOne(id: string): Promise<TMultimediaType> {
    const multimediaType = await this.prisma.multimedia_Type.findUnique({
      where: {
        id,
      },
    });

    if (!multimediaType)
      throw new NotFoundException(
        `El tipo de multimedia con id ${id} no fue encontrada.`,
      );

    return multimediaType;
  }

  async findOneByDescription(description: string): Promise<TMultimediaType> {
    const multimediaType = await this.prisma.multimedia_Type.findFirst({
      where: {
        description: {
          contains: description,
          mode: 'insensitive',
        },
      },
    });

    if (!multimediaType)
      throw new NotFoundException(
        `El tipo de multimedia con descripción ${description} no fue encontrada.`,
      );

    return multimediaType;
  }

  async update(
    id: string,
    updateMultimediaTypeDto: UpdateMultimediaTypeDto,
  ): Promise<TMultimediaType> {
    const multimediaTypeUpdate = await this.prisma.multimedia_Type.update({
      where: {
        id,
      },
      data: {
        ...updateMultimediaTypeDto,
      },
    });

    return multimediaTypeUpdate;
  }

  async remove(id: string): Promise<TMultimediaType> {
    const multimediaTypeDelete = await this.prisma.multimedia_Type.delete({
      where: {
        id,
      },
    });

    return multimediaTypeDelete;
  }
}
