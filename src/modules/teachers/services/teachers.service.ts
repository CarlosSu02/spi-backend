import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTeacherDto } from '../dto/create-teacher.dto';
import { UpdateTeacherDto } from '../dto/update-teacher.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/modules/users/services/users.service';
import { TOutputTeacher } from '../types';
import { IPaginateOutput } from 'src/common/interfaces';
import { QueryPaginationDto } from 'src/common/dto';
import { paginate, paginateOutput } from 'src/common/utils';
import { TCustomOmit } from 'src/common/types';

@Injectable()
export class TeachersService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    // private readonly teachersUndergradService: TeachersUndergradService,
  ) {}

  // para crear un perfil de docente para un usuario ya creado, siempre y cuando el rol, sea: DOCENTE, COORDINADOR_CARRERA
  async create(createTeacherDto: CreateTeacherDto) {
    const {
      categoryId,
      contractTypeId,
      shiftId,
      userId,
      undergradId,
      postgradId,
    } = createTeacherDto;

    const newTeacher = await this.prisma.teacher.create({
      data: {
        userId,
        categoryId,
        contractTypeId,
        shiftId,
        undergradDegrees: {
          create: [
            {
              undergraduate: { connect: { id: undergradId } },
            },
          ],
        },
        ...(postgradId
          ? {
              undergradDegrees: {
                create: [
                  {
                    undergraduate: { connect: { id: undergradId } },
                  },
                ],
              },
            }
          : {}),
      },
    });

    return newTeacher;
  }

  async findAll(): Promise<
    TCustomOmit<
      TOutputTeacher,
      | 'categoryName'
      | 'contractTypeName'
      | 'shiftName'
      | 'postgrads'
      | 'undergrads'
    >[]
  > {
    const teachers = await this.prisma.teacher.findMany({
      select: {
        id: true,
        categoryId: true,
        contractTypeId: true,
        shiftId: true,
        user: {
          select: {
            id: true,
            code: true,
            name: true,
          },
        },
      },
    });

    // const mappedTeachers = teachers.map((teacher) => ({
    // id: teacher.id,
    // })

    const mappedTeachers: TCustomOmit<
      TOutputTeacher,
      | 'categoryName'
      | 'contractTypeName'
      | 'shiftName'
      | 'postgrads'
      | 'undergrads'
    >[] = teachers.map((teacher) => ({
      id: teacher.id,
      name: teacher.user.name,
      code: teacher.user.code,
      categoryId: teacher.categoryId,
      contractTypeId: teacher.contractTypeId,
      shiftId: teacher.shiftId,
      userId: teacher.user.id,
    }));

    return mappedTeachers;
  }

  async findAllWithPagination(
    query: QueryPaginationDto,
  ): Promise<IPaginateOutput<TOutputTeacher>> {
    const [teachers, count] = await Promise.all([
      this.prisma.teacher.findMany({
        ...paginate(query),
        select: {
          id: true,
          categoryId: true,
          contractTypeId: true,
          shiftId: true,
          user: {
            select: {
              id: true,
              code: true,
              name: true,
            },
          },
          contractType: true,
          category: true,
          shift: true,
          postgraduateDegrees: {
            include: {
              postgraduate: true,
            },
          },
          undergradDegrees: {
            include: {
              undergraduate: true,
            },
          },
        },
      }),
      this.prisma.teacher.count(),
    ]);

    // const mappedTeachers = teachers.map((teacher) => ({
    // id: teacher.id,
    // })

    const mappedTeachers: TOutputTeacher[] = teachers.map((teacher) => ({
      id: teacher.id,
      name: teacher.user.name,
      code: teacher.user.code,
      categoryId: teacher.categoryId,
      contractTypeId: teacher.contractTypeId,
      shiftId: teacher.shiftId,
      userId: teacher.user.id,
      shiftName: teacher.shift.name,
      categoryName: teacher.category.name,
      contractTypeName: teacher.contractType.name,
      undergrads: teacher.undergradDegrees.map((u) => ({
        id: u.undergraduate.id,
        name: u.undergraduate.name,
      })),
      postgrads: teacher.postgraduateDegrees.map((u) => ({
        id: u.postgraduate.id,
        name: u.postgraduate.name,
      })),
    }));

    return paginateOutput<TOutputTeacher>(mappedTeachers, count, query);
  }

  async findOne(id: string) {
    const teacher = await this.prisma.teacher.findUnique({
      where: {
        id,
      },
    });

    if (!teacher)
      throw new NotFoundException(
        `El docente con id <${id}> no fue encontrado.`,
      );

    return teacher;
  }

  async findOneByUserId(userId: string) {
    const teacher = await this.prisma.teacher.findFirst({
      where: {
        userId,
      },
      select: {
        id: true,
        userId: true,
        shiftId: true,
        contractTypeId: true,
        categoryId: true,
        user: {
          select: {
            id: true,
            code: true,
          },
        },
      },
    });

    if (!teacher)
      throw new NotFoundException(
        `El docente con userId <${userId}> no fue encontrado.`,
      );

    return teacher;
  }

  // async findTeacherByUserId(userId: string) {
  //   const teacher = await this.prisma.user.findUnique({
  //     where: {
  //       id: userId,
  //     },
  //     select: {
  //       id: true,
  //       userId: true,
  //       shiftId: true,
  //       contractTypeId: true,
  //       categoryId: true,
  //     },
  //   });
  //
  //   if (!teacher)
  //     throw new NotFoundException(
  //       `El docente con userId <${userId}> no fue encontrado.`,
  //     );
  //
  //   return teacher;
  // }

  async findOneByCode(code: string) {
    const teacher = await this.prisma.user.findUnique({
      where: {
        code,
      },
      select: {
        id: true,
        name: true,
        teachers: {
          select: {
            id: true,
            userId: true,
            // positionHeld: {
            //   select: {
            //     departmentId: true,
            //   },
            // },
          },
        },
      },
    });

    if (!teacher)
      throw new NotFoundException(
        `El docente con el código <${code}> no fue encontrado.`,
      );

    return {
      id: teacher.teachers[0].id,
      userId: teacher.id,
      name: teacher.name,
    };
  }

  async update(id: string, updateTeacherDto: UpdateTeacherDto) {
    const { categoryId, contractTypeId, shiftId, undergradId, postgradId } =
      updateTeacherDto;

    await this.findOne(id);

    const teacherUpdate = await this.prisma.teacher.update({
      where: {
        id,
      },
      data: {
        categoryId,
        contractTypeId,
        shiftId,
      },
    });

    // Falta ver si manda un id en pregrado y postgrado.
    // Aunque al ser una tabla mtm, deberia el usuario seleccionar que quiere eliminar primero.

    return teacherUpdate;
  }

  // para no eliminarlo en su totalidad, asi quedan los registros.
  async remove(id: string): Promise<boolean> {
    const teacher = await this.findOne(id);
    const user = await this.usersService.findOne(teacher.userId);

    const deleteTeacher = await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        activeStatus: !user.activeStatus,
      },
    });

    return !!deleteTeacher;
  }
}
