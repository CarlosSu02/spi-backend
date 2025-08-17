import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAcademicPeriodDto, UpdateAcademicPeriodDto } from '../dto';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  TCreateAcademicPeriod,
  TAcademicPeriod,
  TUpdateAcademicPeriod,
  TPacModality,
} from '../types';
import { getYear, setYear } from 'date-fns';

type TCurrentAcademicPeriod = {
  year: number;
  pac_modality: TPacModality;
  pac: number;
};

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
    await this.currentAcademicPeriod();
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

  async findOneByYearPacModality(
    year: number,
    pac: number,
    pac_modality: 'Trimestre' | 'Semestre',
  ): Promise<TAcademicPeriod> {
    const academicPeriod = await this.prisma.academic_Period.findFirst({
      where: {
        AND: [
          {
            year,
          },
          {
            pac,
          },
          {
            pac_modality,
          },
        ],
      },
    });

    if (!academicPeriod)
      throw new NotFoundException(
        `El periodo académico con los parámetros year <${year}>, pac <${pac}>, pac_modality <${pac_modality}> no fue encontrado.`,
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

  currentAcademicPeriod = async (
    pac_modality: TPacModality = 'Trimestre',
  ): Promise<TCurrentAcademicPeriod> => {
    const currentDate = new Date();
    const yearReplace = 2025;
    const newDate = setYear(currentDate, yearReplace);
    const utcDate = new Date(
      Date.UTC(
        newDate.getUTCFullYear(),
        newDate.getUTCMonth(),
        newDate.getUTCDate(),
      ),
    );

    const period = await this.prisma.commonDatesAcademicPeriods.findFirst({
      where: {
        startDate: {
          lte: utcDate,
        },
        endDate: {
          gte: utcDate,
        },
        pac_modality,
      },
    });

    if (!period)
      throw new BadRequestException(
        'No se encontró un periodo que concuerde con la fecha actual.',
      );

    // const currentPeriod = await this.findOneByYearPacModality(
    //   getYear(startDate),
    //   pac,
    //   pac_modality as 'Trimestre' | 'Semestre',
    // );
    //
    // return currentPeriod;

    return {
      pac: period.pac,
      pac_modality,
      year: getYear(currentDate),
    };
  };

  getNextAcademicPeriod = async ({
    pac,
    pac_modality,
    year,
  }: TCurrentAcademicPeriod) => {
    const periodSearch = this.handlePeriod({ pac, pac_modality, year });

    return await this.findOneByYearPacModality(
      periodSearch.updatedYear,
      periodSearch.updatedPac,
      pac_modality,
    );
  };

  private handlePeriod = ({
    pac,
    pac_modality,
    year,
  }: TCurrentAcademicPeriod): {
    updatedPac: number;
    updatedYear: number;
  } => {
    const periods = {
      Trimestre: {
        1: {
          updatedPac: pac + 1,
          updatedYear: year,
        },
        2: {
          updatedPac: pac + 1,
          updatedYear: year,
        },
        3: {
          updatedPac: 1,
          updatedYear: year + 1,
        },
      },
      Semestre: {
        1: {
          updatedPac: pac + 1,
          updatedYear: year,
        },
        2: {
          updatedPac: 1,
          updatedYear: year + 1,
        },
      },
    };

    return periods[pac_modality][pac];
  };
}
