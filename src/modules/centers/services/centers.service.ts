import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCenterDto } from '../dto/create-center.dto';
import { UpdateCenterDto } from '../dto/update-center.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { TCenter } from '../types';

@Injectable()
export class CentersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCenterDto: CreateCenterDto): Promise<TCenter> {
    const newCenter = await this.prisma.center.create({
      data: {
        ...createCenterDto,
      },
    });

    return newCenter;
  }

  async findAll(): Promise<TCenter[]> {
    const centers = await this.prisma.center.findMany();

    // if (centers.length === 0)
    //   throw new NotFoundException('No se encontraron datos.'); // tambien se puede devolver un 200 como consulta exitosa pero con data []

    return centers;
  }

  async findOne(id: string): Promise<TCenter> {
    const center = await this.prisma.center.findUnique({
      where: {
        id,
      },
    });

    if (!center)
      throw new NotFoundException(
        `El centro con id <${id}> no fue encontrado.`,
      );

    // throw new HttpException(
    //   `El centro con id <${id}> no fue encontrado.`,
    //   HttpStatus.NOT_FOUND,
    // );

    return center;
  }

  async findOneByName(name: string): Promise<TCenter> {
    const center = await this.prisma.center.findUnique({
      where: {
        name,
      },
    });

    if (!center)
      throw new NotFoundException(
        `El centro con nombre <${name}> no fue encontrado.`,
      );

    // throw new HttpException(
    //   `El centro con id <${id}> no fue encontrado.`,
    //   HttpStatus.NOT_FOUND,
    // );

    return center;
  }

  async update(id: string, updateCenterDto: UpdateCenterDto): Promise<TCenter> {
    const centerUpdate = await this.prisma.center.update({
      where: {
        id,
      },
      data: {
        ...updateCenterDto,
      },
    });

    return centerUpdate;
  }

  async remove(id: string): Promise<TCenter> {
    const centerDelete = await this.prisma.center.delete({
      where: {
        id,
      },
    });

    return centerDelete;
  }
}
