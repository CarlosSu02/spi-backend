import {
  BadGatewayException,
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/modules/users/services/users.service';
import { IPaginateOutput } from 'src/common/interfaces';
import { QueryPaginationDto } from 'src/common/dto';
import { paginate, paginateOutput } from 'src/common/utils';
import { CreateTeacherPreferenceDto } from '../dto/create-teacher-preference.dto';
import { UpdateTeacherPreferenceDto } from '../dto/update-teacher-preference.dto';
import { TTeacherPreference } from '../types/teacher-preference.types';
import { TCustomOmit } from 'src/common/types';

@Injectable()
export class TeacherPreferencesService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  async create(createTeacherPreferenceDto: CreateTeacherPreferenceDto) {
    const { preferredClasses, ...dataToCreate } = createTeacherPreferenceDto;

    const newTeacherPreference = await this.prisma.teacherPreference.create({
      data: {
        ...dataToCreate,
        preferredClasses: {
          create: preferredClasses.map((c) => ({
            course: {
              connect: {
                code: c,
              },
            },
          })),
        },
      },
    });

    return newTeacherPreference;
  }

  async findAll(): Promise<TTeacherPreference[]> {
    const teacherPreferences = await this.prisma.teacherPreference.findMany({
      relationLoadStrategy: 'join',
      include: {
        preferredClasses: {
          include: {
            course: true,
          },
        },
      },
    });

    return teacherPreferences;
  }

  async findAllWithPagination(
    query: QueryPaginationDto,
  ): Promise<IPaginateOutput<TTeacherPreference>> {
    const [teacherPreferences, count] = await Promise.all([
      this.prisma.teacherPreference.findMany({
        ...paginate(query),
        relationLoadStrategy: 'join',
        include: {
          preferredClasses: {
            include: {
              course: true,
            },
          },
        },
      }),
      this.prisma.teacherPreference.count(),
    ]);

    if (teacherPreferences.length === 0)
      throw new BadRequestException(
        'No se encontraron preferencias de docentes.',
      );

    return paginateOutput<TTeacherPreference>(teacherPreferences, count, query);
  }

  async findOne(id: string) {
    // TODO: se puede buscar por el del docente, ya que solo tiene una
    const teacherPreference = await this.prisma.teacherPreference.findUnique({
      where: {
        id,
      },
    });

    if (!teacherPreference)
      throw new NotFoundException(
        `La preferencia del docente con id <${id}> no fue encontrado.`,
      );

    return teacherPreference;
  }

  async findOneByUserId(userId: string): Promise<TTeacherPreference> {
    const teacherPreference = await this.prisma.teacherPreference.findFirst({
      where: {
        teacher: {
          userId,
        },
      },
      relationLoadStrategy: 'join',
      include: {
        preferredClasses: {
          include: {
            course: true,
          },
        },
      },
    });

    if (!teacherPreference)
      throw new NotFoundException(
        `La preferencia de docente con userId <${userId}> no fue encontrado.`,
      );

    return teacherPreference;
  }

  async findOneByCode(code: string) {
    const teacherPreference = await this.prisma.teacherPreference.findFirst({
      where: {
        teacher: {
          user: {
            code,
          },
        },
      },
      relationLoadStrategy: 'join',
      include: {
        preferredClasses: {
          include: {
            course: true,
          },
        },
      },
    });

    if (!teacherPreference)
      throw new NotFoundException(
        `La preferencia de docente con el código <${code}> no fue encontrado.`,
      );

    return teacherPreference;
  }

  async update(
    id: string,
    updateTeacherPreferenceDto: UpdateTeacherPreferenceDto,
  ) {
    await this.findOne(id);

    const teacherPreferenceUpdate = await this.prisma.teacherPreference.update({
      where: {
        id,
      },
      data: {
        ...updateTeacherPreferenceDto,
      },
    });

    return teacherPreferenceUpdate;
  }

  async remove(
    id: string,
  ): Promise<TCustomOmit<TTeacherPreference, 'preferredClasses'>> {
    const teacherPreference = await this.findOne(id);

    const teacher = await this.usersService.findOne(
      teacherPreference.teacherId,
    );

    const deleteTeacherPreference = await this.prisma.teacherPreference.delete({
      where: {
        teacherId: teacher.id,
      },
    });

    return deleteTeacherPreference;
  }
}
