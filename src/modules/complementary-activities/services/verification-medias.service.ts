import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateVerificationMediaDto, UpdateVerificationMediaDto } from '../dto';
import { TVerificationMedia } from '../types';
import { MultimediaTypesService } from './multimedia-types.service';
import { QueryPaginationDto } from 'src/common/dto';
import { IPaginateOutput } from 'src/common/interfaces';
import { normalizeText, paginate, paginateOutput } from 'src/common/utils';

@Injectable()
export class VerificationMediasService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly multimediaTypesService: MultimediaTypesService,
  ) {}

  async create(
    createVerificationMediaDto: CreateVerificationMediaDto,
  ): Promise<TVerificationMedia> {
    const { multimediaType, ...dataWithoutMultimediaType } =
      createVerificationMediaDto;

    const multimediaTypeExists =
      await this.multimediaTypesService.findOneByDescription(multimediaType);

    const newVerificationMedia = await this.prisma.verification_Media.create({
      data: {
        ...dataWithoutMultimediaType,
        multimediaTypeId: multimediaTypeExists.id,
      },
    });

    return newVerificationMedia;
  }

  async findAll(): Promise<TVerificationMedia[]> {
    const verificationMedias = await this.prisma.verification_Media.findMany();

    return verificationMedias;
  }

  async findAllWithPagination(
    query: QueryPaginationDto,
  ): Promise<IPaginateOutput<TVerificationMedia>> {
    const [verificationMedias, count] = await Promise.all([
      this.prisma.verification_Media.findMany({
        ...paginate(query),
      }),
      this.prisma.complementary_Activity.count(),
    ]);

    return paginateOutput<TVerificationMedia>(verificationMedias, count, query);
  }

  async findAllByUserIdAndCode(
    query: QueryPaginationDto,
    user: {
      userId?: string;
      code?: string;
    },
  ): Promise<IPaginateOutput<TVerificationMedia>> {
    // const teacher = await this.teachersService.findOneByUserId(userId);
    const { userId, code } = user;

    const [verificationMedias, count] = await Promise.all([
      this.prisma.verification_Media.findMany({
        where: {
          complementaryActivity: {
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
        `No se encontraron medio de verificación para el usuario <${userId ?? code}>.`,
      );

    return paginateOutput<TVerificationMedia>(verificationMedias, count, query);
  }
  async findOne(id: string): Promise<TVerificationMedia> {
    const verificationMedia = await this.prisma.verification_Media.findUnique({
      where: {
        id,
      },
    });

    if (!verificationMedia)
      throw new NotFoundException(
        `El medio de verificación con id ${id} no fue encontrada.`,
      );

    return verificationMedia;
  }

  async update(
    id: string,
    updateVerificationMediaDto: UpdateVerificationMediaDto,
  ): Promise<TVerificationMedia> {
    const { multimediaType, ...dataWithoutMultimediaType } =
      updateVerificationMediaDto;

    const dataToUpdate: Omit<UpdateVerificationMediaDto, 'multimediaType'> & {
      multimediaTypeId?: string;
    } = {
      ...dataWithoutMultimediaType,
    };

    if (multimediaType) {
      const multimediaTypeExists =
        await this.multimediaTypesService.findOneByDescription(multimediaType);

      dataToUpdate.multimediaTypeId = multimediaTypeExists.id;
    }

    const verificationMediaUpdate = await this.prisma.verification_Media.update(
      {
        where: {
          id,
        },
        data: {
          ...dataToUpdate,
        },
      },
    );

    return verificationMediaUpdate;
  }

  async remove(id: string): Promise<TVerificationMedia> {
    const verificationMediaDelete = await this.prisma.verification_Media.delete(
      {
        where: {
          id,
        },
      },
    );

    return verificationMediaDelete;
  }
}
