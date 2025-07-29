import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAcademicPeriodDto, UpdateAcademicPeriodDto } from '../dto';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  TCreateAcademicPeriod,
  TAcademicPeriod,
  TUpdateAcademicPeriod,
} from '../types';

@Injectable()
export class AcademicPeriodsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createAcademicPeriodDto: CreateAcademicPeriodDto,
  ): Promise<TCreateAcademicPeriod> {
    const newAcademicPeriod = await this.prisma.academic_Period.create({
      data: {
        ...createAcademicPeriodDto,
      },
    });

    return newAcademicPeriod;
  }

  async findAll(): Promise<TAcademicPeriod[]> {
    const academicPeriods = await this.prisma.academic_Period.findMany();

    return academicPeriods;
  }

  async findOne(id: string): Promise<TAcademicPeriod> {
    const academicPeriod = await this.prisma.academic_Period.findUnique({
      where: {
        id,
      },
    });

    if (!academicPeriod)
      throw new NotFoundException(
        `El periodo académico con id <${id}> no fue encontrado.`,
      );

    return academicPeriod;
  }

  async update(
    id: string,
    updateAcademicPeriodDto: UpdateAcademicPeriodDto,
  ): Promise<TUpdateAcademicPeriod> {
    const academicPeriodUpdate = await this.prisma.academic_Period.update({
      where: {
        id,
      },
      data: {
        ...updateAcademicPeriodDto,
      },
    });

    return academicPeriodUpdate;
  }

  async remove(id: string): Promise<TAcademicPeriod> {
    const academicPeriodDelete = await this.prisma.academic_Period.delete({
      where: {
        id,
      },
    });

    return academicPeriodDelete;
  }
}
